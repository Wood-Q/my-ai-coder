from langchain.schema import HumanMessage, SystemMessage

from src.agentic.agents.state import State
from src.llm.model.chat_model import create_chat_model
from src.llm.prompt.prompt_template import apply_prompt_template


def compress_state(state: State, thread_id: str) -> State:
    compressed_state = state.model_copy(deep=True)
    model = create_chat_model("mini")
    system_prompt = apply_prompt_template("compressor")
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=state.to_markdown()),
    ]
    response = model.invoke(messages, config={"configurable": {"thread_id": thread_id}})
    compressed_note = response.content
    compressed_state.todo_list.clear()
    compressed_state.notepad.clear()
    compressed_state.notepad.add_note(compressed_note)
    compressed_state.messages = [
        state.messages[0],  # File Tree
        HumanMessage(content=compressed_state.notepad.to_markdown()),  # Notepad
        HumanMessage(content=compressed_state.todo_list.to_markdown()),  # Todo List
    ]
    return compressed_state
