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
          <a routerLink="/register" class="btn-primary text-sm !py-2 !px-4">Try Free Tonight</a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-28 pb-20 px-4 text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-story-purple/10 via-transparent to-transparent pointer-events-none"></div>
      <div class="max-w-3xl mx-auto relative">
        <p class="text-story-gold text-sm font-semibold tracking-widest uppercase mb-4">Bedtime, reimagined</p>
        <h1 class="text-4xl md:text-6xl font-bold font-serif leading-tight mb-6">
          Tonight, your child is the
          <span class="bg-gradient-to-r from-story-purple via-story-pink to-story-gold bg-clip-text text-transparent">hero</span>
        </h1>
        <p class="text-xl md:text-2xl text-navy-300 mb-4 max-w-2xl mx-auto leading-relaxed">
          Imagine their face when they hear a bedtime story with <em>their name</em>, <em>their favorite animal</em>, and a magical adventure made just for them.
        </p>
        <p class="text-navy-400 mb-8 max-w-lg mx-auto">
          Personalized stories in 60+ languages. Ready in seconds. With soothing audio narration that guides them gently to sleep.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a routerLink="/register" class="btn-primary text-lg !py-4 !px-8 shadow-lg shadow-story-purple/25">Create Their First Story Free</a>
        </div>
        <p class="text-navy-500 text-sm mt-4">No credit card. No commitment. Just magic at bedtime.</p>

        <!-- Social proof bar -->
        <div class="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-navy-400">
          <span class="flex items-center gap-1.5">
            <span class="text-story-gold">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            Loved by parents
          </span>
          <span class="hidden sm:inline text-navy-700">|</span>
          <span>60+ languages</span>
          <span class="hidden sm:inline text-navy-700">|</span>
          <span>Ages 2-10</span>
          <span class="hidden sm:inline text-navy-700">|</span>
          <span>Audio narration</span>
        </div>
      </div>
    </section>

    <!-- Pain Point / Empathy -->
    <section class="py-16 px-4">
      <div class="max-w-2xl mx-auto text-center">
        <p class="text-2xl md:text-3xl font-serif text-navy-200 leading-relaxed">
          "Read it again!" "One more story!" "But I'm not sleepy..."
        </p>
        <p class="text-navy-400 mt-4">
          Sound familiar? You're exhausted. They're wired. And you've read <em>The Very Hungry Caterpillar</em> 347 times.
        </p>
        <p class="text-navy-300 mt-3 font-medium">
          What if every night brought a brand-new story — starring <em>your</em> child?
        </p>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 px-4 bg-navy-900/30">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-4">Ready in under a minute</h2>
        <p class="text-navy-400 text-center mb-12 max-w-lg mx-auto">Three taps. That's all it takes between "I want a story!" and peaceful silence.</p>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-story-purple/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">&#128118;</div>
            <h3 class="font-semibold text-lg mb-2">1. Tell us about your child</h3>
            <p class="text-navy-400 text-sm">Their name, age, what they love — dinosaurs, princesses, space, puppies. We remember it all.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-story-pink/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">&#10024;</div>
            <h3 class="font-semibold text-lg mb-2">2. Choose the adventure</h3>
            <p class="text-navy-400 text-sm">Courage, friendship, ocean, space — or tap "Surprise me!" and let the magic decide.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-story-gold/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">&#127769;</div>
            <h3 class="font-semibold text-lg mb-2">3. Press play & relax</h3>
            <p class="text-navy-400 text-sm">A warm, soothing voice reads their personal story. Watch their eyes get heavy. Tiptoe out. You're free.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Story Preview -->
    <section class="py-20 px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-3">Hear the difference</h2>
        <p class="text-navy-400 mb-8">This isn't a generic fairy tale. This is <em>their</em> story.</p>
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
          <p class="text-navy-500 text-xs mt-4 text-center italic">Every story features your child's name, interests, and favorite animals.</p>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="py-20 px-4 bg-navy-900/30">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Why parents switch to Dreamlit</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="card flex gap-4">
            <span class="text-2xl mt-0.5">&#128164;</span>
            <div>
              <h3 class="font-semibold mb-1">They actually fall asleep</h3>
              <p class="text-navy-400 text-sm">Calm narration + a story they love = eyes closed in minutes. Not hours. Minutes.</p>
            </div>
          </div>
          <div class="card flex gap-4">
            <span class="text-2xl mt-0.5">&#10084;&#65039;</span>
            <div>
              <h3 class="font-semibold mb-1">They feel special</h3>
              <p class="text-navy-400 text-sm">"That's MY name!" The look on their face when they're the hero is worth everything.</p>
            </div>
          </div>
          <div class="card flex gap-4">
            <span class="text-2xl mt-0.5">&#127793;</span>
            <div>
              <h3 class="font-semibold mb-1">Never the same story twice</h3>
              <p class="text-navy-400 text-sm">Fresh adventures every night. No more reading the same book until you can recite it in your sleep.</p>
            </div>
          </div>
          <div class="card flex gap-4">
            <span class="text-2xl mt-0.5">&#127760;</span>
            <div>
              <h3 class="font-semibold mb-1">Stories in their language</h3>
              <p class="text-navy-400 text-sm">60+ languages — from Estonian to Japanese. Perfect for bilingual families or heritage language practice.</p>
            </div>
          </div>
          <div class="card flex gap-4">
            <span class="text-2xl mt-0.5">&#128106;</span>
            <div>
              <h3 class="font-semibold mb-1">Works for every child</h3>
              <p class="text-navy-400 text-sm">Add up to 5 kids. Each gets stories tailored to their age, interests, and personality.</p>
            </div>
          </div>
          <div class="card flex gap-4">
            <span class="text-2xl mt-0.5">&#128260;</span>
            <div>
              <h3 class="font-semibold mb-1">Save your evenings</h3>
              <p class="text-navy-400 text-sm">Press play, step away. The story handles bedtime so you can finally have that cup of tea.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-3">Don't take our word for it</h2>
        <p class="text-navy-400 text-center mb-12">Here's what real parents are saying.</p>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (t of testimonials; track t.name) {
            <div class="card">
              <div class="flex gap-1 text-story-gold text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p class="text-navy-200 text-sm mb-4">"{{ t.quote }}"</p>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-story-purple to-story-pink flex items-center justify-center text-xs font-bold">{{ t.name[0] }}</div>
                <div>
                  <p class="text-sm font-semibold">{{ t.name }}</p>
                  <p class="text-xs text-navy-500">{{ t.role }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="py-20 px-4 bg-navy-900/30" id="pricing">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-3">Less than a coffee. More than a bedtime book.</h2>
        <p class="text-navy-400 mb-12">Start free. Upgrade when you can't imagine bedtime without it.</p>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="card">
            <h3 class="font-semibold text-lg mb-2">Free</h3>
            <p class="text-3xl font-bold mb-1">$0</p>
            <p class="text-navy-500 text-sm mb-6">Forever free</p>
            <ul class="text-sm text-navy-300 space-y-3 mb-6 text-left">
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> 1 personalized story per day</li>
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> Your child's name & interests</li>
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> 1 beautiful illustration</li>
              <li class="flex items-start gap-2"><span class="text-navy-600 mt-0.5">&#10007;</span> <span class="text-navy-500">No audio narration</span></li>
            </ul>
            <a routerLink="/register" class="btn-secondary w-full block text-center">Start Free</a>
          </div>
          <div class="card border-story-purple/50 relative">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-story-purple to-story-pink text-white text-xs px-4 py-1 rounded-full font-semibold">Most Popular</div>
            <h3 class="font-semibold text-lg mb-2">Pro</h3>
            <p class="text-3xl font-bold mb-1">$7.99<span class="text-sm text-navy-400 font-normal">/mo</span></p>
            <p class="text-story-gold text-sm mb-6 font-medium">7 days free — cancel anytime</p>
            <ul class="text-sm text-navy-200 space-y-3 mb-6 text-left">
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> <strong>Unlimited</strong> stories every day</li>
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> Longer stories (500-600 words)</li>
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> 3-4 illustrations per story</li>
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> <strong>Audio narration</strong> — 4 soothing voices</li>
              <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">&#10003;</span> PDF keepsakes to print & save</li>
            </ul>
            <a routerLink="/register" class="btn-primary w-full block text-center">Start 7-Day Free Trial</a>
            <p class="text-navy-500 text-xs mt-3 text-center">That's $0.26/night for peaceful bedtimes</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-20 px-4">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Questions parents ask</h2>
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

    <!-- Final CTA -->
    <section class="py-20 px-4 bg-navy-900/30">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold font-serif mb-4">Bedtime doesn't have to be a battle</h2>
        <p class="text-navy-300 text-lg mb-8">Tonight could be the night they ask to go to bed. Seriously.</p>
        <a routerLink="/register" class="btn-primary text-lg !py-4 !px-8 shadow-lg shadow-story-purple/25">Create Their First Story — It's Free</a>
        <p class="text-navy-500 text-sm mt-4">Takes 30 seconds. No credit card required.</p>
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
    { name: 'Sarah M.', role: 'Mom of 2', quote: 'My daughter now ASKS to go to bed. She runs to her room saying "Is my story ready?" I never thought I\'d see the day.' },
    { name: 'James K.', role: 'Dad of 1', quote: 'I press play, and he\'s out within 5 minutes. Every. Single. Night. This app has given me my evenings back.' },
    { name: 'Priya L.', role: 'Mom of 3', quote: 'Three kids, three completely different stories, all at the same time. No more fighting over whose book to read. This is a lifesaver.' },
    { name: 'Kadri T.', role: 'Mom of 1', quote: 'We use it in Estonian — my son hears his own name in his mother tongue every night. He tells his friends at school about his adventures.' },
    { name: 'Michael R.', role: 'Dad of 2', quote: 'My kids used to need 45 minutes of negotiation to sleep. Now it\'s one story, lights out, done. Worth every cent of the Pro plan.' },
    { name: 'Aisha B.', role: 'Mom of 2', quote: 'The story had her name, her cat Mr. Whiskers, AND her obsession with rainbows. She looked at me like I made actual magic. I almost cried.' },
  ];

  faqs = [
    { q: 'How does it work?', a: 'Tell us your child\'s name, age, and what they love. In seconds, our AI weaves a unique bedtime story starring them. Pro users also get soothing audio narration — just press play and relax.' },
    { q: 'Is the free plan really free?', a: 'Completely. One personalized story every day, no credit card, no catch. Most parents upgrade to Pro after the first week because their kids won\'t let them stop.' },
    { q: 'Are the stories safe for kids?', a: 'Every story is warm, gentle, and ends peacefully. No scary elements, no villains, no nightmares. Just cozy adventures designed to calm little minds before sleep.' },
    { q: 'Can I cancel anytime?', a: 'Yes, instantly. No emails, no phone calls, no guilt trips. Cancel in one click and keep Pro features until your billing period ends.' },
    { q: 'What ages is this for?', a: 'Ages 2-10. The stories automatically adjust — simpler language and shorter sentences for toddlers, richer vocabulary and longer narratives for older kids.' },
    { q: 'Can I use it in my own language?', a: 'Yes! Dreamlit supports 60+ languages including Estonian, Finnish, Russian, Spanish, French, German, Chinese, Japanese, Arabic, and many more. Perfect for bilingual families.' },
  ];
}
