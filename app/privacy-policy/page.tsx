import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import BackToAllGames from "@/components/BackToAllGames";

export function generateMetadata(): Metadata {
  return {
    title: "Privacy Policy | Mergedle",
    description:
      "Read the Privacy Policy for Mergedle. Learn how we protect your data while you play our free Merge Tactics daily puzzle games.",
    alternates: { canonical: `${SITE.url}/privacy-policy` },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-white">
      <div className="mb-6">
        <BackToAllGames />
      </div>
      <h1 className="text-3xl font-bold mb-2 text-indigo-400 font-game">Privacy Policy</h1>
      <p className="text-white/50 text-sm mb-8">Last Updated: 21.03.2026</p>

      <div className="space-y-8 text-white/80 leading-relaxed text-sm">

        <section>
          <p>
            This Privacy Policy explains how {SITE.name} (&quot;Website,&quot; &quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;) handles information in connection with your use
            of the Website.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">1. Data Collection</h2>
          <p>
            We do not require account registration and we do not intentionally collect personal
            information such as names, email addresses, or user profiles.
          </p>
          <p className="mt-3">
            However, when you access the Website, certain technical information may be
            automatically processed by our hosting provider or server infrastructure. This may
            include:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device type</li>
            <li>Operating system</li>
            <li>Date and time of access</li>
            <li>Basic request and error logs</li>
          </ul>
          <p className="mt-3">
            This information is processed for security, maintenance, and operational purposes.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">2. Local Storage</h2>
          <p>
            Game progress, statistics, and preferences are stored locally in your browser via
            localStorage. This data never leaves your device and is not sent to our servers.
            You can clear it at any time through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">3. Analytics</h2>
          <p>
            The Website uses Vercel Analytics and Vercel Speed Insights to collect anonymized
            page view data and Core Web Vitals performance metrics. This data is processed by
            Vercel Inc. under their Privacy Policy. No personally identifiable information is
            collected through these services.
          </p>
          <p className="mt-3">
            The Website does not use advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">4. How Information Is Used</h2>
          <p>Any technical information processed is used solely to:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Maintain website functionality</li>
            <li>Monitor security and prevent abuse</li>
            <li>Diagnose technical issues</li>
          </ul>
          <p className="mt-3">We do not sell, rent, or trade user information.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">5. Third-Party Infrastructure</h2>
          <p>
            The Website is hosted on Vercel. Vercel Analytics and Vercel Speed Insights are used
            to collect anonymized performance data. We do not integrate advertising networks or
            third-party tracking systems beyond this.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">6. Data Retention</h2>
          <p>
            We do not maintain user accounts and therefore do not store personal user profiles.
            Server logs and technical records may be retained for limited periods as required for
            security and operational purposes by our hosting provider.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">7. Children&apos;s Privacy</h2>
          <p>
            We do not knowingly collect personal information from children under the age of 13
            (or the minimum age required by applicable law). If you believe a child has provided
            personal information, please contact us so appropriate steps can be taken.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Updates will be posted on this
            page with a revised &quot;Last Updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">9. Contact</h2>
          <p>If you have questions about this Privacy Policy, you may contact us at:</p>
          <p className="mt-3">
            Email:{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              {SITE.contactEmail}
            </a>
          </p>
        </section>

        <div className="pt-6 border-t border-white/10 text-xs text-white/30">
          <p>Mergedle is not affiliated with, endorsed, sponsored, or approved by Supercell Oy.</p>
        </div>
      </div>
    </main>
  );
}
