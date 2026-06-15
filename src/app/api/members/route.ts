import { NextRequest, NextResponse } from 'next/server';
import { getMembers, updateMember, addMember, deleteMember } from '../../store';

export async function GET() {
  return NextResponse.json(getMembers());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const member = addMember(body);
  return NextResponse.json(member);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...patch } = body;
  const updated = updateMember(id, patch);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  deleteMember(body.id);
  return NextResponse.json({ ok: true });
}
