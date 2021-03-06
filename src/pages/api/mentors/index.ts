import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/utils/prisma"
import { generateJwtAndRefreshToken } from "../../../utils/generateJwtAndRefreshToken";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === 'POST') {
    try {

      const {
        email,
        password,
        telephone,
        roles = 'mentor',
        name,
        image,
        position,
        biography,
      } = request.body

      const passwordHash = await bcrypt.hash(password, 6)

      const user = await prisma.user.create({
        data: {
          email: email,
          password: passwordHash,
          telephone: telephone,
          roles: roles,
          name: name,
          image: image,
          position: position,
          biography: biography,
        },
        select: {
          id: true,
          roles: true,
          permissions: true,
          email: true,
        }
      })

      const { token, refreshToken } = await generateJwtAndRefreshToken(email, {
        role: user.roles,
        permissions: user.permissions,
      })

      const userData = {
        token,
        refreshToken,
        user
      }

      return response.status(201).json(userData)

    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError) {

        console.log(error)

      }

      throw error;

    }
  }

  if (request.method === 'GET') {

    try {

      const mentors = await prisma.user.findMany({
        where: {
          roles: 'mentor',
        },
        select: {
          id: true,
          categories: true,
          image: true,
          name: true,
          position: true,
        }
      })

      return response.status(200).json(mentors)

    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError) {

        return response.status(500).json(error)

      }

      // throw error;

    }
  }

  if (request.method === 'PUT') {

    try {

      const { id, name, email, password, telephone, image, position, biography, categoryId } = request.body

      if (password) {

        const hashedPassword = await bcrypt.hash(password, 6)

        const updatedMentor = await prisma.user.update({
          where: {
            id: id,
          },
          data: {
            image: image,
            password: hashedPassword,
            email: email,
            name: name,
            telephone: telephone,
            position: position,
            biography: biography,
            categories: {
              connect: {
                id: categoryId,
              }
            }
          }
        })

        return response.status(200).json(updatedMentor)
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          image: image,
          email: email,
          name: name,
          telephone: telephone,
          position: position,
          biography: biography,
          categories: {
            connect: {
              id: categoryId,
            },
          },
        },
      })

      return response.status(200).json(updatedUser)

    } catch (error) {

      if (error instanceof Prisma.PrismaClientKnownRequestError) {

        return response.json(String(error))

      }

      throw error;

    }

  }

  // NEED TO BE ADDED A NEW ONE
  if (request.method === 'DELETE') {

    try {

      const { id } = request.body

      await prisma.user.delete({
        where: {
          id: id,
        }
      })

      return response.status(200).json({ message: `User ${id} was deleted successfully!` })

    } catch (error) {

      return response.status(500).json({
        Error: String(error),
        message: 'Somenthing goes wrong. Trying again',
      })

    }

  }

  return response.status(403).json({ Error: 'Method not supported' })
}