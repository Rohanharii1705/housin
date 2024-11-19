import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken"

export const getPosts=async(req,res)=>{
    const query=req.query;
    try {

const posts=await prisma.post.findMany({
    where:{
        city:query.city||undefined,
        type:query.type||undefined,
        property:query.property||undefined,
        property:query.property||undefined,
        bedroom:parseInt(query.bedroom)||undefined,
        price:{
            gte:parseInt(query.minPrice)||0,
            lte:parseInt(query.maxPrice)||10000000,
        }
    }
})

        res.status(200).json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({message :"failed to get posts"})
    }
}
export const getPost = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const token = req.cookies?.token;

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if (!err) {
                    const saved = await prisma.savedPost.findUnique({
                        where: {
                            userId_postId: {
                                postId: id,
                                userId: payload.id,
                            },
                        },
                    });
                    return res.status(200).json({ ...post, isSaved: saved ? true : false });
                } else {
                    console.error("Token verification failed:", err);
                }
            });
            return; // Prevent the outer response from sending if token is being verified.
        }

        // If no token, respond with isSaved: false
        res.status(200).json({ ...post, isSaved: false });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get post" });
    }
};

  
export const addPost=async(req,res)=>{
    const body = req.body;
    const tokenUserId = req.userId;
    
    console.log("Request Body:", body);
    console.log("User ID from Token:", tokenUserId);
    
    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail:{
            create:body.postDetail,
                },
            }
        });
        res.status(200).json(newPost);
    } catch (err) {
        console.log("Error creating post:", err);
        res.status(500).json({ message: "Failed to add post" });
    }
    
}
export const updatePost=async(req,res)=>{
    try {


        
        res.status(200).json
    } catch (err) {
        console.log(err)
        res.status(500).json({message :"failed to update post"})
    }
}
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        // Find the post by ID
        const post = await prisma.post.findUnique({ where: { id } });
        
        if (!post) {
            console.error("Post not found");
            return res.status(404).json({ message: "Post not found" });
        }
        
        // Check if the user has permission to delete
        if (post.userId !== tokenUserId) {
            console.error("User not authorized to delete this post");
            return res.status(403).json({ message: "Not Authorized" });
        }

        // Delete the post
        await prisma.post.delete({ where: { id } });
        res.status(200).json({ message: "Post deleted" });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ message: "Failed to delete post" });
    }
};
