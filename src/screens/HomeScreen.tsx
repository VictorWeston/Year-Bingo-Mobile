import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, BingoCard} from '../types';
import {getCards} from '../store/CardStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({navigation}: Props) {
  const [cards, setCards] = useState<BingoCard[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, []),
  );

  const loadCards = async () => {
    const loadedCards = await getCards();
    setCards(loadedCards.sort((a, b) => b.createdAt - a.createdAt));
  };

  const renderCard = ({item}: {item: BingoCard}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CardViewer', {cardId: item.id})}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSize}>
        {item.size}x{item.size}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>BINGO</Text>
      </View>

      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No bingo cards yet</Text>
            <Text style={styles.emptySubtext}>
              Tap + to create your first card
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateCard')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 4,
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  cardSize: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    lineHeight: 36,
  },
});
