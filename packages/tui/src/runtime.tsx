import path from "path"

export function abbreviateHome(input: string, home: string) {
  if (!home) return input
  const isPosix = input.startsWith("/")
  const relative = isPosix ? path.posix.relative(home, input) : path.relative(home, input)
  if (relative === "") return "~"
  if (
    relative === ".." ||
    relative.startsWith(".." + (isPosix ? "/" : path.sep)) ||
    (isPosix ? path.posix.isAbsolute(relative) : path.isAbsolute(relative))
  )
    return input
  return "~" + (isPosix ? "/" : path.sep) + relative
}
