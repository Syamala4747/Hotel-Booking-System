# Hotel Booking System - Frontend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend URL
The backend URL is already configured in `src/api/axiosClient.ts` to `http://localhost:3000`.

If your backend runs on a different port, update the `baseURL` in that file.

### 3. Run Development Server
```bash
npm run dev
```

The app will start on http://localhost:5173

### 4. Build for Production
```bash
npm run build
```

The production build will be in the `dist` folder.

## Features

### User Features
- Sign up and login
- View all available rooms
- View room details with images
- Check room availability by date/time
- Book rooms
- View my bookings
- Give feedback for booked rooms
- See all feedbacks for each room

### Admin Features
- Login as admin
- View all rooms
- Add new rooms
- Edit existing rooms
- Delete/deactivate rooms
- View all bookings from all users

## Default Credentials

After setting up the backend, you can create an admin user manually in the database or sign up as a regular user and change the role to 'ADMIN' in the database.

## Tech Stack
- React 18
- TypeScript
- React Router v6
- Axios
- Vite
