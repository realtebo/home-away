import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/properties(.*)"]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  console.log("process.env.ADMIN_USER_ID", process.env.ADMIN_USER_ID);
  const isAdminUser = auth().userId === process.env.ADMIN_USER_ID;
  console.log("user Id of logged user", auth().userId);
  if (isAdminRoute(req) && !isAdminUser) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!isPublicRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
