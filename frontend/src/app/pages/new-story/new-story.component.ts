import { Component, OnInit, signal, computed } from '@angular/core';
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

        <!-- Step 3: Select Language -->
        @if (step() === 3) {
          <div>
            <p class="text-navy-400 mb-2">Story for <span class="text-white font-semibold">{{ selectedChild()?.name }}</span> · {{ selectedTheme() }}</p>
            <h2 class="text-lg text-navy-300 mb-4">Choose a language</h2>
            <div class="relative mb-4">
              <input type="text" [value]="languageSearch()" (input)="languageSearch.set($any($event.target).value)"
                placeholder="Search languages..." class="w-full bg-navy-800 border border-navy-600 rounded-lg px-4 py-2 text-white placeholder-navy-400 focus:outline-none focus:border-story-purple" />
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
              @for (lang of filteredLanguages(); track lang.value) {
                <button (click)="selectLanguage(lang.value)"
                  class="card text-center py-3 hover:border-story-purple/50 transition-colors cursor-pointer text-sm">
                  <span class="text-lg block">{{ lang.flag }}</span>
                  <span>{{ lang.label }}</span>
                </button>
              }
            </div>
            <button (click)="step.set(2)" class="mt-4 text-navy-400 text-sm hover:text-white">&#8592; Back</button>
          </div>
        }

        <!-- Step 4: Select Voice (Pro only) -->
        @if (step() === 4) {
          <div>
            <p class="text-navy-400 mb-4">Story for <span class="text-white font-semibold">{{ selectedChild()?.name }}</span> · {{ selectedTheme() }} · {{ selectedLanguageLabel() }}</p>
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
            <button (click)="step.set(3)" class="mt-4 text-navy-400 text-sm hover:text-white">&#8592; Back</button>
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
  selectedLanguage = signal('English');
  languageSearch = signal('');
  generating = signal(false);
  error = signal('');

  selectedLanguageLabel = computed(() => {
    const lang = this.languages.find(l => l.value === this.selectedLanguage());
    return lang ? lang.label : this.selectedLanguage();
  });

  filteredLanguages = computed(() => {
    const search = this.languageSearch().toLowerCase();
    if (!search) return this.languages;
    return this.languages.filter(l => l.label.toLowerCase().includes(search) || l.value.toLowerCase().includes(search));
  });

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

  languages = [
    { value: 'English', label: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
    { value: 'Estonian', label: 'Eesti', flag: '\u{1F1EA}\u{1F1EA}' },
    { value: 'Afrikaans', label: 'Afrikaans', flag: '\u{1F1FF}\u{1F1E6}' },
    { value: 'Arabic', label: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629', flag: '\u{1F1E6}\u{1F1EA}' },
    { value: 'Armenian', label: '\u0540\u0561\u0575\u0565\u0580\u0565\u0576', flag: '\u{1F1E6}\u{1F1F2}' },
    { value: 'Azerbaijani', label: 'Az\u0259rbaycan', flag: '\u{1F1E6}\u{1F1FF}' },
    { value: 'Belarusian', label: '\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u043A\u0430\u044F', flag: '\u{1F1E7}\u{1F1FE}' },
    { value: 'Bosnian', label: 'Bosanski', flag: '\u{1F1E7}\u{1F1E6}' },
    { value: 'Bulgarian', label: '\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438', flag: '\u{1F1E7}\u{1F1EC}' },
    { value: 'Catalan', label: 'Catal\u00E0', flag: '\u{1F3F4}' },
    { value: 'Chinese', label: '\u4E2D\u6587', flag: '\u{1F1E8}\u{1F1F3}' },
    { value: 'Croatian', label: 'Hrvatski', flag: '\u{1F1ED}\u{1F1F7}' },
    { value: 'Czech', label: '\u010Ce\u0161tina', flag: '\u{1F1E8}\u{1F1FF}' },
    { value: 'Danish', label: 'Dansk', flag: '\u{1F1E9}\u{1F1F0}' },
    { value: 'Dutch', label: 'Nederlands', flag: '\u{1F1F3}\u{1F1F1}' },
    { value: 'Filipino', label: 'Filipino', flag: '\u{1F1F5}\u{1F1ED}' },
    { value: 'Finnish', label: 'Suomi', flag: '\u{1F1EB}\u{1F1EE}' },
    { value: 'French', label: 'Fran\u00E7ais', flag: '\u{1F1EB}\u{1F1F7}' },
    { value: 'Galician', label: 'Galego', flag: '\u{1F3F4}' },
    { value: 'German', label: 'Deutsch', flag: '\u{1F1E9}\u{1F1EA}' },
    { value: 'Greek', label: '\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC', flag: '\u{1F1EC}\u{1F1F7}' },
    { value: 'Hebrew', label: '\u05E2\u05D1\u05E8\u05D9\u05EA', flag: '\u{1F1EE}\u{1F1F1}' },
    { value: 'Hindi', label: '\u0939\u093F\u0928\u094D\u0926\u0940', flag: '\u{1F1EE}\u{1F1F3}' },
    { value: 'Hungarian', label: 'Magyar', flag: '\u{1F1ED}\u{1F1FA}' },
    { value: 'Icelandic', label: '\u00CDslenska', flag: '\u{1F1EE}\u{1F1F8}' },
    { value: 'Indonesian', label: 'Bahasa Indonesia', flag: '\u{1F1EE}\u{1F1E9}' },
    { value: 'Italian', label: 'Italiano', flag: '\u{1F1EE}\u{1F1F9}' },
    { value: 'Japanese', label: '\u65E5\u672C\u8A9E', flag: '\u{1F1EF}\u{1F1F5}' },
    { value: 'Kazakh', label: '\u049A\u0430\u0437\u0430\u049B', flag: '\u{1F1F0}\u{1F1FF}' },
    { value: 'Korean', label: '\uD55C\uAD6D\uC5B4', flag: '\u{1F1F0}\u{1F1F7}' },
    { value: 'Latvian', label: 'Latvie\u0161u', flag: '\u{1F1F1}\u{1F1FB}' },
    { value: 'Lithuanian', label: 'Lietuvi\u0173', flag: '\u{1F1F1}\u{1F1F9}' },
    { value: 'Macedonian', label: '\u041C\u0430\u043A\u0435\u0434\u043E\u043D\u0441\u043A\u0438', flag: '\u{1F1F2}\u{1F1F0}' },
    { value: 'Malay', label: 'Bahasa Melayu', flag: '\u{1F1F2}\u{1F1FE}' },
    { value: 'Marathi', label: '\u092E\u0930\u093E\u0920\u0940', flag: '\u{1F1EE}\u{1F1F3}' },
    { value: 'Nepali', label: '\u0928\u0947\u092A\u093E\u0932\u0940', flag: '\u{1F1F3}\u{1F1F5}' },
    { value: 'Norwegian', label: 'Norsk', flag: '\u{1F1F3}\u{1F1F4}' },
    { value: 'Persian', label: '\u0641\u0627\u0631\u0633\u06CC', flag: '\u{1F1EE}\u{1F1F7}' },
    { value: 'Polish', label: 'Polski', flag: '\u{1F1F5}\u{1F1F1}' },
    { value: 'Portuguese', label: 'Portugu\u00EAs', flag: '\u{1F1F5}\u{1F1F9}' },
    { value: 'Romanian', label: 'Rom\u00E2n\u0103', flag: '\u{1F1F7}\u{1F1F4}' },
    { value: 'Russian', label: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439', flag: '\u{1F1F7}\u{1F1FA}' },
    { value: 'Serbian', label: '\u0421\u0440\u043F\u0441\u043A\u0438', flag: '\u{1F1F7}\u{1F1F8}' },
    { value: 'Slovak', label: 'Sloven\u010Dina', flag: '\u{1F1F8}\u{1F1F0}' },
    { value: 'Slovenian', label: 'Sloven\u0161\u010Dina', flag: '\u{1F1F8}\u{1F1EE}' },
    { value: 'Somali', label: 'Soomaali', flag: '\u{1F1F8}\u{1F1F4}' },
    { value: 'Spanish', label: 'Espa\u00F1ol', flag: '\u{1F1EA}\u{1F1F8}' },
    { value: 'Swahili', label: 'Kiswahili', flag: '\u{1F1F0}\u{1F1EA}' },
    { value: 'Swedish', label: 'Svenska', flag: '\u{1F1F8}\u{1F1EA}' },
    { value: 'Tamil', label: '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD', flag: '\u{1F1EE}\u{1F1F3}' },
    { value: 'Thai', label: '\u0E44\u0E17\u0E22', flag: '\u{1F1F9}\u{1F1ED}' },
    { value: 'Turkish', label: 'T\u00FCrk\u00E7e', flag: '\u{1F1F9}\u{1F1F7}' },
    { value: 'Ukrainian', label: '\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430', flag: '\u{1F1FA}\u{1F1E6}' },
    { value: 'Urdu', label: '\u0627\u0631\u062F\u0648', flag: '\u{1F1F5}\u{1F1F0}' },
    { value: 'Vietnamese', label: 'Ti\u1EBFng Vi\u1EC7t', flag: '\u{1F1FB}\u{1F1F3}' },
    { value: 'Welsh', label: 'Cymraeg', flag: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}' },
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

  selectLanguage(language: string) {
    this.selectedLanguage.set(language);
    this.languageSearch.set('');
    this.step.set(4);
  }

  generate(voice: string | null) {
    this.generating.set(true);
    this.error.set('');
    this.storyService.generate(this.selectedChild()!.id, this.selectedTheme(), voice || undefined, this.selectedLanguage()).subscribe({
      next: (story) => this.router.navigate(['/app/story', story.id]),
      error: (err) => {
        this.error.set(err.error?.message || 'Story generation failed');
        this.generating.set(false);
      }
    });
  }
}
