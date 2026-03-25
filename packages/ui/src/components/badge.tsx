import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils.js'

const badgeVariants = cva(
  'inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[var(--accent)] text-white',
        secondary: 'border-transparent bg-[var(--graphite-whisper)] text-[var(--graphite-med)]',
        outline: 'border-[var(--graphite-ghost)] text-[var(--graphite-med)]',
        destructive: 'border-transparent bg-red-500/10 text-red-500 border-red-500/30',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
