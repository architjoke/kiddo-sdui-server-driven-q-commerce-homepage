import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { Theme } from './types';

const ThemeContext = createContext<Theme | null>(null);
export const ThemeProvider = ({ theme, children }: PropsWithChildren<{ theme: Theme }>) => {
  const stableTheme = useMemo(() => theme, [theme]);
  return <ThemeContext.Provider value={stableTheme}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used inside ThemeProvider');
  return theme;
};
