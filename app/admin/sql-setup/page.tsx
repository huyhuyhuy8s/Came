"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SQLSetupPage() {
  const sqlScript = `
-- Enable RLS on users table
alter table public.users enable row level security;

-- Create policy for users table - allow authenticated users to read all users
create policy "Users can read all users"
  on public.users
  for select
  to authenticated
  using (true);

-- Create policy for users table - allow users to update their own data
create policy "Users can update own data"
  on public.users
  for update
  to authenticated
  using (auth.uid() = id);

-- Create policy for users table - allow authenticated users to insert their own data
create policy "Users can insert own data"
  on public.users
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Enable RLS on products table
alter table public.products enable row level security;

-- Create policy for products table - allow anyone to read products
create policy "Anyone can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- Create policy for carts table - allow users to manage their own carts
alter table public.carts enable row level security;

create policy "Users can manage their own carts"
  on public.carts
  for all
  to authenticated
  using (auth.uid() = user_id);

-- Create policy for cart_items table - allow users to manage their own cart items
alter table public.cart_items enable row level security;

create policy "Users can manage their own cart items"
  on public.cart_items
  for all
  to authenticated
  using (cart_id in (select id from public.carts where user_id = auth.uid()));

-- Create policy for orders table - allow users to manage their own orders
alter table public.orders enable row level security;

create policy "Users can manage their own orders"
  on public.orders
  for all
  to authenticated
  using (user_id = auth.uid());

-- Create policy for order_items table - allow users to manage their own order items
alter table public.order_items enable row level security;

create policy "Users can manage their own order items"
  on public.order_items
  for all
  to authenticated
  using (order_id in (select id from public.orders where user_id = auth.uid()));
  `

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript)
    alert("SQL script copied to clipboard!")
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>SQL Setup Script</CardTitle>
          <CardDescription>
            Copy this SQL script and run it in the Supabase SQL Editor to set up the necessary RLS policies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
            <pre className="text-sm">{sqlScript}</pre>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={copyToClipboard} className="w-full">
            Copy SQL Script
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
