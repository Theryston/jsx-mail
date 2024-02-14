import { Reflector } from '@nestjs/core';

export const Permissions = Reflector.createDecorator<string[]>();
