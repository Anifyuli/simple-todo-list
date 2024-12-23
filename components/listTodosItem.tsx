import { ToDo } from "@/types/todo";
import { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Trash2 } from "lucide-react-native";

export default function ToDoListItem({
  todos,
  changeComplete,
  removeTodo,
}: {
  todos: ToDo;
  changeComplete: (id: number) => Promise<void>;
  removeTodo: (id: number) => Promise<void>;
}) {
  return (
    <View>
      <TodoItem 
        item={todos} 
        changeComplete={changeComplete} 
        removeTodo={removeTodo} 
      />
    </View>
  );
}

function TodoItem({ 
  item, 
  changeComplete, 
  removeTodo 
}: { 
  item: ToDo;
  changeComplete: (id: number) => Promise<void>;
  removeTodo: (id: number) => Promise<void>;
}) {
  const [completed, setCompleted] = useState(item.completed);

  async function handleComplete() {
    try {
      await changeComplete(item.id);
      setCompleted(prev => prev === 0 ? 1 : 0);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  }

  return (
    <View style={styles.todoItem}>
      <TouchableOpacity 
        activeOpacity={0.8}
        style={styles.todoContent}
        onPress={handleComplete}
      >
        <Text
          style={[
            styles.todoText, 
            completed === 1 && styles.completedText
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
      <Pressable 
        onPress={() => removeTodo(item.id)}
        style={styles.deleteButton}
      >
        <Trash2 color="red" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    padding: 8,
  },
});