// src/proxy.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  // Lógica de tu proxy o middleware aquí
  return NextResponse.next();
}

// Aquí puedes especificar las rutas a las que deseas que se aplique el middleware
export const config = {
  matcher: ['/api/:path*', '/dashboard'],
};