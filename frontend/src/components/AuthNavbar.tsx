import { Link } from 'react-router-dom';

const AuthNavbar = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          🥇 SmartStay
        </Link>
        
        <Link to="/" style={styles.homeLink}>
          ← Back
        </Link>
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
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(10px)',
    padding: '1rem 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    borderBottom: '1px solid #E5E7EB',
    zIndex: 1000,
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: '#1F2937',
    fontSize: '1.5rem',
    fontWeight: '700',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  homeLink: {
    color: '#6B7280',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'color 0.3s',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
  },
};

export default AuthNavbar;
