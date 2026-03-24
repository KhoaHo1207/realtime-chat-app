# Realtime Chat App

## Overview

This repository hosts a full-stack real-time messaging experience. The frontend is a Vite-powered React 19 application with Tailwind styling, Redux Toolkit state management, and Socket.IO client hooks. The backend is an Express 5/Mongoose API that handles authentication, profile management with Cloudinary uploads, message persistence, and a Socket.IO server for presence and push notifications.

## Technology Stack

### Frontend

- **Frameworks & Tooling**: React 19, Vite, TypeScript, Tailwind CSS (v4), Babel + ESLint.
- **State & Routing**: Redux Toolkit slices (`authSlice`, `chatSlice`), `react-router-dom` for guarded routes, and `react-toastify` for feedback.
- **Real-time & Networking**: `socket.io-client` keeps the authenticated user in sync with online peers; `axios` is preconfigured with `withCredentials` to talk to the backend’s API prefix (`/api/v1` in development via `MODE`/`VITE_API_URL`).
- **UX Components**: `Navbar` shows online status, `Sidebar` lists contacts and can filter online users, `ChatContainer` renders scroll-anchored chat bubbles, `MessageInput` handles text + media uploads with previews, and skeleton loaders keep the layout polished during API calls.

### Backend

- **Server Core**: Express 5 application with JSON parsing, `cookie-parser`, and CORS policies that mirror the frontend origin plus localhost/5173.
- **Authentication**: JWT tokens signed with `jsonwebtoken`, stored in secure cookies, and validated in `isAuthenticated` middleware. Passwords are hashed via `bcryptjs`.
- **Data Layer**: MongoDB via Mongoose (`User` & `Message` schemas) with a shared database connector.
- **Media & File Uploads**: `express-fileupload` receives avatar/media files which are proxied to Cloudinary using the shared `lib/cloudinary.js`.
- **Real-time Layer**: A Socket.IO server tracks `userSocketMap`, broadcasts `getOnlineUsers`, and emits `newMessage` events after every `Message.create`, enabling the frontend to append incoming messages without polling.

## Key Features

- Sign-up / sign-in flows with field validation, toast feedback, and persisted session cookies.
- Profile updates that can replace avatars; previous Cloudinary images are cleaned up before uploading a new one.
- A searchable contact list with online-only filtering, avatar indicators, and a dedicated chat view per selected user.
- Two-way messaging that persists chat history, sorts messages chronologically, scrolls to the latest entry, and accepts text, images, or video files.
- Online presence tracking powered by Socket.IO: the navbar, sidebar, and chat header all render live status dots and counts.
- Frontend drag-and-drop safe media previews and server-side uploads that auto-detect resource type.

## Architecture Notes

- API namespaces live under `/api/v1`: `/auth` (sign-up, sign-in, sign-out), `/user` (profile info/update), `/message` (list contacts, fetch conversation, send message).
- `sendMessage` writes to MongoDB and immediately relays the new document through Socket.IO using `getReceiverSocketId`.
- `chatSlice` keeps the currently selected contact, existing conversation, and optimistic updates in sync with realtime `newMessage` events; `authSlice` boots the socket connection once a user is available.
- Axios defaults to `http://localhost:8000/api/v1` in development; the client toggles the Socket.IO host to `http://localhost:8000` (or the current origin in production).

## Setup

### 1. Install dependencies

```bash
# from the root
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment

#### Server (`/server/.env`)

```
MONGO_URI=<MongoDB connection string>
PORT=8000
CLOUDINARY_CLOUD_NAME=<cloudinary cloud name>
CLOUDINARY_API_KEY=<cloudinary api key>
CLOUDINARY_API_SECRET=<cloudinary api secret>
JWT_SECRET_KEY=<secret used for signing tokens>
JWT_EXPIRE=15d
COOKIE_EXPIRE=15
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> Replace placeholders with your own credentials; do **not** commit secrets.

#### Client (`/client/.env`)

```
MODE=development
VITE_API_URL=http://localhost:8000
```

You can override `VITE_API_URL` for deployments; the client already toggles the socket endpoint based on `import.meta.env.MODE`.

### 3. Running the apps

- **Backend (with nodemon):**

```bash
cd server
npm run dev
```

Listens on the port defined in `.env` (default `8000`). The Socket.IO server piggybacks on the same HTTP server (`server.js`).

- **Frontend:**

```bash
cd client
npm run dev
```

Vite serves the UI on `http://localhost:5173` by default.

### 4. Optional production build

- Frontend: `npm run build` (runs `tsc -b && vite build`)
- Backend: `npm run start` to launch the bundled Node process.

## Testing & Linting

- `client/npm run lint` runs ESLint across the src tree.
- There are no dedicated automated tests yet; manual sanity checks on auth, messaging, and media uploads are recommended before deploying.

## Directory Layout (at a glance)

- `client/src/pages`: React views (Login/Register/Home/Profile/Notfound).
- `client/src/components`: UI primitives (Navbar, Sidebar, ChatContainer, MessageInput) plus skeleton loaders.
- `client/src/store`: Redux slices for auth/chat plus global store wiring.
- `client/src/lib`: `axios` instance + Socket.IO helpers.
- `server/controllers`, `routes`, `models`, `middleware`, `utils`: the Express/Mongoose/Socket pipeline.

## Next Steps

- Replace the included placeholder `.env` values with your own MongoDB/Cloudinary secrets.
- Add automated tests and CI workflows if you plan to scale the project.
