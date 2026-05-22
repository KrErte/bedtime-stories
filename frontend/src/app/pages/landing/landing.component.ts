import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-navy-950/80 backdrop-blur-lg border-b border-navy-800/50">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <span class="text-xl font-bold bg-gradient-to-r from-story-purple to-story-pink bg-clip-text text-transparent">Dreamlit</span>
        <div class="flex items-center gap-3">
          <!-- Language switcher -->
          <div class="relative group">
            <button class="text-xs text-navy-400 hover:text-white transition-colors flex items-center gap-1 uppercase font-medium">
              {{ lang.lang }}
              <span class="text-navy-600">▾</span>
            </button>
            <div class="absolute right-0 top-7 hidden group-hover:flex flex-wrap w-52 bg-navy-900 border border-navy-700 rounded-xl p-2 gap-1 shadow-xl">
              @for (l of lang.supported; track l) {
                <button
                  (click)="lang.set(l)"
                  [class.text-white]="lang.lang === l"
                  [class.bg-navy-700]="lang.lang === l"
                  class="px-2 py-1 text-xs uppercase text-navy-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors">
                  {{ l }}
                </button>
              }
            </div>
          </div>
          <a routerLink="/login" class="text-sm text-navy-300 hover:text-white transition-colors">{{ t.signIn }}</a>
          <a routerLink="/register" class="btn-primary text-sm !py-2 !px-4">{{ t.tryFree }}</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-28 pb-20 px-4 text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-story-purple/10 via-transparent to-transparent pointer-events-none"></div>
      <div class="max-w-3xl mx-auto relative">
        <p class="text-story-gold text-sm font-semibold tracking-widest uppercase mb-4">{{ t.heroBadge }}</p>
        <h1 class="text-4xl md:text-6xl font-bold font-serif leading-tight mb-6">
          {{ t.heroTitle }}
          <span class="bg-gradient-to-r from-story-purple via-story-pink to-story-gold bg-clip-text text-transparent">{{ t.heroHero }}</span>
        </h1>
        <p class="text-xl md:text-2xl text-navy-300 mb-4 max-w-2xl mx-auto leading-relaxed">{{ t.heroPara1 }}</p>
        <p class="text-navy-400 mb-8 max-w-lg mx-auto">{{ t.heroPara2 }}</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a routerLink="/register" class="btn-primary text-lg !py-4 !px-8 shadow-lg shadow-story-purple/25">{{ t.heroCta }}</a>
        </div>
        <p class="text-navy-500 text-sm mt-4">{{ t.heroNoCc }}</p>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-navy-400">
          <span class="flex items-center gap-1.5"><span class="text-story-gold">&#9733;&#9733;&#9733;&#9733;&#9733;</span>{{ t.heroLovedBy }}</span>
          <span class="hidden sm:inline text-navy-700">|</span>
          <span>{{ t.hero60Langs }}</span>
          <span class="hidden sm:inline text-navy-700">|</span>
          <span>{{ t.heroAges }}</span>
          <span class="hidden sm:inline text-navy-700">|</span>
          <span>{{ t.heroAudio }}</span>
        </div>
      </div>
    </section>

    <!-- Pain Point -->
    <section class="py-16 px-4">
      <div class="max-w-2xl mx-auto text-center">
        <p class="text-2xl md:text-3xl font-serif text-navy-200 leading-relaxed">{{ t.painQuote }}</p>
        <p class="text-navy-400 mt-4">{{ t.painText }}</p>
        <p class="text-navy-300 mt-3 font-medium">{{ t.painQuestion }}</p>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 px-4 bg-navy-900/30">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-4">{{ t.howTitle }}</h2>
        <p class="text-navy-400 text-center mb-12 max-w-lg mx-auto">{{ t.howSubtitle }}</p>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-story-purple/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">&#128118;</div>
            <h3 class="font-semibold text-lg mb-2">{{ t.step1Title }}</h3>
            <p class="text-navy-400 text-sm">{{ t.step1Desc }}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-story-pink/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">&#10024;</div>
            <h3 class="font-semibold text-lg mb-2">{{ t.step2Title }}</h3>
            <p class="text-navy-400 text-sm">{{ t.step2Desc }}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-story-gold/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">&#127769;</div>
            <h3 class="font-semibold text-lg mb-2">{{ t.step3Title }}</h3>
            <p class="text-navy-400 text-sm">{{ t.step3Desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Story Preview -->
    <section class="py-20 px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-3">{{ t.demoTitle }}</h2>
        <p class="text-navy-400 mb-8"><em>{{ t.demoSubtitle }}</em></p>
        <div class="card text-left relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-story-purple via-story-pink to-story-gold"></div>
          <h3 class="font-serif text-xl font-bold text-purple-300 mb-4 mt-2">Luna's Journey to the Starry Meadow</h3>
          <p class="story-text text-navy-200 leading-[1.9]">
            Once upon a time, little <strong class="text-story-pink">Luna</strong> stepped outside into a warm evening breeze. The sky was painted in shades of
            lavender and gold, and tiny stars were just beginning to peek through. Her best friend — a fluffy
            <strong class="text-story-purple">bunny</strong> named Marshmallow — hopped along beside her.
            "I wonder what's beyond the garden," she whispered...
          </p>
          <div class="mt-6 flex items-center gap-3 text-sm text-navy-400">
            <span class="w-8 h-8 rounded-full bg-story-purple/20 flex items-center justify-center text-story-purple">&#9654;</span>
            <div class="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden">
              <div class="w-1/3 h-full bg-gradient-to-r from-story-purple to-story-pink rounded-full"></div>
            </div>
            <span>1:24</span>
          </div>
          <p class="text-navy-500 text-xs mt-4 text-center italic">{{ t.demoNote }}</p>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="py-20 px-4 bg-navy-900/30">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">{{ t.benefitsTitle }}</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="card flex gap-4"><span class="text-2xl mt-0.5">&#128164;</span><div><h3 class="font-semibold mb-1">{{ t.b1Title }}</h3><p class="text-navy-400 text-sm">{{ t.b1Desc }}</p></div></div>
          <div class="card flex gap-4"><span class="text-2xl mt-0.5">&#10084;&#65039;</span><div><h3 class="font-semibold mb-1">{{ t.b2Title }}</h3><p class="text-navy-400 text-sm">{{ t.b2Desc }}</p></div></div>
          <div class="card flex gap-4"><span class="text-2xl mt-0.5">&#127793;</span><div><h3 class="font-semibold mb-1">{{ t.b3Title }}</h3><p class="text-navy-400 text-sm">{{ t.b3Desc }}</p></div></div>
          <div class="card flex gap-4"><span class="text-2xl mt-0.5">&#127760;</span><div><h3 class="font-semibold mb-1">{{ t.b4Title }}</h3><p class="text-navy-400 text-sm">{{ t.b4Desc }}</p></div></div>
          <div class="card flex gap-4"><span class="text-2xl mt-0.5">&#128106;</span><div><h3 class="font-semibold mb-1">{{ t.b5Title }}</h3><p class="text-navy-400 text-sm">{{ t.b5Desc }}</p></div></div>
          <div class="card flex gap-4"><span class="text-2xl mt-0.5">&#128260;</span><div><h3 class="font-semibold mb-1">{{ t.b6Title }}</h3><p class="text-navy-400 text-sm">{{ t.b6Desc }}</p></div></div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-3">{{ t.testimonialsTitle }}</h2>
        <p class="text-navy-400 text-center mb-12">{{ t.testimonialsSubtitle }}</p>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (item of testimonials; track item.name) {
            <div class="card">
              <div class="flex gap-1 text-story-gold text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p class="text-navy-200 text-sm mb-4">"{{ item.quote }}"</p>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-story-purple to-story-pink flex items-center justify-center text-xs font-bold">{{ item.name[0] }}</div>
                <div><p class="text-sm font-semibold">{{ item.name }}</p><p class="text-xs text-navy-500">{{ item.role }}</p></div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="py-20 px-4 bg-navy-900/30" id="pricing">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-3">{{ t.pricingTitle }}</h2>
        <p class="text-navy-400 mb-12">{{ t.pricingSubtitle }}</p>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="card">
            <h3 class="font-semibold text-lg mb-2">{{ t.freeTier }}</h3>
            <p class="text-3xl font-bold mb-1">$0</p>
            <p class="text-navy-500 text-sm mb-6">{{ t.freeForever }}</p>
            <ul class="text-sm text-navy-300 space-y-3 mb-6 text-left">
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> {{ t.fFeat1 }}</li>
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> {{ t.fFeat2 }}</li>
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> {{ t.fFeat3 }}</li>
              <li class="flex items-start gap-2"><span class="text-navy-600 mt-0.5">&#10007;</span> <span class="text-navy-500">{{ t.fFeat4NoAudio }}</span></li>
            </ul>
            <a routerLink="/register" class="btn-secondary w-full block text-center">{{ t.startFree }}</a>
          </div>
          <div class="card border-story-purple/50 relative">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-story-purple to-story-pink text-white text-xs px-4 py-1 rounded-full font-semibold">{{ t.mostPopular }}</div>
            <h3 class="font-semibold text-lg mb-2">Pro</h3>
            <p class="text-3xl font-bold mb-1">{{ t.proMonthly }}</p>
            <p class="text-story-gold text-sm mb-6 font-medium">{{ t.proTrial }}</p>
            <ul class="text-sm text-navy-200 space-y-3 mb-6 text-left">
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> <strong>{{ t.pFeat1 }}</strong></li>
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> {{ t.pFeat2 }}</li>
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> {{ t.pFeat3 }}</li>
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> <strong>{{ t.pFeat4 }}</strong></li>
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> {{ t.pFeat5 }}</li>
            </ul>
            <a routerLink="/register" class="btn-primary w-full block text-center">{{ t.startTrial }}</a>
            <p class="text-navy-500 text-xs mt-3 text-center">{{ t.priceNote }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-20 px-4">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">{{ t.faqTitle }}</h2>
        <div class="space-y-4">
          @for (faq of faqs; track faq.q) {
            <div class="card"><h3 class="font-semibold mb-2">{{ faq.q }}</h3><p class="text-navy-400 text-sm">{{ faq.a }}</p></div>
          }
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-20 px-4 bg-navy-900/30">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold font-serif mb-4">{{ t.ctaTitle }}</h2>
        <p class="text-navy-300 text-lg mb-8">{{ t.ctaSubtitle }}</p>
        <a routerLink="/register" class="btn-primary text-lg !py-4 !px-8 shadow-lg shadow-story-purple/25">{{ t.ctaBtn }}</a>
        <p class="text-navy-500 text-sm mt-4">{{ t.ctaNote }}</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-4 border-t border-navy-800/50">
      <div class="max-w-5xl mx-auto text-center">
        <span class="text-lg font-bold bg-gradient-to-r from-story-purple to-story-pink bg-clip-text text-transparent">Dreamlit</span>
        <p class="text-navy-500 text-sm mt-2">{{ t.footerTagline }}</p>
        <p class="text-navy-600 text-xs mt-4">{{ t.footerCopyright }}</p>
      </div>
    </footer>
  `,
})
export class LandingComponent {
  lang = inject(LanguageService);

  get t() { return this.lang.translations; }

  get testimonials() {
    const t = this.t;
    return [
      { name: t.t1Name, role: t.t1Role, quote: t.t1Quote },
      { name: t.t2Name, role: t.t2Role, quote: t.t2Quote },
      { name: t.t3Name, role: t.t3Role, quote: t.t3Quote },
      { name: t.t4Name, role: t.t4Role, quote: t.t4Quote },
      { name: t.t5Name, role: t.t5Role, quote: t.t5Quote },
      { name: t.t6Name, role: t.t6Role, quote: t.t6Quote },
    ];
  }

  get faqs() {
    const t = this.t;
    return [
      { q: t.q1, a: t.a1 },
      { q: t.q2, a: t.a2 },
      { q: t.q3, a: t.a3 },
      { q: t.q4, a: t.a4 },
      { q: t.q5, a: t.a5 },
      { q: t.q6, a: t.a6 },
    ];
  }
}
