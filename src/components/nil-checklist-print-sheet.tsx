import type { ReactNode } from "react";
import { DATA } from "@/data/resume";

type NilChecklistPrintSheetProps = {
  author: string;
};

function PrintCol({ children }: { children: ReactNode }) {
  return <div className="nil-print-col">{children}</div>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="nil-print-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="nil-print-sub">
      <h3>{title}</h3>
      <ul>{children}</ul>
    </div>
  );
}

function Item({
  children,
  realTalk,
  subs,
}: {
  children: ReactNode;
  realTalk?: string;
  subs?: string[];
}) {
  return (
    <li>
      <label>
        <input type="checkbox" readOnly aria-hidden tabIndex={-1} />
        <span>{children}</span>
      </label>
      {subs?.map((sub) => (
        <em key={sub}>{sub}</em>
      ))}
      {realTalk ? (
        <p className="nil-print-real-talk">
          <strong>Real talk:</strong> {realTalk}
        </p>
      ) : null}
    </li>
  );
}

function ProExample({ title, quote }: { title: string; quote: string }) {
  return (
    <div className="nil-print-pro">
      <h4>{title}</h4>
      <p>{quote}</p>
    </div>
  );
}

function PrintPageHeader() {
  return (
    <div className="nil-print-page-header">NIL Athlete Financial Checklist</div>
  );
}

function PrintPageFooter({ author }: { author: string }) {
  return (
    <div className="nil-print-page-footer">
      <p>By {author}</p>
      <p className="nil-print-url">{DATA.url}/</p>
    </div>
  );
}

