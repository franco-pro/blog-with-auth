import asyncHandler from "express-async-handler";
import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// @desc create user
//@routes POST api/v1/users/register
//@access public

const createAccount = asyncHandler(async (req: Request, res: Response) => {
  const { email, name, password, gender } = req.body;
  if (!email || !name || !password || !gender) {
    res.status(400);
    throw new Error("All fields are mandatory !!");
  }

  const userExist = await prisma.user.findUnique({
    where: { email },
  });
  if (userExist) {
    res.status(400);
    throw new Error("This user already exist !! ");
  }

  //crypt password
  const hashPassword = await bcrypt.hash(password, 1);

  //create account
  const account = await prisma.user.create({
    data: {
      name,
      email,
      gender,
      password: hashPassword,
    },
  });

  if (account) {
    res.status(201).json({
      id: account.id_user,
      account,
    });
  } else {
    res.status(400);
    throw new Error("something wrong !!");
  }
  console.log("password: ", password, "/n hashpass: ", hashPassword);
});

// @desc Read user
//@routes GET api/v1/users
//@access public
const readUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

// @desc Read user
//@routes GET api/v1/users/:id
//@access public
const readOneUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id_user: Number(id) },
  });
  if (!user) {
    res.status(404); // 404 pour utilisateur non trouvé
    throw new Error("User not found!");
  }
  res.status(200).json(user);
});

// @desc Update user
//@routes PATCH api/v1/users/:id
//@access public
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, gender } = req.body;
  const existUser = await prisma.user.findUnique({
    where: { id_user: Number(id) },
  });

  if (existUser) {
    const updateData: { name?: string; email?: string; gender?: boolean } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (gender) updateData.gender = gender;
    const updateUser = await prisma.user.update({
      where: { id_user: Number(id) },
      data: updateData,
    });
    res.status(200).json(updateUser);
  } else {
    res.status(404);
    throw new Error("user id doesnt exist !!");
  }
});

// @desc delete user
//@routes delete api/v1/users/:id
//@access public
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const User = await prisma.user.delete({
    where: { id_user: Number(id) },
  });
  res.status(204).json({ message: "user is deleted successful" });
});

export { createAccount, readUsers, readOneUser, updateUser, deleteUser };
