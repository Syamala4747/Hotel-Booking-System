import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRooms } from '../api/roomsApi';
import Chatbot from '../components/Chatbot';

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
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
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .dashboard-hero {
    animation: fadeIn 0.8s ease-out;
  }
  
  .dashboard-hero-title {
    animation: fadeInUp 1s ease-out 0.2s both;
  }
  
  .dashboard-hero-desc {
    animation: fadeInUp 1s ease-out 0.4s both;
  }
  
  .dashboard-content-section {
    animation: fadeInUp 1s ease-out 0.6s both;
  }
  
  .dashboard-rooms-grid > div:nth-child(1) {
    animation: fadeInUp 0.6s ease-out 0.1s both;
  }
  
  .dashboard-rooms-grid > div:nth-child(2) {
    animation: fadeInUp 0.6s ease-out 0.2s both;
  }
  
  .dashboard-rooms-grid > div:nth-child(3) {
    animation: fadeInUp 0.6s ease-out 0.3s both;
  }
  
  .dashboard-rooms-grid > div:nth-child(4) {
    animation: fadeInUp 0.6s ease-out 0.4s both;
  }
  
  .dashboard-rooms-grid > div:nth-child(5) {
    animation: fadeInUp 0.6s ease-out 0.5s both;
  }
  
  .dashboard-rooms-grid > div:nth-child(6) {
    animation: fadeInUp 0.6s ease-out 0.6s both;
  }
