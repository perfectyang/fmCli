import path from 'path'
import slash from 'slash'

export function getAbsolutePath(...paths: string[]) {
  const ret = path.resolve(...paths)
  return slash(ret)
}
