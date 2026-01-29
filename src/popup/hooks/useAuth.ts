import { useCallback } from "react";
import { useAuth as useClerkAuth, useUser } from "../../lib/clerk";

export const useAuth = () => {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user } = useUser();

  // Memoize getUserToken to prevent infinite re-renders
  const getUserToken = useCallback(async (): Promise<string | null> => {
    try {
      const token = await getToken();
      return token;
    } catch (error) {
      console.error("[Auth] Failed to get token:", error);
      return null;
    }
  }, [getToken]);

  return {
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    user: user
      ? {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          primaryEmailAddress: user.primaryEmailAddress?.emailAddress ?? null,
          imageUrl: user.imageUrl,
        }
      : null,
    getToken: getUserToken,
  };
};
