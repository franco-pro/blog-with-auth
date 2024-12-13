import asyncHandler from "express-async-handler";
import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//@desc Create a role
//@access POST /api/v1/roles
//@access Public
const createRole = asyncHandler(async (req: Request, res: Response) => {
  const { name, desc } = req.body;
  const { id } = req.params;
  const existRole = await prisma.roles.findUnique({
    where: { id_role: Number(id) },
  });

  if (!existRole) {
    const role = await prisma.roles.create({
      data: { name, desc },
    });
    if (!name) {
      res.status(400);
      throw new Error("a name is required");
    }
    res.status(201).json(role);
  } else {
    res.json(400);
    throw new Error("this role already existed");
  }
});

//@desc read all roles
//@access GET /api/v1/roles
//@access Public
const readRoles = asyncHandler(async (req: Request, res: Response) => {
  const roles = await prisma.roles.findMany();
  res.status(200).json(roles);
});

//@desc read a role
//@access GET /api/v1/roles/:id
//@access Public
const readOneRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existRole = await prisma.roles.findUnique({
    where: { id_role: Number(id) },
  });

  if (existRole) {
    res.status(200).json(existRole);
  } else {
    res.status(404);
    throw new Error("role not found !!");
  }
});

//@desc Update a role
//@access PATCH /api/v1/roles/:id
//@access Public
const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, desc } = req.body;

  const existRole = await prisma.roles.findUnique({
    where: { id_role: Number(id) },
  });

  if (existRole) {
    res.status(400);
    throw new Error("The role doesnt exist !!");
  }
  const updateData: { name?: string; desc?: string } = {};
  if (name) updateData.name = name;
  if (desc) updateData.desc = desc;

  const updateRole = await prisma.roles.update({
    where: { id_role: Number(id) },
    data: updateData,
  });
  res.status(200).json(updateRole);
});

//@desc delete a role
//@access delete /api/v1/roles/:id
//@access Public
const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existRole = await prisma.roles.findUnique({
    where: { id_role: Number(id) },
  });
  if (!existRole) {
    res.status(404);
    throw new Error("Role not found!");
  }
  await prisma.roles.delete({
    where: { id_role: Number(id) },
  });
  res.status(204).json({ message: "role deleted successful" });
});

export { createRole, readRoles, readOneRole, updateRole, deleteRole };
