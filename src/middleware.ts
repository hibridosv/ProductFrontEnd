import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authTokens = request.cookies.get("authToken")?.value;
  const remoteUrl = request.cookies.get("remoteUrl")?.value;
  const status = request.cookies.get("status")?.value;

  // Verificar otras rutas
  const protectedRoutes = [
    '/cash',
    '/cashdrawers',
    '/config',
    '/credits',
    '/dashboard',
    '/directory',
    '/histories',
    '/invoices',
    '/product',
    '/reports',
    '/sales',
    '/tools',
    '/transfers',
  ];

  // Comprobar si la ruta actual está en las rutas protegidas
  for (const route of protectedRoutes) {
    if (request.nextUrl.pathname.startsWith(route) && (!authTokens || !remoteUrl)) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("authToken");
      response.cookies.delete("remoteUrl");
      return response;
    }
    // verifcar el estado del usuario, si es 1, continuar con la ejecución normal, sino redirigir al /config/invoice
    if (request.nextUrl.pathname.startsWith(route) && status != "1") {
      const response = NextResponse.redirect(new URL("/error/401", request.url));
      return response;
    }

    // si el usuario ya está autenticado y trata de acceder a la página de inicio de sesión, redirigirlo al panel de control
    if (authTokens && request.nextUrl.pathname.startsWith("/login")) {
      const response = NextResponse.redirect(new URL("/dashboard", request.url));
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
    '/config/:path*', 
    '/credits/:path*',
    '/dashboard/:path*', 
    '/directory/:path*',
    '/histories/:path*',
    '/invoices/:path*',
    '/login/:path*', 
    '/logout/:path*', 
    '/product/:path*', 
    '/reports/:path*', 
    '/sales/:path*',
    '/tools/:path*',
    '/transfers/:path*',
  ],
};
