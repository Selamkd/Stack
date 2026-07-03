import { Request, Response } from 'express';
import Conversation from '../models/conversation.model';
import { OPENAIService } from '../services/ai.service';
import logger from '../utils/logger';

export const getAllConversations = async (req: Request, res: Response) => {
  try {
    const conversations = await Conversation.find()
      .select('_id title updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .lean();

    res.status(200).json(conversations);
  } catch (error) {
    logger.error('Failed to fetch conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations', error });
  }
};

export const getConversationById = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    res.status(200).json(conversation);
  } catch (error) {
    logger.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Error fetching conversation', error });
  }
};

export const renameConversation = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    const updated = await Conversation.findByIdAndUpdate(
      req.params.id,
      { $set: { title } },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    logger.error('Error renaming conversation:', error);
    res.status(500).json({ message: 'Error renaming conversation', error });
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const deleted = await Conversation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    logger.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Error deleting conversation', error });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    if (!content || typeof content !== 'string') {
      res.status(400).json({ message: 'Message content is required' });
      return;
    }

    let conversation;
    if (id === 'new') {
      conversation = new Conversation({
        title: content.length > 60 ? `${content.slice(0, 60)}…` : content,
        messages: [],
      });
    } else {
      conversation = await Conversation.findById(id);
      if (!conversation) {
        res.status(404).json({ message: 'Conversation not found' });
        return;
      }
    }

    conversation.messages.push({ role: 'user', content });
    await conversation.save();

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Conversation-Id', conversation._id.toString());
    res.flushHeaders();

    const reply = await OPENAIService.streamChat(
      conversation.messages.slice(-20),
      (delta) => res.write(delta)
    );

    conversation.messages.push({ role: 'assistant', content: reply });
    await conversation.save();

    res.end();
  } catch (error) {
    logger.error('Error in chat stream:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error generating response', error });
    } else {
      res.end('\n\n[Something went wrong while generating the response.]');
    }
  }
};
