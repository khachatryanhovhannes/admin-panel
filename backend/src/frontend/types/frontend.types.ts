export interface NavigationItem {
  id: number;
  title: string;
  link: string;
  parentId: number | null;
  orderId: number;
  isActive: boolean;
  text: string;
  children: NavigationItem[];
}
