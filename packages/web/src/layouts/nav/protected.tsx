import AuthBoundary from "@/lib/nav/auth-boundary";

export default function ProtectedLayout() {
  return <AuthBoundary require="authenticated" redirectTo="/welcome" />;
}
