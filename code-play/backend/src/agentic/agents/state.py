import os
from dataclasses import field
from typing import Annotated

from langchain.schema import AIMessage, BaseMessage, HumanMessage
from langchain.schema.messages import ToolMessage
from langgraph.graph import add_messages
from pydantic import BaseModel
from src.agentic.notepad import Notepad
from src.agentic.todo import TodoList
from src.workspace.project import Project


def merge_todo_list(left: dict | TodoList, right: dict | TodoList) -> TodoList:
    left = (
        TodoList.model_validate(left)
        if isinstance(left, dict)
        else left.model_copy(deep=True)
    )
    right = (
        TodoList.model_validate(right)
        if isinstance(right, dict)
        else right.model_copy(deep=True)
    )
    left_item_ids = [item.id for item in left.items]
    for right_item in right.items:
        if right_item.id in left_item_ids:
            left.items[left_item_ids.index(right_item.id)] = right_item
        else:
            left.items.append(right_item)
    left.id_counter = max(left.id_counter, right.id_counter)
    return left


def merge_notepad(left: dict | Notepad, right: dict | Notepad) -> Notepad:
    left = (
        Notepad.model_validate(left)
        if isinstance(left, dict)
        else left.model_copy(deep=True)
    )
    right = (
        Notepad.model_validate(right)
        if isinstance(right, dict)
        else right.model_copy(deep=True)
    )
    left_note_contents = [note.content for note in left.notes]
    for right_note in right.notes:
        if right_note.content not in left_note_contents:
            left.notes.append(right_note)
    return left


def merge_messages(
    left: list[BaseMessage], right: list[BaseMessage]
) -> list[BaseMessage]:
    messages = add_messages(left, right)
    last_assistant_message_index = -1
    for i, msg in enumerate(messages):
        if isinstance(msg, AIMessage):
            last_assistant_message_index = i
    if last_assistant_message_index == -1:
        return messages
    merged_messages = []
    for i, msg in enumerate(messages):
        if isinstance(msg, HumanMessage):
            merged_messages.append(msg)
        if isinstance(msg, AIMessage) or isinstance(msg, ToolMessage):
            if i >= last_assistant_message_index:
                merged_messages.append(msg)
    return merged_messages


class State(BaseModel):
    messages: Annotated[list[BaseMessage], merge_messages]
    remaining_steps: int = 25

    project: Project = field(
        default_factory=lambda: Project(
            root_dir=os.getenv("CODE_PLAY_PROJECT_ROOT_DIR", "./")
        )
    )
    todo_list: Annotated[TodoList, merge_todo_list] = field(
        default_factory=lambda: TodoList(items=[])
    )
    notepad: Annotated[Notepad, merge_notepad] = field(
        default_factory=lambda: Notepad(notes=[])
    )

    def to_markdown(self) -> str:
        return f"""# User's Question

{self.messages[3].content if len(self.messages) > 3 else "(none)"}

# Notepad

{self.notepad.to_markdown()}

# Final Answer

{self.messages[-1].content if len(self.messages) > 0 else "(none)"}
"""


def create_initial_state(
    project: Project,
) -> State:
    notepad = Notepad(notes=[])
    todo_list = TodoList(items=[])
    file_tree = f"# Project File Tree (max_depth=3)\n\n```\n{project.file_tree(path='.', max_depth=3)}\n```"
    return State(
        messages=[
            HumanMessage(content=file_tree, id="file_tree"),
            HumanMessage(content=notepad.to_markdown(), id="notepad"),
            HumanMessage(content=todo_list.to_markdown(), id="todo_list"),
        ],
        project=project,
        file_tree=file_tree,
        todo_list=todo_list,
        notepad=notepad,
        remaining_steps=200,
    )
