import { Prisma } from '@prisma/client';

const models = {};

Object.keys(Prisma.ModelName).forEach((key) => {
  models[Prisma.ModelName[key]] = {
    field: 'deletedAt',
    createValue: (deleted) => {
      if (deleted) return new Date();
      return null;
    },
  };
});

export default models;
