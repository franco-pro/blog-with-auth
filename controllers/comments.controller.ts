import asyncHandler from "express-async-handler";
import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//@desc CREATE a comment
//@route POST /api/v1/comments
//@access public
const createComments = asyncHandler(async (req: Request, res: Response) => {
  const { contents, userid, postid } = req.body;
  if (!contents || !userid || !postid) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const post = prisma.posts.findUnique({ where: { id_post: Number(postid) } });
  const user = prisma.user.findUnique({ where: { id_user: Number(userid) } });

  if (!post) {
    res.status(404);
    throw new Error("post not found.");
  }

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  //create comment
  const comment = await prisma.comments.create({
    data: {
      contents,
      user: { connect: { id_user: userid } },
      posts: { connect: { id_post: postid } },
    },
  });
  res.status(201).json(comment);
});

//@desc read all comments
//@route GET /api/v1/comments
//@access public
const readComments = asyncHandler(async (req: Request, res: Response) => {
  const comments = await prisma.comments.findMany();
  res.status(200).json(comments);
});

//@desc read all comment of a post
//@route GET /api/v1/:id_post/comments
//@ acces public
const readAllCommentsOfPost = asyncHandler(
  async (req: Request, res: Response) => {
    const { id_post } = req.params;
    const comments = await prisma.comments.findMany({
      where: { postId: Number(id_post) },
    });
    res.status(200).json(comments);
  }
);

//@desc read a comment
//route GET /api/v1/comments/:id
const readOneComment = asyncHandler(async (req: Request, res: Response) => {
  const { id_Comment } = req.params;
  const comment = await prisma.comments.findUnique({
    where: { id_comment: Number(id_Comment) },
  });

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  res.status(200).json(comment);
});

//@desc Upadate a comment
//@route /api/v1/comments/:id
//@access public
const updateComment = asyncHandler(async (req: Request, res: Response) => {
  const { id_comment } = req.params;
  const { contents } = req.body;
  const comment = await prisma.comments.findUnique({
    where: { id_comment: Number(id_comment) },
  });

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found !!");
  }

  const updatedData: { contents?: string } = {};
  if (contents) updatedData.contents = contents;

  const updatedComment = await prisma.comments.update({
    where: { id_comment: Number(id_comment) },
    data: updatedData,
  });

  res.status(200).json(updatedComment);
});

//@desc Delete a comment
//@route DELETE /api/v1/comments/:id
//@access public
const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { id_comment } = req.params;
  const comment = await prisma.comments.findUnique({
    where: { id_comment: Number(id_comment) },
  });

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found !!");
  }

  await prisma.comments.delete({ where: { id_comment: Number(id_comment) } });
  res.status(204).json({ message: "role deleted successful" });
});

export {
  createComments,
  readComments,
  readAllCommentsOfPost,
  readOneComment,
  updateComment,
  deleteComment,
};
