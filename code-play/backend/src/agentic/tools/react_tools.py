from typing import Annotated

from langchain.schema import HumanMessage
from langchain.schema.messages import ToolMessage
from langchain_core.tools import InjectedToolCallId, tool
from langgraph.prebuilt import InjectedState
from langgraph.types import Command

from src.agentic.agents import State


@tool(parse_docstring=True)
def react(
    thoughts: str,
    add_note: str,
    mark_todo_as_done: list[int],
    ready_to_answer: bool,
    add_todo: list[str],
    state: Annotated[State, InjectedState],
    tool_call_id: Annotated[str, InjectedToolCallId],
) -> Command:
    """
    Update the notepad and todo list every time you access a file or directory using tools.
    To avoid repeating the same action, you **should** mention the file name and line numbers in both the notepad and todo list.
    Double check before adding. Never add duplicated todo item or note.

    Args:
        thoughts: Your concise thoughts about the current state.
        add_note: The note to add to the notepad, including your findings and key insights. Every note should starts with a level-2 heading. **Never** add follow-up steps in the note.
        mark_todo_as_done: The ids of the todo items to be marked as done.
        ready_to_answer: Set to `true` if you're ready to generate the final answer.
        add_todo: The follow-up steps to be added to the todo list. **Never** include `#` in the item. Keep empty if you're ready to generate the final answer.
    """
    state.notepad.add_note(add_note)
    for id in mark_todo_as_done:
        state.todo_list.mark_todo_as_done(id)
    for item in add_todo:
        state.todo_list.add_todo(None, item)
    return Command(
        update={
            "todo_list": state.todo_list,
            "notepad": state.notepad,
            "messages": [
                ToolMessage("Done", tool_call_id=tool_call_id),
                HumanMessage(content=state.notepad.to_markdown(), id="notepad"),
                HumanMessage(content=state.todo_list.to_markdown(), id="todo_list"),
            ],
        }
    )
