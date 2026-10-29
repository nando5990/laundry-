import 'dotenv/config'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const url =
  process.env.DATABASE_URL ??
  'postgres://freshfold:freshfold@localhost:5432/freshfold'

const __dirname = dirname(fileURLToPath(import.meta.url))
const migrationsDir = join(__dirname, '../../drizzle')

async function main() {
  const sql = postgres(url, { max: 1 })
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const applied = await sql`
      SELECT 1 FROM schema_migrations WHERE id = ${file}
    `
    if (applied.length) {
      console.log(`skip ${file}`)
      continue
    }
    const body = readFileSync(join(migrationsDir, file), 'utf8')
    console.log(`apply ${file}`)
    await sql.begin(async (tx) => {
      await tx.unsafe(body)
      await tx`INSERT INTO schema_migrations (id) VALUES (${file})`
    })
  }

  await sql.end()
  console.log('migrations complete')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
