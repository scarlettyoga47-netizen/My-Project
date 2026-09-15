const express = require('express');
const router = express.Router();
const { success } = require('../utils/response');
const { auth, authOptional, requireRole } = require('../middleware/auth');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const merchantController = require('../controllers/merchantController');
const reviewController = require('../controllers/reviewController');
const favoriteController = require('../controllers/favoriteController');
const reservationController = require('../controllers/reservationController');
const merchantAppController = require('../controllers/merchantAppController');
const merchantAuthController = require('../controllers/merchant/merchantAuthController');
const adminController = require('../controllers/admin/adminController');

router.get('/health', (req, res) => {
  success(res, { status: 'running' }, 'ok');
});

router.post('/auth/send-code', authController.sendCode);
router.post('/auth/login', authController.login);
router.post('/auth/admin-login', authController.adminLogin);
router.post('/auth/logout', auth, authController.logout);

router.get('/user/profile', auth, userController.getProfile);
router.put('/user/profile', auth, userController.updateProfile);
router.get('/user/reviews', auth, userController.getMyReviews);
router.get('/user/favorites', auth, userController.getMyFavorites);
router.get('/user/reservations', auth, userController.getMyReservations);

router.get('/categories', categoryController.list);

router.get('/merchants', merchantController.list);
router.get('/merchants/:id', merchantController.detail);
router.get('/merchants/:id/reviews', authOptional, merchantController.reviews);
router.get('/merchants/:id/available-slots', merchantController.availableSlots);
router.get('/merchants/:id/is-favorited', authOptional, merchantController.isFavorited);

router.post('/reviews', auth, reviewController.create);
router.post('/reviews/:id/like', auth, reviewController.toggleLike);

router.post('/upload/image', auth, reviewController.uploadImage);

router.post('/favorites/:merchantId', auth, favoriteController.toggle);
router.get('/favorites', auth, favoriteController.list);

router.post('/reservations', auth, reservationController.create);
router.get('/reservations', auth, reservationController.list);

router.post('/merchant-applications', auth, merchantAppController.create);
router.get('/merchant-applications/mine', auth, merchantAppController.getMine);

const merchantRouter = express.Router();
merchantRouter.use(auth, requireRole('merchant', 'admin'));
merchantRouter.get('/profile', merchantAuthController.getMyMerchant);
merchantRouter.put('/profile', merchantAuthController.updateProfile);
merchantRouter.get('/reservations', merchantAuthController.getReservations);
merchantRouter.put('/reservations/:id/status', merchantAuthController.updateReservationStatus);
router.use('/merchant', merchantRouter);

const adminRouter = express.Router();
adminRouter.use(auth, requireRole('admin'));
adminRouter.get('/merchant-applications', adminController.getApplications);
adminRouter.put('/merchant-applications/:id/approve', adminController.approveApplication);
adminRouter.put('/merchant-applications/:id/reject', adminController.rejectApplication);
adminRouter.get('/reviews', adminController.getReviews);
adminRouter.put('/reviews/:id/remove', adminController.removeReview);
adminRouter.get('/merchants', adminController.getMerchants);
adminRouter.put('/merchants/:id/status', adminController.updateMerchantStatus);
router.use('/admin', adminRouter);

module.exports = router;
