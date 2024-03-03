import * as Mustache from 'mustache';

import { User } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';

import { map, size } from 'lodash';

import {
  RequiredRule,
  CHECK_ABILITY,
} from 'src/common/decorators/abilities.decorator';

import {
  subject,
  RawRuleOf,
  MongoAbility,
  ForcedSubject,
  ForbiddenError,
  createMongoAbility,
} from '@casl/ability';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

export const actions = [
  'read',
  'manage',
  'create',
  'update',
  'delete',
] as const;

export const subjects = [
  'Task',
  'User',
  'Role',
  'Notification',
  'BlockedIp',
  'Audits',
  'all',
] as const;

export type Abilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
  ),
];

export type AppAbility = MongoAbility<Abilities>;

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  createAbility = (rules: RawRuleOf<AppAbility>[]) =>
    createMongoAbility<AppAbility>(rules);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules: any =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];
    const { rawHeaders } = context.switchToHttp().getRequest();

    const token = rawHeaders.find((header) => header.startsWith('Bearer '));

    const jwtService = new JwtService();

    const decoded = jwtService.decode(token.split(' ')[1]);

    const request: FastifyRequest = context.switchToHttp().getRequest();

    const currentUser = await this.prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });

    const userPermissions = await this.prisma.permission.findMany({
      where: {
        role_id: currentUser.role_id,
      },
    });

    const parsedUserPermissions = this.parseCondition(
      userPermissions,
      currentUser,
    );

    try {
      const ability = this.createAbility(Object(parsedUserPermissions));

      for await (const rule of rules) {
        let sub = {};
        if (size(rule?.conditions)) {
          const subId = +request.params['id'];
          sub = await this.getSubjectById(subId, rule.subject);
        }

        ForbiddenError.from(ability)
          .setMessage('You are not allowed to perform this action')
          .throwUnlessCan(rule.action, subject(rule.subject, sub));
      }
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  parseCondition(permissions: any, currentUser: User) {
    const data = map(permissions, (permission) => {
      if (size(permission.conditions)) {
        const parsedConditions = {};
        for (const key in permission.conditions) {
          const parsedVal = Mustache.render(
            permission.conditions[key],
            currentUser,
          );
          parsedConditions[key] = +parsedVal;
        }
        return {
          ...permission,
          conditions: parsedConditions,
        };
      }
      return permission;
    });
    return data;
  }

  async getSubjectById(id: number, subName: string) {
    const subject = await this.prisma[subName].findUnique({
      where: {
        id,
      },
    });
    if (!subject) throw new NotFoundException(`${subName} not found`);
    return subject;
  }
}
