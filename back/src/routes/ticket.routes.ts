import { Router } from 'express';
import * as TicketController from '../controllers/ticket.controller';

const router = Router();

router.get('/', TicketController.getAllTickets);
router.get('/:id', TicketController.getTicketById);
router.post('/', TicketController.upsertTicket);
router.delete('/:id', TicketController.deleteTicket);

export default router;
