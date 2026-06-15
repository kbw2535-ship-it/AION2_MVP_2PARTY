import { members as initialMembers, type Member } from './data';

export type DungeonKey = 'purification' | 'chalice';

export interface Vote {
  voterName: string;
  dungeon: DungeonKey;
  slots: string[];
  submittedAt: string;
}

let memberStore: Member[] = JSON.parse(JSON.stringify(initialMembers));
const voteStore: Vote[] = [];

export function getMembers() { return memberStore; }

export function updateMember(id: number, patch: Partial<Member>) {
  memberStore = memberStore.map(m => m.id === id ? { ...m, ...patch } : m);
  return memberStore.find(m => m.id === id);
}

export function addMember(m: Omit<Member, 'id'>) {
  const id = Math.max(...memberStore.map(x => x.id), 0) + 1;
  const newMember = { ...m, id };
  memberStore.push(newMember);
  return newMember;
}

export function deleteMember(id: number) {
  const idx = memberStore.findIndex(m => m.id === id);
  if (idx >= 0) memberStore.splice(idx, 1);
}

export function getVotes(dungeon: DungeonKey) {
  return voteStore.filter(v => v.dungeon === dungeon);
}

export function getAllVoterNames() {
  const seen: Record<string, boolean> = {};
  return voteStore.map(v => v.voterName).filter(n => seen[n] ? false : (seen[n] = true));
}

export function upsertVote(vote: Vote) {
  const idx = voteStore.findIndex(
    v => v.voterName === vote.voterName && v.dungeon === vote.dungeon
  );
  if (idx >= 0) voteStore[idx] = vote;
  else voteStore.push(vote);
}

export function deleteVote(voterName: string, dungeon: DungeonKey) {
  const idx = voteStore.findIndex(v => v.voterName === voterName && v.dungeon === dungeon);
  if (idx >= 0) voteStore.splice(idx, 1);
}

export function deleteAllVotesForVoter(voterName: string) {
  const toRemove = voteStore.filter(v => v.voterName === voterName);
  toRemove.forEach(() => {
    const idx = voteStore.findIndex(v => v.voterName === voterName);
    if (idx >= 0) voteStore.splice(idx, 1);
  });
}

export function tallyVotes(dungeon: DungeonKey): Record<string, number> {
  const votes = getVotes(dungeon);
  const tally: Record<string, number> = {};
  for (const v of votes) {
    for (const slot of v.slots) {
      tally[slot] = (tally[slot] ?? 0) + 1;
    }
  }
  return tally;
}
