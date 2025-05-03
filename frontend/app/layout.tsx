import type { ReactNode } from "react"
import "@/app/globals.css"
import { GeistSans } from "geist/font/sans"
import { CartProvider } from "@/context/cart-context"
import { UserProvider } from "@/context/user-context"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "Came - Coffee Shop",
  description: "Order coffee and pastries online",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <UserProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  )
}
