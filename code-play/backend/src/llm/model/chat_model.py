import os
from typing import Literal

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

from src.llm_space.tracing import LocalTracer

load_dotenv()
__provider: Literal["openai", "doubao"] = os.getenv(
    "CODE_PLAY_MODEL_PROVIDER", "openai"
)
__tracer = (
    LocalTracer("./.threads")
    if os.getenv("CODE_PLAY_TRACING", "false") == "true"
    else None
)


def create_doubao_model(model: str) -> ChatOpenAI:
    return ChatOpenAI(
        model=model,
        base_url="https://ark-cn-beijing.bytedance.net/api/v3",
        api_key=os.getenv("DOUBAO_API_KEY"),
        temperature=0,
        top_p=0,
        max_retries=3,
    )


def create_openai_model(model: str) -> ChatOpenAI:
    return ChatOpenAI(
        model=model,
        base_url="https://search.bytedance.net/gpt/openapi/online/v2/crawl/openai/deployments",
        default_query={"api-version": "2023-03-15-preview"},
        default_headers={"api-key": os.getenv("GPT_OPEN_API_KEY"), "caller": "sxy"},
        temperature=0,
        top_p=0,
        max_retries=3,
    )


def create_chat_model(level: Literal["pro", "mini"]) -> ChatOpenAI:
    global __provider, __tracer
    model: ChatOpenAI | None = None
    if __provider == "openai":
        model_name = (
            "gpt-4.1-mini-2025-04-14" if level == "mini" else "gpt-4.1-2025-04-14"
        )
        model = create_openai_model(model_name)
    elif __provider == "doubao":
        model_name = (
            "doubao-seed-1-6-flash" if level == "pro" else "doubao-1-5-pro-32k-250115"
        )
        model = create_doubao_model(model_name)
    if __tracer:
        model.callbacks = [__tracer]
    return model


if __name__ == "__main__":
    chat_model = create_chat_model("pro")
    print(chat_model.invoke("你好").content)
