import { Router } from "express";
import{authorization} from '../../Middlewares/authorization.middlware.js'
import{systemroles} from '../../utils/system-roles.utiles.js'
import { validationmiddleware } from "../../Middlewares/validation.middlware.js";
import * as companycontroller from './company.controller.js'
import * as companyschema from './company.schema.js'
import expressAsyncHandler from "express-async-handler";
import { authentication } from "../../Middlewares/authentication.middleware.js";
const router=Router()


router.post('/add-company',authentication(),authorization(systemroles.Company_Hr),
validationmiddleware(companyschema.addcompany_schema),
expressAsyncHandler(companycontroller.addcompany))


router.put('/update/:companyid',authentication(),authorization(systemroles.Company_Hr),
validationmiddleware(companyschema.updatecompany_schema),
expressAsyncHandler(companycontroller.update_company))


router.delete('/delete/:companyid',authentication(),authorization(systemroles.Company_Hr),
validationmiddleware(companyschema.deletecompany_schema),
expressAsyncHandler(companycontroller.deletecompany))


router.get('/search-company',authentication(),authorization([systemroles.Company_Hr,systemroles.User]),
validationmiddleware(companyschema.searchcompanyschema),expressAsyncHandler(companycontroller.search_for_company))


router.get('/company-with-jobs/:companyId',authentication(),authorization(systemroles.Company_Hr),
expressAsyncHandler(companycontroller.getCompanyWithJobs))

router.get('/app-sp-jobs',authentication(),authorization(systemroles.Company_Hr),expressAsyncHandler(companycontroller.application_for_sp_jobs))
export default router