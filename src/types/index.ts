export interface BingoCard {
  id: string;
  title: string;
  items: string[];
  size: number; // 3, 4, or 5
  crossedItems: number[]; // indices of crossed items
  createdAt: number;
}

export type RootStackParamList = {
  Home: undefined;
  CreateCard: undefined;
  CardViewer: {cardId: string};
};
