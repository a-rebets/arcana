import AuthBoundary from "@/lib/nav/auth-boundary";

export default function PublicLayout() {
  return <AuthBoundary require="unauthenticated" redirectTo="/" />;
}
