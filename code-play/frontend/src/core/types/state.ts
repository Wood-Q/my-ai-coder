import { type Message } from "@langchain/langgraph-sdk";

export interface Note {
  content: string;
}

export interface TodoItem {
  title: string;
  is_done: boolean;
}

export interface State {
  notepad: {
    notes: Note[];
  };
  todo_list: {
    items: TodoItem[];
  };
  messages: Message[];
}
