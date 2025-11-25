# +Bosque Manu Dashboard 🌳

A real-time emergency alert dashboard for forest protection and monitoring in the Bosque Manu region. Built with modern web technologies and enterprise-grade architecture patterns.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=flat-square&logo=supabase)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)

## 📖 Overview

This admin dashboard enables real-time monitoring and management of SOS alerts from forest volunteers and visitors. The system provides critical incident tracking, geographic visualization, and role-based access control to support emergency response operations.

### Key Features

- 🚨 **Real-time SOS Alert Management** - Track and respond to emergency alerts
- 🗺️ **Interactive Map Visualization** - Geographic display using Leaflet/OpenStreetMap
- 👥 **Role-Based Access Control** - Admin-only dashboard with secure authentication
- 📊 **Data Tables** - Advanced filtering, sorting, and pagination with TanStack Table
- 🎨 **Modern UI** - Responsive design with Tailwind CSS and Radix UI
- 🔐 **Secure Authentication** - Supabase Auth with middleware protection
- ⚡ **Server-Side Rendering** - Next.js App Router for optimal performance

## 🏗️ Architecture & Design Patterns

This project follows **production-grade architecture patterns** and best practices:

### Clean Architecture Principles

```
src/
├── app/                    # Next.js App Router (Presentation Layer)
│   ├── dashboard/         # Protected admin routes
│   ├── login/             # Authentication pages
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Feature components
├── lib/                   # Business Logic & Utilities
│   ├── auth.ts           # Authentication utilities
│   ├── logger.ts         # Centralized logging
│   ├── env.ts            # Environment validation
│   └── constants.ts      # Application constants
├── services/              # Data Access Layer
│   └── sos-alerts.ts     # SOS alerts service
├── types/                 # TypeScript definitions
│   └── index.ts          # Shared type definitions
├── contexts/              # React Context providers
└── hooks/                 # Custom React hooks
```

### Design Patterns Implemented

1. **Repository Pattern** (`src/services/`)
   - Abstraction layer for data access
   - Centralized database operations
   - Easy to test and mock

2. **Dependency Injection**
   - Supabase client injection
   - Service layer abstraction
   - Testable architecture

3. **Factory Pattern** (`src/utils/supabase/`)
   - Client creation with different contexts (server/client/middleware)
   - Environment-specific configurations

4. **Provider Pattern** (`src/contexts/`)
   - Global state management with React Context
   - User authentication state
   - Theme and UI preferences

5. **Error Boundary Pattern** (`src/components/error-boundary.tsx`)
   - Graceful error handling
   - User-friendly error messages
   - Prevents application crashes

6. **Singleton Pattern** (`src/lib/logger.ts`)
   - Centralized logging instance
   - Consistent log formatting
   - Environment-aware logging

### Code Quality Standards

✅ **Type Safety**
- 100% TypeScript coverage
- Centralized type definitions in `src/types/`
- Strict mode enabled
- No `any` types in production code

✅ **Error Handling**
- Custom logger with structured logging
- Error boundaries for React components
- Graceful degradation
- User-friendly error messages

✅ **Security Best Practices**
- Environment variable validation
- Server-side authentication checks
- Role-based access control
- Secure cookie handling with Supabase SSR

✅ **Code Organization**
- DRY (Don't Repeat Yourself) principle
- Single Responsibility Principle
- Clear separation of concerns
- Modular and reusable components

✅ **Performance Optimization**
- Server-side rendering (SSR)
- Dynamic imports for maps (client-only)
- Optimized images and assets
- Efficient database queries

## 📚 Tech Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **React 19.2** - UI library
- **TypeScript 5** - Type-safe development

### Backend & Database
- **Supabase** - Backend as a Service (BaaS)
  - Authentication
  - PostgreSQL database
  - Real-time subscriptions
  - Row-level security

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **shadcn/ui** - Beautiful, customizable components
- **Lucide React** - Icon library

### Data & State Management
- **TanStack Table v8** - Powerful table library
- **React Context API** - Global state management
- **Zod** - Schema validation

### Maps & Visualization
- **Leaflet** - Interactive maps
- **React Leaflet** - React wrapper for Leaflet
- **Recharts** - Chart library for data visualization

### Development Tools
- **ESLint** - Code linting
- **Prettier** (via Tailwind) - Code formatting

## 🔐 Authentication & Security

- **Supabase Auth** with email/password
- **Middleware-based route protection** (`src/middleware.ts`)
- **Role-based access control** (Admin-only dashboard)
- **Server-side session validation**
- **Secure cookie handling** with `@supabase/ssr`
- **Environment variable validation** at runtime

## 📁 Key Files

- `src/lib/auth.ts` - Authentication utilities (getCurrentUser, getUserProfile)
- `src/lib/logger.ts` - Centralized logging system
- `src/lib/env.ts` - Environment variable validation
- `src/types/index.ts` - TypeScript type definitions
- `src/services/sos-alerts.ts` - SOS alerts data service
- `src/middleware.ts` - Authentication middleware

## 🧪 Best Practices Demonstrated

1. **Centralized Type Definitions** - All types in `src/types/` for consistency
2. **Reusable Utilities** - Common operations abstracted into utilities
3. **Error Boundaries** - Graceful error handling at component level
4. **Structured Logging** - Production-ready logging with context
5. **Environment Validation** - Fail-fast on missing configuration
6. **Server Actions** - Organized in separate files for maintainability
7. **Separation of Concerns** - Clear boundaries between layers
8. **Code Documentation** - Comprehensive inline documentation