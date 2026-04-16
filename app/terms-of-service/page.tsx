import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import BackToAllGames from "@/components/BackToAllGames";

export function generateMetadata(): Metadata {
  return {
    title: "Terms of Service | Mergedle",
    description:
      "Terms of Service and user agreements for playing on Mergedle, the unofficial Merge Tactics daily puzzle hub.",
    alternates: { canonical: `${SITE.url}/terms-of-service` },
  };
}

export default function TermsOfServicePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-white">
      <div className="mb-6">
        <BackToAllGames />
      </div>
      <h1 className="text-3xl font-bold mb-2 text-indigo-400 font-game">Terms of Service</h1>
      <p className="text-white/50 text-sm mb-8">Last Updated: 16.04.2026</p>

      <div className="space-y-8 text-white/80 leading-relaxed text-sm">
        <section>
          <p>
            Welcome to {SITE.name} (&quot;Website,&quot; &quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to
            and use of our Website and the browser-based games made available through it.
          </p>
          <p className="mt-3">
            By accessing or using the Website, you agree to be bound by these Terms. If you do
            not agree to these Terms, you must discontinue use immediately.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">1. Description of Service</h2>
          <p>
            The Website provides free-to-play, browser-based games for entertainment purposes.
            These may include word-based games, puzzle games, and other casual games.
          </p>
          <p className="mt-3">
            We reserve the right to modify, suspend, or discontinue any part of the Website at
            any time without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">
            2. Unofficial Fan Content Disclaimer
          </h2>
          <p>
            {SITE.name} is not affiliated with, endorsed, sponsored, or approved by Supercell Oy.
            Merge Tactics and all related trademarks, logos, and intellectual property are the
            property of Supercell Oy. This Website complies with the Supercell Fan Content Policy.
            Any content displayed remains the property of its respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">3. Eligibility</h2>
          <p>
            You must be at least 13 years old (or the minimum legal age in your jurisdiction) to
            use this Website.
          </p>
          <p className="mt-3">
            By using the Website, you represent that you meet this requirement.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Use the Website for any unlawful purpose.</li>
            <li>Attempt to disrupt or interfere with the Website&apos;s functionality.</li>
            <li>Reverse engineer, copy, or redistribute Website content without permission.</li>
            <li>Use automated scripts, bots, or scraping tools to extract data.</li>
            <li>Attempt to gain unauthorized access to any part of the Website.</li>
          </ul>
          <p className="mt-3">
            We reserve the right to restrict or block access to users who violate these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">5. Intellectual Property</h2>
          <p>
            Unless otherwise stated, all original content on this Website (including game design,
            layout, graphics, text, and code) is owned by or licensed to us and is protected under
            applicable intellectual property laws.
          </p>
          <p className="mt-3">
            You may not reproduce, distribute, modify, or create derivative works from Website
            content without prior written permission.
          </p>
          <p className="mt-3">
            Third-party trademarks and content remain the property of their respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">6. Privacy</h2>
          <p>We do not require user registration.</p>
          <p className="mt-3">
            However, certain technical data (such as IP address, browser type, and server logs)
            may be automatically processed for security and operational purposes.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">7. Disclaimer of Warranties</h2>
          <p>
            The Website and all games are provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
            without warranties of any kind, either express or implied.
          </p>
          <p className="mt-3">We do not guarantee that:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>The Website will be uninterrupted or error-free.</li>
            <li>Games will function without bugs or defects.</li>
            <li>The Website will be secure or free from harmful components.</li>
            <li>
              Game progress, scores, or data will be preserved. Such data may be lost or reset at
              any time.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising out of or related to
            your use of the Website.
          </p>
          <p className="mt-3">This includes, but is not limited to:</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Loss of data</li>
            <li>Loss of access</li>
            <li>Technical issues</li>
            <li>Gameplay interruptions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">
            9. Third-Party Advertising
          </h2>
          <p>
            The Website may display advertisements provided by third-party advertising
            partners. We do not control and are not responsible for the content, accuracy, or
            practices of such advertisements or third-party websites.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">
            10. Changes to These Terms
          </h2>
          <p>
            We may update these Terms at any time. Continued use of the Website constitutes
            acceptance of changes.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">
            11. Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate access to the Website at our discretion,
            without notice, for conduct that violates these Terms or is otherwise harmful.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">
            12. Governing Law
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the
            jurisdiction in which the Website operator is established, without regard to conflict
            of law principles.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">
            13. Contact
          </h2>
          <p>If you have questions about these Terms, you may contact us at:</p>
          <p className="mt-3">
            Email:{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              {SITE.contactEmail}
            </a>
          </p>
          <p className="mt-8">
            By using this Website, you acknowledge that you have read, understood, and agree to
            these Terms of Service.
          </p>
        </section>
      </div>
    </main>
  );
}
