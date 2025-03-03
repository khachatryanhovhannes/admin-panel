import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NavigationItem } from './types/frontend.types';
import {
  Language,
  Text_content,
  Text,
  Constants,
  PageType,
} from '@prisma/client';

@Injectable()
export class FrontendService {
  constructor(private readonly prisma: PrismaService) {}

  async getNavigation(): Promise<Record<string, NavigationItem[]>> {
    const navItems = await this.prisma.navbar.findMany({
      where: {
        isActive: true,
        parentId: null,
        items: {
          some: {
            isActive: true,
          },
        },
      },
      include: {
        items: {
          include: {
            language: true,
          },
        },
      },
      orderBy: { orderId: 'asc' },
    });

    const groupedData: Record<string, NavigationItem[]> = {};

    navItems.forEach((nav) => {
      nav.items.forEach((item) => {
        const langKey: string = item.language.shortName;

        if (!groupedData[langKey]) {
          groupedData[langKey] = [];
        }

        groupedData[langKey].push({
          id: nav.id,
          title: nav.title,
          link: nav.link,
          parentId: nav.parentId,
          orderId: nav.orderId,
          isActive: nav.isActive,
          text: item.text,
          children: [],
        });
      });
    });

    const transformedNav: Record<string, NavigationItem[]> = {};

    Object.keys(groupedData).forEach((langKey: string) => {
      const menuMap = new Map<number, NavigationItem>();

      groupedData[langKey].forEach((item) => {
        menuMap.set(item.id, item);
      });

      const tree: NavigationItem[] = [];

      groupedData[langKey].forEach((item) => {
        if (item.parentId !== null) {
          const parent = menuMap.get(item.parentId);
          if (parent) {
            parent.children.push(item);
          }
        } else {
          tree.push(item);
        }
      });

      transformedNav[langKey] = tree;
    });

    return transformedNav;
  }

  async getAllLanguages(): Promise<Record<string, Omit<Language, 'id'>>> {
    const languages: Language[] = await this.prisma.language.findMany();

    const formattedLanguages: Record<string, Omit<Language, 'id'>> = {};

    languages.forEach((lang: Language) => {
      formattedLanguages[lang.shortName] = {
        enName: lang.enName,
        nativeName: lang.nativeName,
        shortName: lang.shortName,
        iconUrl: lang.iconUrl,
        isActive: lang.isActive,
      };
    });

    return formattedLanguages;
  }

  async getContent(): Promise<
    Record<string, Record<string, string>> & {
      constants: Record<string, string>;
    }
  > {
    const texts: (Text_content & { language: Language; text: Text })[] =
      await this.prisma.text_content.findMany({
        where: {
          language: {
            isActive: true,
          },
        },
        include: {
          language: true,
          text: true,
        },
      });

    const constants: Constants[] = await this.prisma.constants.findMany();

    const formattedTexts: Record<string, Record<string, string>> = {};
    const formattedConstants: Record<string, string> = {};

    texts.forEach((text) => {
      const langKey: string = text.language.shortName;

      if (!formattedTexts[langKey]) {
        formattedTexts[langKey] = {};
      }

      formattedTexts[langKey][text.text.key] = text.content || '';
    });

    constants.forEach((constant: Constants) => {
      formattedConstants[constant.key] = constant.value;
    });

    return {
      ...formattedTexts,
      constants: formattedConstants,
    };
  }

  async getImages() {
    const images = await this.prisma.images.findMany();

    const imagesObj = {};

    images.forEach((image) => {
      imagesObj[image.key] = image.imageUrl;
    });

    return imagesObj;
  }

  async getPageData(language: string, slug: string, type: PageType) {
    return this.prisma.pages.findFirst({
      where: {
        slug: slug,
        type: type,
      },
      include: {
        page_content: {
          where: {
            language: {
              shortName: language,
            },
          },
          include: {
            language: true,
          },
        },
      },
    });
  }
}
