import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-navy-950 text-white">
      <nav class="fixed top-0 w-full z-50 bg-navy-950/80 backdrop-blur-lg border-b border-navy-800/50">
        <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a routerLink="/" class="text-xl font-bold bg-gradient-to-r from-story-purple to-story-pink bg-clip-text text-transparent">Dreamlit</a>
          <a routerLink="/" class="text-sm text-navy-400 hover:text-white transition-colors">← Back to Home</a>
        </div>
      </nav>

      <div class="max-w-4xl mx-auto px-4 pt-28 pb-16">
        <h1 class="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p class="text-navy-400 mb-10">Last updated: May 2025</p>

        <div class="space-y-10 text-navy-200 leading-relaxed">

          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">1. Who We Are</h2>
            <p>Dreamlit ("we", "our", "us") is operated by Dreamlit OÜ, Estonia. We provide an AI-powered personalized bedtime story service for children. Our website is <a href="https://dreamlit.ee" class="text-story-purple hover:underline">https://dreamlit.ee</a>.</p>
            <p class="mt-2">Contact: <a href="mailto:hello@dreamlit.ee" class="text-story-purple hover:underline">hello@dreamlit.ee</a></p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p class="mb-3">We collect the following information when you use Dreamlit:</p>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong class="text-white">Account information:</strong> Email address, name, and password (stored as a secure hash).</li>
              <li><strong class="text-white">Child profiles:</strong> Child's name, age, interests, and language — provided by the parent/guardian to personalize stories. We do not collect any information directly from children.</li>
              <li><strong class="text-white">Usage data:</strong> Stories generated, favorites, and library contents associated with your account.</li>
              <li><strong class="text-white">Payment information:</strong> Subscription payments are processed by Stripe or Google Play. We do not store credit card numbers. We store your subscription status and Stripe customer ID.</li>
              <li><strong class="text-white">Technical data:</strong> IP address, device type, and app version for security and rate limiting purposes.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">3. Children's Privacy (COPPA & GDPR-K)</h2>
            <p class="mb-3">Dreamlit is designed for use by parents and guardians on behalf of their children. <strong class="text-white">We do not knowingly collect personal information directly from children under 13 years of age.</strong></p>
            <ul class="list-disc pl-6 space-y-2">
              <li>All accounts must be created by adults (parents or guardians).</li>
              <li>Child profile data (name, age, interests) is provided by the parent and used solely to generate personalized stories.</li>
              <li>We do not share children's data with third parties for advertising or marketing purposes.</li>
              <li>Parents may request deletion of all data associated with their account and child profiles at any time by emailing <a href="mailto:hello@dreamlit.ee" class="text-story-purple hover:underline">hello@dreamlit.ee</a>.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">4. How We Use Your Information</h2>
            <ul class="list-disc pl-6 space-y-2">
              <li>To generate personalized bedtime stories using AI (Anthropic Claude).</li>
              <li>To provide text-to-speech narration (OpenAI TTS).</li>
              <li>To manage your account, subscription, and billing.</li>
              <li>To send transactional emails (subscription confirmation, password reset) via Resend.</li>
              <li>To prevent abuse and enforce rate limits.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">5. Third-Party Services</h2>
            <p class="mb-3">We use the following third-party services:</p>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong class="text-white">Anthropic (Claude AI)</strong> — generates story text based on your child's profile. Story prompts may be sent to Anthropic's API.</li>
              <li><strong class="text-white">OpenAI</strong> — provides text-to-speech audio narration.</li>
              <li><strong class="text-white">Stripe</strong> — processes subscription payments. Subject to <a href="https://stripe.com/privacy" class="text-story-purple hover:underline" target="_blank">Stripe's Privacy Policy</a>.</li>
              <li><strong class="text-white">Google Play</strong> — processes in-app purchases on Android. Subject to <a href="https://policies.google.com/privacy" class="text-story-purple hover:underline" target="_blank">Google's Privacy Policy</a>.</li>
              <li><strong class="text-white">Resend</strong> — sends transactional emails.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">6. Data Storage & Security</h2>
            <ul class="list-disc pl-6 space-y-2">
              <li>All data is stored on servers located in the European Union.</li>
              <li>Data is transmitted over HTTPS/TLS encryption.</li>
              <li>Passwords are hashed using BCrypt and never stored in plain text.</li>
              <li>Access tokens expire after 15 minutes; refresh tokens expire after 7 days.</li>
              <li>Audio files are stored on our server and associated with your account.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">7. Your Rights (GDPR)</h2>
            <p class="mb-3">If you are in the European Union, you have the right to:</p>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong class="text-white">Access</strong> — request a copy of your personal data.</li>
              <li><strong class="text-white">Rectification</strong> — correct inaccurate data.</li>
              <li><strong class="text-white">Erasure</strong> — request deletion of your account and all associated data.</li>
              <li><strong class="text-white">Portability</strong> — receive your data in a machine-readable format.</li>
              <li><strong class="text-white">Objection</strong> — object to processing of your data.</li>
            </ul>
            <p class="mt-3">To exercise these rights, contact us at <a href="mailto:hello@dreamlit.ee" class="text-story-purple hover:underline">hello@dreamlit.ee</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">8. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. If you delete your account, we will delete all associated data within 30 days, except where required by law (e.g., billing records for 7 years per Estonian accounting law).</p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">9. Cookies</h2>
            <p>The Dreamlit web application uses local storage for authentication tokens. We do not use tracking cookies or advertising cookies. The mobile app uses secure on-device storage for authentication tokens.</p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or via the app. Continued use of Dreamlit after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-white mb-3">11. Contact Us</h2>
            <p>For any privacy-related questions or requests:</p>
            <ul class="list-none pl-0 mt-2 space-y-1">
              <li>📧 <a href="mailto:hello@dreamlit.ee" class="text-story-purple hover:underline">hello@dreamlit.ee</a></li>
              <li>🌐 <a href="https://dreamlit.ee" class="text-story-purple hover:underline">https://dreamlit.ee</a></li>
              <li>🏢 Dreamlit OÜ, Estonia</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {}
