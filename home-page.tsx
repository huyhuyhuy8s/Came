"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { UserMenu } from "@/components/user-menu"
import { useCart } from "@/context/cart-context"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const router = useRouter()
  const { itemCount } = useCart()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/menu" className="text-sm font-medium">
              Menu
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About us
            </Link>
          </nav>

          <div className="absolute left-1/2 -translate-x-1/2 transform">
            <Link href="/" className="text-2xl font-bold">
              Came
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <UserMenu />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Shopping cart"
              className="relative"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  variant="destructive"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Image */}
          <div className="relative h-[500px] md:h-[600px]">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="Red donut boxes with coffee"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right side - Call to action */}
          <div className="flex items-center justify-center p-8 md:p-16">
            <div className="max-w-md space-y-6">
              <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Skip the line when you order online.</h1>
              <Button
                className="rounded-full bg-slate-800 px-8 py-6 text-white hover:bg-slate-700"
                onClick={() => router.push("/menu")}
              >
                Order now
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-xl font-medium">Came</h2>
          </div>
          <Separator className="mb-6 bg-gray-800" />
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-sm font-medium">Stay in the Loop</h3>
              <div className="flex max-w-md">
                <Input
                  type="email"
                  placeholder="Email"
                  className="rounded-r-none border-gray-700 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button className="rounded-l-none border border-l-0 border-gray-700">Sign Up</Button>
              </div>
            </div>
          </div>
          <p className="mt-8 text-xs text-gray-500">
            This form is protected by reCAPTCHA and the Google{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            apply.
          </p>
        </div>
      </footer>
    </div>
  )
}
