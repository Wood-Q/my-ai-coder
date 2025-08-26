from langgraph.prebuilt import create_react_agent
from src.agentic.agents.state import State
from src.agentic.tools import (
    file_outline,
    file_tree,
    react,
    read_lines,
    search_in_file,
    search_in_folders,
)
from src.llm.model import create_chat_model
from src.llm.prompt import apply_prompt_template


def pre_model_hook(state: State):
    if state.messages[0].id == "file_tree":
        state.messages[0].content = (
            "# Project File Tree (max_depth=3)\n\n```\n"
            + state.project.file_tree(path=".", max_depth=3)
            + "\n```"
        )
    return {"llm_input_messages": state.messages}


def create_researcher():
    chat_model = create_chat_model("pro")
    prompt = apply_prompt_template("researcher")
    tools = (
        file_outline,
        file_tree,
        read_lines,
        search_in_file,
        search_in_folders,
        react,
    )
    agent = create_react_agent(
        model=chat_model,
        tools=tools,
        prompt=prompt,
        state_schema=State,
        pre_model_hook=pre_model_hook,
        name="researcher",
    )
    return agent


researcher = create_researcher()
