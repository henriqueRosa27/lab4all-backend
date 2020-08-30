import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateUserService from '../app/services/User/CreateUser';
import UserRepository from '../app/repositories/implementations/UserRepository';
import validationBody from '../middlewares/validationBody';
import createUserValidation from '../validations/user';
import User from '../app/models/User';

const userRouter = Router();

userRouter.post(
  '/',
  (request, response, next) =>
    validationBody(request, response, next, createUserValidation),
  async (request, response) => {
    try {
      const createUser = new CreateUserService(
        new UserRepository(getRepository(User, 'postgres'))
      );

      const { name, surname, email, password } = request.body;

      const user = await createUser.execute({
        name,
        surname,
        email: email.toLowerCase(),
        password,
      });

      delete user.password;

      return response.json(user);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
);

export default userRouter;