import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FilterBar } from '@/components/filters/FilterBar';

type ResultHandler = ((event: { results: { isFinal: boolean; 0: { transcript: string } }[] }) => void) | null;

class MockSpeechRecognition {
  static instances: MockSpeechRecognition[] = [];
  lang = '';
  interimResults = false;
  continuous = false;
  onresult: ResultHandler = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  started = false;

  constructor() {
    MockSpeechRecognition.instances.push(this);
  }

  start() {
    this.started = true;
  }

  stop() {
    this.onend?.();
  }

  abort() {
    this.onend?.();
  }

  emitResult(transcript: string, isFinal: boolean) {
    this.onresult?.({ results: [{ isFinal, 0: { transcript } }] });
  }

  emitError(error: string) {
    this.onerror?.({ error });
  }
}

function stubSpeechRecognition() {
  MockSpeechRecognition.instances = [];
  vi.stubGlobal('SpeechRecognition', MockSpeechRecognition);
}

describe('FilterBar voice input', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('hides the mic button when SpeechRecognition is unavailable', () => {
    render(
      <FilterBar query="" onQueryChange={() => {}} placeholder="Search..." voiceLang="ja-JP" voiceStartLabel="音声で検索" />,
    );
    expect(screen.queryByTestId('filter-voice-button')).toBeNull();
  });

  it('hides the mic button when voiceLang is not provided', () => {
    stubSpeechRecognition();
    render(<FilterBar query="" onQueryChange={() => {}} placeholder="Search..." />);
    expect(screen.queryByTestId('filter-voice-button')).toBeNull();
  });

  it('starts recognition with the given language and reflects results in the query', () => {
    stubSpeechRecognition();
    const onQueryChange = vi.fn();
    render(
      <FilterBar
        query=""
        onQueryChange={onQueryChange}
        placeholder="Search..."
        voiceLang="ja-JP"
        voiceStartLabel="音声で検索"
        voiceStopLabel="音声入力を停止"
      />,
    );

    const button = screen.getByTestId('filter-voice-button');
    expect(button).toHaveAttribute('aria-label', '音声で検索');
    fireEvent.click(button);

    const recognition = MockSpeechRecognition.instances[0];
    expect(recognition.started).toBe(true);
    expect(recognition.lang).toBe('ja-JP');
    expect(recognition.interimResults).toBe(true);
    expect(recognition.continuous).toBe(true);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-label', '音声入力を停止');
    expect(screen.getByTestId('filter-voice-listening')).toBeInTheDocument();

    act(() => {
      recognition.emitResult('チャイ', false);
    });
    expect(onQueryChange).toHaveBeenLastCalledWith('チャイ');

    act(() => {
      recognition.emitResult('チャイ レシピ', true);
      recognition.onend?.();
    });
    expect(onQueryChange).toHaveBeenLastCalledWith('チャイ レシピ');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByTestId('filter-voice-listening')).toBeNull();
  });

  it('shows a permission message when microphone access is denied', () => {
    stubSpeechRecognition();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <FilterBar
        query=""
        onQueryChange={() => {}}
        placeholder="Search..."
        voiceLang="ja-JP"
        voicePermissionMessage="マイクの使用が許可されていません"
      />,
    );

    fireEvent.click(screen.getByTestId('filter-voice-button'));
    act(() => {
      MockSpeechRecognition.instances[0].emitError('not-allowed');
    });

    expect(screen.getByTestId('filter-voice-error')).toHaveTextContent('マイクの使用が許可されていません');
    expect(screen.getByTestId('filter-voice-button')).toHaveAttribute('data-state', 'idle');
  });

  it('stops recognition when the mic button is clicked while listening', () => {
    stubSpeechRecognition();
    render(
      <FilterBar
        query=""
        onQueryChange={() => {}}
        placeholder="Search..."
        voiceLang="en-US"
        voiceStartLabel="Search by voice"
        voiceStopLabel="Stop voice input"
      />,
    );

    const button = screen.getByTestId('filter-voice-button');
    fireEvent.click(button);
    expect(button).toHaveAttribute('data-state', 'listening');

    fireEvent.click(button);
    expect(button).toHaveAttribute('data-state', 'idle');
  });
});
