import { NextRequest, NextResponse } from 'next/server';
import { getVotes, upsertVote, deleteVote, deleteAllVotesForVoter, tallyVotes, type DungeonKey } from '../../store';

export async function GET(req: NextRequest) {
  const dungeon = req.nextUrl.searchParams.get('dungeon') as DungeonKey;
  if (!dungeon) return NextResponse.json({ error: 'dungeon required' }, { status: 400 });
  const votes = getVotes(dungeon);
  const tally = tallyVotes(dungeon);
  return NextResponse.json({ votes, tally });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { voterName, dungeon, slots } = body;
  if (!voterName || !dungeon || !Array.isArray(slots)) {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }
  upsertVote({ voterName, dungeon, slots, submittedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { voterName, dungeon, resetAll } = body;
  if (resetAll) {
    deleteAllVotesForVoter(voterName);
  } else {
    deleteVote(voterName, dungeon);
  }
  return NextResponse.json({ ok: true });
}
