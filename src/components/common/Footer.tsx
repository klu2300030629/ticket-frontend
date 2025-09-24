import React from 'react';
import FooterLayout from '../layout/Footer';
import { useTheme } from '../../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { darkMode } = useTheme();
  return <FooterLayout isDarkMode={darkMode} />;
};

export default Footer;