import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoomsList from './pages/RoomsList';
import RoomDetail from './pages/RoomDetail';
import AdminRooms from './pages/AdminRooms';
import AdminBookings from './pages/AdminBookings';
import AdminFeedbacks from './pages/AdminFeedbacks';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/rooms" element={
            <ProtectedRoute>
              <RoomsList />
            </ProtectedRoute>
          } />
          
          <Route path="/rooms/:id" element={
            <ProtectedRoute>
              <RoomDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/my-bookings" element={
            <ProtectedRoute role="USER">
              <MyBookings />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/rooms" element={
            <ProtectedRoute role="ADMIN">
              <AdminRooms />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/bookings" element={
            <ProtectedRoute role="ADMIN">
              <AdminBookings />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/feedbacks" element={
            <ProtectedRoute role="ADMIN">
              <AdminFeedbacks />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
