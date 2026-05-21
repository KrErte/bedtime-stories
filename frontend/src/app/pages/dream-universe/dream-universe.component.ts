import { Component, OnInit, OnDestroy, signal, computed, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Story, StoryService } from '../../services/story.service';
import { Child, ChildService } from '../../services/child.service';

interface Star {
  x: number;
  y: number;
  radius: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  story: Story;
  childName: string;
  color: string;
  pulsePhase: number;
  constellation: number;
  hovered: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number }[];
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
  drift: number;
}

interface BackgroundStar {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const THEME_COLORS: Record<string, string> = {
  adventure: '#f59e0b',
  friendship: '#ec4899',
  courage: '#ef4444',
  nature: '#22c55e',
  space: '#7c3aed',
  ocean: '#06b6d4',
  magic: '#a855f7',
  helping_others: '#f97316',
  random: '#8b5cf6',
};

@Component({
  selector: 'app-dream-universe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative w-full" style="height: calc(100vh - 80px); overflow: hidden; margin: -1rem -1rem -2rem -1rem; padding: 0;">
      <canvas #canvas class="absolute inset-0 w-full h-full cursor-crosshair"></canvas>

      <!-- Header overlay -->
      <div class="absolute top-6 left-6 right-6 flex items-center justify-between z-10 pointer-events-none">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold font-serif">
            <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Dream Universe
            </span>
          </h1>
          <p class="text-navy-400 text-sm mt-1">Every story is a star in your child's galaxy</p>
        </div>
        <div class="flex gap-2 pointer-events-auto">
          <a routerLink="/app/library" class="btn-secondary text-xs">Grid View</a>
          <a routerLink="/app/new-story" class="btn-primary text-xs">+ New Star</a>
        </div>
      </div>

      <!-- Legend -->
      <div class="absolute bottom-6 left-6 z-10 pointer-events-none">
        <div class="bg-navy-900/80 backdrop-blur-sm rounded-xl border border-navy-700/50 p-4 text-xs space-y-2">
          <p class="text-navy-300 font-semibold mb-2">Story Themes</p>
          @for (entry of legendEntries; track entry.theme) {
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" [style.background]="entry.color" [style.box-shadow]="'0 0 6px ' + entry.color"></div>
              <span class="text-navy-400 capitalize">{{ entry.theme }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Child filter -->
      @if (children().length > 1) {
        <div class="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          <button (click)="filterChild(null)" [class]="!selectedChild() ? 'btn-primary text-xs' : 'btn-secondary text-xs opacity-70'">All Stars</button>
          @for (child of children(); track child.id) {
            <button (click)="filterChild(child.id)" [class]="selectedChild() === child.id ? 'btn-primary text-xs' : 'btn-secondary text-xs opacity-70'">{{ child.name }}</button>
          }
        </div>
      }

      <!-- Tooltip -->
      @if (hoveredStar()) {
        <div class="absolute z-20 pointer-events-none transition-all duration-150"
             [style.left.px]="tooltipX()"
             [style.top.px]="tooltipY()">
          <div class="bg-navy-900/95 backdrop-blur-md rounded-xl border border-navy-600/50 p-4 max-w-64 shadow-2xl"
               [style.border-color]="hoveredStar()!.color + '60'"
               [style.box-shadow]="'0 0 30px ' + hoveredStar()!.color + '20'">
            <h3 class="font-serif font-bold text-sm mb-1" [style.color]="hoveredStar()!.color">{{ hoveredStar()!.story.title }}</h3>
            <p class="text-navy-400 text-xs mb-2">{{ hoveredStar()!.story.content.substring(0, 100) }}...</p>
            <div class="flex items-center gap-2 text-xs text-navy-500">
              <span class="capitalize">{{ hoveredStar()!.story.storyTheme }}</span>
              <span>&middot;</span>
              <span>{{ hoveredStar()!.childName }}</span>
              @if (hoveredStar()!.story.audioUrl) {
                <span>&middot;</span>
                <span>&#127925;</span>
              }
            </div>
            <p class="text-navy-600 text-xs mt-2">Click to read</p>
          </div>
        </div>
      }

      <!-- Stats -->
      <div class="absolute bottom-6 right-6 z-10 pointer-events-none">
        <div class="bg-navy-900/80 backdrop-blur-sm rounded-xl border border-navy-700/50 p-4 text-center">
          <div class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{{ stars.length }}</div>
          <div class="text-navy-400 text-xs">stars in the universe</div>
        </div>
      </div>

      <!-- Empty state -->
      @if (stars.length === 0 && !loading()) {
        <div class="absolute inset-0 flex items-center justify-center z-10">
          <div class="text-center">
            <div class="text-6xl mb-4">&#127756;</div>
            <h2 class="text-xl font-serif font-bold text-navy-300 mb-2">Your universe is empty</h2>
            <p class="text-navy-400 text-sm mb-4">Create your first story to light up the sky</p>
            <a routerLink="/app/new-story" class="btn-primary">Create First Star</a>
          </div>
        </div>
      }
    </div>
  `,
})
export class DreamUniverseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  children = signal<Child[]>([]);
  selectedChild = signal<string | null>(null);
  loading = signal(true);
  hoveredStar = signal<Star | null>(null);
  tooltipX = signal(0);
  tooltipY = signal(0);

  stars: Star[] = [];
  backgroundStars: BackgroundStar[] = [];
  shootingStars: ShootingStar[] = [];
  nebulae: Nebula[] = [];
  childMap = new Map<string, string>();

  private ctx!: CanvasRenderingContext2D;
  private animFrame = 0;
  private time = 0;
  private mouseX = 0;
  private mouseY = 0;
  private parallaxX = 0;
  private parallaxY = 0;
  private dpr = 1;
  private canvasW = 0;
  private canvasH = 0;

  legendEntries = Object.entries(THEME_COLORS).map(([theme, color]) => ({ theme: theme.replace('_', ' '), color }));

  constructor(
    private storyService: StoryService,
    private childService: ChildService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.childService.getChildren().subscribe(children => {
      this.children.set(children);
      children.forEach(c => this.childMap.set(c.id, c.name));
      this.loadAllStories();
    });
  }

  ngAfterViewInit() {
    this.setupCanvas();
    this.generateBackground();
    this.generateNebulae();
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animFrame);
  }

  @HostListener('window:resize')
  onResize() {
    this.setupCanvas();
    this.generateBackground();
    this.generateNebulae();
    if (this.stars.length) this.positionStars();
  }

  private setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    this.dpr = window.devicePixelRatio || 1;
    this.canvasW = rect.width;
    this.canvasH = rect.height;
    canvas.width = rect.width * this.dpr;
    canvas.height = rect.height * this.dpr;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.scale(this.dpr, this.dpr);
  }

  private generateBackground() {
    this.backgroundStars = [];
    const count = Math.floor((this.canvasW * this.canvasH) / 800);
    for (let i = 0; i < count; i++) {
      this.backgroundStars.push({
        x: Math.random() * this.canvasW * 1.2 - this.canvasW * 0.1,
        y: Math.random() * this.canvasH * 1.2 - this.canvasH * 0.1,
        radius: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.6 + 0.1,
        twinkleSpeed: Math.random() * 2 + 1,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  private generateNebulae() {
    this.nebulae = [];
    const colors = ['#7c3aed', '#ec4899', '#06b6d4', '#a855f7', '#f59e0b'];
    for (let i = 0; i < 5; i++) {
      this.nebulae.push({
        x: Math.random() * this.canvasW,
        y: Math.random() * this.canvasH,
        radius: Math.random() * 200 + 150,
        color: colors[i % colors.length],
        opacity: Math.random() * 0.04 + 0.02,
        drift: Math.random() * 0.2 - 0.1,
      });
    }
  }

  private loadAllStories() {
    this.loading.set(true);
    const childId = this.selectedChild() || undefined;
    // Load up to 200 stories for the universe
    this.storyService.getStories(0, 200, childId).subscribe(res => {
      this.createStarsFromStories(res.content);
      this.loading.set(false);
    });
  }

  filterChild(childId: string | null) {
    this.selectedChild.set(childId);
    this.loadAllStories();
  }

  private createStarsFromStories(stories: Story[]) {
    this.stars = stories.map((story, i) => {
      const theme = story.storyTheme?.toLowerCase().replace(/\s+/g, '_') || 'random';
      const color = THEME_COLORS[theme] || THEME_COLORS['random'];
      return {
        x: 0,
        y: 0,
        radius: story.isFavorite ? 6 : 4,
        brightness: 1,
        twinkleSpeed: Math.random() * 3 + 1,
        twinkleOffset: Math.random() * Math.PI * 2,
        story,
        childName: this.childMap.get(story.childId) || 'Unknown',
        color,
        pulsePhase: Math.random() * Math.PI * 2,
        constellation: Math.floor(i / 5),
        hovered: false,
      };
    });
    this.positionStars();
  }

  private positionStars() {
    if (!this.stars.length) return;
    const padding = 80;
    const w = this.canvasW - padding * 2;
    const h = this.canvasH - padding * 2;

    // Arrange stars in a spiral galaxy pattern
    const total = this.stars.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const maxRadius = Math.min(w, h) * 0.42;

    this.stars.forEach((star, i) => {
      const t = i / total;
      const r = maxRadius * Math.sqrt(t) * 0.9 + 20;
      // Spiral arms
      const armAngle = goldenAngle * i;
      const spiralAngle = armAngle + t * Math.PI * 3;
      const jitter = (Math.random() - 0.5) * 40;

      star.x = this.canvasW / 2 + Math.cos(spiralAngle) * (r + jitter);
      star.y = this.canvasH / 2 + Math.sin(spiralAngle) * (r + jitter) * 0.7;
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;

    // Parallax
    this.parallaxX = (this.mouseX / this.canvasW - 0.5) * 20;
    this.parallaxY = (this.mouseY / this.canvasH - 0.5) * 20;

    // Hover detection
    let found: Star | null = null;
    for (const star of this.stars) {
      const dx = this.mouseX - star.x;
      const dy = this.mouseY - star.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      star.hovered = dist < star.radius + 15;
      if (star.hovered) found = star;
    }
    this.hoveredStar.set(found);
    if (found) {
      this.tooltipX.set(found.x + 20);
      this.tooltipY.set(found.y - 60);
    }
  }

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    const star = this.hoveredStar();
    if (star) {
      e.preventDefault();
      e.stopPropagation();
      this.router.navigate(['/app/story', star.story.id]);
    }
  }

  private animate() {
    this.time += 0.016;
    this.draw();
    this.animFrame = requestAnimationFrame(() => this.animate());
  }

  private draw() {
    const ctx = this.ctx;
    const w = this.canvasW;
    const h = this.canvasH;

    // Clear with deep space gradient
    const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
    bg.addColorStop(0, '#0c0a1a');
    bg.addColorStop(0.5, '#080616');
    bg.addColorStop(1, '#030212');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Nebulae
    for (const neb of this.nebulae) {
      const nx = neb.x + this.parallaxX * 0.3 + Math.sin(this.time * neb.drift) * 10;
      const ny = neb.y + this.parallaxY * 0.3 + Math.cos(this.time * neb.drift * 0.7) * 8;
      const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, neb.radius);
      g.addColorStop(0, this.hexToRgba(neb.color, neb.opacity * 1.5));
      g.addColorStop(0.4, this.hexToRgba(neb.color, neb.opacity));
      g.addColorStop(1, this.hexToRgba(neb.color, 0));
      ctx.fillStyle = g;
      ctx.fillRect(nx - neb.radius, ny - neb.radius, neb.radius * 2, neb.radius * 2);
    }

    // Background stars with parallax
    for (const bs of this.backgroundStars) {
      const bx = bs.x + this.parallaxX * 0.5;
      const by = bs.y + this.parallaxY * 0.5;
      const twinkle = Math.sin(this.time * bs.twinkleSpeed + bs.twinkleOffset) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(200, 210, 255, ${bs.opacity * twinkle})`;
      ctx.beginPath();
      ctx.arc(bx, by, bs.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shooting stars
    if (Math.random() < 0.005) {
      this.shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.3,
        vx: Math.random() * 8 + 4,
        vy: Math.random() * 3 + 2,
        life: 0,
        maxLife: Math.random() * 40 + 30,
        trail: [],
      });
    }

    this.shootingStars = this.shootingStars.filter(ss => {
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life++;
      ss.trail.push({ x: ss.x, y: ss.y });
      if (ss.trail.length > 20) ss.trail.shift();

      const alpha = 1 - ss.life / ss.maxLife;
      for (let i = 0; i < ss.trail.length; i++) {
        const t = i / ss.trail.length;
        ctx.fillStyle = `rgba(255, 255, 255, ${t * alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(ss.trail[i].x, ss.trail[i].y, (1 - t) * 2 + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      return ss.life < ss.maxLife;
    });

    // Constellation lines between story stars
    if (this.stars.length > 1) {
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < this.stars.length - 1; i++) {
        const a = this.stars[i];
        const b = this.stars[i + 1];
        if (a.constellation === b.constellation) {
          ctx.beginPath();
          ctx.moveTo(a.x + this.parallaxX * 0.1, a.y + this.parallaxY * 0.1);
          ctx.lineTo(b.x + this.parallaxX * 0.1, b.y + this.parallaxY * 0.1);
          ctx.stroke();
        }
      }
    }

    // Story stars
    for (const star of this.stars) {
      const sx = star.x + this.parallaxX * 0.1;
      const sy = star.y + this.parallaxY * 0.1;
      const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
      const pulse = star.hovered ? 1.8 : 1;
      const r = star.radius * pulse;

      // Outer glow
      const glowRadius = r * (star.hovered ? 8 : 4);
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowRadius);
      glow.addColorStop(0, this.hexToRgba(star.color, 0.4 * twinkle));
      glow.addColorStop(0.3, this.hexToRgba(star.color, 0.15 * twinkle));
      glow.addColorStop(1, this.hexToRgba(star.color, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sx, sy, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Cross flare for favorites
      if (star.story.isFavorite) {
        ctx.strokeStyle = this.hexToRgba(star.color, 0.3 * twinkle);
        ctx.lineWidth = 1;
        const flareLen = r * 5;
        ctx.beginPath();
        ctx.moveTo(sx - flareLen, sy);
        ctx.lineTo(sx + flareLen, sy);
        ctx.moveTo(sx, sy - flareLen);
        ctx.lineTo(sx, sy + flareLen);
        ctx.stroke();
      }

      // Core
      const core = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
      core.addColorStop(0, '#ffffff');
      core.addColorStop(0.3, star.color);
      core.addColorStop(1, this.hexToRgba(star.color, 0.6));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();

      // Hover ring
      if (star.hovered) {
        ctx.strokeStyle = this.hexToRgba(star.color, 0.6);
        ctx.lineWidth = 2;
        const ringRadius = r + 8 + Math.sin(this.time * 4) * 3;
        ctx.beginPath();
        ctx.arc(sx, sy, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting particles
        for (let p = 0; p < 4; p++) {
          const angle = this.time * 3 + (p * Math.PI * 2) / 4;
          const orbitR = r + 14;
          const px = sx + Math.cos(angle) * orbitR;
          const py = sy + Math.sin(angle) * orbitR;
          ctx.fillStyle = this.hexToRgba(star.color, 0.7);
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Center galaxy core glow
    if (this.stars.length > 0) {
      const coreGlow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 60);
      coreGlow.addColorStop(0, 'rgba(124, 58, 237, 0.08)');
      coreGlow.addColorStop(0.5, 'rgba(236, 72, 153, 0.03)');
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
