import { NextRequest, NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"
export { default } from "next-auth/middleware"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }) // Pass the actual request object, not the NextRequest class
  const url = request.nextUrl

  // If token exists and user is trying to access sign-in, sign-up, or verify, redirect to dashboard
  if (token && (
    url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up") || url.pathname.startsWith("/verify")
  )) {
     // If user is an admin, redirect to the dashboard
     if (token.isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      // If user is not an admin, redirect to home page
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Allow access to sign-in, sign-up, and verify if no token is found
  if (!token && (
    url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up") || url.pathname.startsWith("/verify")
  )) {
    return NextResponse.next()  // Proceed to the requested page (sign-in, sign-up, etc.)
  }

  // Redirect unauthenticated users trying to access the dashboard to the home page
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()  // Allow all other requests to proceed
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/verify',
    '/dashboard/:path*',
    '/'
  ]
}
