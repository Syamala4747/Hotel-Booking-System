import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/authApi';

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
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
  
  .auth-left-side {
    animation: slideInLeft 0.8s ease-out;
  }
  
  .auth-form-container {
    animation: slideInRight 0.8s ease-out;
  }
  
  .auth-input {
    transition: all 0.3s ease;
  }
  
  .auth-input:focus {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
  
  .auth-button {
    transition: all 0.3s ease;
  }
  
  .auth-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  
  .auth-button:active {
    transform: translateY(0);
  }
`;
document.head.appendChild(styleSheet);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginApi({ email, password });
      login(response.access_token, response.user);
      
      if (response.user.role === 'ADMIN') {
        navigate('/admin/rooms');
      } else {
        navigate('/rooms');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
            <p style={styles.brandTagline}>Experience luxury like never before</p>
          </div>
          <div style={styles.features}>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>✓</div>
              <div>
                <div style={styles.featureTitle}>Instant Booking</div>
                <div style={styles.featureDesc}>Reserve your room in seconds</div>
              </div>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>✓</div>
              <div>
                <div style={styles.featureTitle}>Best Price Guarantee</div>
                <div style={styles.featureDesc}>Lowest rates guaranteed</div>
              </div>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>✓</div>
              <div>
                <div style={styles.featureTitle}>24/7 Support</div>
                <div style={styles.featureDesc}>We're here whenever you need us</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={styles.rightSide} className="auth-right-side">
        <div style={styles.formContainer} className="auth-form-container">
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle} className="auth-form-title">Welcome Back</h2>
            <p style={styles.formSubtitle}>Login to access your account</p>
          </div>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={styles.input}
                className="auth-input"
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
                placeholder="Enter your password"
                style={styles.input}
                className="auth-input"
                onFocus={(e) => e.currentTarget.style.borderColor = '#6C5CE7'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
              />
            </div>
            
            <button 
              type="submit" 
              style={styles.button}
              className="auth-button"
            >
              Sign In
            </button>
          </form>
          
          <div style={styles.divider}>
            <span style={styles.dividerText}>or</span>
          </div>
          
          <p style={styles.footer}>
            Don't have an account? <Link to="/signup" style={styles.link}>Create one now</Link>
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
    backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80)',
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

export default Login;
