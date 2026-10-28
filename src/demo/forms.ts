export interface DemoFormRecord {
  id: string
  type: 'contact' | 'commercial'
  submittedAt: string
  payload: Record<string, string>
}

const STORAGE_KEY = 'freshfold-demo-forms'

function readStore(): DemoFormRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as DemoFormRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStore(records: DemoFormRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function saveDemoForm(
  type: DemoFormRecord['type'],
  payload: Record<string, string>,
): DemoFormRecord {
  const record: DemoFormRecord = {
    id: crypto.randomUUID(),
    type,
    submittedAt: new Date().toISOString(),
    payload,
  }
  const next = [record, ...readStore()].slice(0, 20)
  writeStore(next)
  return record
}

export function listDemoForms(): DemoFormRecord[] {
  return readStore()
}
