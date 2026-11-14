# SkillBridge mobile

Expo SDK 58 + React Native 0.88 + TypeScript app. Frontend only — there is no backend or API yet.

## Product & scope

SkillBridge is a social learning and skill-exchange app: **"Discover. Connect. Exchange. Grow."** It connects people who want to learn a skill with people who can teach it. Build a premium, youthful, welcoming mobile experience — Instagram-style discovery plus LinkedIn-style networking, with its own identity.

Order of work (do not skip ahead):

1. Foundation: design tokens, reusable UI, Expo Router, five-tab navigation. **Done.**
2. Home/Discover — the primary screen. **Done; keep it polished.**
3. Search, Matches, Profile, Skill Details, Swap Workspace, and Impact & Reviews — done. Welcome/auth and skill onboarding — done. Community — next.
4. Backend integration when the ASP.NET Core API exists.

Frontend-only rules:

- No `fetch`/axios/API clients, auth, or persistence. Do not invent endpoints.
- Use realistic, typed mock data in `src/data/`; keep it out of route files.
- No unnecessary dependencies. Explain before adding one.
- Android and iOS first. Web is a testing convenience, not a design target.
- Do not implement all screens at once or put a screen in one file.

## Current state (read before coding)

- Five-tab Expo Router app in `src/app/(tabs)/`: `index` (Home), `search`, `matches`, `community`, `profile`. The root `Stack` in `src/app/_layout.tsx` hides native headers and hides the splash screen in an effect.
- `HomeScreen` in `src/screens/home-screen.tsx` is fully built: header, feed tabs (For You / Trending / Following), interests, picked match, people, trending skills, and community feed.
- `SearchScreen` is a polished discovery screen: natural-language query with mapped intent, related skill chips, matched mentors, recent/popular searches, and a relevant discussion card. Results are mock data and are not filtered by the query yet.
- `MatchesScreen` is a reciprocal 1-on-1 exchange screen: compatibility badges, active status, ratings, teaches/wants trade cards, match rationale, and connect/profile actions. It uses `src/data/matches.ts`; actions show mock alerts and do not persist.
- `ProfileScreen` is built: identity, stats, teach/learn skill chips, and posts/exchanges/reviews tabs. It uses `src/data/profile.ts`; actions show mock alerts and do not persist. Teach skill chips open Skill Details.
- Skill Details (`src/app/skill/[id].tsx`, `SkillDetailsScreen`) is built: skill overview, demand/teacher/learner counts, related skill navigation, top teachers, learners, community discussion, save/share, and a find-partner CTA. It uses `src/data/skills.ts`.
- Swap Workspace (`src/app/swap/[id].tsx`, `SwapWorkspaceScreen`) is built: accepted-swap agreement, partner header, mock chat with local message sending, scheduled-session card, attach/options actions, and Mark Finished. It uses `src/data/swaps.ts`. Matches connect actions open this route.
- Impact & Reviews (`src/app/impact.tsx`, `ImpactScreen`) is built: dark community-impact card, completed-swap summary, interactive star review form with tags/feedback and local success state, plus endorsements. It uses `src/data/impact.ts`; Mark Finished opens this route.
- Welcome/auth (`src/app/welcome.tsx`, `WelcomeScreen`) and skill onboarding (`src/app/onboarding/skills.tsx`, `OnboardingSkillsScreen`) are built as a mock auth flow. Registration leads to onboarding, login and skip lead to Home; there is no real auth or persistence. Community still uses `PlaceholderScreen`.
- Design tokens live in `src/constants/theme.ts`: `Palette`, `Radius`, `Typography`, `Shadows`, `Spacing`, `BottomTabInset`, `MaxContentWidth`.
- Reusable UI is in `src/components/ui/`; feature sections are in `src/components/home/`, `src/components/search/`, `src/components/matches/`, `src/components/profile/`, `src/components/onboarding/`, `src/components/auth/`, `src/components/skill/`, `src/components/swap/`, and `src/components/impact/`; typed mock data is in `src/data/` (including `search.ts`, `matches.ts`, `profile.ts`, `onboarding.ts`, `skills.ts`, `swaps.ts`, and `impact.ts`); shared models are in `src/types/index.ts`.
- `lucide-react-native` and `react-native-svg` are installed. Use Lucide icons consistently.
- Starter screens/components (`explore`, `app-tabs`, themed text/view, animated icon, starter hooks) were deleted. Do not reintroduce template UI.
- `app.json` display name is `SkillBridge`; app icons and splash are still Expo defaults (`#208AEF`). Do not rebrand config unless the task calls for it.
- Web is a client-only SPA (`web.output: "single"`) with web async routes disabled in the `expo-router` plugin. Dev SSR with lazy async routes intermittently threw `Requiring unknown module`, and web is only a testing convenience here. Do not switch web back to `server`/async routes without testing every tab.
- `skillbridge.sln` at the repo root is an empty placeholder. No API projects, controllers, or models exist.
- There is no test runner, ESLint config, CI, or `eas.json`. Do not assume these exist.
- `npx tsc --noEmit` and `npx expo-doctor` pass. Android and web exports were verified. The dev server was verified earlier; it may need restarting after route changes.