`;
document.head.appendChild(styleSheet);

const RoomsList = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await getRooms();
      console.log('🏨 RAW DATA from API:', JSON.stringify(data, null, 2));
      
      // Ensure images is always an array
      const processedRooms = data.map((room: any) => {
        console.log(`\n📋 Processing Room ${room.room_number}:`);
        console.log('  - Raw images:', room.images);
        console.log('  - Type:', typeof room.images);
        console.log('  - Is Array:', Array.isArray(room.images));
        
        let processedImages;
        if (Array.isArray(room.images)) {
          processedImages = room.images;
          console.log('  ✅ Already array:', processedImages);
        } else if (typeof room.images === 'string') {
          processedImages = room.images.split(',').map((img: string) => img.trim()).filter((img: string) => img);
          console.log('  🔄 Converted from string:', processedImages);
        } else {
          processedImages = [];
          console.log('  ❌ No images, using empty array');
        }
        
        return {
          ...room,
          images: processedImages
        };
      });
      
      console.log('\n✅ FINAL PROCESSED ROOMS:', JSON.stringify(processedRooms, null, 2));
      setRooms(processedRooms);
    } catch (error) {
      console.error('❌ Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading amazing rooms...</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Hero Section */}
      <section style={styles.hero} className="dashboard-hero">
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <span style={styles.badge}>🏨 Premium Accommodations</span>
          <h1 style={styles.heroTitle} className="dashboard-hero-title">
            Discover Your
            <br />
            <span style={styles.gradient}>Perfect Room</span>
          </h1>
          <p style={styles.heroDesc} className="dashboard-hero-desc">
            Browse our collection of luxury rooms designed for your comfort and convenience
          </p>
          <div style={styles.heroStats}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{rooms.length}+</div>
              <div style={styles.statLabel}>Premium Rooms</div>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>Support</div>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>100%</div>
              <div style={styles.statLabel}>Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section style={styles.roomsSection} className="dashboard-content-section">
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Available Rooms</h2>
            <p style={styles.sectionDesc}>Choose from our handpicked selection of premium rooms</p>
          </div>

          <div style={styles.grid} className="dashboard-rooms-grid">
            {rooms.map((room) => (
              <div 
                key={room.id} 
                style={styles.card}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(108, 92, 231, 0.15)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.06)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <div style={styles.imageContainer}>
                  {room.images && room.images.length > 0 ? (
                    <img 
                      src={room.images[0]} 
                      alt={room.room_number} 
                      style={styles.image}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div style={styles.noImage}>No Image</div>
                  )}
                  <div style={styles.roomBadge}>{room.capacity} 👥</div>
                  {room.images && room.images.length > 1 && (
                    <div style={styles.imageCount}>📷 {room.images.length}</div>
                  )}
                </div>
                
                <div style={styles.cardBody}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.roomNumber}>Room {room.room_number}</h3>
                    <div style={styles.priceTag}>
                      <span style={styles.priceAmount}>₹{room.cost}</span>
                      <span style={styles.priceLabel}>/day</span>
                    </div>
                  </div>
                  
                  <div style={styles.roomTypes}>
                    {(Array.isArray(room.room_type) ? room.room_type : [room.room_type]).map((type: string, idx: number) => (
                      <span key={idx} style={styles.typeTag}>{type.replace('_', ' ')}</span>
                    ))}
                  </div>
                  
                  <p style={styles.description}>{room.description.substring(0, 100)}...</p>
                  
                  <div style={styles.buttonGroup}>
                    <button
                      onClick={() => navigate(`/rooms/${room.id}?mode=view`)}
                      style={styles.viewButton}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#667EEA';
                        e.currentTarget.style.color = '#667EEA';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                        e.currentTarget.style.borderColor = '#E5E7EB';
                        e.currentTarget.style.color = '#374151';
                      }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/rooms/${room.id}?mode=book`)}
                      style={styles.bookButton}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.5)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
                      }}
                    >
                      Book Now →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
  },
  loadingSpinner: {
    width: '60px',
    height: '60px',
    border: '4px solid #E5E7EB',
    borderTop: '4px solid #667EEA',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1.5rem',
    fontSize: '1.1rem',
    color: '#6B7280',
    fontWeight: '600',
  },
  wrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  // Hero Section
  hero: {
    marginTop: '80px',
    paddingTop: window.innerWidth <= 768 ? '3rem' : '4rem',
    paddingBottom: window.innerWidth <= 768 ? '3rem' : '4rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none' as const,
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative' as const,
    zIndex: 1,
  },
  badge: {
    display: 'inline-block',
    padding: '0.5rem 1.25rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    borderRadius: '25px',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  heroTitle: {
    fontSize: window.innerWidth <= 768 ? '2rem' : '3.5rem',
    fontWeight: '800',
    color: 'white',
    lineHeight: '1.2',
    marginBottom: '1.5rem',
    textShadow: '0 2px 20px rgba(0,0,0,0.2)',
  },
  gradient: {
    color: 'white',
    textShadow: '0 0 30px rgba(255,255,255,0.5)',
  },
  heroDesc: {
    fontSize: '1.15rem',
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: '1.8',
    maxWidth: '600px',
    margin: '0 auto 2.5rem',
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: window.innerWidth <= 768 ? '1.5rem' : '3rem',
    marginTop: '2rem',
    flexWrap: 'wrap' as const,
  },
  statItem: {
    textAlign: 'center' as const,
  },
  statNumber: {
    fontSize: window.innerWidth <= 768 ? '2rem' : '2.5rem',
    fontWeight: '800',
    color: 'white',
    lineHeight: '1',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    display: window.innerWidth <= 768 ? 'none' : 'block',
  },
  // Rooms Section
  roomsSection: {
    padding: window.innerWidth <= 768 ? '2rem 1rem' : '5rem 2rem',
    backgroundColor: '#FFFFFF',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  sectionHeader: {
    textAlign: 'center' as const,
    marginBottom: '3.5rem',
  },
  sectionTitle: {
    fontSize: window.innerWidth <= 768 ? '1.75rem' : '2.75rem',
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: '0.75rem',
  },
  sectionDesc: {
    fontSize: '1.1rem',
    color: '#6B7280',
    maxWidth: '600px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: window.innerWidth <= 768 ? '1.5rem' : '2.5rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 2px 15px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: '1px solid #F3F4F6',
    position: 'relative' as const,
  },
  imageContainer: {
    width: '100%',
    height: '280px',
    overflow: 'hidden',
    position: 'relative' as const,
    backgroundColor: '#F9FAFB',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    imageRendering: '-webkit-optimize-contrast' as const,
    backfaceVisibility: 'hidden' as const,
  },
  noImage: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  roomBadge: {
    position: 'absolute' as const,
    top: '1rem',
    right: '1rem',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1F2937',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  imageCount: {
    position: 'absolute' as const,
    bottom: '1rem',
    left: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '15px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  cardBody: {
    padding: '1.75rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.25rem',
  },
  roomNumber: {
    margin: 0,
    color: '#111827',
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
  },
  priceTag: {
    textAlign: 'right' as const,
    backgroundColor: '#F9FAFB',
    padding: '0.5rem 0.75rem',
    borderRadius: '12px',
  },
  priceAmount: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#6C5CE7',
    display: 'block',
    lineHeight: '1',
  },
  priceLabel: {
    fontSize: '0.75rem',
    color: '#9CA3AF',
    fontWeight: '600',
  },
  roomTypes: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  typeTag: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#EEF2FF',
    color: '#6C5CE7',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  description: {
    color: '#6B7280',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.75rem',
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    color: '#374151',
    padding: '1rem',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '700',
    transition: 'all 0.3s',
  },
  bookButton: {
    flex: 1,
    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '700',
    transition: 'all 0.3s',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
  },
};

export default RoomsList;
