import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {getCardById, saveCard} from '../store/CardStore';

type Props = NativeStackScreenProps<RootStackParamList, 'EditCard'>;

const SIZES = [3, 4, 5];

export default function EditCardScreen({route, navigation}: Props) {
  const {cardId} = route.params;
  const [title, setTitle] = useState('');
  const [items, setItems] = useState('');
  const [size, setSize] = useState(5);
  const [originalSize, setOriginalSize] = useState(5);

  useEffect(() => {
    loadCard();
  }, []);

  const loadCard = async () => {
    const card = await getCardById(cardId);
    if (card) {
      setTitle(card.title);
      setItems(card.items.join('\n'));
      setSize(card.size);
      setOriginalSize(card.size);
    }
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const itemList = items
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (!trimmedTitle) {
      Alert.alert('Error', 'Please enter a title for your bingo card');
      return;
    }

    const requiredItems = size * size;
    if (itemList.length < requiredItems) {
      Alert.alert(
        'Error',
        `You need at least ${requiredItems} items for a ${size}x${size} card. You have ${itemList.length}.`,
      );
      return;
    }

    const card = await getCardById(cardId);
    if (!card) return;

    const updatedCard = {
      ...card,
      title: trimmedTitle,
      items: itemList.slice(0, requiredItems),
      size,
      crossedItems: size !== originalSize ? [] : card.crossedItems,
    };

    await saveCard(updatedCard);
    navigation.goBack();
  };

  const requiredItems = size * size;
  const currentItems = items
    .split('\n')
    .filter(item => item.trim().length > 0).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.label}>Card Title</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Enter card title..."
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Grid Size</Text>
        <View style={styles.sizeContainer}>
          {SIZES.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.sizeButton, size === s && styles.sizeButtonActive]}
              onPress={() => setSize(s)}>
              <Text
                style={[
                  styles.sizeButtonText,
                  size === s && styles.sizeButtonTextActive,
                ]}>
                {s}x{s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {size !== originalSize && (
          <Text style={styles.warning}>
            Changing size will reset crossed items
          </Text>
        )}

        <Text style={styles.label}>
          Bingo Items ({currentItems}/{requiredItems})
        </Text>
        <Text style={styles.hint}>Enter one item per line</Text>
        <TextInput
          style={styles.itemsInput}
          placeholder="Enter items, one per line..."
          value={items}
          onChangeText={setItems}
          multiline
          textAlignVertical="top"
          placeholderTextColor="#999"
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  warning: {
    fontSize: 12,
    color: '#f57c00',
    marginTop: 8,
  },
  titleInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sizeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  sizeButtonActive: {
    borderColor: '#6200ee',
    backgroundColor: '#f3e8ff',
  },
  sizeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  sizeButtonTextActive: {
    color: '#6200ee',
  },
  itemsInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 200,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 2,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#6200ee',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
