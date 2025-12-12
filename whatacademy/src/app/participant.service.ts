import { Injectable } from '@angular/core';

export interface Participant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private storageKey = 'participants';
  private altKey = 'whatacademy_participants';

  private readKey(key: string): Participant[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as Participant[]) : [];
    } catch {
      return [];
    }
  }

  private writeKeys(items: Participant[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      localStorage.setItem(this.altKey, JSON.stringify(items));
    } catch {}
  }

  private mergeLists(): Participant[] {
    const a = this.readKey(this.storageKey);
    const b = this.readKey(this.altKey);
    const map = new Map<string, Participant>();

    [...a, ...b].forEach((p) => {
      if (p.id) map.set(p.id, p);
      else {
        const key = `${p.name}:${p.email || ''}:${p.phone || ''}`;
        map.set(key, { ...p, id: p.id || 'id-' + this.hashString(key) });
      }
    });

    return Array.from(map.values());
  }

  private hashString(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h).toString();
  }

  getAll(): Participant[] {
    return this.mergeLists();
  }

  add(p: Omit<Participant, 'id'>) {
    const items = this.getAll();
    const exists = items.find(
      (x) =>
        (x.email && p.email && x.email === p.email) ||
        (x.name && p.name && x.name === p.name && x.phone === p.phone)
    );
    if (exists) {
      return exists;
    }
    const participant: Participant = { id: Date.now().toString(), ...p };
    items.push(participant);
    this.writeKeys(items);
    return participant;
  }

  remove(id: string) {
    let items = this.getAll();
    items = items.filter((i) => i.id !== id);
    this.writeKeys(items);
  }

  getById(id: string): Participant | undefined {
    return this.getAll().find((i) => i.id === id);
  }

  update(id: string, p: Partial<Omit<Participant, 'id'>>) {
    const items = this.getAll();
    const index = items.findIndex((i) => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...p };
      this.writeKeys(items);
    }
  }

  clearAll() {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.altKey);
    } catch {}
  }
}
