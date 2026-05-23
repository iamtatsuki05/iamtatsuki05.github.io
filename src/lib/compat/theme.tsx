import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme?: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = 'theme';
const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  resolvedTheme: undefined,
  setTheme: () => undefined,
});

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredTheme(defaultTheme: Theme): Theme {
  if (typeof window === 'undefined') return defaultTheme;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : defaultTheme;
}

function applyTheme(theme: Theme, enableSystem: boolean) {
  if (typeof document === 'undefined') return getSystemTheme();
  const resolved = theme === 'system' && enableSystem ? getSystemTheme() : theme === 'dark' ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.classList.toggle('light', resolved === 'light');
  document.documentElement.style.colorScheme = resolved;
  return resolved;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableSystem = true,
}: {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
}) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme(defaultTheme));
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme | undefined>(undefined);

  useEffect(() => {
    setResolvedTheme(applyTheme(theme, enableSystem));
    if (theme === 'system') {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [enableSystem, theme]);

  useEffect(() => {
    if (!enableSystem) return;
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQuery) return;
    const update = () => {
      if (theme === 'system') setResolvedTheme(applyTheme(theme, enableSystem));
    };
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, [enableSystem, theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: setThemeState,
    }),
    [resolvedTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
