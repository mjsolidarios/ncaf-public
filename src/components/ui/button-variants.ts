import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-ambient hover:shadow-float hover:-translate-y-0.5 active:translate-y-0 rounded-full',
        secondary:
          'bg-gradient-to-r from-secondary to-secondary-container text-on-secondary shadow-ambient hover:shadow-float hover:-translate-y-0.5 active:translate-y-0 rounded-full',
        ghost:
          'bg-transparent hover:bg-surface-container-low text-on-surface rounded-xl',
        glass:
          'glass border-0 text-on-surface shadow-ambient hover:shadow-float hover:-translate-y-0.5 active:translate-y-0 rounded-xl',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-13 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
