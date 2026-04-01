import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Story, StoryService, Page } from '../../services/story.service';
import { Child, ChildService } from '../../services/child.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Story Library</h1>
        <a routerLink="/app/new-story" class="btn-primary text-sm">+ New Story</a>
      </div>

      <!-- Filter by child -->
      @if (children().length > 1) {
        <div class="flex gap-2 mb-6 flex-wrap">
          <button (click)="filterChild(null)" [class]="!selectedChildId() ? 'btn-primary text-xs' : 'btn-secondary text-xs'">All</button>
          @for (child of children(); track child.id) {
            <button (click)="filterChild(child.id)" [class]="selectedChildId() === child.id ? 'btn-primary text-xs' : 'btn-secondary text-xs'">{{ child.name }}</button>
          }
        </div>
      }

      @if (stories().length === 0 && !loading()) {
        <div class="card text-center py-16">
          <span class="text-5xl block mb-4">&#128218;</span>
          <p class="text-navy-300 mb-4">No stories yet. Create your first bedtime story!</p>
          <a routerLink="/app/new-story" class="btn-primary">Create Story</a>
        </div>
      }

      <div class="grid gap-4 md:grid-cols-2">
        @for (story of stories(); track story.id) {
          <a [routerLink]="['/app/story', story.id]" class="card hover:border-story-purple/50 transition-all cursor-pointer group">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-serif font-semibold text-lg group-hover:text-purple-300 transition-colors line-clamp-2">{{ story.title }}</h3>
              @if (story.isFavorite) { <span class="text-red-400">&#9829;</span> }
            </div>
            <p class="text-navy-400 text-sm line-clamp-2 mb-3">{{ story.content.substring(0, 150) }}...</p>
            <div class="flex items-center gap-3 text-xs text-navy-500">
              <span>{{ story.contentWordCount }} words</span>
              <span>{{ story.storyTheme }}</span>
              @if (story.audioUrl) { <span>&#127925; Audio</span> }
              <span class="ml-auto">{{ story.createdAt | date:'mediumDate' }}</span>
            </div>
          </a>
        }
      </div>

      @if (totalPages() > 1) {
        <div class="flex justify-center gap-2 mt-8">
          @for (p of pageNumbers(); track p) {
            <button (click)="loadPage(p)" [class]="p === currentPage() ? 'btn-primary text-sm' : 'btn-secondary text-sm'">{{ p + 1 }}</button>
          }
        </div>
      }
    </div>
  `,
})
export class LibraryComponent implements OnInit {
  stories = signal<Story[]>([]);
  children = signal<Child[]>([]);
  loading = signal(true);
  currentPage = signal(0);
  totalPages = signal(0);
  selectedChildId = signal<string | null>(null);
  pageNumbers = signal<number[]>([]);

  constructor(private storyService: StoryService, private childService: ChildService) {}

  ngOnInit() {
    this.childService.getChildren().subscribe(c => this.children.set(c));
    this.loadPage(0);
  }

  loadPage(page: number) {
    this.loading.set(true);
    this.storyService.getStories(page, 10, this.selectedChildId() || undefined).subscribe(res => {
      this.stories.set(res.content);
      this.currentPage.set(res.number);
      this.totalPages.set(res.totalPages);
      this.pageNumbers.set(Array.from({ length: res.totalPages }, (_, i) => i));
      this.loading.set(false);
    });
  }

  filterChild(childId: string | null) {
    this.selectedChildId.set(childId);
    this.loadPage(0);
  }
}
