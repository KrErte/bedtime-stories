import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Child, ChildService } from '../../services/child.service';
import { StoryService } from '../../services/story.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-story',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-8">Create a New Story</h1>

      @if (generating()) {
        <div class="card text-center py-16">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-story-purple border-t-transparent mb-6"></div>
          <p class="text-xl font-serif text-navy-200">Writing a magical story...</p>
          <p class="text-navy-400 mt-2 text-sm">This may take a few seconds</p>
        </div>
      } @else if (error()) {
        <div class="card">
          <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-300 mb-4">{{ error() }}</div>
          <button (click)="error.set('')" class="btn-secondary">Try Again</button>
        </div>
      } @else {
        <!-- Step 1: Select Child -->
        @if (step() === 1) {
          <div class="space-y-4">
            <h2 class="text-lg text-navy-300 mb-4">Who is tonight's story for?</h2>
            @if (children().length === 0) {
              <div class="card text-center py-8">
                <p class="text-navy-300 mb-4">Add a child profile first to create stories.</p>
                <a routerLink="/app/children" class="btn-primary">Add Child</a>
              </div>
            }
            @for (child of children(); track child.id) {
              <button (click)="selectChild(child)" class="card w-full text-left hover:border-story-purple/50 transition-colors cursor-pointer">
                <h3 class="font-semibold text-lg">{{ child.name }}</h3>
                <p class="text-navy-400 text-sm">Age {{ child.age }} · Loves {{ child.interests?.join(', ') || 'stories' }}</p>
              </button>
            }
          </div>
        }

        <!-- Step 2: Select Theme -->
        @if (step() === 2) {
          <div>
            <p class="text-navy-400 mb-2">Story for <span class="text-white font-semibold">{{ selectedChild()?.name }}</span></p>
            <h2 class="text-lg text-navy-300 mb-4">Pick a theme</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              @for (theme of themes; track theme.value) {
                <button (click)="selectTheme(theme.value)"
                  class="card text-center py-6 hover:border-story-purple/50 transition-colors cursor-pointer">
                  <span class="text-3xl mb-2 block">{{ theme.emoji }}</span>
                  <span class="text-sm">{{ theme.label }}</span>
                </button>
              }
            </div>
            <button (click)="step.set(1)" class="mt-4 text-navy-400 text-sm hover:text-white">&#8592; Back</button>
          </div>
        }

        <!-- Step 3: Select Voice (Pro only) -->
        @if (step() === 3) {
          <div>
            <p class="text-navy-400 mb-4">Story for <span class="text-white font-semibold">{{ selectedChild()?.name }}</span> · {{ selectedTheme() }}</p>
            @if (auth.isPro()) {
              <h2 class="text-lg text-navy-300 mb-4">Choose a narrator voice</h2>
              <div class="grid grid-cols-2 gap-3">
                @for (voice of voices; track voice.value) {
                  <button (click)="generate(voice.value)"
                    class="card text-center py-6 hover:border-story-purple/50 transition-colors cursor-pointer">
                    <span class="text-2xl mb-2 block">{{ voice.emoji }}</span>
                    <span class="font-medium">{{ voice.label }}</span>
                    <span class="text-navy-400 text-xs block mt-1">{{ voice.desc }}</span>
                  </button>
                }
              </div>
              <button (click)="generate(null)" class="mt-4 text-navy-400 text-sm hover:text-white">Skip audio</button>
            } @else {
              <div class="card text-center py-8">
                <p class="text-navy-300 mb-2">Audio narration is a Pro feature</p>
                <div class="flex gap-3 justify-center mt-4">
                  <button (click)="generate(null)" class="btn-primary">Generate Story (Text Only)</button>
                  <a routerLink="/app/subscribe" class="btn-secondary">Upgrade to Pro</a>
                </div>
              </div>
            }
            <button (click)="step.set(2)" class="mt-4 text-navy-400 text-sm hover:text-white">&#8592; Back</button>
          </div>
        }
      }
    </div>
  `,
})
export class NewStoryComponent implements OnInit {
  children = signal<Child[]>([]);
  step = signal(1);
  selectedChild = signal<Child | null>(null);
  selectedTheme = signal('');
  generating = signal(false);
  error = signal('');

  themes = [
    { value: 'adventure', label: 'Adventure', emoji: '\u{1F3D4}' },
    { value: 'friendship', label: 'Friendship', emoji: '\u{1F91D}' },
    { value: 'courage', label: 'Courage', emoji: '\u{1F981}' },
    { value: 'nature', label: 'Nature', emoji: '\u{1F33F}' },
    { value: 'space', label: 'Space', emoji: '\u{1F680}' },
    { value: 'ocean', label: 'Under the Sea', emoji: '\u{1F30A}' },
    { value: 'magic', label: 'Magic', emoji: '\u{2728}' },
    { value: 'helping', label: 'Helping Others', emoji: '\u{1F49B}' },
    { value: 'random', label: 'Surprise Me!', emoji: '\u{1F3B2}' },
  ];

  voices = [
    { value: 'luna', label: 'Luna', desc: 'Warm, gentle female', emoji: '\u{1F319}' },
    { value: 'atlas', label: 'Atlas', desc: 'Calm, soothing male', emoji: '\u{1F30D}' },
    { value: 'willow', label: 'Willow', desc: 'Soft, whispery', emoji: '\u{1F343}' },
    { value: 'sage', label: 'Sage', desc: 'Classic storyteller', emoji: '\u{1F4D6}' },
  ];

  constructor(
    private childService: ChildService,
    private storyService: StoryService,
    public auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.childService.getChildren().subscribe(c => this.children.set(c));
  }

  selectChild(child: Child) {
    this.selectedChild.set(child);
    this.step.set(2);
  }

  selectTheme(theme: string) {
    this.selectedTheme.set(theme);
    this.step.set(3);
  }

  generate(voice: string | null) {
    this.generating.set(true);
    this.error.set('');
    this.storyService.generate(this.selectedChild()!.id, this.selectedTheme(), voice || undefined).subscribe({
      next: (story) => this.router.navigate(['/app/story', story.id]),
      error: (err) => {
        this.error.set(err.error?.message || 'Story generation failed');
        this.generating.set(false);
      }
    });
  }
}
