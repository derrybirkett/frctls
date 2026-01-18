import Link from 'next/link';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getCurrentUser } from '../lib/auth';

async function readMissionExcerpt(): Promise<string | null> {
  try {
    const workspaceRoot = process.cwd();
    const candidatePaths = [
      path.resolve(workspaceRoot, 'docs', 'mission.md'),
      path.resolve(workspaceRoot, 'mission', 'mission.md'),
    ];

    let raw: string | null = null;
    for (const candidatePath of candidatePaths) {
      try {
        raw = await readFile(candidatePath, 'utf8');
        break;
      } catch {
        // Keep trying other paths.
      }
    }

    if (!raw) return null;

    // Very small heuristic: first non-empty, non-heading paragraph.
    const lines = raw.split(/\r?\n/);
    const paragraphs: string[] = [];
    let current: string[] = [];

    const flush = () => {
      const text = current.join(' ').trim();
      current = [];
      if (text) paragraphs.push(text);
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        flush();
        continue;
      }
      if (trimmed.startsWith('#')) {
        flush();
        continue;
      }
      current.push(trimmed);
    }
    flush();

    return paragraphs[0] ?? null;
  } catch {
    return null;
  }
}

export default async function LandingPage() {
  const user = getCurrentUser();
  const mission = await readMissionExcerpt();

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1 style={{ fontSize: 32, margin: 0 }}>Ship the mission, fast.</h1>
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        {mission ?? (
          <>
            This is the minimal marketing landing page. Define your mission in{' '}
            <code>docs/mission.md</code>.
          </>
        )}
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {user ? <Link href="/app">Go to app</Link> : <Link href="/login">Log in</Link>}
      </div>
    </div>
  );
}
