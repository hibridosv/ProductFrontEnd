import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authTokens = request.cookies.get("authTokens")?.value;

  console.log(authTokens)
  // Verificar si la ruta es "/"
  if (request.nextUrl.pathname === "/") {
    // Redirigir a dashboard si está autenticado, de lo contrario a login
    const redirectPath = authTokens ? "/dashboard" : "/login";
    const response = NextResponse.redirect(new URL(redirectPath, request.url));
    return response;
  }

  // Verificar otras rutas
  const protectedRoutes = [
    '/cash',
    '/cashdrawers',
    '/config',
    '/credits',
    '/directory',
    '/histories',
    '/product',
    '/sales',
  ];

  // Comprobar si la ruta actual está en las rutas protegidas
  for (const route of protectedRoutes) {
    if (request.nextUrl.pathname.startsWith(route) && !authTokens) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("authTokens");
      return response;
    }
    if (authTokens && request.nextUrl.pathname.startsWith(route + "/login")) {
      const response = NextResponse.redirect(new URL(route + "/dashboard", request.url));
      return response;
    }
  }

  // Si la ruta no coincide con ninguna ruta protegida, continuar con la lógica actual
  // ...

  // Si llegamos hasta aquí, continuar con la ejecución normal
}

export const config = {
  matcher: [
    '/cash/:path*', 
    '/cashdrawers/:path*', 
    '/login/:path*', 
    '/dashboard/:path*', 
    '/config/:path*', 
    '/credits/:path*',
    '/directory/:path*',
    '/histories/:path*',
    '/product/:path*', 
    '/sales/:path*',
  ],
};
