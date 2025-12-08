import { Link } from 'react-router-dom';

const AuthFooter = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.content} className="auth-footer-content">
          <div style={styles.brand}>
            <div style={styles.logo}>🥇 SmartStay</div>
            <p style={styles.tagline}>Your gateway to luxury accommodations</p>
          </div>

          <div style={styles.links} className="auth-footer-links">
            <div style={styles.column}>
              <h4 style={styles.heading}>Company</h4>
              <Link to="/" style={styles.link}>About Us</Link>
              <Link to="/" style={styles.link}>Careers</Link>
              <Link to="/" style={styles.link}>Press</Link>
            </div>
            <div style={styles.column}>
              <h4 style={styles.heading}>Support</h4>
              <Link to="/" style={styles.link}>Help Center</Link>
              <Link to="/" style={styles.link}>Contact Us</Link>
              <Link to="/" style={styles.link}>FAQ</Link>
            </div>
            <div style={styles.column}>
              <h4 style={styles.heading}>Legal</h4>
              <Link to="/" style={styles.link}>Privacy Policy</Link>
              <Link to="/" style={styles.link}>Terms of Service</Link>
              <Link to="/" style={styles.link}>Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          <p style={styles.copyright}>© 2024 SmartStay Hotel Booking System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1F2937',
    padding: '3rem 2rem 2rem',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '3rem',
    marginBottom: '2rem',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
  },
  tagline: {
    color: '#9CA3AF',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  links: {
    display: 'contents',
  },
  column: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  heading: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  link: {
    color: '#9CA3AF',
    fontSize: '0.9rem',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
  bottom: {
    paddingTop: '2rem',
    borderTop: '1px solid #374151',
    textAlign: 'center' as const,
  },
  copyright: {
    color: '#6B7280',
    fontSize: '0.9rem',
  },
};

export default AuthFooter;
