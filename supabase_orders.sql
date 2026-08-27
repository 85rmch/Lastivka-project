-- Run this SQL in your Supabase SQL Editor to create the orders table

CREATE TABLE IF NOT EXISTS public.orders (
    id text PRIMARY KEY,
    customer_name text,
    customer_phone text,
    delivery_info text,
    total numeric,
    status text DEFAULT 'pending',
    items jsonb,
    items_text text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so customers can place orders)
CREATE POLICY "Allow anonymous inserts" ON public.orders
    FOR INSERT 
    WITH CHECK (true);

-- Allow admins to read all orders (assuming you have auth set up, or you can use service role key)
CREATE POLICY "Allow authenticated full access" ON public.orders
    FOR ALL
    USING (auth.role() = 'authenticated');
