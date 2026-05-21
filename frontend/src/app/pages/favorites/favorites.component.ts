import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Story, StoryService } from '../../services/story.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-8">Favorite Stories</h1>
      @if (stories().length === 0 && !loading()) {
        <div class="card text-center py-16">
          <span class="text-5xl block mb-4">&#9829;</span>
          <p class="text-navy-300">No favorites yet. Tap the heart on a story to add it here.</p>
        </div>
      }
      <div class="grid gap-4 md:grid-cols-2">
        @for (story of stories(); track story.id) {
          <a [routerLink]="['/app/story', story.id]" class="card hover:border-story-purple/50 transition-all cursor-pointer group">
            <h3 class="font-serif font-semibold text-lg group-hover:text-purple-300 transition-colors mb-2">{{ story.title }}</h3>
            <p class="text-navy-400 text-sm line-clamp-2 mb-3">{{ story.content.substring(0, 150) }}...</p>
            <div class="flex items-center gap-3 text-xs text-navy-500">
              <span>{{ story.storyTheme }}</span>
              <span class="ml-auto">{{ story.createdAt | date:'mediumDate' }}</span>
            </div>
          </a>
        }
      </div>
    </div>
  `,
})
export class FavoritesComponent implements OnInit {
  stories = signal<Story[]>([]);
  loading = signal(true);

  constructor(private storyService: StoryService) {}

  ngOnInit() {
    this.storyService.getFavorites().subscribe(res => {
      this.stories.set(res.content);
      this.loading.set(false);
    });
  }
}
