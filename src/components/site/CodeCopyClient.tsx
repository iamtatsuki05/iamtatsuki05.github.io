"use client";
import { useEffect } from 'react';
import type { Locale } from '@/lib/i18n';
import { useResolvedPreferredLocale } from '@/hooks/useResolvedPreferredLocale';

export function CodeCopyClient({ enabled = true }: { enabled?: boolean } = {}) {
  const locale = useResolvedPreferredLocale();

  useEffect(() => {
    if (!enabled) return;
    const text = locale === 'ja'
      ? {
          default: 'コピー',
          success: 'コピーしました',
          failure: 'コピーに失敗しました',
          aria: 'コードをコピー',
        }
      : {
          default: 'Copy',
          success: 'Copied',
          failure: 'Failed',
          aria: 'Copy code',
        };
    const pres = Array.from(document.querySelectorAll<HTMLElement>('article.prose pre'));
    pres.forEach((pre) => {
      const code = pre.querySelector('code');
      if (!code) return;
      let btn = pre.querySelector<HTMLButtonElement>('.code-copy-btn');
      if (!btn) {
        const newBtn = document.createElement('button');
        newBtn.className = 'code-copy-btn';
        newBtn.type = 'button';
        newBtn.addEventListener('click', async () => {
          const current = newBtn;
          const defaultText = current.dataset.labelDefault || 'Copy';
          const successText = current.dataset.labelSuccess || 'Copied';
          const failureText = current.dataset.labelFailure || 'Failed';

          try {
            const codeText = code.innerText;
            if (navigator.clipboard?.writeText) {
              await navigator.clipboard.writeText(codeText);
            } else {
              const ta = document.createElement('textarea');
              ta.value = codeText;
              ta.style.position = 'fixed';
              ta.style.opacity = '0';
              document.body.appendChild(ta);
              ta.select();
              document.execCommand('copy');
              document.body.removeChild(ta);
            }
            current.textContent = successText;
            current.classList.add('copied');
            setTimeout(() => {
              current.textContent = current.dataset.labelDefault || defaultText;
              current.classList.remove('copied');
            }, 1400);
          } catch {
            current.textContent = failureText;
            setTimeout(() => {
              current.textContent = current.dataset.labelDefault || defaultText;
            }, 1200);
          }
        });
        pre.appendChild(newBtn);
        btn = newBtn;
      }
      btn.dataset.labelDefault = text.default;
      btn.dataset.labelSuccess = text.success;
      btn.dataset.labelFailure = text.failure;
      btn.setAttribute('aria-label', text.aria);
      if (!btn.classList.contains('copied')) {
        btn.textContent = text.default;
      }
    });
  }, [enabled, locale]);
  return null;
}
