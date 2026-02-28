# Field Log

A lightweight mobile app for logging field observations. Visit a location, snap photos, write notes — everything is automatically tagged with GPS coordinates and a timestamp, stored entirely on-device.

Built as a portfolio project to demonstrate practical React Native and Expo skills.

---

## Demo

> Screen recording coming soon — will show: creating a note with photo and location, viewing it, finding it on the map.

---

## Features

- Create notes with a title, body, category, photos, and automatic GPS tagging
- Reverse-geocodes coordinates to a readable address where possible
- Swipe to delete with haptic feedback
- Browse all geotagged notes on an interactive map — tap a pin to open the note
- Full edit flow with location retag
- Settings persist across sessions (location tagging toggle)
- Works offline — no account, no sync, no server

---

## Tech Stack

| | |
|---|---|
| Framework | Expo SDK 54 (managed workflow) |
| Language | TypeScript |
| Navigation | React Navigation (native stack + bottom tabs) |
| State | Zustand |
| Storage | expo-sqlite (notes), AsyncStorage (settings) |
| Location | expo-location |
| Camera / Photos | expo-image-picker |
| Maps | react-native-maps |
| Haptics | expo-haptics |

---

## Running Locally

```bash
git clone https://github.com/Pete-Eichman/field-log.git
cd field-log
npm install
npx expo start
```

Scan the QR code with [Expo Go](https://expo.dev/go) on your phone. The app seeds a few demo notes on first launch so the list and map aren't empty.

---

## Architecture Decisions

**expo-sqlite over WatermelonDB**

WatermelonDB is powerful but brings significant complexity — a separate native thread, schema migration tooling, and a reactive query layer. For a single-entity app with no sync requirements, that's all overhead with no payoff. expo-sqlite with a thin hand-rolled data access layer in `src/db/db.ts` is simpler to reason about, easier to test, and straightforward to explain in an interview.

**Zustand over Context + useReducer**

The settings store is small (two booleans), but the pattern matters. React Context re-renders every consumer on any state change, which becomes a real problem as an app grows. Zustand's selective subscription model (`useSettingsStore(s => s.autoTagLocation)`) only re-renders what actually changed. It also makes the persistence story clean — one `persist` middleware call and the store survives app restarts via AsyncStorage, with no boilerplate.

**Local-only storage**

All notes stay on-device. There's no auth layer, no API calls, and no sync engine. This was a deliberate scope decision: the interesting engineering is in the native integrations (camera, GPS, SQLite, haptics), not in building a backend. A real sync layer would be worth adding — the data model is simple enough that something like a REST endpoint accepting note JSON would plug in cleanly — but it's out of scope here.

**Managed Expo workflow**

The app uses Expo's managed workflow rather than bare React Native. This trades some native flexibility for a dramatically faster setup and a smaller surface area of things that can go wrong during development. For a portfolio app that exercises native capabilities through Expo's own modules (camera, location, sqlite, haptics), the managed workflow is the right call.

---

## Testing

```bash
npm test
```

The test suite covers `src/db/db.ts` (all five CRUD functions, row mapping, JSON serialization) and `src/utils/formatDate.ts`. expo-sqlite is mocked so the tests run without a device or simulator. 13 tests, no snapshots.
