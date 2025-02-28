import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

const fetchTodos = async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/todos?_limit=15"
  );
  return response.data;
};

export const useTodos = () => {
  return useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
};

export const useAddTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title) => ({ id: Date.now(), title, completed: false }),
    onSuccess: (newTodo) => {
      queryClient.setQueryData(["todos"], (oldTodos) => [
        newTodo,
        ...(oldTodos || []),
      ]);
      toast.success("Todo added successfully");
    },
  });
};

export const useToggleTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => id,
    onSuccess: (id) => {
      queryClient.setQueryData(["todos"], (oldTodos) =>
        oldTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => id,
    onSuccess: (id) => {
      queryClient.setQueryData(["todos"], (oldTodos) =>
        oldTodos.filter((todo) => todo.id !== id)
      );
      toast.success("Todo Deleted successfully");
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updatedTitle }) => ({ id, updatedTitle }),
    onSuccess: ({ id, updatedTitle }) => {
      queryClient.setQueryData(["todos"], (oldTodos) =>
        oldTodos.map((todo) =>
          todo.id === id ? { ...todo, title: updatedTitle } : todo
        )
      );
      toast.success("Edited successfully");
    },
  });
};
