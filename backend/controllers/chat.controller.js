import prisma from '../lib/prisma.js';

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    for (const chat of chats){
      const receiverId=chat.userIDs.find((id)=>id!==tokenUserId);

      const receiver= await prisma.user.findUnique({
        where:{
          id:receiverId,
        },
        select:{
          id:true,
          username:true,
          avatar:true,
        }
      })
      chat.receiver= receiver;
    }
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error); // Log the error
    res.status(500).json({ message: "Failed to get chats!", error });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId= req.userId;
    try {
      const chat=await prisma.chat.findUnique({
        where:{
          id:req.params.id,
          userIDs:{
            hasSome:[tokenUserId]
          }
        },
        include:{
          messages:{
            orderBy:{
              createdAt:"asc"
            }
          }
        }
      });

      await prisma.chat.update({
        where:{
          id:req.params.id
        },
        data:{
          seenBy:{
            set:[tokenUserId]
          }
        }
      })
      res.status(200).json(chat);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get  chats!" });
    }
  };

  
  export const addChat = async (req, res) => {
    const tokenUserId = req.userId;
  
    if (!req.body.receiverId) {
      return res.status(400).json({ message: "receiverId is required" });
    }
  
    try {
      const newChat = await prisma.chat.create({
        data: {
          userIDs: [tokenUserId, req.body.receiverId],
        },
      });
      res.status(200).json(newChat);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to add chat!" });
    }
  };
  

  export const readChat = async (req, res) => {
    const tokenUserId=req.userId;

    try {
      const chat = await prisma.chat.update({
        where:{
          id:req.params.id,
          userIds:{
            hasSome:[tokenUserId]
          ,}
        },
        data:{
          seenBy:{
            set:[tokenUserId]
          }
        }
      })
      
      res.status(200).json(chat);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to read  chats!" });
    }
  };
  
