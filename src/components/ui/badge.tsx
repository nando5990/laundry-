import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  {
    variants: {
      variant: {
        default: 'bg-teal/15 text-teal-dark',
        navy: 'bg-navy text-white',
        demo: 'bg-warning/15 text-dark border border-warning/40',
        muted: 'bg-off-white text-muted border border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
