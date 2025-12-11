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

  private read(): Participant[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) as Participant[] : [];
    } catch {
      return [];
    }
  }

  private write(items: Participant[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getAll(): Participant[] {
    return this.read();
  }

  add(p: Omit<Participant, 'id'>) {
    const items = this.read();
    const participant: Participant = { id: Date.now().toString(), ...p };
    items.push(participant);
    this.write(items);
    return participant;
  }

  remove(id: string) {
    const items = this.read().filter((i) => i.id !== id);
    this.write(items);
  }

  getById(id: string): Participant | undefined {
    return this.read().find((i) => i.id === id);
  }

  update(id: string, p: Omit<Participant, 'id'>) {
    const items = this.read();
    const index = items.findIndex((i) => i.id === id);
    if (index !== -1) {
      items[index] = { id, ...p };
      this.write(items);
    }
  }

  clearAll() {
    localStorage.removeItem(this.storageKey);
  }
}
