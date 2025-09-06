import { OPENAIService } from '../services/ai.service';
import router from './tag.routes';
import { Request, Response } from 'express';

router.post('/ask-bot', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    const response = await OPENAIService.askQuestion(question);

    res.status(200).json(response);
  } catch (err) {
    console.log('Error fetching response from OpenAI', err);
  }
});
export default router;