export function NilChecklistPrintSheet({ author }: NilChecklistPrintSheetProps) {
  return (
    <div className="nil-print-sheet">
      <div className="nil-print-page">
        <PrintPageHeader />
        <div className="nil-print-content">
        <PrintCol>
          <Section title="Bag Talk: Know What's Coming In">
            <Sub title="1st: Track Every Deal">
              <Item realTalk="Mixing personal and NIL money is how things get messy fast. Keep them apart from day one.">
                Open a separate bank account for NIL income only.
              </Item>
              <Item realTalk="You already have the skills. You've used Excel before. No excuses.">
                Build a deal tracker in Excel: deal name, total payment, upfront amount,
                remaining amount, payment status, dates.
              </Item>
              <Item
                subs={["Guaranteed = upfront", "Conditional = after you deliver"]}
              >
                Know the difference: <strong>Guaranteed income</strong> vs.{" "}
                <strong>Conditional income</strong>.
              </Item>
              <Item subs={["Divide total payment by number of posts/appearances."]}>
                Calculate your income per deliverable.
              </Item>
              <Item
                subs={[
                  "Which brands actually pay on time?",
                  "What happens if I transfer?",
                ]}
              >
                Track time to payment.
              </Item>
            </Sub>
            <Sub title="2nd: Know the Risks">
              <Item realTalk="Bad actors reach out cold. Unqualified advisors are often people you love. Non-licensed consultants look legit but aren't. Agents may prioritize their cut over your future.">
                Identify who is in your corner and verify they're qualified.
              </Item>
              <Item
                subs={[
                  "Are you licensed? By whom?",
                  "How are they looking to be compensated? What is their cut?",
                ]}
              >
                Ask every advisor:
              </Item>
              <Item>Google and background check everyone who touches your money.</Item>
            </Sub>
          </Section>
        </PrintCol>

        <PrintCol>
          <Section title="Protect Your Paper: Secure the Bag">
            <Sub title="3rd: Savings Vehicles">
              <Item subs={["Earns more than a standard savings account."]}>
                Open a <strong>High-Yield Savings Account (HYSA)</strong>.
              </Item>
              <Item realTalk="Regardless of what people tell you, always verify FDIC insurance.">
                Confirm any bank you use is <strong>FDIC insured</strong> up to $250k.
              </Item>
              <Item realTalk="NIL income has NO taxes withheld. The money hits looking whole. It is not whole.">
                Set aside <strong>20–30% of every NIL payment</strong> immediately for
                taxes.
              </Item>
            </Sub>
            <Sub title="4th: Start Investing (When Ready)">
              <Item>
                <strong>Robinhood</strong> — best interface for beginners learning the
                basics of investing
              </Item>
              <Item>
                <strong>Fidelity</strong> — best for long-term, serious money
              </Item>
              <Item realTalk="WARNING: Crypto is volatile. Only invest what you're comfortable losing.">
                <strong>Coinbase</strong> — if you're doing crypto, this is the safest
                mainstream option
              </Item>
              <Item>
                <strong>Diversify.</strong> Don't put everything in one place.
              </Item>
            </Sub>
            <ProExample
              title="Pro Example: Kevin Garnett"
              quote="Lost over $70M to a financial advisor he fully trusted. He had no idea it was happening. Without awareness, the wrong person can cost you everything."
            />
          </Section>
        </PrintCol>
        </div>

        <p className="nil-print-band">Ten minutes. No excuses.</p>
        <PrintPageFooter author={author} />
      </div>

      <div className="nil-print-page">
        <PrintPageHeader />
        <div className="nil-print-content">
        <PrintCol>
          <Section title="Taxes Don't Redshirt: NIL & the IRS">
            <Sub title="5th: Understand What You Owe">
              <Item realTalk='If you are truly in the business of "you" then you need to protect yourself from avoidable issues.'>
                NIL income = <strong>self-employment income</strong>. You are the business.
              </Item>
              <Item>
                File a tax return if you made <strong>$400+</strong> in NIL income.
              </Item>
              <Item>
                Receive a <strong>Form 1099</strong> (not W-2) if paid $600+ from one
                source.
              </Item>
              <Item>
                File <strong>Schedule C</strong> (Profit or Loss from Business) with Form
                1040.
              </Item>
              <Item>
                Know that gifts, gift cards, and merch count as{" "}
                <strong>taxable income</strong> too.
              </Item>
              <Item>
                Understand your NIL income must be reported on <strong>FAFSA</strong> —
                it can impact financial aid.
              </Item>
            </Sub>
            <Sub title="6th: Best Practices">
              <Item>
                Make <strong>quarterly estimated tax payments</strong> (Jan 15, Apr 15,
                Jul 15, Oct 15).
              </Item>
              <Item>
                Document every legitimate business expense: equipment, travel, agent
                fees, branding costs.
              </Item>
              <Item>
                Keep all 1099s, contracts, bank statements, and receipts.
              </Item>
              <Item realTalk="Understanding the basics keeps you in control even when you hire a pro.">
                Work with a qualified <strong>CPA</strong> or enrolled agent.
              </Item>
            </Sub>
            <ProExample
              title="Pro Example: Allen Iverson"
              quote="Earned over $200M. His inner circle spent it all. The people closest to you aren't always the most qualified to guide your money."
            />
          </Section>
        </PrintCol>

        <PrintCol>
          <Section title="#'s That Follow You: Credit & Team">
            <Sub title="7th: Build Credit Now">
              <Item realTalk={"A lot of people like to say: \"Don't worry, you are young, you have time.\" That is utter bullsh*t."}>
                Open a credit card. Use it. Pay it off in full every month.
              </Item>
              <Item>Monitor your credit score regularly.</Item>
              <Item>
                Freeze your credit with{" "}
                <strong>TransUnion, Equifax, and Experian</strong> to block fraudulent
                inquiries.
              </Item>
              <Item>
                Keep credit utilization low. Pay bills on time. Every time.
              </Item>
            </Sub>
            <Sub title="8th: Starter Cards (If You're Building From Zero)">
              <Item>
                <strong>Chase Freedom Unlimited®</strong> — $0 fee, 1.5%–5% cash back,
                $300 bonus
              </Item>
              <Item>
                <strong>Bank of America® Customized Cash Rewards</strong> — $0 fee, up to
                6% back
              </Item>
              <Item>
                <strong>Amex Gold</strong> — only once you've built solid credit.
                $325/yr fee
              </Item>
            </Sub>
            <Sub title="9th: Choose Your Team Wisely">
              <Item>
                <strong>Accountant (CPA)</strong> — licensed, verifiable experience
              </Item>
              <Item>
                <strong>Lawyer</strong> — reviews every NIL contract before you sign
              </Item>
              <Item>
                <strong>Financial Advisor</strong> — fiduciary, meaning they're legally
                required to act in your interest
              </Item>
              <Item>
                <strong>Agent</strong> — understand exactly how they're compensated and
                what they take
              </Item>
            </Sub>
            <ProExample
              title="Pro Example: Latrell Sprewell"
              quote="Lost tens of millions after failed business deals and bad advice. Not everyone who sounds like an expert is qualified — and bad guidance can be just as costly as bad intent."
            />
          </Section>
        </PrintCol>
        </div>

        <p className="nil-print-disclaimer">
          The goal of this checklist is NOT to act as a complete, holistic money
          management guide. It is a foundation that prepares you to ask the right
          questions, spot potential red flags, and take ownership of your financial
          future.
        </p>
        <PrintPageFooter author={author} />
      </div>
    </div>
  );
}
