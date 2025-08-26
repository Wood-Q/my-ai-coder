def read_lines(
    path: str,
) -> list[str]:
    with open(path, "r") as f:
        lines = f.readlines()
        return lines
