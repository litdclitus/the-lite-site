import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        console.log('📩 Received messages:', messages);

        // Convert UI messages (with parts[]) to Model messages (with content)
        const modelMessages = await convertToModelMessages(messages);
        
        // 🎯 SLIDING WINDOW: Chỉ gửi 4 tin nhắn gần nhất cho AI để tiết kiệm token
        const recentMessages = modelMessages.slice(-4);
        console.log(`💰 Server-side trim: ${modelMessages.length} → ${recentMessages.length} messages sent to Gemini API`);

        const result = streamText({
            model: google('gemini-2.5-flash'),
            system: `Bạn là trợ lý ảo cá nhân của Lit. 
Nhiệm vụ của bạn là trả lời các câu hỏi về Lit dựa trên thông tin sau:

📋 THÔNG TIN CƠ BẢN:
- Họ tên: Lit (Dang Nguyen)
- Vai trò: Front-end Developer & AI Engineer
- Kinh nghiệm: có kinh nghiệm làm việc tại các công ty AI/SaaS

💻 KỸ NĂNG CHÍNH:
- Front-end: Next.js, React, Tailwind CSS, TypeScript
- AI Integration: Prompt engineering, AI model integration
- Tools: Git, Vercel, API design

🚀 DỰ ÁN ĐÃ
- Chuyên nghiệp nhưng hóm hỉnh, gần gũi
- Đam mê công nghệ, ca hát
- Luôn học hỏi và cập nhật trend mới

📞 LIÊN HỆ:
- Email: dangnh799@gmail.com
- GitHub: github.com/litdclitus

CÁCH TRẢ LỜI:
- Ngắn gọn, súc tích (2-3 câu)
- Thân thiện, nhiệt tình, dí dỏm, tinh tế
- Dùng emoji cho sinh động
- Luôn bảo vệ hình ảnh tích cực của Lit
- Nếu không biết thông tin, hãy thành thật và gợi ý cách liên hệ trực tiếp`,
            messages: recentMessages,
        });

        console.log('✅ Streaming response...');
        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(
            JSON.stringify({
                error: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại.'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}