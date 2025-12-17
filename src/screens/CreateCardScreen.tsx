import React, {useState} from 'react';
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
import {saveCard} from '../store/CardStore';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateCard'>;

const SIZES = [3, 4, 5];

export default function CreateCardScreen({navigation}: Props) {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState('');
  const [size, setSize] = useState(5);

  const handleCreate = async () => {
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

    const newCard = {
      id: Date.now().toString(),
      title: trimmedTitle,
      items: itemList.slice(0, requiredItems),
      size,
      crossedItems: [],
      createdAt: Date.now(),
    };

    await saveCard(newCard);
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
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Create Card</Text>
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
  createButton: {
    flex: 2,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#6200ee',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
