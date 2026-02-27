import * as SQLite from 'expo-sqlite';

// FieldNote is the central data type for the whole app
export type FieldNote = {
  id: string;
  title: string;
  body: string;
  category: 'inspection' | 'observation' | 'issue' | 'general';
  photos: string[]; // local file URIs
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  createdAt: string; // ISO timestamp
  updatedAt: string;
};

const db = SQLite.openDatabaseSync('field_log.db');

export function initDatabase(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS field_notes (
      id          TEXT PRIMARY KEY NOT NULL,
      title       TEXT NOT NULL,
      body        TEXT NOT NULL DEFAULT '',
      category    TEXT NOT NULL DEFAULT 'general',
      photos      TEXT NOT NULL DEFAULT '[]',
      latitude    REAL,
      longitude   REAL,
      address     TEXT,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );
  `);
}

// SQLite rows use snake_case; map them to our camelCase type here
// so nothing outside this file has to think about the DB schema
function rowToNote(row: Record<string, unknown>): FieldNote {
  return {
    id: row.id as string,
    title: row.title as string,
    body: row.body as string,
    category: row.category as FieldNote['category'],
    photos: JSON.parse(row.photos as string),
    latitude: row.latitude as number | null,
    longitude: row.longitude as number | null,
    address: row.address as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getAllNotes(): Promise<FieldNote[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM field_notes ORDER BY created_at DESC'
  );
  return rows.map(rowToNote);
}

export async function getNoteById(id: string): Promise<FieldNote | null> {
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM field_notes WHERE id = ?',
    [id]
  );
  return row ? rowToNote(row) : null;
}

export async function insertNote(note: FieldNote): Promise<void> {
  await db.runAsync(
    `INSERT INTO field_notes
      (id, title, body, category, photos, latitude, longitude, address, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      note.id,
      note.title,
      note.body,
      note.category,
      JSON.stringify(note.photos),
      note.latitude,
      note.longitude,
      note.address,
      note.createdAt,
      note.updatedAt,
    ]
  );
}

export async function updateNote(note: FieldNote): Promise<void> {
  await db.runAsync(
    `UPDATE field_notes
     SET title = ?, body = ?, category = ?, photos = ?,
         latitude = ?, longitude = ?, address = ?, updated_at = ?
     WHERE id = ?`,
    [
      note.title,
      note.body,
      note.category,
      JSON.stringify(note.photos),
      note.latitude,
      note.longitude,
      note.address,
      note.updatedAt,
      note.id,
    ]
  );
}

export async function deleteNote(id: string): Promise<void> {
  await db.runAsync('DELETE FROM field_notes WHERE id = ?', [id]);
}
