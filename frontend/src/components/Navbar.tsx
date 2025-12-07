import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(prev => !prev);
  };

  const handleProfileTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(prev => !prev);
  };

  const handleLogout = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    logout();
    navigate('/login');
  };

  // Hide navbar on landing page
  if (location.pathname === '/' || !user) {
    return null;
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/rooms" style={styles.brand}>
          {window.innerWidth <= 768 ? '🏨' : '🏨 SmartStay Hotel Booking System'}
        </Link>
        
        <div style={styles.links} className="navbar-links">
          {user.role === 'ADMIN' ? (
            <>
              <Link to="/admin/rooms" style={styles.link} className="navbar-link">Manage Rooms</Link>
              <Link to="/admin/bookings" style={styles.link} className="navbar-link">All Bookings</Link>
              <Link to="/admin/feedbacks" style={styles.link} className="navbar-link">Feedbacks</Link>
              
              {/* Profile Icon - Beside Feedbacks */}
              <div style={styles.profileContainer}>
            <button 
              ref={profileButtonRef}
              style={styles.profileIcon}
              onClick={handleProfileClick}
              onTouchEnd={handleProfileTouch}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={styles.profileInitial}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            </button>
            
            {showDropdown && createPortal(
              <div ref={dropdownRef} style={styles.dropdown}>
                <div style={styles.dropdownHeader}>
                  <strong style={styles.dropdownName}>{user.name}</strong>
                  <small style={styles.dropdownEmail}>{user.email}</small>
                </div>
                <button 
                  onClick={handleLogout}
                  style={styles.dropdownLogout}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  🚪 Logout
                </button>
              </div>,
              document.body
            )}
              </div>
            </>
          ) : (
            <>
              <Link to="/rooms" style={styles.link} className="navbar-link">Rooms</Link>
              <Link to="/my-bookings" style={styles.link} className="navbar-link">My Bookings</Link>
              
              {/* Profile Icon - Beside My Bookings */}
              <div style={styles.profileContainer}>
            <button 
              ref={profileButtonRef}
              style={styles.profileIcon}
              onClick={handleProfileClick}
              onTouchEnd={handleProfileTouch}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={styles.profileInitial}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            </button>
            
            {showDropdown && createPortal(
              <div ref={dropdownRef} style={styles.dropdown}>
                <div style={styles.dropdownHeader}>
                  <strong style={styles.dropdownName}>{user.name}</strong>
                  <small style={styles.dropdownEmail}>{user.email}</small>
                </div>
                <button 
                  onClick={handleLogout}
                  style={styles.dropdownLogout}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  🚪 Logout
                </button>
              </div>,
              document.body
            )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '1rem 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderBottom: '1px solid #E5E7EB',
    zIndex: 100000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: window.innerWidth <= 768 ? '0 0.5rem' : '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: window.innerWidth <= 768 ? '0.25rem' : '1rem',
  },
  brand: {
    color: '#1F2937',
    fontSize: window.innerWidth <= 768 ? '1.5rem' : '1.5rem',
    fontWeight: '700',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: window.innerWidth <= 768 ? 'auto' : undefined,
  },
  links: {
    display: 'flex',
    gap: window.innerWidth <= 768 ? '0.25rem' : '2.5rem',
    alignItems: 'center',
    flexWrap: 'nowrap' as const,
  },
  link: {
    color: '#6B7280',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: window.innerWidth <= 768 ? '0.7rem' : '1rem',
    transition: 'all 0.3s',
    padding: window.innerWidth <= 768 ? '0.35rem 0.5rem' : '0.5rem 1rem',
    borderRadius: '8px',
    whiteSpace: 'nowrap' as const,
  },
  profileContainer: {
    position: 'relative' as const,
    marginLeft: '0',
    display: 'inline-flex',
    alignItems: 'center',
    zIndex: 100002,
  },
  profileIcon: {
    width: window.innerWidth <= 768 ? '36px' : '40px',
    height: window.innerWidth <= 768 ? '36px' : '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)',
    border: 'none',
    padding: 0,
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
  } as React.CSSProperties,
  profileInitial: {
    color: 'white',
    fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem',
    fontWeight: '700',
  },
  dropdown: {
    position: 'fixed' as const,
    top: window.innerWidth <= 768 ? '60px' : '70px',
    right: window.innerWidth <= 768 ? '10px' : '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    minWidth: window.innerWidth <= 768 ? '260px' : '220px',
    zIndex: 100003,
    overflow: 'hidden',
    border: '3px solid #6C5CE7',
  },
  dropdownHeader: {
    padding: window.innerWidth <= 768 ? '1.25rem 1.5rem' : '1rem 1.25rem',
    background: 'linear-gradient(135deg, #F8F9FF 0%, #FFF5F7 100%)',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.35rem',
  },
  dropdownName: {
    fontSize: window.innerWidth <= 768 ? '1.1rem' : '1rem',
    color: '#1F2937',
  },
  dropdownEmail: {
    opacity: 0.7,
    fontSize: window.innerWidth <= 768 ? '0.95rem' : '0.85rem',
    color: '#6B7280',
  },
  dropdownLogout: {
    width: '100%',
    padding: window.innerWidth <= 768 ? '1.125rem 1.5rem' : '1rem 1.25rem',
    border: 'none',
    background: 'white',
    color: '#DC2626',
    fontSize: window.innerWidth <= 768 ? '1.05rem' : '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s',
    textAlign: 'left' as const,
  },
};

export default Navbar;
