# Grade Project (AutoAssist) – Full Summary

## 1. Project overview

**AutoAssist** is an Expo React Native (TypeScript) app with three roles: **User**, **Mechanic**, and **Seller**. After login, the app shows role-specific flows: users request/book mechanics, mechanics accept requests and manage jobs, sellers have store/orders (placeholders). Backend is **Supabase** (auth, Postgres, RLS, Realtime).

---

## 2. Tech stack

| Area | Technology |
|------|------------|
| Framework | Expo ~54, React 19, React Native 0.81 |
| Language | TypeScript |
| Navigation | React Navigation 7 (native-stack + bottom-tabs) |
| Auth / DB | Supabase (Auth + Postgres + Realtime) |
| State | Zustand (auth store) |
| Forms | React Hook Form + Zod (@hookform/resolvers) |
| Other | Expo Location, Expo Notifications, Axios (API client), react-native-safe-area-context |

---

## 3. App structure (`src/`)

```
src/
├── api/              # Axios client, optional REST API
├── components/       # Shared UI
│   ├── ui/           # Design system (Screen, Button, Input, Card, Header)
│   ├── Button.tsx, Input.tsx, ScreenContainer.tsx  # Legacy (kept for compatibility)
│   └── index.ts
├── features/
│   ├── auth/         # Login, Register (schemas + screens)
│   ├── user/         # Home, Bookings, ActiveJob, Searching, Profile
│   ├── booking/      # MechanicList, MechanicProfile, Booking, BookingSuccess
│   ├── mechanic/     # Requests, RequestsNearby, Jobs, ActiveJob, MechanicBookings, Profile
│   ├── seller/       # Store, Orders, Profile
│   ├── requests/     # (placeholder)
│   └── store/        # (placeholder)
├── hooks/            # useAuth
├── lib/              # supabase, authHelpers, mechanicHelpers
├── navigation/       # AuthStack, UserStack, MechanicStack, SellerTabs, RootNavigator
├── store/            # authStore (Zustand)
├── theme/            # Design tokens (theme.ts + index)
├── types/            # user, navigation, booking
└── utils/            # location (e.g. getCurrentPosition, distanceKm)
```

---

## 4. Design system (`src/theme/` and `src/components/ui/`)

### Theme (`src/theme/theme.ts`)

