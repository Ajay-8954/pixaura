import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {editProfile,login,logout, register,getSuggestedUsers, getProfile, followOrUnfollow, searchUser } from '../controllers/user.controller.js';
import upload from '../middlewares/multer.js';
const router= express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture') , editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);
router.route('/search/:searchTerm').get(isAuthenticated, searchUser);

export default router;

