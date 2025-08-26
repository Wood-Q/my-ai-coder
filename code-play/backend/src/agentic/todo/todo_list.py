from pydantic import BaseModel


class TodoItem(BaseModel):
    id: int
    """The id of the todo item."""

    title: str
    """The title of the todo item."""

    is_done: bool = False
    """Whether the todo item is done."""


class TodoList(BaseModel):
    items: list[TodoItem] = []

    id_counter: int = 0

    def next_id(self) -> int:
        self.id_counter += 1
        return self.id_counter

    def add_todo(self, id: int | None, title: str):
        item = TodoItem(
            id=id or self.next_id(),
            title=title,
        )
        self.items.append(item)

    def clear(self):
        self.items = []
        self.id_counter = 0

    def remove_todo(self, id: int):
        for item in self.items:
            if item.id == id:
                self.items.remove(item)
                break

    def mark_todo_as_done(self, id: int):
        for item in self.items:
            if item.id == id:
                item.is_done = True
                break

    def to_markdown(self) -> str:
        content = ""
        if len(self.items) == 0:
            content = "(empty)\n\n> Should call the `react()` tool immediately to add Todo items as a your first plan."
        else:
            for item in self.items:
                content += f"- [{'x' if item.is_done else ' '}] #{item.id}: {item.title.replace('\n', ' | ')}\n"
        return f"# Todo List\n\n{content.strip()}"


def create_todo_list() -> TodoList:
    return TodoList(items=[])
