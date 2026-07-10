'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionErrorEventLike = {
  error?: string;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const candidates = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return candidates.SpeechRecognition ?? candidates.webkitSpeechRecognition ?? null;
}

type Options = {
  /** BCP 47 の言語タグ (例: 'ja-JP')。認識エンジンに渡す。 */
  lang: string;
  /** 認識結果。interim (確定前) も isFinal=false で都度呼ばれる。 */
  onResult: (transcript: string, isFinal: boolean) => void;
};

export type SpeechRecognitionErrorKind = 'permission' | 'no-speech' | 'unavailable';

function classifyError(error?: string): SpeechRecognitionErrorKind {
  if (error === 'not-allowed' || error === 'service-not-allowed') return 'permission';
  if (error === 'no-speech' || error === 'aborted') return 'no-speech';
  return 'unavailable';
}

export function useSpeechRecognition({ lang, onResult }: Options) {
  // SSR とのハイドレーション不一致を避けるため、対応判定は mount 後に行う
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<SpeechRecognitionErrorKind | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    setSupported(getSpeechRecognitionConstructor() !== null);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor || recognitionRef.current) return;

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.interimResults = true;
    // 停止操作 (または長い無音での自動終了) まで聞き続け、複数フレーズを積み上げる
    recognition.continuous = true;
    recognition.onresult = (event) => {
      let transcript = '';
      let isFinal = false;
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }
      onResultRef.current(transcript, isFinal);
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    recognition.onerror = (event) => {
      console.warn('[voice-search] speech recognition error:', event.error ?? 'unknown');
      recognitionRef.current = null;
      setListening(false);
      setError(classifyError(event.error));
    };

    recognitionRef.current = recognition;
    setListening(true);
    setError(null);
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setListening(false);
      setError('unavailable');
    }
  }, [lang]);

  const toggle = useCallback(() => {
    if (recognitionRef.current) stop();
    else start();
  }, [start, stop]);

  // エラー表示は数秒で自動的に消す
  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(null), 5000);
    return () => window.clearTimeout(timer);
  }, [error]);

  return { supported, listening, error, start, stop, toggle };
}
