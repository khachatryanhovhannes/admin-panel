import { PageType } from '@prisma/client';

export class CreatePageDto {
  title: string;
  slug: string;
  type: PageType;
  isActive?: boolean;
}
