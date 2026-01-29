// Re-export Clerk hooks and components
export {
  ClerkProvider,
  useAuth,
  useUser,
  useClerk,
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/chrome-extension";
export { CLERK_PUBLISHABLE_KEY } from "./config";
