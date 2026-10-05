# Provider App

The provider app is a JavaScript React Native app built with Expo. It includes
provider sign-in, an available-request feed, request details, and the supported
accept/start/complete actions.

## Run locally

```sh
npm install
```

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_BASE_URL` to the backend
URL reachable from the device:

- Android emulator: `http://10.0.2.2:5000/api`
- iOS simulator: `http://localhost:5000/api`
- Physical device: `http://<your-computer-LAN-IP>:5000/api`

Then start Expo:

```sh
npm start
```

Sign in with a provider account. The access token is stored using Expo Secure
Store and cleared when signing out.

## Backend integration

The app follows the existing backend contract:

- `GET /service-requests/available` for new requests
- `GET /service-requests/:id` for request details
- `PATCH /service-requests/:id/accept`
- `PATCH /service-requests/:id/start`
- `PATCH /service-requests/:id/complete`

The backend currently moves requests directly from `accepted` to
`in_progress`; it has no `ON_THE_WAY` status or journey endpoint. Accordingly,
**Start Journey** is an in-app step and **Start Work** performs the backend's
`start` action. The current service-request API response also has no photo or
urgency fields, so the details screen shows a no-photo placeholder and defaults
urgency to Normal unless those fields are provided by the API.
