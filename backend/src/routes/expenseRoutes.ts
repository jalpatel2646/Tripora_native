import { Router } from 'express';
import { createExpense, getExpenses, updateExpense, deleteExpense } from '../controllers/expense.controller';

const router = Router({ mergeParams: true });

router.post('/', createExpense);
router.get('/', getExpenses);
router.patch('/:expenseId', updateExpense);
router.delete('/:expenseId', deleteExpense);

export default router;
