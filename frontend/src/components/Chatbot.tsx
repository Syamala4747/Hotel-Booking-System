import { useState, useRef, useEffect } from 'react';
import { chatWithBot } from '../api/aiApi';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hi! I'm your hotel assistant. I can help you find the perfect room based on your needs. Just ask me about room types, pricing, capacity, or any other questions!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatWithBot(inputMessage);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What rooms are available?",
    "I need a room for 4 people",
    "Show me budget-friendly options",
    "What's your most luxurious room?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={styles.toggleButton}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
          }}
        >
          <span style={styles.toggleIcon}>💬</span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          {window.innerWidth <= 768 && (
            <div 
              style={styles.backdrop}
              onClick={() => setIsOpen(false)}
            />
          )}
          <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.botAvatar}>🤖</div>
              <div>
                <div style={styles.botName}>Hotel Assistant</div>
                <div style={styles.botStatus}>● Online</div>
              </div>
            </div>
            {/* Close button - visible on all devices */}
            <button
              onClick={() => setIsOpen(false)}
              style={styles.closeButton}
              title="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...styles.messageWrapper,
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    ...styles.message,
                    ...(message.sender === 'user' ? styles.userMessage : styles.botMessage),
                  }}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={styles.messageWrapper}>
                <div style={{ ...styles.message, ...styles.botMessage }}>
                  <div style={styles.typingIndicator}>
                    <span style={styles.dot}></span>
                    <span style={styles.dot}></span>
                    <span style={styles.dot}></span>
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div style={styles.quickQuestionsContainer}>
                <div style={styles.quickQuestionsTitle}>Quick questions:</div>
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(question)}
                    style={styles.quickQuestionButton}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#667EEA';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                      e.currentTarget.style.color = '#374151';
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              style={styles.input}
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              style={{
                ...styles.sendButton,
                opacity: !inputMessage.trim() || isTyping ? 0.5 : 1,
                cursor: !inputMessage.trim() || isTyping ? 'not-allowed' : 'pointer',
              }}
              onMouseOver={(e) => {
                if (inputMessage.trim() && !isTyping) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ➤
            </button>
          </div>
        </div>
        </>
      )}
    </>
  );
};

const styles = {
  toggleButton: {
    position: 'fixed' as const,
    bottom: window.innerWidth <= 768 ? '1rem' : '2rem',
    right: window.innerWidth <= 768 ? '1rem' : '2rem',
    width: window.innerWidth <= 768 ? '50px' : '60px',
    height: window.innerWidth <= 768 ? '50px' : '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    border: 'none',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    zIndex: 1000,
  },
  toggleIcon: {
    fontSize: '1.75rem',
  },
  backdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99998,
  },
  chatWindow: {
    position: 'fixed' as const,
    bottom: window.innerWidth <= 768 ? '0' : '2rem',
    right: window.innerWidth <= 768 ? '0' : '2rem',
    left: window.innerWidth <= 768 ? '0' : 'auto',
    width: window.innerWidth <= 768 ? '100%' : '380px',
    height: window.innerWidth <= 768 ? '75vh' : '550px',
    maxHeight: window.innerWidth <= 768 ? '75vh' : '550px',
    backgroundColor: 'white',
    borderRadius: window.innerWidth <= 768 ? '20px 20px 0 0' : '20px',
    boxShadow: window.innerWidth <= 768 ? '0 -4px 30px rgba(0, 0, 0, 0.3)' : '0 10px 40px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    zIndex: 99999,
  },
  header: {
    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    padding: window.innerWidth <= 768 ? '0.875rem 1rem' : '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.75rem',
    minHeight: window.innerWidth <= 768 ? '70px' : 'auto',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flex: 1,
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    border: '2px solid white',
    color: 'white',
    width: '44px',
    height: '44px',
    minWidth: '44px',
    minHeight: '44px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '2rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
    lineHeight: '1',
    padding: 0,
    WebkitTapHighlightColor: 'transparent',
  },
  botAvatar: {
    width: window.innerWidth <= 768 ? '36px' : '40px',
    height: window.innerWidth <= 768 ? '36px' : '40px',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: window.innerWidth <= 768 ? '1.1rem' : '1.25rem',
    flexShrink: 0,
  },
  botName: {
    color: 'white',
    fontWeight: '700',
    fontSize: window.innerWidth <= 768 ? '0.95rem' : '1rem',
    lineHeight: '1.2',
  },
  botStatus: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: window.innerWidth <= 768 ? '0.7rem' : '0.75rem',
    lineHeight: '1.2',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    border: '2px solid white',
    color: 'white',
    width: window.innerWidth <= 768 ? '44px' : '36px',
    height: window.innerWidth <= 768 ? '44px' : '36px',
    minWidth: window.innerWidth <= 768 ? '44px' : '36px',
    minHeight: window.innerWidth <= 768 ? '44px' : '36px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: window.innerWidth <= 768 ? '1.75rem' : '1.5rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
    lineHeight: '1',
    padding: 0,
    zIndex: 10,
    WebkitTapHighlightColor: 'transparent',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: window.innerWidth <= 768 ? '1rem' : '1.25rem',
    backgroundColor: '#F9FAFB',
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '1rem',
  },
  message: {
    maxWidth: '75%',
    padding: '0.875rem 1.125rem',
    borderRadius: '16px',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    wordWrap: 'break-word' as const,
  },
  userMessage: {
    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  botMessage: {
    backgroundColor: 'white',
    color: '#1F2937',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  typingIndicator: {
    display: 'flex',
    gap: '0.25rem',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#9CA3AF',
    animation: 'bounce 1.4s infinite ease-in-out',
  },
  quickQuestionsContainer: {
    marginTop: '1rem',
  },
  quickQuestionsTitle: {
    fontSize: '0.85rem',
    color: '#6B7280',
    marginBottom: '0.75rem',
    fontWeight: '600',
  },
  quickQuestionButton: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    marginBottom: '0.5rem',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '12px',
    color: '#374151',
    fontSize: '0.9rem',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.2s',
  },
  inputContainer: {
    padding: window.innerWidth <= 768 ? '0.875rem 1rem' : '1rem',
    backgroundColor: 'white',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    gap: '0.75rem',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: '0.875rem',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  sendButton: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    border: 'none',
    color: 'white',
    fontSize: '1.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
};

export default Chatbot;
