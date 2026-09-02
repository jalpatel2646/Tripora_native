import { Router } from 'express';
import { createContact, getContacts, updateContact, deleteContact, matchDeviceContacts } from '../controllers/contact.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', createContact);
router.post('/match', matchDeviceContacts);
router.get('/', getContacts);
router.patch('/:contactId', updateContact);
router.delete('/:contactId', deleteContact);

export default router;
