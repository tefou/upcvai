"use server";
import { canUseAITools } from "@/lib/permissions";
import { getUserSubscriptionLevel } from "@/lib/subscriptions";
import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";

type GenerationConfig = {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
  responseMimeType: string;
};

const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const apiKey: string | undefined = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("API key is missing. Please set GEMINI_API_KEY in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Đây là tính năng của gói Premium, vui lòng nâng cấp gói Premium để sử dụng tính năng này");
  }

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
    Bạn là một AI chuyên tạo nội dung cho hồ sơ xin việc. Nhiệm vụ của bạn là viết phần giới thiệu chuyên nghiệp cho hồ sơ xin việc dựa trên dữ liệu được cung cấp bởi người dùng.
    Chỉ trả về phần tóm tắt và không thêm bất kỳ thông tin nào khác trong phản hồi. Hãy giữ nội dung ngắn gọn, súc tích và bằng tiếng Việt, mô tả công việc bằng tiếng việt.
    `;

  const userMessage = `
    Vui lòng tạo phần tóm tắt chuyên nghiệp cho hồ sơ xin việc từ dữ liệu sau:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Mô tả công việc bằng tiếng việt:
        ${exp.description || "N/A"}
        `,
      )
      .join("\n\n")}

      Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")}

      Skills:
      ${skills}
    `;

  console.log("systemMessage", systemMessage);
  console.log("userMessage", userMessage);

  const model2 = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemMessage,
  });
  
  
  
  async function run2(): Promise<string> {
    const chatSession = model2.startChat({
      generationConfig,
      history: [],
    });
  
    try {
      const result = await chatSession.sendMessage(userMessage);
      return result.response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
  
  const aiResponse = await run2();



  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return aiResponse;
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { description } = generateWorkExperienceSchema.parse(input);

  // const systemMessage = `
  // You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
  // Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

  // Job title: <chức danh công việc>
  // Company: <tên công ty>
  // Start date: <format: YYYY-MM-DD> (only if provided)
  // End date: <format: YYYY-MM-DD> (only if provided)
  // Description: <mô tả tối ưu bằng tiếng việt dưới dạng danh sách gạch đầu dòng, có thể suy ra từ chức danh công việc>
  // `;

  // const userMessage = `
  // ${description}
  // `;

  // const completion = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo",
  //   messages: [
  //     {
  //       role: "system",
  //       content: systemMessage,
  //     },
  //     {
  //       role: "user",
  //       content: userMessage,
  //     },
  //   ],
  // });

  // const aiResponse = completion.choices[0].message.content;

  
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      "Bạn là một AI tạo bản tóm tắt kinh nghiệm làm việc cho CV. Nhiệm vụ của bạn là tạo một mục kinh nghiệm làm việc duy nhất dựa trên thông tin người dùng cung cấp.\n\n" +
      "Phản hồi của bạn phải tuân thủ cấu trúc sau. Bạn có thể bỏ qua các trường nếu không thể suy ra từ dữ liệu, nhưng không thêm bất kỳ trường mới nào. Chỉ suy luận những nhiệm vụ phổ biến và điển hình cho chức danh. " +
      "Mô tả nên ngắn gọn, súc tích, tập trung vào đóng góp/thành tựu (nếu có thể suy ra), và ưu tiên sử dụng từ khóa liên quan. Sử dụng giọng văn trang trọng và chuyên nghiệp.\n\n" +
      "Job title: <chức danh công việc>\nCompany: <tên công ty>\nStart date: <format: YYYY-MM-DD> (nếu có)\nEnd date: <format: YYYY-MM-DD> (nếu có)\n" +
      "Description: <mô tả tối ưu bằng tiếng việt dưới dạng danh sách gạch đầu dòng (3-5 dòng, sử dụng dấu \"-\"), có thể suy ra từ chức danh công việc>\n\n" +
      "Ví dụ:\n\n" +
      "**Đầu vào:** Job title: Nhân viên Bán hàng, Company: ABC Corp.\n\n" +
      "**Đầu ra:**\n\n" +
      "Job title: Nhân viên Bán hàng\nCompany: ABC Corp.\nDescription:\n- Tìm kiếm và tiếp cận khách hàng tiềm năng.\n- Tư vấn và giới thiệu sản phẩm/dịch vụ cho khách hàng.\n- Xây dựng và duy trì mối quan hệ tốt với khách hàng.\n- Đạt chỉ tiêu doanh số được giao.\n\n" +
      "**Hãy tạo một mục kinh nghiệm làm việc dựa trên thông tin sau (thay thế bằng thông tin người dùng cung cấp):** [Thông tin người dùng]",
  });
  
  
  
  async function run(): Promise<string> {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
  
    try {
      const result = await chatSession.sendMessage(description);
      return result.response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
  
  const aiResponse = await run();

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  console.log("aiResponse", aiResponse);

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}
