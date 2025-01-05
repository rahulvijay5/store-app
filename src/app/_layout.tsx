import { tokenCache } from "@/cache";
import "@/global.css";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

export default function RootLayoutNav() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Slot />
      </ClerkLoaded>
    </ClerkProvider>
  )
}