// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { PrivyProvider } from "@privy-io/react-auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <PrivyProvider
        appId="clud9qqj208591452l5nz5voy"
        config={{
          // Customize Privy's appearance in your app
          loginMethods: ['wallet'],
          appearance: {
            theme: "dark",
            accentColor: "#676FFF",
            showWalletLoginFirst: true,
            // logo: "https://i.ibb.co/HNj4bvd/logo-white.png",
          },
          // Create embedded wallets for users who don't have a wallet
        //   embeddedWallets: {
        //     createOnLogin: "users-without-wallets",
        //   },
        }}
      >
        {children}
      </PrivyProvider>
    </NextUIProvider>
  );
}
