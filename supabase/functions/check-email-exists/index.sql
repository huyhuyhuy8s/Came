
-- Create an RPC function to check if an email exists in auth.users
create or replace function public.check_if_email_exists(email_to_check text)
returns boolean
language plpgsql
security definer
as $$
declare
  user_exists boolean;
begin
  -- Check if email exists in auth.users table
  select exists(
    select 1
    from auth.users
    where email = email_to_check
  ) into user_exists;
  
  return user_exists;
end;
$$;
