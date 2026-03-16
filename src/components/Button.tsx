import Link from 'next/link'
import clsx from 'clsx'

const variantStyles = {
  primary:
    'bg-[var(--color-btn-primary-bg)] font-semibold text-[var(--color-btn-primary-text)] hover:bg-[var(--color-btn-primary-bg-hover)] active:bg-[var(--color-btn-primary-bg-active)] active:text-[var(--color-btn-primary-text)]/70',
  secondary:
    'bg-[var(--color-btn-secondary-bg)] font-medium text-[var(--color-btn-secondary-text)] hover:bg-[var(--color-btn-secondary-bg-hover)] active:bg-[var(--color-btn-secondary-bg-active)] active:text-[var(--color-btn-secondary-text)]/60',
}

type ButtonProps = {
  variant?: keyof typeof variantStyles
} & (
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
  | React.ComponentPropsWithoutRef<typeof Link>
)

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  className = clsx(
    'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none',
    variantStyles[variant],
    className,
  )

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}
