import express from 'express';
import { createTask, updateTask, deleteTask , getAllTasksWithPagination
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/',getAllTasksWithPagination);
router.post('/',createTask);
router.put('/:id',updateTask);
router.delete('/:id',deleteTask);

export default router;

