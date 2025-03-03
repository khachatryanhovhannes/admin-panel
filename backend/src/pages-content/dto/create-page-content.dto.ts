export class CreatePageContentDto {
  meta_title: string;
  meta_description: string;
  keywords: string;

  title: string;
  content: string;

  languageId: number;
  pagesId?: number;
}
