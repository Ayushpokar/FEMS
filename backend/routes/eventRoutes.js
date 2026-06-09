import express from 'express';
import { Router } from 'express';
import {login, logout, register, me} from '../controllers/faculty/Controller.js';
import { createguest, get_guest_details} from '../controllers/guest/Controller.js';
import { createparticipate, attendence} from '../controllers/participate/Controller.js';
import {createevent,get_events_details ,getevent,updateevent, deleteevent, updatestatus, reports , ReportGeneration} from '../controllers/event/Controller.js';
import { addvolunteer, getvolunteer ,creategroup, getvolunteer_group} from '../controllers/volunteer/Controller.js';
import { auth, authorizeRoles } from '../middleware/authMiddleware.js';
import { createOrder } from '../controllers/payment/Controller.js';
import { DraftOutcome } from '../controllers/reports/Controller.js';
const router = Router();

router.route('/api/faculty/register').post(auth, authorizeRoles("hod"),register);
router.route('/api/login').post(login)
router.route('/api/logout').post(auth, logout)
router.route('/api/createguest').post(auth, authorizeRoles("faculty"),createguest);
router.route('/api/event/participate').post(createparticipate);
router.route('/api/event/attendence').post(attendence)
router.route('/api/get_guests').get(get_guest_details);
router.route('/api/createevent').post(auth, authorizeRoles("faculty"), createevent);
router.route('/api/events').get(auth, authorizeRoles("hod","faculty"), get_events_details);
router.route('/api/addvolunteer').post(auth, authorizeRoles("faculty"),addvolunteer);
router.route('/getvolunteer',auth).get(getvolunteer);
router.route('/creategroup').post(creategroup);
router.route('/api/getvolunteer_group').get(getvolunteer_group);    
router.route('/api/getevent/:id').get(getevent);
router.route('/api/updateevent/:id').put(auth, authorizeRoles("faculty"), updateevent);
router.route('/api/deleteevent/:id').delete(auth,authorizeRoles("faculty"), deleteevent);
router.route('/api/event/updatestatus/:id/:status').patch(auth, authorizeRoles("hod"), updatestatus).get(auth,updatestatus);
router.route('/api/me').get(auth,me);
router.route('/api/reports').get(auth,authorizeRoles("hod"), reports);
router.route('/api/report').post(auth,authorizeRoles("faculty"), ReportGeneration)

router.route('/api/create-order').post(createOrder);

router.route('/api/reports/ai-draft/:event_id').get(DraftOutcome);

export default router;