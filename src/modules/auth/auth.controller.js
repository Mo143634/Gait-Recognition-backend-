import { Router } from "express";
import * as authService from "./auth.service.js";
import { authentication, tokenTypeEnum } from "../../middleware/authenticaion.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { 
    confirmEmailValidation,
    forgetPasswordValidation,
    loginValidation,
    logoutValidation,
    resetPasswordValidation,
    signUpValidation,
    socialLoginValidation
} from "./auth.validation.js";

const router = Router();

router.post('/signup', validation(signUpValidation), authService.signup);

router.post('/login',validation(loginValidation),authService.login);

router.post('/logout',validation(logoutValidation),authentication({tokenType:tokenTypeEnum.access }),authService.logout);

router.post('/social-login',validation(socialLoginValidation),authService.loginWithGmail);

router.get('/refresh-token',authentication({tokenType:tokenTypeEnum.refresh }),authService.refreshToken);

router.patch('/confirm-email',validation(confirmEmailValidation),authService.confirmEmail);

router.patch('/forget-password',validation(forgetPasswordValidation),authService.forgetPassword);

router.patch('/reset-password',validation(resetPasswordValidation),authService.resetPassword);

export default router;