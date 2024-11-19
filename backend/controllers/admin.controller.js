import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const isAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        },
        postDetail: true
      }
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, isAdmin } = req.body;

  try {
    const updateData = {
      username,
      email,
      isAdmin
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Start a transaction to ensure all deletions happen together
    await prisma.$transaction(async (prisma) => {
      // Get all chat IDs where the user is a participant
      const userChats = await prisma.chat.findMany({
        where: {
          userIDs: {
            has: id
          }
        },
        select: {
          id: true
        }
      });

      const chatIds = userChats.map(chat => chat.id);

      // Delete all messages in these chats
      await prisma.message.deleteMany({
        where: {
          chatId: {
            in: chatIds
          }
        }
      });

      // Delete all chats
      await prisma.chat.deleteMany({
        where: {
          id: {
            in: chatIds
          }
        }
      });

      // Delete all saved posts
      await prisma.savedPost.deleteMany({
        where: { userId: id }
      });

      // Delete all posts and their details
      const userPosts = await prisma.post.findMany({
        where: { userId: id },
        select: { id: true }
      });

      const postIds = userPosts.map(post => post.id);

      await prisma.postDetail.deleteMany({
        where: {
          postId: {
            in: postIds
          }
        }
      });

      await prisma.post.deleteMany({
        where: { userId: id }
      });

      // Finally delete the user
      await prisma.user.delete({
        where: { id }
      });
    });

    res.status(200).json({ message: "User and all related data deleted successfully" });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: "Failed to delete user", error });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    // First delete related records
    await prisma.savedPost.deleteMany({
      where: { postId: id }
    });

    await prisma.postDetail.deleteMany({
      where: { postId: id }
    });

    // Then delete the post
    await prisma.post.delete({
      where: { id }
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [userCount, postCount, savedPostCount] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.savedPost.count()
    ]);

    res.status(200).json({
      totalUsers: userCount,
      totalPosts: postCount,
      totalSavedPosts: savedPostCount
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch statistics", error });
  }
};