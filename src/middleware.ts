import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/dev-login", 
  },
});

export const config = {
  matcher: ["/panel/:path*"], 
};
