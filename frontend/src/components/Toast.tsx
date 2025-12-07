import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, type = 'success', onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'info':
        return '#3B82F6';
      default:
        return '#10B981';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  return (
    <div style={{
      ...styles.toast,
      backgroundColor: getBackgroundColor(),
    }}>
      <div style={styles.icon}>{getIcon()}</div>
      <div style={styles.message}>{message}</div>
      <button onClick={onClose} style={styles.closeBtn}>✕</button>
    </div>
  );
};

const styles = {
  toast: {
    position: 'fixed' as const,
    top: window.innerWidth <= 768 ? '80px' : '90px',
    right: window.innerWidth <= 768 ? '10px' : '20px',
    left: window.innerWidth <= 768 ? '10px' : 'auto',
    minWidth: window.innerWidth <= 768 ? 'auto' : '300px',
    maxWidth: window.innerWidth <= 768 ? 'calc(100% - 20px)' : '500px',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    zIndex: 100005,
    animation: 'slideIn 0.3s ease-out',
  },
  icon: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'white',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  message: {
    flex: 1,
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    transition: 'opacity 0.2s',
  },
};

export default Toast;
