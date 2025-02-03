-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text unique,
  full_name text,
  avatar_url text,
  constraint username_length check (char_length(username) >= 3)
);

-- Create todos table
create table todos (
  id uuid default gen_random_uuid() primary key not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  completed boolean default false not null,
  user_id uuid references auth.users on delete cascade not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table todos enable row level security;

-- Create policies
create policy "Users can view their own profile."
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = id );

create policy "Users can view their own todos."
  on todos for select
  using ( auth.uid() = user_id );

create policy "Users can create their own todos."
  on todos for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own todos."
  on todos for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own todos."
  on todos for delete
  using ( auth.uid() = user_id );

-- Create functions to handle user management
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user management
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 