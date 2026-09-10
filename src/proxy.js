import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "./lib/token";
import { auth } from "./auth";

export async function proxy(req) {
  try {

    const pathname = req.nextUrl.pathname;
    
    if(pathname.includes('/dashboard'))
    {
      // dashboard auth
      const store = await cookies();
      const token = store.get('ecom-dash-token')?.value;
      const isAuthenticatedUser = store.get('ecom-dash-user')?.value;
      const isAuthUser = isAuthenticatedUser ? JSON.parse(isAuthenticatedUser) : null;
      const isDashboardAuth = token ? await verifyToken(token) : false;

      // prevent seller from /dashboard/user pages...
      // if(isAuthUser && isAuthUser.role === 'seller' && pathname.startsWith('/dashboard/user'))
      // {
      //   console.log(isAuthUser);
      //   console.log("Hello 💛");
      //   return NextResponse.redirect(new URL('/dashboard', req.url));
      // }

      // ✅ 1. Allow auth pages first
      if (pathname.startsWith('/dashboard/auth')) {
        if (isDashboardAuth) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        return NextResponse.next();
      }

      // ✅ 2. Protect dashboard
      if (!isDashboardAuth && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/dashboard/auth/login', req.url));
      }
    }
    else
    {
      // auth
      const sessionUser = await auth();
      const user = sessionUser?.user;
      const isAuth = !!user;
      
      //
      const isPrivateRoutes = ['/cart', '/wishlist', '/checkout'].includes(pathname);
      if (isPrivateRoutes && !isAuth) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }

      if(pathname.startsWith('/auth') && isAuth)
      {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/auth/login", req.url));
    // note : you can also show error page
  }
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)'
};