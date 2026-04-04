import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Story, StoryService } from '../../services/story.service';
import { AuthService } from '../../services/auth.service';
import { NativeService } from '../../services/native.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-story-reader',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto">
      @if (loading()) {
        <div class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-story-purple border-t-transparent"></div>
        </div>
      } @else if (story()) {
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent leading-relaxed">
            {{ story()!.title }}
          </h1>
          <p class="text-navy-400 text-sm mt-2">{{ story()!.storyTheme }} story</p>
        </div>

        <!-- Story Content with Illustrations -->
        <div class="space-y-8 mb-12">
          @for (block of storyBlocks(); track $index) {
            @if (block.type === 'image') {
              <div class="rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20">
                <div class="bg-navy-800 aspect-video flex items-center justify-center text-navy-500">
                  <div class="text-center">
                    <span class="text-4xl block mb-2">&#127749;</span>
                    <span class="text-sm">{{ block.content }}</span>
                  </div>
                </div>
              </div>
            } @else {
              <p class="story-text text-navy-100 leading-[1.9]">{{ block.content }}</p>
            }
          }
        </div>

        <!-- Audio Player -->
        @if (story()!.audioUrl) {
          <div class="card mb-8">
            <div class="flex items-center gap-4">
              <button (click)="togglePlay()" class="w-12 h-12 rounded-full bg-story-purple flex items-center justify-center hover:bg-purple-600 transition-colors flex-shrink-0">
                <span class="text-lg">{{ playing() ? '&#9646;&#9646;' : '&#9654;' }}</span>
              </button>
              <div class="flex-1">
                <input #seekBar type="range" min="0" [max]="duration()" [value]="currentTime()"
                  (input)="seek($event)" class="w-full h-1 bg-navy-600 rounded-lg appearance-none cursor-pointer accent-story-purple">
                <div class="flex justify-between text-xs text-navy-400 mt-1">
                  <span>{{ formatTime(currentTime()) }}</span>
                  <span>{{ formatTime(duration()) }}</span>
                </div>
              </div>
            </div>
            <audio #audioPlayer [src]="audioBlobUrl()" (timeupdate)="onTimeUpdate()" (loadedmetadata)="onMetadataLoaded()" (ended)="playing.set(false)"></audio>
          </div>
        }

        <!-- Actions -->
        <div class="flex items-center justify-center gap-4 pb-8">
          <button (click)="toggleFavorite()" class="btn-secondary flex items-center gap-2">
            <span>{{ story()!.isFavorite ? '&#9829;' : '&#9825;' }}</span>
            {{ story()!.isFavorite ? 'Favorited' : 'Favorite' }}
          </button>
          <button (click)="share()" class="btn-secondary flex items-center gap-2">
            <span>&#128228;</span> Share
          </button>
          <a [href]="storyService.getPdfUrl(story()!.id)" target="_blank" class="btn-secondary flex items-center gap-2">
            <span>&#128196;</span> PDF
          </a>
          <a routerLink="/app/library" class="btn-secondary flex items-center gap-2">
            <span>&#8592;</span> Library
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px; height: 12px;
      border-radius: 50%;
      background: #7c3aed;
      cursor: pointer;
    }
  `],
})
export class StoryReaderComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer') audioRef!: ElementRef<HTMLAudioElement>;

  story = signal<Story | null>(null);
  loading = signal(true);
  playing = signal(false);
  currentTime = signal(0);
  duration = signal(0);
  storyBlocks = signal<{type: string; content: string}[]>([]);
  audioBlobUrl = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    public storyService: StoryService,
    private auth: AuthService,
    private router: Router,
    private native: NativeService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.storyService.getStory(id).subscribe({
      next: (story) => {
        this.story.set(story);
        this.buildBlocks(story);
        this.loading.set(false);
        if (story.audioUrl) {
          this.loadAudio(story.audioUrl);
        }
      },
      error: () => this.router.navigate(['/app/library']),
    });
  }

  ngOnDestroy() {
    if (this.audioRef?.nativeElement) {
      this.audioRef.nativeElement.pause();
    }
    const url = this.audioBlobUrl();
    if (url) URL.revokeObjectURL(url);
  }

  private loadAudio(audioUrl: string) {
    this.http.get(audioUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => this.audioBlobUrl.set(URL.createObjectURL(blob)),
      error: () => console.warn('Failed to load audio'),
    });
  }

  private buildBlocks(story: Story) {
    const paragraphs = story.content.split(/\n\n+/).filter(p => p.trim());
    const illustrations = story.illustrationUrls || [];
    const blocks: {type: string; content: string}[] = [];
    const interval = Math.max(1, Math.floor(paragraphs.length / (illustrations.length + 1)));

    let imgIdx = 0;
    paragraphs.forEach((para, i) => {
      if (i > 0 && i % interval === 0 && imgIdx < illustrations.length) {
        blocks.push({ type: 'image', content: illustrations[imgIdx] });
        imgIdx++;
      }
      blocks.push({ type: 'text', content: para.trim() });
    });
    this.storyBlocks.set(blocks);
  }

  togglePlay() {
    const audio = this.audioRef?.nativeElement;
    if (!audio) return;
    if (this.playing()) { audio.pause(); } else { audio.play(); }
    this.playing.set(!this.playing());
  }

  onTimeUpdate() {
    this.currentTime.set(this.audioRef.nativeElement.currentTime);
  }

  onMetadataLoaded() {
    this.duration.set(this.audioRef.nativeElement.duration);
  }

  seek(event: Event) {
    const val = +(event.target as HTMLInputElement).value;
    this.audioRef.nativeElement.currentTime = val;
  }

  share() {
    const s = this.story();
    if (s) this.native.shareStory(s.title, s.id);
  }

  toggleFavorite() {
    this.storyService.toggleFavorite(this.story()!.id).subscribe(updated => {
      this.story.set(updated);
    });
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
