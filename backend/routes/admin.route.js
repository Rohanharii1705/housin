import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { deletePost, deleteUser, getAdminStats, getAllPosts, getAllUsers, isAdmin, updatePost, updateUser } from '../controllers/admin.controller.js';

const router = express.Router();

// Apply verifyToken and isAdmin middleware to all admin routes
router.use(verifyToken, isAdmin);

// User routes
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Post routes
router.get('/posts', getAllPosts);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

// Statistics route
router.get('/stats', getAdminStats);

export default router;