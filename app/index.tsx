// Import komponen yang dibutuhkan dari react-native
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
// Import komponen SafeAreaView untuk handling notch dan sistem UI
import { SafeAreaView } from "react-native-safe-area-context";
// Import hooks yang diperlukan dari React
import { useState, useEffect } from "react";
// Import icon-icon yang digunakan dari lucide-react-native
import { Plus, Trash2, Edit2, Save, X } from "lucide-react-native";
// Import AsyncStorage untuk penyimpanan data lokal
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface untuk mendefinisikan struktur data todo
interface Todo {
  id: number;      // ID unik untuk setiap todo
  title: string;   // Judul/isi dari todo
  completed: boolean; // Status penyelesaian todo
}

// Key untuk menyimpan data di AsyncStorage
const STORAGE_KEY = '@todos_storage';

export default function Index() {
  // State untuk menyimpan daftar todos
  const [todos, setTodos] = useState<Todo[]>([]);
  // State untuk input teks todo baru
  const [text, setText] = useState("");
  // State untuk menyimpan ID todo yang sedang diedit
  const [editingId, setEditingId] = useState<number | null>(null);
  // State untuk menyimpan teks yang sedang diedit
  const [editText, setEditText] = useState("");

  // Effect untuk memuat todos saat aplikasi pertama kali dibuka
  useEffect(() => {
    loadTodos();
  }, []);

  /**
   * Memuat todos dari AsyncStorage
   * Dijalankan saat aplikasi pertama kali dibuka
   */
  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTodos) {
        // Parse data JSON dan urutkan berdasarkan ID (terbaru di atas)
        setTodos(JSON.parse(savedTodos).sort((a: Todo, b: Todo) => b.id - a.id));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load todos');
    }
  };

  /**
   * Menyimpan todos ke AsyncStorage
   * @param newTodos - Array todos yang akan disimpan
   */
  const saveTodos = async (newTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (error) {
      Alert.alert('Error', 'Failed to save todos');
    }
  };

  /**
   * Menambahkan todo baru ke daftar
   * Todo baru akan ditambahkan di awal list
   */
  const addTodo = () => {
    if (text.trim()) {
      // Generate ID baru (ID tertinggi + 1)
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      // Buat array baru dengan todo baru di awal
      const newTodos = [{ id: newId, title: text, completed: false }, ...todos];
      saveTodos(newTodos);
      setText(""); // Reset input field
    }
  };

  /**
   * Toggle status completed dari sebuah todo
   * @param id - ID todo yang akan di-toggle
   */
  const toggleTodo = (id: number) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(newTodos);
  };

  /**
   * Menghapus todo dari daftar
   * Menampilkan konfirmasi sebelum menghapus
   * @param id - ID todo yang akan dihapus
   */
  const removeTodo = (id: number) => {
    Alert.alert(
      "Delete Todo",
      "Are you sure you want to delete this todo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newTodos = todos.filter((todo) => todo.id !== id);
            saveTodos(newTodos);
          },
        },
      ]
    );
  };

  /**
   * Memulai proses edit todo
   * @param todo - Todo yang akan diedit
   */
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  /**
   * Membatalkan proses edit todo
   */
  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  /**
   * Menyimpan perubahan pada todo yang diedit
   * @param id - ID todo yang sedang diedit
   */
  const saveEdit = (id: number) => {
    if (editText.trim()) {
      const newTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, title: editText.trim() } : todo
      );
      saveTodos(newTodos);
      setEditingId(null);
      setEditText("");
    }
  };

  /**
   * Render setiap item todo
   * Menampilkan tampilan berbeda untuk mode normal dan mode edit
   */
  const renderItem = ({ item }: { item: Todo }) => (
    <View style={style.todoItem}>
      {editingId === item.id ? (
        // Tampilan mode edit
        <View style={style.editContainer}>
          <TextInput
            style={style.editInput}
            value={editText}
            onChangeText={setEditText}
            autoFocus
          />
          <Pressable onPress={() => saveEdit(item.id)} style={style.iconButton}>
            <Save color="green" size={20} />
          </Pressable>
          <Pressable onPress={cancelEditing} style={style.iconButton}>
            <X color="red" size={20} />
          </Pressable>
        </View>
      ) : (
        // Tampilan mode normal
        <View>
          <Text
            style={[style.todoText, item.completed && style.completedText]}
            onPress={() => toggleTodo(item.id)}
          >
            {item.title}
          </Text>
          <View style={style.actionButtons}>
            <Pressable onPress={() => startEditing(item)} style={style.iconButton}>
              <Edit2 color="blue" size={20} />
            </Pressable>
            <Pressable onPress={() => removeTodo(item.id)} style={style.iconButton}>
              <Trash2 color="red" size={20} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );

  // Render utama aplikasi
  return (
    <SafeAreaView style={style.container}>
      {/* Container untuk input todo baru */}
      <View style={style.inputContainer}>
        <TextInput
          style={style.input}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={style.addButton}>
          <Plus color="white" />
        </Pressable>
      </View>

      {/* List todos */}
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={{ flexGrow: 1, marginHorizontal: 10 }}
      />
    </SafeAreaView>
  );
}

// Styles untuk komponen
const style = StyleSheet.create({
  // Container utama aplikasi
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  // Container untuk input dan tombol add
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    width: "auto",
    marginHorizontal: "auto",
    pointerEvents: "auto",
  },
  // Style untuk input field
  input: {
    flex: 1,
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    padding: 8,
    fontSize: 18,
    minWidth: 0,
  },
  // Style untuk tombol add
  addButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
  },
  // Style untuk setiap item todo
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    padding: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    width: "100%",
    maxWidth: 1024,
    marginHorizontal: "auto",
    pointerEvents: "auto",
  },
  // Style untuk teks todo
  todoText: {
    flex: 1,
    fontSize: 18,
    color: "black",
  },
  // Style untuk teks todo yang sudah selesai
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  // Container untuk mode edit
  editContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Style untuk input field saat edit
  editInput: {
    flex: 1,
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    fontSize: 18,
  },
  // Container untuk tombol-tombol aksi
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  // Style untuk tombol icon
  iconButton: {
    padding: 4,
  },
});