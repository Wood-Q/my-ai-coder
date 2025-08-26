import { Client } from "@langchain/langgraph-sdk";
import { v4 as uuid } from "uuid";

import { env } from "~/env";

const ASSISTANT_ID = "b43d04d2-cdbe-49af-bdb6-284c0adf3022";

const client = new Client({
  apiUrl: env.NEXT_PUBLIC_LANGGRAPH_API_URL ?? "http://localhost:2024",
});
void client.assistants.create({
  graphId: "researcher",
  assistantId: ASSISTANT_ID,
  ifExists: "do_nothing",
});

export async function runThread(question: string) {
  const thread = await client.threads.create({
    graphId: "researcher",
    threadId: uuid(),
  });
  window.location.hash = `${thread.thread_id}`;
  const streamResponse = client.runs.stream(thread.thread_id, ASSISTANT_ID, {
    streamMode: "values",
    input: {
      messages: [
        {
          content: "",
          additional_kwargs: {},
          response_metadata: {},
          type: "human",
          name: null,
          id: "file_tree",
        },
        {
          content:
            "# Notepad\n\n(empty)\n\n> Should call the `react()` tool immediately to add your first note.",
          additional_kwargs: {},
          response_metadata: {},
          type: "human",
          name: null,
          id: "notepad",
        },
        {
          content:
            "# Todo List\n\n(empty)\n\n> Should call the `react()` tool immediately to add Todo items as a your first plan.",
          additional_kwargs: {},
          response_metadata: {},
          type: "human",
          name: null,
          id: "todo_list",
        },
        {
          content: "# User's Question\n\n" + question,
          additional_kwargs: {},
          response_metadata: {},
          type: "human",
          name: null,
          id: "user_question",
        },
      ],
      remaining_steps: 200,
      project: {
        root_dir: "/Users/henry/workspaces/bytedance/deer-flow",
      },
      file_tree:
        "# Project File Tree (max_depth=3)\n\n```\ndeer-flow/\n├── .dockerignore\n├── .env.example\n├── .github/\n│   └── workflows/\n│       ├── lint.yaml\n│       └── unittest.yaml\n├── .gitignore\n├── .python-version\n├── CONTRIBUTING\n├── Dockerfile\n├── LICENSE\n├── Makefile\n├── README.md\n├── README_de.md\n├── README_es.md\n├── README_ja.md\n├── README_pt.md\n├── README_ru.md\n├── README_zh.md\n├── assets/\n│   └── architecture.png\n├── bootstrap.bat\n├── bootstrap.sh\n├── conf.yaml.example\n├── docker-compose.yml\n├── docs/\n│   ├── FAQ.md\n│   ├── configuration_guide.md\n│   └── mcp_integrations.md\n├── examples/\n│   ├── AI_adoption_in_healthcare.md\n│   ├── Cristiano_Ronaldo's_Performance_Highlights.md\n│   ├── Quantum_Computing_Impact_on_Cryptography.md\n│   ├── bitcoin_price_fluctuation.md\n│   ├── how_to_use_claude_deep_research.md\n│   ├── nanjing_tangbao.md\n│   ├── openai_sora_report.md\n│   ├── what_is_agent_to_agent_protocol.md\n│   ├── what_is_llm.md\n│   └── what_is_mcp.md\n├── langgraph.json\n├── main.py\n├── pre-commit\n├── pyproject.toml\n├── server.py\n├── src/\n│   ├── __init__.py\n│   ├── agents/\n│   │   ├── __init__.py\n│   │   └── agents.py\n│   ├── config/\n│   │   ├── __init__.py\n│   │   ├── agents.py\n│   │   ├── configuration.py\n│   │   ├── loader.py\n│   │   ├── questions.py\n│   │   ├── report_style.py\n│   │   └── tools.py\n│   ├── crawler/\n│   │   ├── __init__.py\n│   │   ├── article.py\n│   │   ├── crawler.py\n│   │   ├── jina_client.py\n│   │   └── readability_extractor.py\n│   ├── graph/\n│   │   ├── __init__.py\n│   │   ├── builder.py\n│   │   ├── nodes.py\n│   │   └── types.py\n│   ├── llms/\n│   │   ├── __init__.py\n│   │   └── llm.py\n│   ├── podcast/\n│   │   ├── graph/\n│   │   └── types.py\n│   ├── ppt/\n│   │   └── graph/\n│   ├── prompt_enhancer/\n│   │   ├── __init__.py\n│   │   └── graph/\n│   ├── prompts/\n│   │   ├── __init__.py\n│   │   ├── coder.md\n│   │   ├── coordinator.md\n│   │   ├── planner.md\n│   │   ├── planner_model.py\n│   │   ├── podcast/\n│   │   ├── ppt/\n│   │   ├── prompt_enhancer/\n│   │   ├── prose/\n│   │   ├── reporter.md\n│   │   ├── researcher.md\n│   │   └── template.py\n│   ├── prose/\n│   │   └── graph/\n│   ├── rag/\n│   │   ├── __init__.py\n│   │   ├── builder.py\n│   │   ├── ragflow.py\n│   │   └── retriever.py\n│   ├── server/\n│   │   ├── __init__.py\n│   │   ├── app.py\n│   │   ├── chat_request.py\n│   │   ├── config_request.py\n│   │   ├── mcp_request.py\n│   │   ├── mcp_utils.py\n│   │   └── rag_request.py\n│   ├── tools/\n│   │   ├── __init__.py\n│   │   ├── crawl.py\n│   │   ├── decorators.py\n│   │   ├── python_repl.py\n│   │   ├── retriever.py\n│   │   ├── search.py\n│   │   ├── tavily_search/\n│   │   └── tts.py\n│   ├── utils/\n│   │   ├── __init__.py\n│   │   └── json_utils.py\n│   └── workflow.py\n├── test_fix.py\n├── tests/\n│   ├── integration/\n│   │   ├── test_crawler.py\n│   │   ├── test_nodes.py\n│   │   ├── test_python_repl_tool.py\n│   │   ├── test_template.py\n│   │   └── test_tts.py\n│   ├── test_state.py\n│   └── unit/\n│       ├── config/\n│       ├── crawler/\n│       └── prompt_enhancer/\n├── uv.lock\n└── web/\n    ├── .dockerignore\n    ├── .env.example\n    ├── .gitignore\n    ├── .npmrc\n    ├── Dockerfile\n    ├── README.md\n    ├── components.json\n    ├── docker-compose.yml\n    ├── docs/\n    │   ├── implementation-summary.md\n    │   ├── interaction-flow-test.md\n    │   ├── streaming-improvements.md\n    │   ├── testing-thought-block.md\n    │   ├── thought-block-design-system.md\n    │   └── thought-block-feature.md\n    ├── eslint.config.js\n    ├── next.config.js\n    ├── package.json\n    ├── pnpm-lock.yaml\n    ├── postcss.config.js\n    ├── prettier.config.js\n    ├── public/\n    │   ├── images/\n    │   ├── mock/\n    │   └── replay/\n    ├── src/\n    │   ├── app/\n    │   ├── components/\n    │   ├── core/\n    │   ├── env.js\n    │   ├── hooks/\n    │   ├── lib/\n    │   ├── styles/\n    │   └── typings/\n    └── tsconfig.json\n```",
      todo_list: {
        items: [],
        id_counter: 0,
      },
      notepad: {
        notes: [],
      },
    },
  });
  return streamResponse;
}
