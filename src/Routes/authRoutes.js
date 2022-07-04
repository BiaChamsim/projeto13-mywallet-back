import { createUser, loginUser} from '../Controllers/authControllers.js'
import { Router } from 'express'

const router = Router()

router.post('/signup', createUser);
router.post('/login', loginUser);

export default router;