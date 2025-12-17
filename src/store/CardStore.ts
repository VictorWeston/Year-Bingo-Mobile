import AsyncStorage from '@react-native-async-storage/async-storage';
import {BingoCard} from '../types';

const STORAGE_KEY = 'bingo_cards';

export const getCards = async (): Promise<BingoCard[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCard = async (card: BingoCard): Promise<void> => {
  const cards = await getCards();
  const existingIndex = cards.findIndex(c => c.id === card.id);
  if (existingIndex >= 0) {
    cards[existingIndex] = card;
  } else {
    cards.push(card);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};

export const deleteCard = async (cardId: string): Promise<void> => {
  const cards = await getCards();
  const filtered = cards.filter(c => c.id !== cardId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getCardById = async (
  cardId: string,
): Promise<BingoCard | null> => {
  const cards = await getCards();
  return cards.find(c => c.id === cardId) || null;
};
