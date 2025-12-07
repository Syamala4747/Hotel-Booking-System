import { useState, useEffect, useMemo } from 'react';
import { getAllBookings, cancelBooking, updateBookingStatus } from '../api/bookingsApi';

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showConfirm, setShowConfirm] = useState<{ bookingId: number; roomNumber: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!showConfirm) return;

    try {
      await cancelBooking(showConfirm.bookingId);
      setNotification({ message: 'Booking cancelled successfully!', type: 'success' });
      setShowConfirm(null);
      loadBookings();
    } catch (error: any) {
      console.error('Failed to cancel booking', error);
      setNotification({ 
        message: `Failed to cancel booking: ${error.response?.data?.message || error.message}`, 
        type: 'error' 
      });
      setShowConfirm(null);
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setNotification({ message: 'Booking status updated successfully!', type: 'success' });
      loadBookings();
    } catch (error: any) {
      console.error('Failed to update status', error);
      setNotification({ 
        message: `Failed to update status: ${error.response?.data?.message || error.message}`, 
        type: 'error' 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return { bg: '#E0F2FE', color: '#0369A1' }; // Pastel blue
      case 'CHECKED_IN':
        return { bg: '#D1FAE5', color: '#047857' }; // Pastel green
      case 'CHECKED_OUT':
        return { bg: '#E9D5FF', color: '#7C3AED' }; // Pastel purple
      case 'CANCELLED':
        return { bg: '#FECACA', color: '#B91C1C' }; // Pastel red
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  // Memoized calculations - MUST be before any early returns
  const filteredBookings = useMemo(() => {
    if (!searchQuery) return bookings;
    const query = searchQuery.toLowerCase();
    return bookings.filter(booking => 
      booking.user?.name?.toLowerCase().includes(query) ||
      booking.user?.email?.toLowerCase().includes(query) ||
      booking.room?.room_number?.toString().includes(query)
    );
  }, [bookings, searchQuery]);

  const totalRevenue = useMemo(() => {
    return bookings.reduce((total, booking) => {
      if (booking.total_cost) {
        return total + Number(booking.total_cost);
      } else {
        // Fallback calculation for old bookings
        const startDate = new Date(booking.start_time);
        const endDate = new Date(booking.end_time);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const dailyRate = booking.room.cost;
        const hourlyRate = dailyRate / 24;
        
        if (diffHours <= 6) return Math.ceil(6 * hourlyRate);
        if (diffHours <= 12) return Math.ceil(diffHours * hourlyRate);
        if (diffHours <= 24) return dailyRate;
        return Math.ceil(diffHours / 24) * dailyRate;
      }
    }, 0);
  }, [bookings]);

  const activeBookings = useMemo(() => {
    const now = new Date();
    return bookings.filter(booking => {
      const start = new Date(booking.start_time);
      const end = new Date(booking.end_time);
      return start <= now && end >= now && booking.status !== 'CANCELLED';
    }).length;
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    const now = new Date();
    return bookings.filter(booking => {
      const start = new Date(booking.start_time);
      return start > now && booking.status !== 'CANCELLED';
    }).length;
  }, [bookings]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div style={styles.loadingText}>Loading bookings...</div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Notification Toast */}
      {notification && (
        <div style={{
          ...styles.notification,
          backgroundColor: notification.type === 'success' ? '#D1FAE5' : '#FEE2E2',
          color: notification.type === 'success' ? '#059669' : '#DC2626',
        }}>
          {notification.type === 'success' ? '✅' : '❌'} {notification.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={styles.modalOverlay} onClick={() => setShowConfirm(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Cancel Booking</h3>
            <p style={styles.modalText}>
              Are you sure you want to cancel booking for Room {showConfirm.roomNumber}?
            </p>
            <p style={styles.modalWarning}>This action cannot be undone.</p>
            <div style={styles.modalButtons}>
              <button 
                onClick={() => setShowConfirm(null)} 
                style={styles.modalCancelBtn}
              >
                No, Keep It
              </button>
              <button 
                onClick={handleCancelBooking} 
                style={styles.modalConfirmBtn}
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={styles.hero} className="dashboard-hero">
        <div style={styles.heroContent}>
          <span style={styles.badge}>📊 Booking Management</span>
          <h1 style={styles.heroTitle} className="dashboard-hero-title">
            All <span style={styles.gradient}>Bookings</span>
          </h1>
          <p style={styles.heroDesc} className="dashboard-hero-desc">
            Monitor and manage all hotel reservations in real-time
          </p>
          
          {/* Stats in Hero */}
          <div style={styles.statsRow} className="dashboard-stats-row">
            <div style={styles.statBox}>
              <div style={styles.statNumber}>{bookings.length}</div>
              <div style={styles.statLabel}>Total Bookings</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statNumber}>{activeBookings}</div>
              <div style={styles.statLabel}>Active Now</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statNumber}>{upcomingBookings}</div>
              <div style={styles.statLabel}>Upcoming</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statNumber}>₹{totalRevenue}</div>
              <div style={styles.statLabel}>Total Revenue</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={styles.contentSection} className="dashboard-content-section">
        <div style={styles.container}>
          {/* Search Bar - Always visible */}
          {bookings.length > 0 && (
            <div style={styles.searchContainer}>
                <div 
                  style={styles.searchBox}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#6C5CE7';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <span style={styles.searchIcon}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search by guest name, email, or room number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={styles.clearButton}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#D1D5DB';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#E5E7EB';
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div style={styles.searchInfo}>
                  Showing {filteredBookings.length} of {bookings.length} bookings
                </div>
              </div>
            )}

          {bookings.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📅</div>
              <h3 style={styles.emptyTitle}>No Bookings Yet</h3>
              <p style={styles.emptyText}>Bookings will appear here once customers start making reservations</p>
            </div>
          ) : (
            <>
              {window.innerWidth <= 768 && (
                <div style={styles.scrollHint}>
                  ← Scroll horizontally to see all columns →
                </div>
              )}
              
              <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Room</th>
                    <th style={styles.th}>Guest</th>
                    <th style={styles.th}>Check-in</th>
                    <th style={styles.th}>Check-out</th>
                    <th style={styles.th}>Duration</th>
                    <th style={styles.th}>Revenue</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => {
                    const startDate = new Date(booking.start_time);
                    const endDate = new Date(booking.end_time);
                    const durationHours = booking.duration_hours || Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
                    const statusColors = getStatusColor(booking.status);

                    return (
                      <tr key={booking.id} style={styles.tableRow}>
                        <td style={styles.td}>
                          <span style={styles.bookingId}>#{booking.id}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.roomCell}>
                            <div style={styles.roomNumber}>Room {booking.room.room_number}</div>
                            <div style={styles.roomType}>
                              {Array.isArray(booking.room.room_type) 
                                ? booking.room.room_type.join(', ') 
                                : booking.room.room_type}
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.guestCell}>
                            <div style={styles.guestName}>{booking.user.name}</div>
                            <div style={styles.guestEmail}>{booking.user.email}</div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.dateCell}>
                            <div>{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                            <div style={styles.timeText}>
                              {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.dateCell}>
                            <div>{endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                            <div style={styles.timeText}>
                              {endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.duration}>{durationHours}h</span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.revenue}>
                            ₹{booking.total_cost 
                              ? Number(booking.total_cost).toFixed(0) 
                              : (() => {
                                  const dailyRate = booking.room.cost;
                                  const hourlyRate = dailyRate / 24;
                                  if (durationHours <= 6) return Math.ceil(6 * hourlyRate);
                                  if (durationHours <= 12) return Math.ceil(durationHours * hourlyRate);
                                  if (durationHours <= 24) return dailyRate;
                                  return Math.ceil(durationHours / 24) * dailyRate;
                                })()}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            style={{
                              ...styles.statusSelect,
                              backgroundColor: statusColors.bg,
                              color: statusColors.color,
                            }}
                          >
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="CHECKED_IN">Checked-in</option>
                            <option value="CHECKED_OUT">Checked-out</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* No Results Message */}
            {filteredBookings.length === 0 && searchQuery && (
              <div style={styles.noResults}>
                <div style={styles.noResultsIcon}>🔍</div>
                <div style={styles.noResultsText}>No bookings found for "{searchQuery}"</div>
                <button 
                  onClick={() => setSearchQuery('')} 
                  style={styles.clearSearchBtn}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#5B4FE9';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#6C5CE7';
                  }}
                >
                  Clear Search
                </button>
              </div>
            )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const styles = {
  wrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  // Hero Section
  hero: {
    marginTop: window.innerWidth <= 768 ? '85px' : '95px',
    paddingTop: window.innerWidth <= 768 ? '2rem' : '3rem',
    paddingBottom: window.innerWidth <= 768 ? '2rem' : '3rem',
    paddingLeft: window.innerWidth <= 768 ? '1rem' : '2rem',
    paddingRight: window.innerWidth <= 768 ? '1rem' : '2rem',
    background: 'linear-gradient(135deg, #F8F9FF 0%, #FFF5F7 100%)',
    textAlign: 'center' as const,
  },
  heroContent: {
    maxWidth: window.innerWidth <= 768 ? '100%' : '1200px',
    margin: '0 auto',
    padding: window.innerWidth <= 768 ? '0 0.5rem' : '0',
  },
  badge: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#EEF2FF',
    color: '#6C5CE7',
    borderRadius: '20px',
    fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.85rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    whiteSpace: 'nowrap' as const,
  },
  heroTitle: {
    fontSize: window.innerWidth <= 768 ? '1.75rem' : '3rem',
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: '1.2',
    marginBottom: '1.5rem',
  },
  gradient: {
    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroDesc: {
    fontSize: window.innerWidth <= 768 ? '0.95rem' : '1.1rem',
    color: '#6B7280',
    lineHeight: '1.8',
    marginBottom: '2.5rem',
  },
  statsRow: {
    display: window.innerWidth <= 768 ? 'flex' : 'grid',
    flexDirection: window.innerWidth <= 768 ? 'column' as const : undefined,
    gridTemplateColumns: window.innerWidth <= 768 ? undefined : 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: window.innerWidth <= 768 ? '1rem' : '1.5rem',
    maxWidth: window.innerWidth <= 768 ? '100%' : '1000px',
    margin: '0 auto',
  },
  statBox: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#6C5CE7',
    marginBottom: '0.5rem',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  // Content Section
  contentSection: {
    padding: window.innerWidth <= 768 ? '2rem 1rem' : '4rem 2rem',
    backgroundColor: '#F9FAFB',
    minHeight: '60vh',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: window.innerWidth <= 768 ? '0 0.5rem' : '0',
  },
  searchContainer: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.25rem',
    backgroundColor: '#F9FAFB',
    borderRadius: '10px',
    border: '2px solid #E5E7EB',
    transition: 'border-color 0.3s',
  },
  searchIcon: {
    fontSize: '1.25rem',
    color: '#6B7280',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.95rem',
    color: '#1F2937',
    outline: 'none',
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#E5E7EB',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#6B7280',
    transition: 'all 0.2s',
  },
  searchInfo: {
    marginTop: '0.75rem',
    fontSize: '0.85rem',
    color: '#6B7280',
    fontWeight: '600',
  },
  noResults: {
    backgroundColor: 'white',
    padding: '3rem 2rem',
    borderRadius: '12px',
    textAlign: 'center' as const,
    marginTop: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  noResultsIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    opacity: 0.5,
  },
  noResultsText: {
    fontSize: '1rem',
    color: '#6B7280',
    marginBottom: '1.5rem',
  },
  clearSearchBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6C5CE7',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  scrollHint: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: '0.75rem',
    textAlign: 'center' as const,
    fontSize: '0.85rem',
    fontWeight: '600',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  emptyState: {
    backgroundColor: 'white',
    padding: '4rem 2rem',
    borderRadius: '16px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '0.5rem',
  },
  emptyText: {
    fontSize: '1rem',
    color: '#6B7280',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    overflowX: 'auto' as const,
    WebkitOverflowScrolling: 'touch' as const,
  },
  table: {
    width: '100%',
    minWidth: '900px',
    borderCollapse: 'collapse' as const,
  },
  tableHeader: {
    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
  },
  th: {
    padding: '1rem',
    textAlign: 'left' as const,
    color: 'white',
    fontWeight: '700',
    fontSize: '0.85rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid #F3F4F6',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '1rem',
    fontSize: '0.9rem',
    color: '#374151',
  },
  bookingId: {
    fontWeight: '700',
    color: '#6C5CE7',
    fontSize: '1rem',
  },
  roomCell: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  roomNumber: {
    fontWeight: '700',
    color: '#1F2937',
  },
  roomType: {
    fontSize: '0.8rem',
    color: '#6B7280',
  },
  guestCell: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  guestName: {
    fontWeight: '600',
    color: '#1F2937',
  },
  guestEmail: {
    fontSize: '0.8rem',
    color: '#6B7280',
  },
  dateCell: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  timeText: {
    fontSize: '0.8rem',
    color: '#6B7280',
  },
  duration: {
    fontWeight: '600',
    color: '#6C5CE7',
  },
  revenue: {
    fontWeight: '700',
    color: '#059669',
    fontSize: '1rem',
  },
  statusSelect: {
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none',
    textTransform: 'capitalize' as const,
  },

  notification: {
    position: 'fixed' as const,
    top: '100px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 9999,
    animation: 'slideIn 0.3s ease-out',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '1rem',
  },
  modalText: {
    fontSize: '1rem',
    color: '#6B7280',
    marginBottom: '0.5rem',
  },
  modalWarning: {
    fontSize: '0.9rem',
    color: '#DC2626',
    fontWeight: '600',
    marginBottom: '1.5rem',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
  },
  modalCancelBtn: {
    flex: 1,
    padding: '0.75rem',
    border: '2px solid #E5E7EB',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#6B7280',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  modalConfirmBtn: {
    flex: 1,
    padding: '0.75rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#DC2626',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #E5E7EB',
    borderTop: '4px solid #6C5CE7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    fontSize: '1rem',
    color: '#6B7280',
    fontWeight: '600',
  },
};

export default AdminBookings;
