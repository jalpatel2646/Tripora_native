import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getLocalItem, setLocalItem } from '../utils/storage';
import { theme } from '../constants/theme';

type ThemeType = 'system' | 'light' | 'dark';

type BaseColors = Omit<typeof theme.colors, 'dark'>;

interface ThemeContextType {
  themeType: ThemeType;
  isDark: boolean;
  colors: BaseColors;
  setThemeType: (type: ThemeType) => void;
  spacing: typeof theme.spacing;
  typography: typeof theme.typography;
  radius: typeof theme.radius;
  shadows: typeof theme.shadows;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeTypeState] = useState<ThemeType>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await getLocalItem('theme_preference');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setThemeTypeState(storedTheme);
      }
      setIsReady(true);
    };
    loadTheme();
  }, []);

  const setThemeType = async (type: ThemeType) => {
    setThemeTypeState(type);
    await setLocalItem('theme_preference', type);
  };

  const isDark = themeType === 'dark' || (themeType === 'system' && systemColorScheme === 'dark');
  
  // Choose the token set based on isDark
  const activeColors = isDark 
    ? { ...theme.colors, ...theme.colors.dark } 
    : { ...theme.colors }; 

  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ 
      themeType, 
      isDark, 
      colors: activeColors, 
      setThemeType,
      spacing: theme.spacing,
      typography: theme.typography,
      radius: theme.radius,
      shadows: theme.shadows,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};


export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
