import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import {userschema} from './user.schema.js'
import * as usercontroller from './user.controller.js'
import {validationmiddleware} from '../../Middlewares/validation.middlware.js'
import {authentication} from '../../Middlewares/authentication.middleware.js'
const router=Router()

router.post('/signup',validationmiddleware(userschema.signupschema),
expressAsyncHandler(usercontroller.signup))


router.get('/verify-email',expressAsyncHandler(usercontroller.verfyemail))


router.get('/login',validationmiddleware(userschema.loginschema),
expressAsyncHandler(usercontroller.login))


router.put('/update',authentication(),
validationmiddleware(userschema.updateschema),expressAsyncHandler(usercontroller.updateuser))


router.delete('/delete',authentication(),validationmiddleware(usercontroller.deleteuser),
expressAsyncHandler(usercontroller.deleteuser))


router.get('/',authentication(),expressAsyncHandler(usercontroller.getuseraccount))


router.get('/sp-user/:userid',validationmiddleware(userschema.sp_user),
expressAsyncHandler(usercontroller.get_another_user))


router.put('/update-password',authentication(),validationmiddleware(usercontroller.update_password),
expressAsyncHandler(usercontroller.update_password))


router.post('/forget-password',validationmiddleware(userschema.forget_pass),
expressAsyncHandler(usercontroller.forget_password))


router.post('/reset-password',validationmiddleware(userschema.reset_pass),
expressAsyncHandler(usercontroller.resetpassword))


router.get('/get-rec-emails/:recoveryEmail',validationmiddleware(userschema.recovery_email),
expressAsyncHandler(usercontroller.all_accounts_with_sp_recovey_email))
export default router