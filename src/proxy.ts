import { NextResponse } from 'next/server';

export function proxy(request: Request) {
  // Lógica del proxy
  return NextResponse.next();  // o cualquier lógica que desees implementar
}

// Configura las rutas que deseas que usen este proxy
export const config = {
  matcher: ['/api/:path*', '/dashboard'],
};