import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { analyzeAllFeedbacks, checkAiHealth } from '../api/aiApi';

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | number>('all');
  const [showAiAnalysis, setShowAiAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiConnected, setAiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    loadFeedbacks();
    checkAiStatus();
  }, []);

  const checkAiStatus = async () => {
    try {
      const result = await checkAiHealth();
      setAiConnected(result.status === 'connected');
    } catch (error) {
      setAiConnected(false);
    }
  };

  const handleAiAnalysis = async () => {
    setAnalyzingAi(true);
    setShowAiAnalysis(true);
    try {
      const result = await analyzeAllFeedbacks();
      setAiAnalysis(result.analysis);
    } catch (error: any) {
      setAiAnalysis('Error analyzing feedbacks. Please try again.');
    } finally {
      setAnalyzingAi(false);
    }
  };

  const loadFeedbacks = async () => {
    try {
      // Get all rooms first
      const roomsResponse = await axiosClient.get('/rooms?showInactive=true');
      const rooms = roomsResponse.data;

      // Get feedbacks for each room
      const allFeedbacks: any[] = [];
      for (const room of rooms) {
        const feedbackResponse = await axiosClient.get(`/rooms/${room.id}/feedback`);
        const roomFeedbacks = feedbackResponse.data.map((fb: any) => ({
          ...fb,
          room: room,
        }));
        allFeedbacks.push(...roomFeedbacks);
      }

      // Sort by date (newest first)
      allFeedbacks.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setFeedbacks(allFeedbacks);
    } catch (error) {
      console.error('Failed to load feedbacks', error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueRooms = () => {
    const roomMap = new Map();
    feedbacks.forEach(fb => {
      if (!roomMap.has(fb.room.id)) {
        roomMap.set(fb.room.id, fb.room);
      }
    });
    return Array.from(roomMap.values());
  };

  const filteredFeedbacks = filter === 'all' 
    ? feedbacks 
    : feedbacks.filter(fb => fb.room.id === filter);

  const getAverageRating = (roomId?: number) => {
    const relevantFeedbacks = roomId 
      ? feedbacks.filter(fb => fb.room.id === roomId)
      : feedbacks;
    
    if (relevantFeedbacks.length === 0) return 0;
    
    const sum = relevantFeedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / relevantFeedbacks.length).toFixed(1);
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.wrapper}>
      {/* AI Analysis Modal */}
      {showAiAnalysis && (
        <div style={styles.modalOverlay} onClick={() => setShowAiAnalysis(false)}>
          <div style={styles.aiModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.aiModalHeader}>
              <h2 style={styles.aiModalTitle}>🤖 AI Feedback Analysis</h2>
              <button onClick={() => setShowAiAnalysis(false)} style={styles.closeModalBtn}>✕</button>
            </div>
            <div style={styles.aiModalContent}>
              {analyzingAi ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.spinner}></div>
                  <p>Analyzing all feedbacks with AI...</p>
                </div>
              ) : (
                <div style={styles.analysisText}>{aiAnalysis}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={styles.hero} className="dashboard-hero">
        <div style={styles.heroContent}>
          <span style={styles.badge}>⭐ Customer Reviews</span>
          <h1 style={styles.heroTitle} className="dashboard-hero-title">
            Customer <span style={styles.gradient}>Feedbacks</span>
          </h1>
          <p style={styles.heroDesc} className="dashboard-hero-desc">
            Monitor and analyze customer reviews to improve service quality
          </p>

          {/* AI Analysis Button */}
          <button
            onClick={handleAiAnalysis}
            onMouseOver={(e) => {
              if (aiConnected !== false) {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.5)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
            }}
            style={{
              ...styles.aiButton,
              opacity: aiConnected === false ? 0.5 : 1,
              cursor: aiConnected === false ? 'not-allowed' : 'pointer',
            }}
            disabled={analyzingAi || aiConnected === false}
            title={aiConnected === false ? 'AI is not connected' : 'Analyze all feedbacks with AI'}
          >
            {analyzingAi ? '🤖 Analyzing...' : 
             aiConnected === null ? '🤖 Checking AI...' :
             aiConnected ? '🤖 AI Feedback Analysis' : '🤖 AI Offline'}
          </button>
          
          {/* Stats in Hero */}
          <div style={styles.statsRow} className="dashboard-stats-row">
            <div style={styles.statBox}>
              <div style={styles.statNumber}>{feedbacks.length}</div>
              <div style={styles.statLabel}>Total Reviews</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statNumber}>⭐ {getAverageRating()}</div>
              <div style={styles.statLabel}>Average Rating</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statNumber}>{getUniqueRooms().length}</div>
              <div style={styles.statLabel}>Rooms Reviewed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={styles.contentSection} className="dashboard-content-section">
        <div style={styles.container}>
          <div style={styles.filterSection} className="dashboard-filter-section">
        <div style={styles.filterHeader}>
          <span style={styles.filterIcon}>🔍</span>
          <label style={styles.filterLabel}>Filter by Room</label>
        </div>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          style={styles.filterSelect}
        >
          <option value="all">All Rooms ({feedbacks.length} reviews)</option>
          {getUniqueRooms().map(room => (
            <option key={room.id} value={room.id}>
              Room {room.room_number} ({feedbacks.filter(fb => fb.room.id === room.id).length} reviews)
            </option>
          ))}
        </select>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div style={styles.noFeedback}>
          <p>No feedbacks yet.</p>
        </div>
      ) : (
        <div style={styles.feedbackGrid} className="dashboard-feedback-grid">
          {filteredFeedbacks.map((feedback) => (
            <div 
              key={feedback.id} 
              style={styles.feedbackCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.roomBadge}>
                  <span style={styles.roomIcon}>🏨</span>
                  <span style={styles.roomText}>Room {feedback.room.room_number}</span>
                </div>
                <div style={styles.ratingBadge}>
                  <span style={styles.ratingNumber}>{feedback.rating}</span>
                  <span style={styles.ratingStars}>{'⭐'.repeat(feedback.rating)}</span>
                </div>
              </div>
              
              <div style={styles.cardBody}>
                <div style={styles.quoteIcon}>"</div>
                <p style={styles.comment}>{feedback.comment}</p>
                
                <div style={styles.cardFooter}>
                  <div style={styles.userInfo}>
                    <div style={styles.userAvatar}>
                      {feedback.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.userDetails}>
                      <div style={styles.userName}>{feedback.user.name}</div>
                      <div style={styles.userEmail}>{feedback.user.email}</div>
                    </div>
                  </div>
                  <div style={styles.dateContainer}>
                    <div style={styles.dateIcon}>📅</div>
                    <div style={styles.date}>
                      {new Date(feedback.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
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
    maxWidth: window.innerWidth <= 768 ? '100%' : '1000px',
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
    maxWidth: window.innerWidth <= 768 ? '100%' : '800px',
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: window.innerWidth <= 768 ? '0 0.5rem' : '0',
  },
  filterSection: {
    backgroundColor: 'white',
    padding: window.innerWidth <= 768 ? '1rem' : '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: window.innerWidth <= 768 ? 'column' as const : 'row' as const,
    alignItems: window.innerWidth <= 768 ? 'stretch' : 'center',
    gap: '1rem',
    border: '1px solid #E5E7EB',
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  filterIcon: {
    fontSize: '1.25rem',
  },
  filterLabel: {
    fontWeight: '600',
    color: '#1F2937',
    fontSize: '1rem',
  },
  filterSelect: {
    flex: 1,
    padding: '0.875rem 1rem',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
    outline: 'none',
    transition: 'all 0.3s',
  },
  noFeedback: {
    backgroundColor: 'white',
    padding: '4rem 2rem',
    borderRadius: '16px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  feedbackGrid: {
    display: window.innerWidth <= 768 ? 'flex' : 'grid',
    flexDirection: window.innerWidth <= 768 ? 'column' as const : undefined,
    gridTemplateColumns: window.innerWidth <= 768 ? undefined : 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem',
  },
  feedbackCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'all 0.3s',
    border: '1px solid #E5E7EB',
  },
  cardHeader: {
    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
    padding: '0.875rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomBadge: {
    color: 'white',
    fontWeight: '800',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  roomIcon: {
    fontSize: '1.1rem',
  },
  roomText: {
    fontSize: '1.1rem',
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: '0.35rem 0.75rem',
    borderRadius: '15px',
  },
  ratingNumber: {
    color: 'white',
    fontWeight: '800',
    fontSize: '1.1rem',
  },
  ratingStars: {
    fontSize: '0.85rem',
  },
  cardBody: {
    padding: '1.25rem',
    position: 'relative' as const,
  },
  quoteIcon: {
    display: 'none',
  },
  comment: {
    color: '#374151',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '1rem',
    fontStyle: 'italic',
    position: 'relative' as const,
    zIndex: 1,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #F3F4F6',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '1rem',
    boxShadow: '0 2px 8px rgba(108, 92, 231, 0.3)',
    flexShrink: 0,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.15rem',
  },
  userName: {
    fontWeight: '700',
    color: '#1F2937',
    fontSize: '0.95rem',
  },
  userEmail: {
    color: '#9CA3AF',
    fontSize: '0.75rem',
  },
  dateContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    backgroundColor: '#F9FAFB',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
  },
  dateIcon: {
    fontSize: '0.85rem',
  },
  date: {
    color: '#6B7280',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  aiButton: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '700',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.3s',
    marginTop: '1.5rem',
    marginBottom: '2rem',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  aiModal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    maxWidth: '700px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  aiModalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    borderBottom: '2px solid #E5E7EB',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  },
  aiModalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
    margin: 0,
  },
  closeModalBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  aiModalContent: {
    padding: '2rem',
    maxHeight: 'calc(80vh - 100px)',
    overflowY: 'auto' as const,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #E5E7EB',
    borderTop: '4px solid #10B981',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  analysisText: {
    fontSize: '1rem',
    lineHeight: '1.8',
    color: '#374151',
    whiteSpace: 'pre-wrap' as const,
  },
};

export default AdminFeedbacks;