- **Colors:** primary (#0A84FF), background (#FFFFFF), text (#111111), muted (#777777), border (#E5E5E5), danger (#FF3B30), success (#34C759); plus compatibility aliases (surface, error, textSecondary, secondary).
- **Spacing:** xs(4), sm(8), md(16), lg(24), xl(32).
- **Radius:** sm(6), md(12), lg(18).
- **Typography:** Presets `title`, `subtitle`, `body`, `caption` (fontSize, lineHeight, fontWeight); backward-compat `fontSize` and `lineHeight` scales.
- **Exports:** `theme` object and named exports `colors`, `spacing`, `radius`, `typography` from `src/theme/index.ts`.

### UI components (`src/components/ui/`)

| Component | Purpose |
|-----------|--------|
| **Screen** | SafeAreaView, white background, padding from theme |
| **Button** | primary / secondary / outline, loading state |
| **Input** | label, error message, theme-based styling |
| **Card** | Rounded corners, shadow (elevation on Android, shadow on iOS) |
| **Header** | Title + optional back button (onBackPress) |

All screens use these components and `theme` tokens for consistent look and feel.

---

## 5. Authentication and roles

- **Auth:** Supabase Auth. Login (email/password) and Register (name, email, password, optional phone, role: user | mechanic | seller).
- **Profile:** On sign-up, trigger `handle_new_user()` creates a row in `public.profiles` with `id`, `name`, `email`, `role`. Role comes from sign-up metadata.
- **Auth state:** Zustand `authStore` holds `user`, `isAuthenticated`, `isLoading`. On app load, session is restored; profile is fetched via `authHelpers` (fetchProfile, ensureProfileExists, authUserFromSession).
- **Routing:** `RootNavigator` checks auth and role and renders:
  - Not authenticated → `AuthStack` (Login / Register).
  - Role **user** → `UserStack` (tabs + stack screens).
  - Role **mechanic** → `MechanicStack` (tabs + ActiveJob).
  - Role **seller** → `SellerTabs` (Store, Orders, Profile).

---

## 6. Features by role

### User

- **Home:** “Request mechanic” (creates a request with user location, navigates to Searching) and “Book a mechanic” (navigates to MechanicList).
- **Bookings:** List of user’s bookings (date, time, status); “Book a mechanic” opens MechanicList.
- **Flow:** MechanicList → MechanicProfile → Booking (date/time) → BookingSuccess; Realtime notifies when a request is accepted → ActiveJob.
- **Searching:** Waiting screen while request is pending; on Realtime update (status = accepted), navigate to ActiveJob.
- **ActiveJob:** View request status, description, location.
- **Profile:** Show user info, Sign Out.

### Mechanic

- **Requests (RequestsNearbyScreen):** List pending requests, optionally with distance; “Accept” assigns mechanic and updates status; Realtime for new requests.
- **Jobs:** Show active job (if any); “View job” → ActiveJob.
- **ActiveJob:** View request details, status, customer location.
- **Bookings:** List mechanic’s appointments (date, time, status).
- **Profile:** Sign Out.

### Seller

- **Store / Orders:** Placeholder screens (title + role).
- **Profile:** Sign Out.

---

## 7. Supabase backend

### Main tables

- **profiles** – id (→ auth.users), name, email, role (user_role).
- **mechanics** – user_id (→ profiles), workshop_name, experience_years, rating, availability_status.
- **sellers** – user_id, shop_name, address.
- **mechanic_locations** – mechanic_id, lat, lng (for distance/nearby).
- **requests** – user_id, mechanic_id (nullable until accepted), status (request_status), problem_description, location_lat/lng, price, etc.
- **bookings** – user_id, mechanic_id, date, time, status (booking_status).
- **products, orders, ratings** – schema present for future use.

### Enums

- user_role: user, mechanic, seller  
- request_status: pending, accepted, in_progress, completed, cancelled  
- booking_status: pending, confirmed, completed, cancelled  
- order_status, availability_status, etc.

### RLS and migrations

- Migrations in `supabase/migrations/`: full schema, enums, profiles, mechanics, sellers, requests, bookings, products, orders, ratings, indexes, RLS policies.
- Notable: profile self-insert, mechanic pending-requests select, realtime for `requests`, users can select mechanics for booking flow, profile phone → email migration, etc.

### Realtime

- User: subscribe to request updates (e.g. `requestId`) to navigate to ActiveJob when status becomes `accepted`.
- Mechanic: subscribe to new rows on `requests` (pending) to refresh list.

---

## 8. Navigation (typed)

- **AuthStack:** Login, Register.
- **UserStack:** UserTabs (Home, Bookings, Profile) + Searching, ActiveJob, MechanicList, MechanicProfile, Booking, BookingSuccess.
- **MechanicStack:** MechanicTabs (Requests, Jobs, Bookings, Profile) + ActiveJob.
- **SellerTabs:** Store, Orders, Profile.

Param lists and screen props are defined in `src/types/navigation.ts` (UserStackParamList, MechanicStackParamList, AuthStackParamList, tab param lists, and composite props for tabs).

---

## 9. What’s implemented in this repo

- **Expo app** with TypeScript and a clear `src/` feature-based structure.
- **Design system:** Single `theme.ts` (colors, spacing, radius, typography) and reusable UI in `src/components/ui/` (Screen, Button, Input, Card, Header). All relevant screens refactored to use them and theme tokens.
- **Auth:** Supabase Auth + profiles with role; Zustand auth store; login/register with React Hook Form + Zod; role-based root routing.
- **User flows:** Request mechanic (with location), searching state, active job view; book mechanic (list → profile → date/time → success); bookings list.
- **Mechanic flows:** Pending requests list (with optional distance), accept request, active job, bookings list, profile.
- **Seller flows:** Placeholder Store/Orders/Profile screens.
- **Supabase:** Full schema (profiles, mechanics, sellers, requests, bookings, etc.), RLS, triggers (e.g. new user → profile), Realtime subscriptions for requests.
- **Helpers:** `authHelpers` (profile fetch/ensure, AuthUser build), `mechanicHelpers` (getMechanicId, location updates), `location` utils (getCurrentPosition, distanceKm).
- **API layer:** Axios client in `src/api/` (optional; app primarily uses Supabase client).
- **Docs:** README (run instructions, auth flow, API, troubleshooting), this PROJECT_SUMMARY.md.

---

## 10. How to run

1. `npm install`
2. Configure `.env` (e.g. Supabase URL/key if not in app.config; see README).
3. `npx expo start` then choose device/simulator or Expo Go.

---

## 11. File summary (key files)

| Area | Key files |
|------|-----------|
| Entry | `App.tsx`, `index.ts` |
| Auth | `authStore.ts`, `useAuth.ts`, `authHelpers.ts`, LoginScreen, RegisterScreen |
| Theme | `theme/theme.ts`, `theme/index.ts` |
| UI | `components/ui/Screen.tsx`, `Button.tsx`, `Input.tsx`, `Card.tsx`, `Header.tsx` |
| Navigation | `RootNavigator.tsx`, AuthStack, UserStack, MechanicStack, UserTabs, MechanicTabs, SellerTabs |
| User | HomeScreen, BookingsScreen, SearchingScreen, ActiveJobScreen, ProfileScreen |
| Booking | MechanicListScreen, MechanicProfileScreen, BookingScreen, BookingSuccessScreen |
| Mechanic | RequestsNearbyScreen, RequestsScreen, JobsScreen, ActiveJobScreen, MechanicBookingsScreen, ProfileScreen |
| Seller | StoreScreen, OrdersScreen, ProfileScreen |
| Backend | `supabase/migrations/*.sql`, `lib/supabase.ts` |

This document is the **full summary of what is done in this repo** as of the last update.
