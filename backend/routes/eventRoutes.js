import express from 'express';
import { Router } from 'express';
import {login, logout, register, me} from '../controllers/faculty/Controller.js';
import { createguest, get_guest_details} from '../controllers/guest/Controller.js';
import { createparticipate} from '../controllers/participate/Controller.js';
import {createevent,get_events_details ,getevent,updateevent, deleteevent, updatestatus} from '../controllers/event/Controller.js';
import { addvolunteer, getvolunteer ,creategroup, getvolunteer_group} from '../controllers/volunteer/Controller.js';
import { auth, authorizeRoles } from '../middleware/authMiddleware.js';
const router = Router();

router.route('/api/faculty/register').post(auth, authorizeRoles("hod"),register);
router.route('/api/login').post(login)
router.route('/api/logout').post(auth, logout)
router.route('/guest').post(createguest);
router.route('/api/event/participate').post(createparticipate);
router.route('/get_guest_details').get(get_guest_details);
router.route('/api/createevent').post(auth, authorizeRoles("faculty"), createevent);
router.route('/api/events').get(auth, authorizeRoles("hod","faculty"), get_events_details);
router.route('/addvolunteer').post(addvolunteer);
router.route('/getvolunteer',auth).get(getvolunteer);
router.route('/creategroup').post(creategroup);
router.route('/getvolunteer_group').get(getvolunteer_group);    
router.route('/api/getevent/:id').get(auth,getevent);
router.route('/api/updateevent/:id').put(auth, authorizeRoles("faculty"), updateevent);
router.route('/api/deleteevent/:id').delete(auth,authorizeRoles("faculty"), deleteevent);
router.route('/api/event/updatestatus/:id/:status').patch(auth, authorizeRoles("hod"), updatestatus).get(auth,updatestatus);
router.route('/api/me').get(auth,me);
export default router;