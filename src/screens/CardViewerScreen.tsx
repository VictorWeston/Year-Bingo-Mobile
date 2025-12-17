import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList, BingoCard} from '../types';
import {getCardById, saveCard, deleteCard} from '../store/CardStore';

type Props = NativeStackScreenProps<RootStackParamList, 'CardViewer'>;

const {width} = Dimensions.get('window');

export default function CardViewerScreen({route, navigation}: Props) {
  const insets = useSafeAreaInsets();
  const {cardId} = route.params;
  const [card, setCard] = useState<BingoCard | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadCard();
    }, []),
  );

  const loadCard = async () => {
    const loadedCard = await getCardById(cardId);
    if (loadedCard) {
      setCard(loadedCard);
      navigation.setOptions({title: loadedCard.title});
    }
  };

  const toggleItem = async (index: number) => {
    if (!card) return;

    const newCrossedItems = card.crossedItems.includes(index)
      ? card.crossedItems.filter(i => i !== index)
      : [...card.crossedItems, index];

    const updatedCard = {...card, crossedItems: newCrossedItems};
    setCard(updatedCard);
    await saveCard(updatedCard);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this bingo card?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteCard(cardId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleReset = () => {
    Alert.alert('Reset Card', 'Clear all crossed items?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Reset',
        onPress: async () => {
          if (!card) return;
          const updatedCard = {...card, crossedItems: []};
          setCard(updatedCard);
          await saveCard(updatedCard);
        },
      },
    ]);
  };

  const handleShuffle = async () => {
    if (!card) return;
    const shuffledItems = [...card.items].sort(() => Math.random() - 0.5);
    const updatedCard = {...card, items: shuffledItems, crossedItems: []};
    setCard(updatedCard);
    await saveCard(updatedCard);
  };

  const handleEdit = () => {
    if (!card) return;
    navigation.navigate('EditCard', {cardId: card.id});
  };

  if (!card) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const tileSize = (width - 40 - (card.size - 1) * 4) / card.size;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{card.title}</Text>
      </View>

      <View style={styles.gridContainer}>
        <View style={[styles.grid, {width: width - 40}]}>
          {card.items.map((item, index) => {
            const isCrossed = card.crossedItems.includes(index);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tile,
                  {
                    width: tileSize,
                    height: tileSize,
                  },
                  isCrossed && styles.tileCrossed,
                ]}
                onPress={() => toggleItem(index)}>
                <Text
                  style={[styles.tileText, isCrossed && styles.tileTextCrossed]}
                  numberOfLines={3}
                  adjustsFontSizeToFit>
                  {item}
                </Text>
                {isCrossed && <View style={styles.crossLine} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 20)}]}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShuffle}>
          <Text style={styles.actionButtonText}>Shuffle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tile: {
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  tileCrossed: {
    backgroundColor: '#e8f5e9',
  },
  tileText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  tileTextCrossed: {
    color: '#666',
  },
  crossLine: {
    position: 'absolute',
    width: '140%',
    height: 3,
    backgroundColor: '#4caf50',
    transform: [{rotate: '-45deg'}],
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 10,
  },
  actionButton: {
    width: '48%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
  },
  resetButton: {
    width: '48%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  deleteButton: {
    width: '48%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ffebee',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d32f2f',
  },
});
