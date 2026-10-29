import { cn } from '@/lib/utils'

interface SectionMediaProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}

/** Soft lifestyle photo for marketing sections — no card chrome. */
export function SectionMedia({
  src,
  alt,
  className,
  imgClassName,
}: SectionMediaProps) {
  return (
    <figure className={cn('overflow-hidden rounded-2xl', className)}>
      <img
        src={src}
        alt={alt}
        className={cn('h-full w-full object-cover', imgClassName)}
        loading="lazy"
      />
    </figure>
  )
}
