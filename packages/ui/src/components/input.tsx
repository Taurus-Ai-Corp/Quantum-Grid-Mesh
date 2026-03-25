import * as React from 'react'
import { cn } from '../lib/utils.js'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-10 w-full border border-[var(--graphite-ghost)] bg-[var(--bone)] px-3 py-2 text-sm text-[var(--graphite)] placeholder:text-[var(--graphite-light)] transition-colors',
      'focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-1 focus-visible:ring-[var(--accent)]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      className,
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = 'Input'
