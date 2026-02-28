// jest.mock is hoisted above variable declarations by Babel, so all mock
// setup must live inside the factory. Access mocks via jest.requireMock.
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn().mockReturnValue({
    execSync: jest.fn(),
    runAsync: jest.fn().mockResolvedValue(undefined),
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
  }),
}));

import { FieldNote, getAllNotes, getNoteById, insertNote, updateNote, deleteNote } from '../db/db';

// Grab references to the mock functions after the module is loaded
const SQLite = jest.requireMock('expo-sqlite');
const mockDb = SQLite.openDatabaseSync();
const mockRunAsync = mockDb.runAsync as jest.Mock;
const mockGetAllAsync = mockDb.getAllAsync as jest.Mock;
const mockGetFirstAsync = mockDb.getFirstAsync as jest.Mock;

const mockNote: FieldNote = {
  id: 'test-id-1',
  title: 'Foundation crack',
  body: 'Horizontal crack on east wall',
  category: 'issue',
  photos: ['file://photo1.jpg'],
  latitude: 41.8781,
  longitude: -87.6298,
  address: 'E Wacker Dr, Chicago, IL',
  createdAt: '2025-01-01T10:00:00.000Z',
  updatedAt: '2025-01-01T10:00:00.000Z',
};

// Mirrors the snake_case schema that rowToNote reads from
function toRow(note: FieldNote) {
  return {
    id: note.id,
    title: note.title,
    body: note.body,
    category: note.category,
    photos: JSON.stringify(note.photos),
    latitude: note.latitude,
    longitude: note.longitude,
    address: note.address,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getAllNotes', () => {
  it('returns an empty array when there are no notes', async () => {
    mockGetAllAsync.mockResolvedValue([]);
    const result = await getAllNotes();
    expect(result).toEqual([]);
  });

  it('maps DB rows to FieldNote objects', async () => {
    mockGetAllAsync.mockResolvedValue([toRow(mockNote)]);
    const result = await getAllNotes();
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockNote);
  });

  it('deserializes the photos JSON array', async () => {
    mockGetAllAsync.mockResolvedValue([toRow(mockNote)]);
    const [note] = await getAllNotes();
    expect(Array.isArray(note.photos)).toBe(true);
    expect(note.photos[0]).toBe('file://photo1.jpg');
  });
});

describe('getNoteById', () => {
  it('returns null when no note is found', async () => {
    mockGetFirstAsync.mockResolvedValue(undefined);
    const result = await getNoteById('nonexistent');
    expect(result).toBeNull();
  });

  it('returns the mapped note when found', async () => {
    mockGetFirstAsync.mockResolvedValue(toRow(mockNote));
    const result = await getNoteById(mockNote.id);
    expect(result).toEqual(mockNote);
  });
});

describe('insertNote', () => {
  it('calls runAsync with the correct number of params', async () => {
    await insertNote(mockNote);
    expect(mockRunAsync).toHaveBeenCalledTimes(1);
    const [sql, params] = mockRunAsync.mock.calls[0];
    expect(sql).toContain('INSERT INTO field_notes');
    expect(params).toHaveLength(10);
  });

  it('serializes the photos array to JSON', async () => {
    await insertNote(mockNote);
    const [, params] = mockRunAsync.mock.calls[0];
    const photosParam = params[4]; // photos is the 5th column
    expect(photosParam).toBe(JSON.stringify(mockNote.photos));
  });
});

describe('updateNote', () => {
  it('passes the note id as the final param', async () => {
    await updateNote(mockNote);
    const [sql, params] = mockRunAsync.mock.calls[0];
    expect(sql).toContain('UPDATE field_notes');
    expect(params[params.length - 1]).toBe(mockNote.id);
  });
});

describe('deleteNote', () => {
  it('calls runAsync with the correct id', async () => {
    await deleteNote('test-id-1');
    expect(mockRunAsync).toHaveBeenCalledWith(
      'DELETE FROM field_notes WHERE id = ?',
      ['test-id-1']
    );
  });
});
