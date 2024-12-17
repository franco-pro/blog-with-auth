import asyncHandler from "express-async-handler";
import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//@desc CREATE a Like
//@route POST /api/v1/likes
//@access public
const addLike = asyncHandler(async (req: Request, res: Response) => {
  const { userid, postid, commentid } = req.body;
  const like = await prisma.likes.create({
    data: {
      user: { connect: { id_user: userid } },
      posts: { connect: { id_post: postid } },
      comments: { connect: { id_comment: commentid } },
    },
  });
  res.status(201).json(like);
});

//@desc read all like of a user
//@route GET /api/v1/:id_user/likes
//@access public
const readLikesOfUser = asyncHandler(async (req: Request, res: Response) => {
  const { id_user } = req.params;
  const like = await prisma.likes.findMany({
    where: { userId: Number(id_user) },
  });
  res.status(200).json(like);
});

//@desc read all like of a post
//@route GET /api/v1/:id_post/likes
//@access public
const readLikesOfPost = asyncHandler(async (req: Request, res: Response) => {
  const { id_post } = req.params;
  const like = await prisma.likes.findMany({
    where: { postId: Number(id_post) },
  });
  res.status(200).json(like);
});

//@desc read all like of a comment
//@route GET /api/v1/:id_comment/likes
//@access public
const readLikesOfComment = asyncHandler(async (req: Request, res: Response) => {
  const { id_comment } = req.params;
  const like = await prisma.likes.findMany({
    where: { commentId: Number(id_comment) },
  });
  res.status(200).json(like);
});

//@desc a like
//@route DELETE /api/v1/likes/:id
//@access public
const deleteLike = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const like = await prisma.likes.findUnique({
    where: { id_like: Number(id) },
  });
  if (!like) {
    res.status(404);
    throw new Error("not found !!");
  }
  await prisma.likes.delete({
    where: { id_like: Number(id) },
  });
  res.status(204).json({ message: "like deleted successful" });
});
