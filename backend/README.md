# Hotel Booking System - Backend

## Admin Credentials

**Email:** hotel@gmail.com  
**Password:** 1234567890

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
The `.env` file is already configured to use the `postgres` database.

### 3. Run the Application
```bash
npm start
```

The server will start on http://localhost:3000

## Admin Features
- Login with admin credentials above
- Add new rooms with images
- Edit existing rooms
- Delete/deactivate rooms
- View all bookings from all users

## API Endpoints

### Auth
- POST /auth/signup - Register new user
- POST /auth/login - Login (use admin credentials above)

### Rooms (Admin)
- GET /rooms - List all rooms
- POST /rooms - Create room (ADMIN only)
- PATCH /rooms/:id - Update room (ADMIN only)
- DELETE /rooms/:id - Deactivate room (ADMIN only)

### Bookings (Admin)
- GET /bookings - Get all bookings (ADMIN only)
