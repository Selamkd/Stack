import { Router } from 'express';
import { Request, Response } from 'express';
import Slug from '../models/slug.model';
const router = Router();

const CODEWARS_BASE_API = 'https://www.codewars.com/api/v1';

router.get('/code-challenges', async (req: Request, res: Response) => {
  try {
    const [randomSlug] = await Slug.aggregate([
      { $match: { completed: false } },
      { $sample: { size: 1 } },
    ]);
    const codewarsRes = await fetch(
      `${CODEWARS_BASE_API}/code-challenges/${randomSlug.name}`
    );

    const potd = await codewarsRes.json();

    const matchingSlug = await Slug.findOne({ name: randomSlug.name });

    if (matchingSlug) {
      matchingSlug.id = potd.id;
      await matchingSlug.save();
    }
    res.status(200).json(potd);
  } catch (err) {
    console.log('Error fetching from Codewars API', err);
  }
});

router.get('/completed', async (req: Request, res: Response) => {
  try {
    const completed = await fetch(
      `${CODEWARS_BASE_API}/users/s3lam/code-challenges/completed`
    );
    const completedData = await completed.json();

    const solvedIds = completedData.data.map((challenge: any) => challenge.id);

    const slugs = await Slug.find();

    for (const slug of slugs) {
      if (solvedIds.includes(slug.id)) {
        slug.completed = true;
        slug.save();
      }
    }

    res.status(200).json({ message: 'Completed slugs updated ' });
  } catch (err) {
    console.log('Error fetching from Codewars API', err);
  }
});

export default router;
