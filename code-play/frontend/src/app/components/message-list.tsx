import { type AIMessage, type Message } from "@langchain/langgraph-sdk";
import { Bot, PenTool, User } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function MessageList({
  className,
  messages,
}: {
  messages: Message[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-3 overflow-y-auto", className)}>
      {messages.map((message, index) => (
        <li key={message.id}>
          <MessageItem messageIndex={index} message={message} />
        </li>
      ))}
    </ul>
  );
}

export function MessageItem({
  messageIndex,
  message,
}: {
  messageIndex: number;
  message: Message;
}) {
  let content: string;
  if (typeof message.content === "string") {
    content = message.content;
  } else {
    content = JSON.stringify(message.content);
  }

  return (
    <div className="border-input dark:bg-input/30 flex min-h-16 w-full resize-none flex-col rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
      <header className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">
          # {messageIndex + 1}
        </span>
        <Button
          className="gap-1 !pr-2 !pl-1 dark:shadow"
          variant="secondary"
          size="xs"
        >
          {message.type === "human" ? (
            <User className="size-3" />
          ) : message.type === "ai" ? (
            <Bot className="size-3" />
          ) : (
            <PenTool className="size-3" />
          )}
          {message.type === "human"
            ? "User"
            : message.type === "ai"
              ? "Assistant"
              : "Tool"}
        </Button>
      </header>
      <main className="pt-2">
        {content && (
          <textarea
            className={cn(
              "field-sizing-content h-fit w-full resize-none overflow-auto font-mono text-sm",
              !(message.type === "ai" && message.tool_calls?.length === 0) &&
                "max-h-[80px]",
            )}
            readOnly
            value={content}
          />
        )}
        {message.type === "ai" &&
          message.tool_calls &&
          message.tool_calls.length > 0 && (
            <ToolCallList toolCalls={message.tool_calls} />
          )}
      </main>
    </div>
  );
}

export function ToolCallList({
  toolCalls,
}: {
  toolCalls: AIMessage["tool_calls"];
}) {
  return (
    <ul className="flex flex-col gap-2">
      {toolCalls?.map((toolCall) => (
        <li
          key={toolCall.id}
          className="font-mono text-sm whitespace-break-spaces"
        >
          <span className="text-[#9bc6fa]">{toolCall.name}</span>
          <span>{JSON.stringify(toolCall.args, null, 2)}</span>
        </li>
      ))}
    </ul>
  );
}
