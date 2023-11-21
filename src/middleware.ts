import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  let cookie = request.cookies.get('authToken')
  if (cookie) {
      return NextResponse.next()
  }
return NextResponse.redirect(new URL('/', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
    '/cash/:path*', 
    '/cashdrawers/:path*', 
    '/config/:path*', 
    '/credits/:path*',
    '/directory/:path*',
    '/histories/:path*',
    '/product/:path*', 
    '/sales/:path*',],
};
