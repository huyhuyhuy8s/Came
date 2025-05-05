"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { UserMenu } from "@/components/user-menu"
import { useCart } from "@/context/cart-context"

export default function AboutPage() {
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
        {/* Hero Section */}
        <section className="relative h-[50vh] w-full">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Coffee beans being roasted"
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Our Story</h1>
              <p className="mt-4 text-lg md:text-xl">The passion behind every cup</p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold">The Beginning</h2>
            <p className="mb-6 text-lg leading-relaxed">
              Came wasn't born from a business plan. It began with a moment—a perfect cup of coffee shared between
              friends on a rainy afternoon in Chicago. That single cup, with its complex notes and comforting warmth,
              sparked a conversation that would change our lives forever.
            </p>
            <p className="mb-12 text-lg leading-relaxed">
              Founded in 2018 by two friends who believed that coffee should be more than a caffeine delivery system—it
              should be an experience that connects people, creates moments, and tells stories. We started with a small
              cart at the local farmers' market, serving pour-overs to curious passersby who soon became our first loyal
              customers.
            </p>

            <div className="relative mb-12 h-80 w-full overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt="Our first coffee cart"
                fill
                className="object-cover"
              />
            </div>

            <h2 className="mb-6 text-3xl font-bold">Our Philosophy</h2>
            <p className="mb-6 text-lg leading-relaxed">
              At Came, we believe that coffee is a form of expression—both for us as makers and for you as the drinker.
              Each cup represents a moment of pause in our increasingly hectic lives. It's a ritual that invites you to
              slow down, to breathe, to be present.
            </p>
            <p className="mb-12 text-lg leading-relaxed">
              We approach coffee-making as both an art and a science. The rhythmic dance of the barista's hands as they
              prepare your drink is backed by precise measurements, careful temperature control, and deep knowledge of
              how different beans express themselves. This balance of intuition and precision is what creates the
              perfect cup—one that speaks to both your senses and your soul.
            </p>

            <h2 className="mb-6 text-3xl font-bold">The Ritual of Coffee</h2>
            <p className="mb-6 text-lg leading-relaxed">
              There's something almost magical about the ritual of coffee. The gentle hiss of steam, the rich aroma that
              fills the air, the warmth of the cup in your hands—these sensory experiences create a moment of
              mindfulness in our day. At Came, we honor this ritual by creating an environment where you can fully
              immerse yourself in the experience.
            </p>
            <p className="mb-12 text-lg leading-relaxed">
              Whether you're starting your day with us, taking a mid-afternoon break, or winding down in the evening, we
              want each visit to Came to feel like a small retreat—a moment where you can reconnect with yourself or
              deepen your connection with others over a perfectly crafted cup.
            </p>

            <div className="relative mb-12 h-80 w-full overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt="Barista crafting coffee"
                fill
                className="object-cover"
              />
            </div>

            <h2 className="mb-6 text-3xl font-bold">Our Community</h2>
            <p className="mb-6 text-lg leading-relaxed">
              Coffee has always been about community. From ancient coffee houses where ideas were exchanged to modern
              cafes where friendships are formed, coffee brings people together. At Came, we're proud to be a gathering
              place for our neighborhood—a space where conversations flow as freely as our coffee.
            </p>
            <p className="mb-12 text-lg leading-relaxed">
              We've watched first dates turn into engagements, business ideas scribbled on napkins turn into thriving
              companies, and strangers become friends over shared tables. These human connections are as much a part of
              our story as the coffee we serve.
            </p>

            <h2 className="mb-6 text-3xl font-bold">Our Promise</h2>
            <p className="mb-6 text-lg leading-relaxed">
              Every cup we serve is a promise—a promise that we've sourced our beans ethically, roasted them with care,
              and prepared your drink with attention to detail. It's a promise that when you visit us, you'll find not
              just excellent coffee, but a moment of genuine connection in an increasingly disconnected world.
            </p>
            <p className="mb-12 text-lg leading-relaxed">
              We invite you to become part of our story. Whether you're a daily regular or a first-time visitor, each
              time you choose Came, you're choosing to pause, to savor, and to connect—with yourself, with others, and
              with the simple joy of a perfectly crafted cup of coffee.
            </p>

            <div className="flex justify-center">
              <Button
                className="rounded-full bg-slate-800 px-8 py-6 text-white hover:bg-slate-700"
                onClick={() => router.push("/menu")}
              >
                Explore our menu
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
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-sm font-medium">Visit Us</h3>
              <p className="text-sm text-gray-400">1813 N Milwaukee Ave Ste 1</p>
              <p className="text-sm text-gray-400">Chicago, IL 60647</p>
              <p className="mt-2 text-sm text-gray-400">Open daily: 7am - 7pm</p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium">Contact</h3>
              <p className="text-sm text-gray-400">hello@came.coffee</p>
              <p className="text-sm text-gray-400">(312) 555-1234</p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  Instagram
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Facebook
                </a>
              </div>
            </div>
          </div>
          <p className="mt-8 text-xs text-gray-500">© 2023 Came Coffee. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
