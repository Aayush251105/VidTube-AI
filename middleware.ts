import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

// lets everyone access these routes not only signed in users
const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    // "/",
    "/home"
])

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
])


export default clerkMiddleware(async (auth, req) => {
  const {userId} = await auth();
  const currentUrl = new URL(req.url)
  const pathname = currentUrl.pathname;

  // Redirect root "/" to "/home" for everyone
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  
  const isAccessingDashboard = currentUrl.pathname === "/home"
  const isApiRequest = currentUrl.pathname.startsWith("/api")

  // if user is already signed in direct him to home
  if(userId && isPublicRoute(req) && !isAccessingDashboard){
    return NextResponse.redirect(new URL("/home", req.url))
  }
  // not logged in
  if(!userId){
    // trying to access protected page
    if(!isPublicRoute(req) && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    //trying to access protected api route
    if(isApiRequest && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/sign-in", req.url))
    }
  }
})

export const config = {
    // matcher means it will execute the middleware on all these
  
    matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}