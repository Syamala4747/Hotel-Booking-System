import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class GroqService {
  private groq: Groq;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('GROQ_API_KEY');
    this.groq = new Groq({
      apiKey: apiKey,
    });
    
    // Log connection status on startup
    this.checkConnection();
  }

  private async checkConnection() {
    try {
      console.log('🤖 Initializing Groq AI...');
      const test = await this.testConnection();
      if (test) {
        console.log('✅ Groq AI connected successfully!');
        console.log('📡 Model: llama-3.1-8b-instant');
        console.log('🚀 AI Feedback Analysis ready!');
      }
    } catch (error) {
      console.error('❌ Groq AI connection failed:', error.message);
      console.error('⚠️  AI features will not be available');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'llama-3.1-8b-instant',
        max_tokens: 10,
      });
      return !!completion.choices[0]?.message?.content;
    } catch (error) {
      throw new Error(`AI Connection Test Failed: ${error.message}`);
    }
  }

  async analyzeFeedbacks(feedbacks: any[]): Promise<string> {
    if (feedbacks.length === 0) {
      return 'No feedbacks available to analyze.';
    }

    // Group feedbacks by room
    const roomGroups = feedbacks.reduce((acc, fb) => {
      const roomNum = fb.room?.room_number || 'Unknown';
      if (!acc[roomNum]) acc[roomNum] = [];
      acc[roomNum].push(fb);
      return acc;
    }, {});

    // Prepare feedback data for AI with room grouping
    const feedbackText = Object.entries(roomGroups).map(([roomNum, roomFeedbacks]: [string, any[]]) => {
      const avgRating = (roomFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / roomFeedbacks.length).toFixed(1);
      const feedbackList = roomFeedbacks.map((fb, idx) => 
        `  ${idx + 1}. Rating: ${fb.rating}/5 - "${fb.comment}" (${fb.user?.name || 'Anonymous'})`
      ).join('\n');
      
      return `📍 Room ${roomNum} (${roomFeedbacks.length} reviews, avg: ${avgRating}/5):\n${feedbackList}`;
    }).join('\n\n');

    const prompt = `You are a hotel management assistant. Analyze ONLY the actual guest feedbacks provided below. Do NOT make up or invent any reviews.

Actual Guest Feedbacks by Room:
${feedbackText}

Provide a brief, factual analysis:

1. **Overall Summary**: What is the general sentiment based on the actual ratings and comments provided?

2. **Room-Specific Insights**: For each room that has reviews, briefly mention:
   - Room number and average rating
   - What guests actually said (positive or negative)
   - Specific issues mentioned in the actual comments

3. **Best Performing Rooms**: Which room numbers have the highest actual ratings?

4. **Rooms Needing Attention**: Which room numbers have low ratings or negative comments in the actual reviews?

5. **Action Items**: Based ONLY on the actual feedback provided, what specific improvements are needed for which rooms?

CRITICAL RULES:
- Only discuss rooms that have actual reviews above
- Only mention issues that guests actually wrote about
- Do NOT invent or assume any feedback
- Quote or reference actual guest comments when discussing issues
- Keep under 250 words
- Always mention specific room numbers`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0]?.message?.content || 'Unable to generate analysis.';
    } catch (error) {
      console.error('Groq AI Error:', error);
      return 'Error analyzing feedbacks. Please try again later.';
    }
  }

  async generateRoomSummary(room: any, feedbacks: any[]): Promise<string> {
    const avgRating = feedbacks.length > 0
      ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1)
      : 'N/A';

    const prompt = `Summarize this hotel room in 2-3 sentences for admin dashboard:
Room: ${room.room_number}
Type: ${Array.isArray(room.room_type) ? room.room_type.join(', ') : room.room_type}
Capacity: ${room.capacity} guests
Cost: $${room.cost}/night
Average Rating: ${avgRating}/5
Total Reviews: ${feedbacks.length}

Focus on key selling points and guest satisfaction.`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.5,
        max_tokens: 150,
      });

      return completion.choices[0]?.message?.content || 'No summary available.';
    } catch (error) {
      console.error('Groq AI Error:', error);
      return 'Error generating summary.';
    }
  }

  async chatWithUser(userMessage: string, availableRooms: any[]): Promise<string> {
    // Prepare room data for AI context
    const roomsContext = availableRooms.map(room => {
      const types = Array.isArray(room.room_type) ? room.room_type.join(', ') : room.room_type;
      return `Room ${room.room_number}: ${types}, Capacity: ${room.capacity} guests, Cost: $${room.cost}/night, Description: ${room.description}`;
    }).join('\n');

    const prompt = `You are a friendly hotel assistant chatbot helping guests find their perfect room. 

Available Rooms:
${roomsContext}

User Question: "${userMessage}"

Instructions:
- Be warm, friendly, and helpful
- If user asks about room recommendations, suggest specific rooms by number based on their requirements (budget, capacity, type)
- If user asks about amenities, pricing, or availability, provide accurate information from the room data
- If user asks general hotel questions, answer helpfully
- Keep responses concise (under 150 words) and conversational
- Always mention specific room numbers when making recommendations
- Format recommendations like: "I recommend Room 101 because..."

Respond naturally and helpfully:`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful hotel assistant. Be friendly, concise, and always recommend specific rooms by number when relevant.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.8,
        max_tokens: 300,
      });

      return completion.choices[0]?.message?.content || 'I apologize, I am having trouble responding right now. Please try again.';
    } catch (error) {
      console.error('Groq AI Chat Error:', error);
      return 'I apologize, I am currently unavailable. Please try again later or contact our staff directly.';
    }
  }
}
