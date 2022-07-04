import {userIncome, userOutcome, userBalance} from '../Controllers/activityControllers.js'
import { Router } from 'express'

const router = Router()

router.post('/income', userIncome);
router.post('/outcome', userOutcome);
router.get('/balance', userBalance);

export default router;