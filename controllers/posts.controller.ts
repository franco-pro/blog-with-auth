import asyncHandler from "express-async-handler";
import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//@desc Create a post
//@access POST /api/v1/posts
//@access Public
const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, id_category, userId } = req.body;
  if (!title || !content || !id_category || !userId) {
    res.status(400);
    throw new Error("Title, content, category ID, and user ID are required.");
  }

  // Récupérer une catégorie existante
  const category = await prisma.category.findUnique({
    where: { id_category: Number(id_category) }, // Assurez-vous que cette requête renvoie un résultat
  });
  if (!category) {
    res.status(404);
    throw new Error("Category not found.");
  }
  // Récupérer une catégorie existante
  const user = await prisma.user.findUnique({
    where: { id_user: Number(userId) }, // Assurez-vous que cette requête renvoie un résultat
  });
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  const post = await prisma.posts.create({
    data: {
      title,
      content,
      category: {
        connect: { id_category: id_category },
      },
      user: {
        connect: { id_user: userId },
      },
    },
  });
  res.status(201).json(post);
});

//@desc read all posts
//@access GET /api/v1/posts
//@access Public
const readposts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await prisma.posts.findMany({
    include: { category: true, user: true },
  });
  res.status(200).json(posts);
});

//@desc read all posts of a category
//@route /api/v1/:name_category/posts
//@acess public
const readAllPostsOfCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name_category } = req.params;
    const posts = await prisma.posts.findMany({
      where: { name_category: String(name_category) },
    });
    res.status(200).json(posts);
  }
);

//@desc read a post
//@access GET /api/v1/posts/:id
//@access Public
const readOnePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await prisma.posts.findUnique({
    where: { id_post: Number(id) },
    include: { category: true, user: true }, // Include related data if needed
  });

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404);
    throw new Error("post not found !!");
  }
});

//@desc Update a Post
//@access PATCH /api/v1/posts/:id
//@access Public
const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const existPost = await prisma.posts.findUnique({
    where: { id_post: Number(id) },
  });

  if (!existPost) {
    res.status(404);
    throw new Error("Post not found.");
  }
  const updateData: { title?: string; content?: string } = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;

  const updatePost = await prisma.posts.update({
    where: { id_post: Number(id) },
    data: updateData,
  });
  res.status(200).json(updatePost);
});

//@desc delete a post
//@access delete /api/v1/posts/:id
//@access Public
const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existPost = await prisma.posts.findUnique({
    where: { id_post: Number(id) },
  });
  if (!existPost) {
    res.status(404);
    throw new Error("Role not found!");
  }
  await prisma.posts.delete({
    where: { id_post: Number(id) },
  });
  res.status(204).json({ message: "role deleted successful" });
});

export {
  createPost,
  readposts,
  readAllPostsOfCategory,
  readOnePost,
  updatePost,
  deletePost,
};
