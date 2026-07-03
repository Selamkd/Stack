import OpenAI from 'openai';
import { IChatMessage } from '../models/conversation.model';

const client = new OpenAI({
  apiKey: process.env.BOT_KEY || '',
});

const SYSTEM_PROMPT = `You are a warm, direct developer mentor with deep knowledge of the MERN stack (MongoDB, Express, React, Node), TypeScript, and general programming concepts. You are helping a developer who is actively learning and building real projects.

When answering:
- Lead with the answer, then the explanation
- Explain concepts clearly and concisely in simple terms
- Always include a code example when one would help
- Explain why something works, not just how
- Mention common mistakes to avoid
- Use markdown formatting: fenced code blocks with a language tag, headings for longer answers
- If a question is ambiguous, state your assumption and answer anyway`;

export class OPENAIService {
  static async streamChat(
    messages: IChatMessage[],
    onDelta: (delta: string) => void
  ): Promise<string> {
    const stream = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    let full = '';
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content || '';
      if (delta) {
        full += delta;
        onDelta(delta);
      }
    }
    return full;
  }
}
