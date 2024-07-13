import { Router } from "express";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { authorization } from "../../Middlewares/authorization.middlware.js";
import { systemroles } from "../../utils/system-roles.utiles.js";
import * as jobcontroller from './job.controller.js'
import { validationmiddleware } from "../../Middlewares/validation.middlware.js";
import{multerhost} from '../../Middlewares/multer.js'
import * as jobschema from './job.schema.js'
import expressAsyncHandler from "express-async-handler";
const router=Router()

router.post('/add',authentication(),authorization(systemroles.Company_Hr),validationmiddleware(jobschema.addjob_schema),
expressAsyncHandler(jobcontroller.addjob))


router.put('/update/:jobid',authentication(),authorization(systemroles.Company_Hr),validationmiddleware(jobschema.updatejob),
expressAsyncHandler(jobcontroller.updatejob))

router.delete('/delete/:jobId',authentication(),authorization(systemroles.Company_Hr),expressAsyncHandler(jobcontroller.deletejob))

router.post('/application',authentication(),authorization(systemroles.User),multerhost().single('cv'),
expressAsyncHandler(jobcontroller.apply_job))

router.get('/find-job',authentication(),authorization([systemroles.Company_Hr,systemroles.User]),
validationmiddleware(jobschema.filter_jobs)
,expressAsyncHandler(jobcontroller.filter_jobs))

router.get('/jobs-sp-company',authentication(),authorization([systemroles.Company_Hr,systemroles.User]),
validationmiddleware(jobschema.jobs_sp_companyschema),
expressAsyncHandler(jobcontroller.get_jobs_for_sp_company))

router.get('/jobs-with-companys',authentication(),authorization([systemroles.Company_Hr,systemroles.User]),
expressAsyncHandler(jobcontroller.get_jobs_with_their_companys))
export default router