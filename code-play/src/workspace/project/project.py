import os

from openai import BaseModel
from src.workspace.code import code_outline
from src.workspace.fs import (
    IgnoreRule,
    file_tree,
    ignore_rules_from_gitignore_files,
    read_lines,
)
from src.workspace.search import search_in_file, search_in_folders


class Project(BaseModel):
    root_dir: str

    _ignore_rules: list[IgnoreRule] | None = None

    def map_path(self, path: str) -> str:
        return os.path.join(self.root_dir, path)

    def rel_path(self, path: str) -> str:
        if path.startswith(self.root_dir):
            return path.replace(self.root_dir, ".")
        return path

    def file_tree(self, path: str = "./", max_depth: int = 5) -> str:
        joined_path = os.path.join(self.root_dir, path)
        return file_tree(joined_path, max_depth, self.ignore_rules())

    def file_outline(self, path: str) -> str:
        if path.endswith(".py"):
            return code_outline(self.map_path(path))
        else:
            raise ValueError(f"Unsupported code file extension: {path}")

    def search_in_folders(
        self,
        keyword: str,
        folders: list[str],
        file_extensions: list[str],
    ) -> str:
        results = search_in_folders(
            keyword,
            [self.map_path(folder) for folder in folders],
            file_extensions,
            self.ignore_rules(),
        )
        if len(results) == 0:
            return "No search result found"
        result_str = ""
        for result in results:
            for line in result.lines:
                result_str += f'File "{self.rel_path(result.file_path)}", line {line.line_number}: {line.context}\n'
            result_str += "\n"
        return result_str

    def search_in_file(self, keyword: str, file: str) -> str:
        result = search_in_file(keyword, self.map_path(file))
        if result is None:
            return "No search result found"
        result_str = ""
        for line in result.lines:
            result_str += f"Line {line.line_number}: {line.context}\n"
        return result_str

    def read_lines(
        self,
        path: str,
    ) -> list[str]:
        return read_lines(self.map_path(path))

    def ignore_rules(self) -> list[IgnoreRule]:
        if self._ignore_rules is None:
            self._ignore_rules = [ignore_rules_from_gitignore_files(self.root_dir)]
        return self._ignore_rules
