import { Router } from 'express';
import * as ConversationController from '../controllers/conversation.controller';

const router = Router();

router.get('/', ConversationController.getAllConversations);
router.get('/:id', ConversationController.getConversationById);
router.post('/:id/messages', ConversationController.sendMessage);
router.patch('/:id', ConversationController.renameConversation);
router.delete('/:id', ConversationController.deleteConversation);

export default router;
