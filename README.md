# Next.js + Supabase Demo

This is a simple demo project showcasing how to integrate [Supabase](https://supabase.com) with [Next.js](https://nextjs.org) to build a full-stack application with authentication and real-time features. The project demonstrates a simple todo list application with real-time updates and user authentication.

## What is Supabase?

Supabase is an open-source Backend-as-a-Service (BaaS) platform that emerged in 2020 as a powerful alternative to Firebase. Built on PostgreSQL, it provides developers with pre-built backend functionalities to accelerate app development.

### Key Advantages

- **Open Source & SQL-Based**: Unlike Firebase's NoSQL approach, Supabase uses PostgreSQL, providing the full power of SQL while maintaining an open-source architecture.
- **Real-Time Capabilities**: Built-in support for real-time subscriptions, perfect for building collaborative and interactive applications.
- **Enterprise-Grade PostgreSQL**: Leverages PostgreSQL's robust features including:
  - Row Level Security (RLS) for fine-grained access control
  - Foreign keys and relationships
  - Full-text search
  - Database functions and triggers
- **Modern Development**: Offers pre-built services for:
  - Authentication and user management
  - Auto-generated APIs
  - Storage
  - Serverless functions
  - Database backups

### API Query Language

Supabase uses PostgREST to automatically create RESTful APIs over your PostgreSQL database. Unlike GraphQL which uses a single endpoint with a specific query structure, Supabase's default approach leverages REST endpoints with powerful URL parameters.

Example of a Supabase REST query:
```
/rest/v1/todos?select=*&user_id=eq.05a78f9b-305e-4757-8de7-a78b4c945a88&order=created_at.desc
```

Key components:
- `select=*`: Select all columns
- `user_id=eq.{uuid}`: Filter records by user_id
- `order=created_at.desc`: Sort by creation date descending

This RESTful approach allows for:
- Intuitive URL-based querying
- Powerful filtering and sorting
- Automatic API generation from your database schema
- Efficient request/response cycles

### Development Benefits

1. **Rapid Development**
   - Pre-built backend services reduce infrastructure setup time
   - Auto-generated APIs eliminate boilerplate code
   - Extensive SDKs and tooling support

2. **Cost Efficiency**
   - Pay-as-you-go pricing model
   - Perfect for startups and MVPs
   - No upfront infrastructure costs

3. **Scalability**
   - Automatic handling of scaling
   - Built-in security features
   - Managed updates and maintenance

4. **Developer Experience**
   - Comprehensive documentation
   - Strong TypeScript support
   - Local development environment
   - Simple integration with modern frameworks

## Features

- 🔐 Authentication with Supabase Auth
  - Email/Password authentication
  - Protected routes with middleware
  - Automatic session management
  - Auth state context provider
- 📝 CRUD operations with Supabase Database
  - Real-time todo list management
  - Row Level Security (RLS) policies
  - TypeScript types for database schema
- ⚡ Real-time updates using Supabase Realtime
  - Live todo updates across clients
  - Optimistic UI updates
  - WebSocket subscriptions
- 🎨 Modern UI with Tailwind CSS
  - Clean and responsive design
  - Form validation
  - Loading states
  - Error handling

## Prerequisites

- Node.js 18+ 
- A Supabase account (free tier works great!)
- Basic understanding of React and Next.js
- Docker installed and running (required for local Supabase development)
- Supabase CLI installed (`npm install -g supabase`)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/jpcaparas/demo-vercel-supabase.git
   cd demo-vercel-supabase
   ```

2. Install dependencies:
   ```bash
   # Install project dependencies
   npm install

   # Install Supabase CLI globally if you haven't already
   npm install -g supabase
   ```

3. Environment Setup:
   ```bash
   # Copy the environment template
   cp .env.example .env.local

   # After running 'supabase start', update .env.local with the local development credentials:
   # - NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   # - NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start output>
   #
   # Note: Don't use production credentials during local development!
   ```

4. Database Setup (Terminal 1):
   ```bash
   # Ensure Docker is running first!
   
   # Start the local Supabase instance
   supabase start
   
   # Once Supabase is running, apply the database schema
   supabase migration up
   ```
   
   Verify Supabase is running:
   ```bash
   supabase status
   ```
   
   Expected output should show all services running:
   - API URL: http://localhost:54321
   - DB URL: postgresql://postgres:postgres@localhost:54322/postgres
   - Studio URL: http://localhost:54323

5. Start Next.js (Terminal 2):
   ```bash
   # Run the Next.js development server
   npm run dev
   ```

Now you should have:
- Terminal 1: Running Supabase (`supabase start`)
- Terminal 2: Running Next.js (`npm run dev`)
- Browser access:
  - Next.js app: http://localhost:3000
  - Supabase Studio: http://localhost:54323

Troubleshooting:
- If Supabase fails to start:
  ```bash
  supabase stop
  supabase start
  ```
- If database schema isn't working:
  ```bash
  supabase migration up --debug
  ```
- If Next.js can't connect to Supabase:
  - Check your `.env.local` settings
  - Ensure Supabase status shows all services running

## Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── auth/              # Authentication pages
│   │   ├── callback/      # Auth callback handler
│   │   ├── signin/        # Sign in page
│   │   └── signup/        # Sign up page
│   ├── dashboard/         # Protected dashboard pages
│   └── page.tsx           # Home page with auth redirect
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   │   ├── SignInForm.tsx
│   │   └── SignUpForm.tsx
│   └── todos/            # Todo list components
│       └── TodoList.tsx
├── lib/                  # Utility functions and configurations
│   ├── context/         # React context providers
│   │   └── auth-context.tsx
│   └── supabase/        # Supabase client configuration
├── services/            # Service layer for data fetching
│   └── todos.ts        # Todo CRUD operations
├── types/              # TypeScript type definitions
│   └── supabase.ts    # Database types
└── supabase/          # Supabase configurations
    └── migrations/    # Database migrations
```

## Key Features Demonstrated

1. **Authentication Flow**
   - Sign up with email/password
   - Email verification
   - Sign in with credentials
   - Protected routes with middleware
   - Automatic session refresh
   - Sign out functionality

2. **Data Management**
   - Create, read, update, and delete todos
   - Real-time updates using Supabase subscriptions
   - Optimistic UI updates
   - Error handling and loading states
   - TypeScript integration with database types

3. **Security**
   - Row Level Security (RLS) policies
   - User-specific data access
   - Secure authentication flow
   - Protected API routes

4. **Real-time Features**
   - Live updates across clients
   - WebSocket subscriptions
   - Efficient state management
   - Automatic reconnection

## Learn More

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Supabase Real-time Subscriptions](https://supabase.com/docs/guides/realtime/concepts)


## License

[MIT](https://choosealicense.com/licenses/mit/)
