# Tripora API Documentation

## Authentication (`/api/auth`)
- `POST /register`
  Creates a new user account (name, email, password) securely hashed via bcrypt.
- `POST /login`
  Issues a JSON Web Token payload valid for 7 days authorizing standard API interactions.

## Trips (`/api/trips`)
Requires Bearer Auth Token.
- `POST /`
  Initializes a primary Root Trip entity assigning the logged-in User as ROOT `OWNER`.
- `GET /`
  Returns all associated trips (Both explicitly owned and those granted via Companions table).
- `GET /:id`
  Returns deeply nested Graph representations resolving stops instantly. Validates standard ownership matrices (403 exception if invalid).
- `PATCH /:id`
  Updates trip configuration fields securely evaluating payload parameters.
- `DELETE /:id`
  Cascades complete deletion wiping nested `Stop` representations alongside local entities natively.
- `PATCH /:id/cover`
  Intercepts standard Image IDs, converting `coverPhoto` to active CDN remote URLs securely rejecting disconnected payloads natively.

## Trip Stops (`/api/trips/:tripId/stops`)
Attached strictly underneath parent Trip router parameters.
- `POST /`
  Creates ordered nested entities (e.g. Ahmedabad, Mumbai, NYC) safely resolving geo points natively.
- `GET /`
  Orders dynamically outputting sorted arrays scaling frontend implementations.
- `PATCH /api/stops/:stopId`
  Directly modifies specific location markers natively enforcing auth boundaries correctly.
- `DELETE /api/stops/:stopId`
  Strips inner references smoothly repairing parent tracking.

## Activities (`/api/stops/:stopId/activities`)
Nested logically inside specific geographical stops.
- `POST /`
  Spawns granular timeframes safely mapping geo parameters alongside financial metrics (cost/notes).
- `GET /`
  Lists nested parameters correctly.
- `PATCH /api/activities/:activityId`
  Updates parameters safely dynamically.
- `DELETE /api/activities/:activityId`
  Nullifies mapping seamlessly avoiding orphaned blobs accurately.

## Media & Cloudinary (`/api/trips/:tripId/media` / `/api/activities/:activityId/media`)
- `POST /`
  Multiparts specific binary formats routing securely via Multer wrapping directly around Cloudinary APIs returning normalized payload maps limiting threshold sizes automatically (configurable MAX_ACTIVITY_PHOTOS defaults to 5 limits).
- `GET /` 
  Calculated paginated results dynamically sorting timelines natively.
- `PATCH /api/media/:mediaId`
  Configures captions avoiding network bloats strictly.
- `DELETE /api/media/:mediaId`
  Safely unlinks Remote Cloudinary objects synchronously clearing MongoDB pointers locally avoiding dead bytes accurately.

## Companions (`/api/trips/:tripId/companions`)
- `POST /`
  Invites active internal Tripora users mapping distinct roles dynamically (OWNER/COMPANION/VIEWER).
- `GET /`
  Lists populated user mappings cleanly abstracting payload parameters natively.
- `DELETE /:userId`
  Safely drops relationships strictly.

## Expenses (`/api/trips/:tripId/expenses`)
- `POST /`
  Maps complex calculations securely isolating negative payloads natively resolving currencies.
- `GET /`
  Provides financial tracking globally sorted dynamically. 
- `PATCH /api/expenses/:expenseId` & `DELETE /api/expenses/:expenseId`

## Sharing (`/api/trips/:tripId/share`)
- `POST /`
  Generates Cryptographically secure HEX tokens (32 bytes) mapped securely returning `api/shared/:token`.
- `GET /api/shared/:token`
  Validates public scopes limiting exposed footprints safely mapping Trip data natively rejecting outdated maps safely.
- `DELETE /`
  Forces "REVOKE" states universally freezing URLs securely.
