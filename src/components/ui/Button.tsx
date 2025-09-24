import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const baseClasses = 'inline-flex items-center justify-center px-6 py-2 rounded-xl font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props} />
  );
};

interface ButtonLinkProps extends Omit<LinkProps, 'to'> {
  to: LinkProps['to'];
  variant?: ButtonVariant;
  className?: string;
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({ to, variant = 'primary', className = '', children, ...props }) => {
  return (
    <Link to={to} className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
};

export default Button;


