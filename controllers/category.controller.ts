import asyncHandler from "express-async-handler";
import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//@desc Create a category
//@access POST /api/v1/category
//@access Public
const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const { id } = req.params;
  const existCategory = await prisma.category.findUnique({
    where: { id_category: name },
  });
  if (!name) {
    res.status(400);
    throw new Error("a name is required");
  }

  if (existCategory) {
    res.status(400);
    throw new Error("this role already existed");
  }

  const category = await prisma.category.create({
    data: { name },
  });
  res.status(201).json(category);
});

//@desc read all category
//@access GET /api/v1/category
//@access Public
const readCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.findMany();
  res.status(200).json(category);
});

//@desc read a category
//@access GET /api/v1/category/:id
//@access Public
const readOneCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existCategory = await prisma.category.findUnique({
    where: { id_category: Number(id) },
  });

  if (!existCategory) {
    res.status(404);
    throw new Error("category not found !!");
  }
  res.status(200).json(existCategory);
});

//@desc Update a category
//@access PATCH /api/v1/category/:id
//@access Public
const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  const existCategory = await prisma.category.findUnique({
    where: { id_category: Number(id) },
  });

  if (!existCategory) {
    res.status(400);
    throw new Error("The category doesnt exist !!");
  }
  const updateData: { name?: string } = {};
  if (name) updateData.name = name;

  const updateCategory = await prisma.category.update({
    where: { id_category: Number(id) },
    data: updateData,
  });
  res.status(200).json(updateCategory);
});

//@desc delete a category
//@access delete /api/v1/category/:id
//@access Public
const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existCategory = await prisma.category.findUnique({
    where: { id_category: Number(id) },
  });
  if (!existCategory) {
    res.status(404);
    throw new Error("category not found!");
  }
  await prisma.category.delete({
    where: { id_category: Number(id) },
  });
  res.status(204).json({ message: "role deleted successful" });
});

export {
  createCategory,
  readCategory,
  readOneCategory,
  updateCategory,
  deleteCategory,
};
