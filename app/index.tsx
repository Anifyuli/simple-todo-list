import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react-native";
import todoData from "@/data/todos.json";
import { Data } from "@/types/todos";

export default function Index() {
  const [todos, setTodos] = useState<Data[]>(
    todoData.todos.sort((a, b) => b.id - a.id)
  );
  const [text, setText] = useState("");

  const addTodo = () => {
    if (text.trim()) {
      const newId =
        todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos]);
      setText("");
    }
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const removeTodo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const saveTodos = async (updatedTodos: Data[]) => {
    try {
      await AsyncStorage.setItem(
        "todos",
        JSON.stringify({ todos: updatedTodos })
      );
    } catch (e) {
      console.error("Failed to save todos:", e);
    }
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await AsyncStorage.getItem("todos");
        if (savedTodos) {
          setTodos(
            JSON.parse(savedTodos).todos.sort((a: any, b: any) => b.id - a.id)
          );
        }
      } catch (e) {
        console.error("Failed to load todos:", e);
      }
    };

    loadTodos();
  }, []);

  const renderItem = ({ item }: { item: Data }) => (
    <View style={style.todoItem}>
      <Text
        style={[style.todoText, item.completed && style.completedText]}
        onPress={() => toggleTodo(item.id)}
      >
        {item.title}
      </Text>
      <Pressable onPress={() => removeTodo(item.id)}>
        <Trash2 color="red" />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={style.container}>
      <View style={style.inputContainer}>
        <TextInput
          style={style.input}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
          onSubmitEditing={addTodo}
        />
        <Pressable onPress={addTodo} style={style.addButton}>
          <Plus color="white" />
        </Pressable>
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={{ flexGrow: 1, marginHorizontal: 10 }}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    width: "auto",
    marginHorizontal: "auto",
    pointerEvents: "auto",
  },
  input: {
    flex: 1,
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    padding: 10,
    fontSize: 18,
    minWidth: 0,
    color: "black",
  },
  addButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
  },
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
  todoText: {
    flex: 1,
    fontSize: 18,
    color: "black",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});
