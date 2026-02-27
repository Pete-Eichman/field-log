import * as Crypto from 'expo-crypto';
import { getAllNotes, insertNote } from './db';

// Only runs if the database is empty — safe to call on every app start
export async function seedIfEmpty(): Promise<void> {
  const existing = await getAllNotes();
  if (existing.length > 0) return;

  const notes = [
    {
      id: Crypto.randomUUID(),
      title: 'Foundation crack — east wall',
      body: 'Horizontal crack running approximately 4 feet along the east foundation wall, roughly 18 inches below grade. Width appears to be 3–4mm at widest point. Efflorescence visible along lower edge, suggesting water infiltration over time. Recommend structural engineer review before next season.',
      category: 'issue' as const,
      photos: [],
      latitude: 41.8781,
      longitude: -87.6298,
      address: 'E Wacker Dr, Chicago, IL',
      createdAt: daysAgo(6),
      updatedAt: daysAgo(6),
    },
    {
      id: Crypto.randomUUID(),
      title: 'Roof drainage — north section',
      body: 'Two of the four roof drains on the north section are partially blocked with debris. Standing water pooling near HVAC curb after yesterday\'s rain. Gutters on the north face are pulling away from fascia board at the northeast corner. Minor repairs should address this before winter.',
      category: 'inspection' as const,
      photos: [],
      latitude: 41.8827,
      longitude: -87.6233,
      address: 'N Michigan Ave, Chicago, IL',
      createdAt: daysAgo(3),
      updatedAt: daysAgo(2),
    },
    {
      id: Crypto.randomUUID(),
      title: 'Standing water near loading dock',
      body: 'Consistent pooling on the west side of the loading dock after any significant rain. Grade appears to slope toward the building rather than away. Could be contributing to the moisture issues noted in the basement last quarter. Worth addressing with regrading or a french drain.',
      category: 'observation' as const,
      photos: [],
      latitude: 41.8757,
      longitude: -87.6243,
      address: 'S Canal St, Chicago, IL',
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
    {
      id: Crypto.randomUUID(),
      title: 'Site walkthrough — general condition',
      body: 'Overall site in reasonable shape. Parking lot has two potholes developing near the south entrance, flagged for asphalt crew. Exterior lighting on the east side is out — three fixtures total. Landscaping overgrown along the fence line, obstructing one of the security cameras. No urgent safety issues observed.',
      category: 'general' as const,
      photos: [],
      latitude: 41.8795,
      longitude: -87.6322,
      address: 'W Randolph St, Chicago, IL',
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0),
    },
  ];

  for (const note of notes) {
    await insertNote(note);
  }
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}
