import * as React from 'react'

import { cn } from '@/lib/utils'

export function Textarea({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'flex min-h-28 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-dark placeholder:text-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
