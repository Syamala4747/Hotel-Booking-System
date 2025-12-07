interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({ message, onConfirm, onCancel }: ConfirmDialogProps) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttons}>
          <button onClick={onCancel} style={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={onConfirm} style={styles.confirmBtn}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  message: {
    fontSize: '1rem',
    color: '#1F2937',
    marginBottom: '1.5rem',
    lineHeight: '1.5',
  },
  buttons: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#F3F4F6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  confirmBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
};

export default ConfirmDialog;
