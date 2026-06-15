import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET(req: NextRequest) {
  const dungeon = req.nextUrl.searchParams.get('dungeon');
  if (!dungeon) return NextResponse.json({ error: 'dungeon required' }, { status: 400 });

  const { data, error } = await supabase
    .from('votes')
    .select('voter_name, slots')
    .eq('dungeon', dungeon);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Build tally
  const tally: Record<string, number> = {};
  for (const row of data ?? []) {
    for (const slot of (row.slots as string[])) {
      tally[slot] = (tally[slot] ?? 0) + 1;
    }
  }

  const votes = (data ?? []).map(r => ({ voterName: r.voter_name, slots: r.slots as string[] }));
  return NextResponse.json({ votes, tally });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { voterName, dungeon, slots } = body;
  if (!voterName || !dungeon || !Array.isArray(slots)) {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  // Upsert: update if exists, insert if not
  const { error } = await supabase
    .from('votes')
    .upsert(
      { voter_name: voterName, dungeon, slots, submitted_at: new Date().toISOString() },
      { onConflict: 'voter_name,dungeon' }
    );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { voterName, dungeon, resetAll } = body;

  if (resetAll) {
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('voter_name', voterName);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('voter_name', voterName)
      .eq('dungeon', dungeon);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
