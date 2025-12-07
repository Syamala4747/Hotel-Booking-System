import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup as signupApi } from '../api/authApi';

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .signup-left-side {
    animation: slideInLeft 0.8s ease-out;
  }
  
  .signup-form-container {
    animation: slideInRight 0.8s ease-out;
  }
  
  .signup-input {
    transition: all 0.3s ease;
  }
  
  .signup-input:focus {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
  
  .signup-button {
    transition: all 0.3s ease;
  }
  
  .signup-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  
  .signup-button:active {
    transform: translateY(0);
  }
`;
document.head.appendChild(styleSheet);

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await signupApi({ name, email, password });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={styles.container} className="auth-container">
      {/* Left Side - Image */}
      <div style={styles.leftSide} className="auth-left-side">
        <div style={styles.overlay}></div>
        <div style={styles.leftContent}>
          <Link to="/" style={styles.backLink}>← Back to Home</Link>
          <div style={styles.brandSection}>
            <h1 style={styles.brandLogo}>🥇 SmartStay</h1>
            <p style={styles.brandTagline}>Join thousands of happy travelers</p>
          </div>
          <div style={styles.features}>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>✓</div>
              <div>
                <div style={styles.featureTitle}>Free Account</div>
                <div style={styles.featureDesc}>No hidden fees or charges</div>
              </div>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>✓</div>
              <div>
                <div style={styles.featureTitle}>Exclusive Deals</div>
                <div style={styles.featureDesc}>Access member-only discounts</div>
              </div>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>✓</div>
              <div>
                <div style={styles.featureTitle}>Easy Management</div>
                <div style={styles.featureDesc}>Track all your bookings in one place</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={styles.rightSide} className="auth-right-side">
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle} className="auth-form-title">Create Account</h2>
            <p style={styles.formSubtitle}>Start your journey with us today</p>
          </div>
          
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                style={styles.input}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6C5CE7'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={styles.input}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6C5CE7'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                style={styles.input}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6C5CE7'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
              />
            </div>
            
            <button 
              type="submit" 
              style={styles.button}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Create Account
            </button>
          </form>
          
          <div style={styles.divider}>
            <span style={styles.dividerText}>or</span>
          </div>
          
          <p style={styles.footer}>
            Already have an account? <Link to="/login" style={styles.link}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    '@media (maxWidth: 768px)': {
      flexDirection: 'column' as const,
    },
  },
  // Left Side
  leftSide: {
    flex: 1,
    minHeight: '300px',
    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    backgroundImage: 'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.95) 0%, rgba(162, 155, 254, 0.9) 100%)',
  },
  leftContent: {
    position: 'relative' as const,
    zIndex: 1,
    color: 'white',
    maxWidth: '500px',
  },
  backLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    marginBottom: '3rem',
    display: 'inline-block',
    opacity: 0.9,
    transition: 'opacity 0.3s',
  },
  brandSection: {
    marginBottom: '4rem',
  },
  brandLogo: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  brandTagline: {
    fontSize: '1.2rem',
    opacity: 0.95,
    fontWeight: '300',
  },
  features: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
  },
  feature: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: '700',
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  featureDesc: {
    fontSize: '0.95rem',
    opacity: 0.9,
  },
  // Right Side
  rightSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    width: '100%',
    maxWidth: '450px',
  },
  formHeader: {
    marginBottom: '2.5rem',
  },
  formTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '0.5rem',
  },
  formSubtitle: {
    fontSize: '1rem',
    color: '#6B7280',
  },
  error: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    border: '1px solid #FCA5A5',
  },
  success: {
    backgroundColor: '#D1FAE5',
    color: '#059669',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    border: '1px solid #6EE7B7',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '0.875rem 1rem',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '1rem',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.3s',
    outline: 'none',
  },
  button: {
    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'all 0.3s',
    boxShadow: '0 4px 20px rgba(108, 92, 231, 0.3)',
  },
  divider: {
    position: 'relative' as const,
    textAlign: 'center' as const,
    margin: '2rem 0',
  },
  dividerText: {
    backgroundColor: '#FFFFFF',
    padding: '0 1rem',
    color: '#9CA3AF',
    fontSize: '0.9rem',
    position: 'relative' as const,
    zIndex: 1,
  },
  footer: {
    textAlign: 'center' as const,
    color: '#6B7280',
    fontSize: '0.95rem',
  },
  link: {
    color: '#6C5CE7',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Signup;
