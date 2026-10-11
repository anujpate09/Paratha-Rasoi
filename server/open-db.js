// Open the local database in DB Browser for SQLite: npm run db:open
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { DB_PATH } from './db.js'

const APP = [
  process.env.SQLITE_BROWSER,
  'C:/Program Files/DB Browser for SQLite/DB Browser for SQLite.exe',
  'C:/Program Files (x86)/DB Browser for SQLite/DB Browser for SQLite.exe',
].find((path) => path && existsSync(path))

if (!APP) {
  console.error('DB Browser for SQLite not found. Set SQLITE_BROWSER in .env to its .exe path.')
  process.exit(1)
}

spawn(APP, [DB_PATH], { detached: true, stdio: 'ignore' }).unref()
console.log(`Opening ${DB_PATH}`)
