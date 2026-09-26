import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function generateWithRetry(systemInstruction: string, message: string, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: message,
        config: {
          systemInstruction: systemInstruction,
        }
      });
    } catch (err: any) {
      const isOverloaded = err?.status === 503;
      if (isOverloaded && i < retries) {
        console.log(`⏳ Model quá tải, thử lại lần ${i + 1}...`);
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
}

export async function POST(req: Request) {
  const { message, currentPath } = await req.json();

  const systemInstruction = `
    Bạn là Mai - Hướng dẫn viên AI thông thái của website "Tour Huế 360° - Di Sản & Làng Nghề Cố Đô".
    Website của chúng ta có các trang chính sau đây:
    1. Trang Chủ (/home): Nơi hiển thị danh sách 8 làng nghề truyền thống, tiến độ hoàn thành và cấp độ người chơi.
    2. Bản Đồ 360° (/map): Nơi trải nghiệm không gian thực tế ảo toàn cảnh các làng nghề.
    3. Kho Báu / Phần Thưởng (/rewards): Nơi quản lý vé trải nghiệm, số dư Xu, và đổi voucher ưu đãi (Homestay, Ẩm thực, Spa, Quà tặng).

    Người dùng hiện đang đứng ở trang: ${currentPath || 'Không rõ'}.
    
    Nhiệm vụ của bạn:
    - Trả lời thân thiện, ngắn gọn, đậm chất xứ Huế.
    - Khi người dùng hỏi muốn đi đâu hoặc làm gì (ví dụ: muốn xem voucher, muốn xem bản đồ, muốn về trang chủ), hãy chỉ dẫn họ rõ ràng và **gợi ý cho họ đường dẫn tương ứng** (ví dụ: /home, /map, /rewards).
  `;

  try {
    const response = await generateWithRetry(systemInstruction, message);
    return NextResponse.json({ answer: response?.text });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { answer: "Xin lỗi, AI đang quá tải, vui lòng thử lại sau ít phút." },
      { status: 200 }
    );
  }
}