import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-navy-950/80 backdrop-blur-lg border-b border-navy-800/50">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <span class="text-xl font-bold bg-gradient-to-r from-story-purple to-story-pink bg-clip-text text-transparent">Dreamlit.ee</span>
        <div class="flex items-center gap-4">
          <a routerLink="/login" class="text-sm text-navy-300 hover:text-white transition-colors">Sign In</a>
          <a routerLink="/register" class="btn-primary text-sm !py-2 !px-4">Get Started</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-32 pb-20 px-4 text-center">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-bold font-serif leading-tight mb-6">
          Every child deserves to be the
          <span class="bg-gradient-to-r from-story-purple via-story-pink to-story-gold bg-clip-text text-transparent">hero</span>
          of their own story
        </h1>
        <p class="text-xl text-navy-300 mb-8 max-w-xl mx-auto">
          AI-powered personalized bedtime stories with your child's name, interests, and favorite animals woven into magical adventures.
        </p>
        <div class="flex gap-4 justify-center">
          <a routerLink="/register" class="btn-primary text-lg !py-4 !px-8">Start Free — No Card Needed</a>
        </div>
        <p class="text-navy-500 text-sm mt-4">1 free story every day. Upgrade anytime.</p>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 px-4 bg-navy-900/30">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">How it works</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-story-purple/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">&#128118;</div>
            <h3 class="font-semibold text-lg mb-2">1. Add your child</h3>
            <p class="text-navy-400 text-sm">Tell us their name, age, interests, and favorite animal.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-story-pink/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">&#10024;</div>
            <h3 class="font-semibold text-lg mb-2">2. Pick a theme</h3>
            <p class="text-navy-400 text-sm">Adventure, space, ocean, friendship — or surprise me!</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-story-gold/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">&#127769;</div>
            <h3 class="font-semibold text-lg mb-2">3. Listen & dream</h3>
            <p class="text-navy-400 text-sm">A unique story is generated with audio narration. Sweet dreams!</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Story Preview -->
    <section class="py-20 px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-8">A story preview</h2>
        <div class="card text-left">
          <h3 class="font-serif text-xl font-bold text-purple-300 mb-4">Luna's Journey to the Starry Meadow</h3>
          <p class="story-text text-navy-200 leading-[1.9]">
            Once upon a time, little Luna stepped outside into a warm evening breeze. The sky was painted in shades of
            lavender and gold, and tiny stars were just beginning to peek through. "I wonder what's beyond the garden,"
            she whispered to her stuffed bunny...
          </p>
          <p class="text-navy-500 text-sm mt-4 text-center italic">This is just the beginning. Your child's story will be personalized with their name and interests.</p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 px-4 bg-navy-900/30">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Parents love it</h2>
        <div class="grid md:grid-cols-3 gap-6">
          @for (t of testimonials; track t.name) {
            <div class="card">
              <p class="text-navy-200 text-sm mb-4 italic">"{{ t.quote }}"</p>
              <p class="text-sm font-semibold">{{ t.name }}</p>
              <p class="text-xs text-navy-500">{{ t.role }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="py-20 px-4" id="pricing">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-12">Simple pricing</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="card">
            <h3 class="font-semibold text-lg mb-2">Free</h3>
            <p class="text-3xl font-bold mb-6">$0<span class="text-sm text-navy-400">/month</span></p>
            <ul class="text-sm text-navy-300 space-y-2 mb-6 text-left">
              <li>&#10003; 1 story per day</li>
              <li>&#10003; 200 words</li>
              <li>&#10003; 1 illustration</li>
              <li class="text-navy-500">&#10007; No audio</li>
            </ul>
            <a routerLink="/register" class="btn-secondary w-full block text-center">Get Started</a>
          </div>
          <div class="card border-story-purple/50 relative">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-story-purple text-white text-xs px-3 py-1 rounded-full font-semibold">Best Value</div>
            <h3 class="font-semibold text-lg mb-2">Pro</h3>
            <p class="text-3xl font-bold mb-6">$7.99<span class="text-sm text-navy-400">/month</span></p>
            <ul class="text-sm text-navy-200 space-y-2 mb-6 text-left">
              <li>&#10003; Unlimited stories</li>
              <li>&#10003; 500-600 words</li>
              <li>&#10003; 3-4 illustrations</li>
              <li>&#10003; Audio narration</li>
              <li>&#10003; PDF export</li>
              <li>&#10003; 7-day free trial</li>
            </ul>
            <a routerLink="/register" class="btn-primary w-full block text-center">Start Free Trial</a>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-20 px-4 bg-navy-900/30">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">FAQ</h2>
        <div class="space-y-4">
          @for (faq of faqs; track faq.q) {
            <div class="card">
              <h3 class="font-semibold mb-2">{{ faq.q }}</h3>
              <p class="text-navy-400 text-sm">{{ faq.a }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-4 border-t border-navy-800/50">
      <div class="max-w-5xl mx-auto text-center">
        <span class="text-lg font-bold bg-gradient-to-r from-story-purple to-story-pink bg-clip-text text-transparent">Dreamlit.ee</span>
        <p class="text-navy-500 text-sm mt-2">Making bedtime magical, one story at a time.</p>
        <p class="text-navy-600 text-xs mt-4">&copy; 2026 Dreamlit.ee. All rights reserved.</p>
      </div>
    </footer>
  `,
})
export class LandingComponent {
  testimonials = [
    { name: 'Sarah M.', role: 'Mom of 2', quote: 'My daughter asks for her "special story" every night now. She loves hearing her name in the adventure!' },
    { name: 'James K.', role: 'Dad of 1', quote: 'The audio narration is perfect. I turn it on and my son is asleep within minutes.' },
    { name: 'Priya L.', role: 'Mom of 3', quote: 'Each kid gets their own unique story based on what they love. It is like having a personal storyteller.' },
  ];

  faqs = [
    { q: 'How does it work?', a: 'You tell us about your child — name, age, interests — and our AI creates a unique bedtime story personalized just for them. Pro users also get audio narration.' },
    { q: 'Is the free plan really free?', a: 'Yes! You get 1 story per day with no credit card required. Upgrade to Pro anytime for unlimited stories and audio.' },
    { q: 'Are the stories safe for kids?', a: 'Absolutely. Our AI is specifically tuned to create warm, calming, age-appropriate stories with no scary elements. Every story ends peacefully.' },
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel your Pro subscription at any time. You keep Pro features until the end of your billing period.' },
    { q: 'What ages is this for?', a: 'Dreamlit.ee is designed for children aged 2-10. The AI adjusts language complexity based on your child\'s age.' },
  ];
}
