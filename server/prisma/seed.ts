// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { cloneDeep } from 'lodash';

const prisma = new PrismaClient();

export const roles = [
  {
    id: 1,
    name: 'Admin',
  },
  {
    id: 2,
    name: 'User',
  },
];

export const permissions = [
  {
    id: 1,
    role_id: 1,
    action: 'manage',
    subject: 'all',
  },
  {
    id: 2,
    role_id: 2,
    action: 'read',
    subject: 'Task',
  },
  {
    id: 3,
    role_id: 2,
    action: 'manage',
    subject: 'Task',
    conditions: { created_by: '{{ id }}' },
  },
];

export const users = [
  {
    id: 1,
    role_id: 1,
    email: 'admin@example.com',
    name: 'Admin',
    lastname: 'Example',
    username: 'admin',
  },
  {
    id: 2,
    role_id: 2,
    email: 'user@example.com',
    name: 'User',
    lastname: 'Example',
    username: 'user',
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  for await (const role of roles) {
    const roleAttrs = cloneDeep(role);
    delete roleAttrs.id;
    await prisma.role.upsert({
      where: {
        id: role.id,
      },
      create: roleAttrs,
      update: roleAttrs,
    });
  }

  for await (const permission of permissions) {
    const permissionAttrs = cloneDeep(permission);
    delete permissionAttrs.id;
    await prisma.permission.upsert({
      where: {
        id: permission.id,
      },
      create: permissionAttrs,
      update: permissionAttrs,
    });
  }

  for await (const user of users) {
    const userAttrs = cloneDeep(user);
    delete userAttrs.id;
    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: {
        ...userAttrs,
        password: hashedPassword,
      },
      update: userAttrs,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
