'use client'
import { useAuthStore } from "@/lib/store/authStore";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogIdentifier() {
  const posthog = usePostHog();
  const {user} = useAuthStore();
  useEffect(() => {
    if (user && posthog) {
      // Identify the user when they log in
      posthog.identify(user.email, {
        name: user.name,
        email: user.email,
      });

      // Optional: Reset any previous super properties
      posthog.register({
        isAnonymous: false,
        userStatus: 'identified'
      });
    } else if (posthog) {
      // For anonymous users
      posthog.register({
        isAnonymous: true,
        userStatus: 'anonymous'
      });
    }
  }, [user, posthog]);

  return null;
}