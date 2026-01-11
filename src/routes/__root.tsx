/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { createServerFn } from '@tanstack/react-start'
import * as React from 'react'
import { DefaultCatchBoundary } from '../components/DefaultCatchBoundary'
import { NotFound } from '../components/NotFound'
import appCss from '../styles/app.css?url'
import { seo } from '../utils/seo'
import { getSupabaseServerClient } from '../utils/supabase'
import { getCurrentUserRole } from '../middleware/rbac'

// UPDATED: Enhanced fetchUser to include more user data
export interface UserContext {
  id: string
  email: string
  name?: string
  role?: string
  rank?: string
  region?: string
  status?: string
}

const fetchUser = createServerFn({ method: 'GET' }).handler(async (): Promise<UserContext | null> => {
  // 1. First try to get authoritative RBAC role data (from trainers & roles tables)
  const rbacUser = await getCurrentUserRole()

  if (rbacUser) {
    console.log('DEBUG: RBAC User found', { role: rbacUser.role })
    return {
      id: rbacUser.userId,
      email: rbacUser.email,
      name: rbacUser.name,
      role: rbacUser.role, // This comes from roles table
      rank: rbacUser.rank,
      // Status and region are not in rbacUser yet, if needed we can fetch or default
      status: 'active',
    }
  }

  // 2. Fallback to users table if not a trainer (e.g. basic user or broken link)
  const supabase = getSupabaseServerClient()
  const { data: { user }, error: _error } = await supabase.auth.getUser()

  if (!user?.email) {
    return null
  }

  const { data: userData } = await supabase
    .from('users')
    .select('id, email, name, role, rank, region, status')
    .eq('email', user.email)
    .single()

  console.log('DEBUG: Fallback User data', { role: userData?.role })

  if (userData) {
    return userData as UserContext
  }

  // If no RBAC user and no user in 'users' table, return basic info from auth
  return {
    id: user.id,
    email: user.email,
  }
})

export const Route = createRootRoute({
  beforeLoad: async () => {
    const user = await fetchUser()

    return {
      user,
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'ABPM Trainer System - Manage Training Activities',
        description: 'ABPM Trainer Management System for tracking schedules, events, dormitory, and activities',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { user } = Route.useRouteContext()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="bg-gray-50">
        {/* Top Navigation Bar */}
        <nav className="bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Title */}
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <h1 className="text-xl font-bold">ABPM Trainer System</h1>
                  <p className="text-xs text-orange-100">Akademi Bomba dan Penyelamat Malaysia</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                <NavLink to="/" label="Home" icon="🏠" />
                <NavLink to="/schedule" label="Schedule" icon="📅" />
                <NavLink to="/events" label="Events" icon="📋" />
                {user?.role !== 'TRAINER' && (
                  <>
                    <NavLink to="/dormitory" label="Dormitory" icon="🏢" />
                  </>
                )}
                <NavLink to="/physical-training" label="PT" icon="💪" />
                <NavLink to="/religious-activity" label="Religious" icon="📖" />
                {user?.role !== 'TRAINER' && (
                  <>
                    <NavLink to="/trainer-overview" label="Overview" icon="👥" />
                  </>
                )}
              </div>

              {/* UPDATED: User Menu with Profile Dropdown */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    {/* Profile Dropdown */}
                    <div className="relative group">
                      {/* Profile Button */}
                      <button className="flex items-center space-x-2 hover:bg-red-800 px-3 py-2 rounded-lg transition">
                        {/* Avatar */}
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                          <span className="text-sm font-bold text-white">
                            {user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="hidden sm:inline text-sm font-medium">{user.email}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                          <p className="text-xs text-gray-500 mt-1">Signed in</p>
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 transition text-gray-700"
                        >
                          <span className="text-xl">👤</span>
                          <span className="font-medium">My Profile</span>
                        </Link>

                        <div className="border-t border-gray-200 my-2"></div>

                        <Link
                          to="/logout"
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition text-red-600"
                        >
                          <span className="text-xl">🚪</span>
                          <span className="font-medium">Logout</span>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-sm"
                  >
                    Login
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* UPDATED: Mobile Menu with Profile Section */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-red-800">
                <div className="flex flex-col space-y-2">
                  {/* NEW: Profile Section for Mobile */}
                  {user && (
                    <>
                      <div className="border-b border-red-800 pb-3 mb-3">
                        <div className="flex items-center space-x-3 px-4 py-2">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                            <span className="text-white font-bold">
                              {user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm">{user.email}</p>
                            <p className="text-xs text-orange-200">Signed in</p>
                          </div>
                        </div>
                      </div>

                      <MobileNavLink
                        to="/profile"
                        label="My Profile"
                        icon="👤"
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                    </>
                  )}

                  {/* Existing Mobile Navigation Links */}
                  <MobileNavLink
                    to="/"
                    label="Home"
                    icon="🏠"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    to="/schedule"
                    label="Schedule"
                    icon="📅"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    to="/events"
                    label="Events"
                    icon="📋"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  {user?.role !== 'TRAINER' && (
                    <MobileNavLink
                      to="/dormitory"
                      label="Dormitory"
                      icon="🏢"
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  )}
                  <MobileNavLink
                    to="/physical-training"
                    label="Physical Training"
                    icon="💪"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    to="/religious-activity"
                    label="Religious Activity"
                    icon="📖"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  {user?.role !== 'TRAINER' && (
                    <MobileNavLink
                      to="/trainer-overview"
                      label="Trainer Overview"
                      icon="👥"
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>

        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}

// Desktop Navigation Link Component
function NavLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <Link
      to={to}
      activeProps={{
        className: 'bg-red-800 text-white',
      }}
      activeOptions={{ exact: to === '/' }}
      className="px-3 py-2 rounded hover:bg-red-800 transition flex items-center space-x-2 text-sm"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

// UPDATED: Mobile Navigation Link Component with onClick support
function MobileNavLink({
  to,
  label,
  icon,
  onClick
}: {
  to: string
  label: string
  icon: string
  onClick?: () => void
}) {
  return (
    <Link
      to={to}
      activeProps={{
        className: 'bg-red-900 text-white',
      }}
      activeOptions={{ exact: to === '/' }}
      className="px-4 py-3 rounded hover:bg-red-800 transition flex items-center space-x-3"
      onClick={onClick}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}