## Commands (from `skillbridge-mobile/`)

```bash
npm install               # package-lock.json; this repo uses npm, not bun
npm start                 # Expo dev server; press a / i / w
npm run android
npm run ios
npm run web
npx tsc --noEmit          # typecheck (there is no npm script)
npx expo-doctor           # dependency/config health; currently passes
npx expo export --platform android   # verifies a production Android bundle
npx expo install <pkg>    # install SDK-compatible versions
npx expo install --fix    # repair mismatched Expo package versions
```

`npm run lint` exists but ESLint is not configured; `npx expo lint` will offer to set it up. Typecheck and the Android export are the reliable gates today.

## Expo 58: verify APIs, don't trust memory

Expo ships breaking changes every SDK release. Before writing code that touches an Expo, EAS, or React Native API:

1. Check the `expo` version in `package.json` (currently `~58.0.25`).
2. Read `https://docs.expo.dev/versions/v58.0.0/`.
3. For anything else, start at `https://docs.expo.dev/llms.txt` and follow the specific page. Do not answer from memory.

## Architecture & conventions

- Routes live only in `src/app/`. Every file there is a screen; `_layout.tsx` files define navigators. Keep components, hooks, data, and types outside `src/app/`.
- Route files stay tiny: they render a screen from `src/screens/`, and screens compose section components. Keep that split for new screens too.
- Aliases: `@/*` → `src/*`, `@/assets/*` → `assets/*`.
- Use tokens from `src/constants/theme.ts` instead of hardcoded hex values or spacing. `Palette` has the brand colours, `Typography` the text variants, `Radius` the card/button radii, and `Shadows` the card elevations.
- `Spacing` is a custom scale, not 4/8/12: `half=2, one=4, two=8, three=16, four=24, five=32, six=64`. Read the constants.
- `SkillIcon` maps the typed `SkillIcon` model to Lucide icons. Add new skill icon mappings there rather than in screens.
- File naming is kebab-case (`skill-chip.tsx`). Components use named exports; route screens use default exports. Co-locate `StyleSheet.create` styles.
- Use installed primitives where they fit: `expo-image` for images, `react-native-safe-area-context` for insets, `react-native-reanimated` for animation.
- Keep shared UI in `src/components/ui/`; feature-specific sections belong in a feature folder such as `src/components/home/` or `src/components/search/`.
- The tab bar is a standard Expo Router `Tabs` bar sized with the safe-area inset. Do not double-pad screens for it.

## Navigation

- Use Expo Router only; do not import React Navigation navigators directly.
- Five tabs: Home (`/`), Search, Matches, Community, Profile. The tab `name` must match the route filename (`index` for `/`).
- The root stack also contains `/welcome` (auth), `/onboarding/skills` (skill setup), `/skill/[id]`, `/swap/[id]`, and `/impact`. These are outside the tab bar. Search and Profile teach chips open Skill Details, Matches connect opens Swap Workspace, and Swap Mark Finished opens Impact & Reviews.
- `src/app/_layout.tsx` calls `SplashScreen.preventAutoHideAsync()` and hides it in `useEffect`. Keep a `SplashScreen.hideAsync()` path if you refactor the root layout, or the app stays on the splash screen.
- Home actions navigate to `/matches` and `/profile`; profile is now real. Community remains a placeholder.
- `typedRoutes` is enabled. Route strings are typed from the generated `.expo/types/router.d.ts`; do not edit that file. It only knows existing routes, so restart the dev server after adding routes if type errors look stale. Navigate to dynamic routes with `{ pathname: '/skill/[id]', params: { id } }` (same for `/swap/[id]`), not a template string.

## Design direction

- Deep indigo/purple primary, soft lavender secondary, white/very light grey surfaces, subtle blue accents. Use `Palette`.
- Rounded cards/buttons, clean typography, consistent spacing, modern icons, subtle shadows. Avoid generic starter/template layouts.
- Light theme only for now; there is no dark-mode implementation.
- Icons: use Lucide (`lucide-react-native`) consistently. Do not reintroduce the starter's iOS-only `expo-symbols`/PNG tab icons.

## Expo native / build rules

- `ios/` and `android/` are generated (Continuous Native Generation). Never create or hand-edit them; configure native behaviour in `app.json` and config plugins.
- Expo Go includes bundled native modules. A library with new native code needs a development build (`npx expo run:ios` / `npx expo run:android`).
- EAS is not configured (no `eas.json`). Do not assume build/submit profiles exist.
