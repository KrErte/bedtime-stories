import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

export interface Story {
  id: string;
  childId: string;
  title: string;
  content: string;
  contentWordCount: number;
  audioUrl: string | null;
  audioDurationSeconds: number | null;
  illustrationTheme: string;
  illustrationUrls: string[];
  storyTheme: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class StoryService {
  constructor(private api: ApiService) {}

  generate(childId: string, theme: string, voice?: string, language?: string) {
    return this.api.post<Story>('/stories/generate', { childId, theme, voice, language });
  }

  getStories(page = 0, size = 10, childId?: string) {
    return this.api.get<Page<Story>>('/stories', { page, size, childId });
  }

  getFavorites(page = 0, size = 10) {
    return this.api.get<Page<Story>>('/stories/favorites', { page, size });
  }

  getStory(id: string) {
    return this.api.get<Story>(`/stories/${id}`);
  }

  toggleFavorite(id: string) {
    return this.api.put<Story>(`/stories/${id}/favorite`);
  }

  deleteStory(id: string) {
    return this.api.delete(`/stories/${id}`);
  }

  getAudioUrl(id: string): string {
    return `${environment.apiUrl}/stories/${id}/audio`;
  }

  getPdfUrl(id: string): string {
    return `${environment.apiUrl}/stories/${id}/pdf`;
  }
}
