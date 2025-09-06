import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.BOT_KEY,
});

export class OPENAIService {
  static async askQuestion(question: string) {
    let systemPrompt = `You are a warm helpful developer mentor with deep knowledge in the MERN stack and general programming concepts. Your role is helping a developer that is in the process of learnig by answering their questions. 
    When answering questions:
    - Explain concepts concisely and clearly in simple terms
    - Always provide code examples 
    - Explain why something works
    - Mention common mistakes to avoid
 
    .`;

    const response = await client.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    });

    return response.choices?.[0]?.message?.content || '';
  }
}
