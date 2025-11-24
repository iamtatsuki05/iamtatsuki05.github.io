"use client";
import { useEffect } from 'react';

export function CodeCopyClient({ enabled = true }: { enabled?: boolean } = {}) {
  useEffect(() => {
    if (!enabled) return;
    const pres = Array.from(document.querySelectorAll<HTMLElement>('article.prose pre'));
    pres.forEach((pre) => {
      if (pre.dataset.copyReady === '1') return;
      pre.dataset.copyReady = '1';
      const code = pre.querySelector('code');
      if (!code) return;
      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Copy code');
      btn.textContent = 'Copy';
      btn.addEventListener('click', async () => {
        try {
          const text = code.innerText;
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
          const prev = btn.textContent;
          btn.textContent = 'Copied';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = prev || 'Copy';
            btn.classList.remove('copied');
          }, 1400);
        } catch {
          btn.textContent = 'Failed';
          setTimeout(() => (btn.textContent = 'Copy'), 1200);
        }
      });
      pre.appendChild(btn);
    });
  }, [enabled]);
  return null;
}
