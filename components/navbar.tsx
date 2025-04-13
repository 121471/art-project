'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()

  const routes = [
    {
      href: '/',
      label: 'Home',
      active: pathname === '/',
    },
    {
      href: '/create',
      label: 'Create',
      active: pathname === '/create',
    },
    {
      href: '/messages',
      label: 'Messages',
      active: pathname === '/messages',
    },
  ]

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="font-bold text-xl">
          Art Project
        </Link>
        <div className="ml-6 flex items-center space-x-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                route.active
                  ? 'text-black dark:text-white'
                  : 'text-muted-foreground'
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  )
} 