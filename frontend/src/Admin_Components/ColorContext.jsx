import React, { createContext, useState, useEffect } from 'react';

// Create a context
const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [colors, setColors] = useState({
    primary: '#ff0000',
    secondary: '#00ff00',
    accent1: '#0000ff',
    accent2: '#ffff00',
  });

  // Load colors from local storage
  useEffect(() => {
    const storedColors = localStorage.getItem('colors');
    if (storedColors) {
      setColors(JSON.parse(storedColors));
    }
  }, []);

  // Save colors to local storage
  useEffect(() => {
    localStorage.setItem('colors', JSON.stringify(colors));
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    document.documentElement.style.setProperty('--accent1-color', colors.accent1);
    document.documentElement.style.setProperty('--accent2-color', colors.accent2);
  }, [colors]);

  return (
    <ColorContext.Provider value={{ colors, setColors }}>
      {children}
    </ColorContext.Provider>
  );
};

export default ColorContext;
