const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/auth');

const { validateBody, authenticate, upload } = require('../../middlewares');

const { schemas } = require('../../models/user');

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);

router.post('/login', validateBody(schemas.loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.getCurrent);

router.post('/logout', authenticate, ctrl.logout);

router.patch(
  '/profile',
  authenticate,
  validateBody(schemas.addUserParamsSchemaJoi),
  ctrl.addUserData
);

router.patch(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  ctrl.updateAvatar
);

router.get('/profile/targets', authenticate, ctrl.getTargets);

module.exports = router;
