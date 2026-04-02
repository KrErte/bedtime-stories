import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-navy-900/80 border-r border-navy-700/50 p-6 hidden md:flex flex-col">
        <a routerLink="/app" class="text-2xl font-bold bg-gradient-to-r from-story-purple to-story-pink bg-clip-text text-transparent mb-8 block">
          Dreamlit.ee
        </a>
        <nav class="space-y-2 flex-1">
          <a routerLink="/app/new-story" routerLinkActive="bg-story-purple/20 text-story-purple" class="flex items-center gap-3 px-4 py-3 rounded-xl text-navy-300 hover:text-white hover:bg-navy-800 transition-all">
            <span>&#10024;</span> New Story
          </a>
          <a routerLink="/app/library" routerLinkActive="bg-story-purple/20 text-story-purple" class="flex items-center gap-3 px-4 py-3 rounded-xl text-navy-300 hover:text-white hover:bg-navy-800 transition-all">
            <span>&#128218;</span> Library
          </a>
          <a routerLink="/app/favorites" routerLinkActive="bg-story-purple/20 text-story-purple" class="flex items-center gap-3 px-4 py-3 rounded-xl text-navy-300 hover:text-white hover:bg-navy-800 transition-all">
            <span>&#9829;</span> Favorites
          </a>
          <a routerLink="/app/children" routerLinkActive="bg-story-purple/20 text-story-purple" class="flex items-center gap-3 px-4 py-3 rounded-xl text-navy-300 hover:text-white hover:bg-navy-800 transition-all">
            <span>&#128118;</span> Children
          </a>
          <a routerLink="/app/settings" routerLinkActive="bg-story-purple/20 text-story-purple" class="flex items-center gap-3 px-4 py-3 rounded-xl text-navy-300 hover:text-white hover:bg-navy-800 transition-all">
            <span>&#9881;</span> Settings
          </a>
        </nav>
        <div class="mt-auto pt-6 border-t border-navy-700/50">
          @if (!auth.isPro()) {
            <a routerLink="/app/subscribe" class="block text-center btn-primary text-sm mb-4">Upgrade to Pro</a>
          }
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-story-purple flex items-center justify-center text-sm font-bold">
              {{ auth.currentUser()?.name?.charAt(0) || 'U' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ auth.currentUser()?.name }}</p>
              <p class="text-xs text-navy-400 truncate">{{ auth.currentUser()?.email }}</p>
            </div>
          </div>
          <button (click)="auth.logout()" class="mt-3 text-sm text-navy-400 hover:text-red-400 transition-colors w-full text-left">
            Sign out
          </button>
        </div>
      </aside>

      <!-- Mobile header -->
      <div class="flex-1 flex flex-col">
        <header class="md:hidden flex items-center justify-between p-4 bg-navy-900/80 border-b border-navy-700/50">
          <a routerLink="/app" class="text-xl font-bold bg-gradient-to-r from-story-purple to-story-pink bg-clip-text text-transparent">Dreamlit.ee</a>
          <button (click)="menuOpen = !menuOpen" class="text-navy-300 p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </header>

        @if (menuOpen) {
          <div class="md:hidden bg-navy-900 border-b border-navy-700/50 p-4 space-y-2">
            <a routerLink="/app/new-story" (click)="menuOpen=false" class="block px-4 py-2 rounded-lg text-navy-300 hover:bg-navy-800">New Story</a>
            <a routerLink="/app/library" (click)="menuOpen=false" class="block px-4 py-2 rounded-lg text-navy-300 hover:bg-navy-800">Library</a>
            <a routerLink="/app/favorites" (click)="menuOpen=false" class="block px-4 py-2 rounded-lg text-navy-300 hover:bg-navy-800">Favorites</a>
            <a routerLink="/app/children" (click)="menuOpen=false" class="block px-4 py-2 rounded-lg text-navy-300 hover:bg-navy-800">Children</a>
            <a routerLink="/app/settings" (click)="menuOpen=false" class="block px-4 py-2 rounded-lg text-navy-300 hover:bg-navy-800">Settings</a>
            <button (click)="auth.logout()" class="text-red-400 px-4 py-2">Sign out</button>
          </div>
        }

        <main class="flex-1 p-4 md:p-8 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class ShellComponent {
  menuOpen = false;
  constructor(public auth: AuthService) {}
}
