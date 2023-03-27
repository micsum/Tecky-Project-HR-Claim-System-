import fs from 'fs'
import path from 'path'
import jsonfile from 'jsonfile'
import { Response } from 'express'

fs.mkdirSync('res', { recursive: true })

export function loadArrayFromFile<T>(filename: string, defaultValue: T[]): T[] {
  if (fs.readdirSync('res').includes(filename)) {
    let file = path.join('res', filename)
    return jsonfile.readFileSync(file)
  }
  return defaultValue
}

export function saveArrayToFile<T>(
  filename: string,
  array: T[],
  res: Response,
  cb: () => void,
) {
  let file = path.join('res', filename)
  jsonfile.writeFile(file, array, err => {
    if (err) {
      res.status(507)
      res.end('failed to save data, error: ' + err)
    } else {
      cb()
    }
  })
}

export function toSingle<T>(maybeArray: T | T[]): T | undefined {
  if (Array.isArray(maybeArray)) {
    return maybeArray[0]
  }
  return maybeArray
}
