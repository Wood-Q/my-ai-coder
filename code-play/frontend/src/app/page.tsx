"use client";

import { useCallback, useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { Textarea } from "~/components/ui/textarea";
import { runThread } from "~/core/api";
import type { State } from "~/core/types";
import { deepClone } from "~/core/utils/deep-clone";
import { cn } from "~/lib/utils";

import { MessageList } from "./components/message-list";
import { TodoList } from "./components/todo-list";

export default function HomePage() {
  const [state, setState] = useState<State | null>(null);
  const [input, setInput] = useState("");
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const response = await runThread(input);
      setInput("");
      setState(null);
      for await (const chunk of response) {
        if (chunk.event === "values") {
          const newState = chunk.data as unknown as State;
          setState(deepClone(newState));
        }
      }
    },
    [input],
  );

  return (
    <div className="flex h-screen w-screen gap-4">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          className={cn("flex h-full flex-col gap-4 p-4")}
          defaultSize={50}
        >
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <Input
              placeholder="Ask me anything about the project"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit">Just Ask</Button>
          </form>
          <div className="min-h-0 grow">
            {state?.messages ? (
              <div className="flex size-full flex-col gap-2">
                <div className="font-md">Messages</div>
                <MessageList
                  className="min-h-0 grow"
                  messages={state.messages}
                />
              </div>
            ) : null}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="flex flex-col">
          <header className="font-md border-b p-4 pb-2">
            State of the Running Thread
          </header>
          {state ? (
            <main className="flex h-full min-w-0 grow flex-col">
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel
                  className="flex size-full flex-col"
                  defaultSize={66}
                >
                  <div className="font-md p-4 pb-2">Notepad</div>
                  <div className="min-h-0 grow p-4 pt-0">
                    <Textarea
                      className="size-full resize-none"
                      readOnly
                      value={
                        state?.notepad.notes
                          .map((note) => note.content)
                          .join("\n\n") ?? ""
                      }
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel className="flex size-full flex-col">
                  <div className="font-md p-4 pb-2">Todo List</div>
                  <div className="min-h-0 grow p-4 pt-0">
                    <TodoList
                      className="size-full"
                      items={state?.todo_list.items ?? []}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </main>
          ) : null}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
