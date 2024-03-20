import { authMiddleware } from "@clerk/nextjs";
import "@uploadthing/react/styles.css";
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ['/', '/api/webhook/clerk', '/api/uploadthing'],
  ignoredRoutes: ['/api/webhook/clerk']
});
 
export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};