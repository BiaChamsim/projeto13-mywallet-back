import {userIncome, userOutcome, userBalance} from '../Controllers/activityControllers.js'
import validateUser from '../Middlewares/validateUser.js';
import { Router } from 'express'

const router = Router()

router.post('/income', validateUser, userIncome);
router.post('/outcome', validateUser, userOutcome);
router.get('/balance', validateUser, userBalance);

export default router;