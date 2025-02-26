export interface INavItem {
  id: number;
  title: string;
  link: string;
  text: string;
  children?: INavItem;
}
