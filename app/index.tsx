import { View, TextInput, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import ToDoListItem from "@/components/listTodosItem";
import { ToDo } from "@/types/todo";

export default function Index() {
  const db = useSQLiteContext();
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState<ToDo[]>([]);

  // Fetch todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const result = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM todo"
      );
      console.log("Number of todos:", result?.count);

      const todos = await db.getAllAsync<ToDo>(
        "SELECT * FROM todo ORDER BY id DESC"
      );
      console.log("Todos fetched:", todos);
      setTodos(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      Alert.alert("Error", "Could not load todos");
    }
  };

  const addTodo = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a todo title");
      return;
    }

    try {
      await db.runAsync(`INSERT INTO todo (title, completed) VALUES (?, ?)`, [
        title.trim(),
        0,
      ]);
      setTitle(""); // Reset input
      fetchTodos(); // Refresh list
    } catch (error) {
      console.error("Error adding todo:", error);
      Alert.alert("Error", "Could not add todo");
    }
  };

  const changeComplete = async (id: number) => {
    try {
      await db.runAsync(
        `UPDATE todo SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END WHERE id = ?`,
        [id]
      );
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
      Alert.alert("Error", "Could not update todo");
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await db.runAsync(`DELETE FROM todos WHERE id = ?`, [id]);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      Alert.alert("Error", "Could not delete todo");
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.inputContainer}>
        <TextInput
          style={style.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          onSubmitEditing={addTodo}
        />
      </View>
      <ScrollView style={style.scrollContainer}>
        {todos.map((todo) => (
          <ToDoListItem
            key={todo.id}
            todos={todo}
            changeComplete={changeComplete}
            removeTodo={removeTodo}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  inputContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  input: {
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    color: "black",
    backgroundColor: "white",
  },
  scrollContainer: {
    flex: 1,
    padding: 10,
  },
});
