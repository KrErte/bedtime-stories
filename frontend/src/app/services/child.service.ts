import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  interests: string[];
  favoriteAnimal: string;
}

@Injectable({ providedIn: 'root' })
export class ChildService {
  constructor(private api: ApiService) {}

  getChildren() {
    return this.api.get<Child[]>('/children');
  }

  createChild(child: Partial<Child>) {
    return this.api.post<Child>('/children', child);
  }

  updateChild(id: string, child: Partial<Child>) {
    return this.api.put<Child>(`/children/${id}`, child);
  }

  deleteChild(id: string) {
    return this.api.delete(`/children/${id}`);
  }
}
