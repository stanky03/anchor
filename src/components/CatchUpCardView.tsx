"use client";

import { useEffect, useRef } from "react";

import { formatTimestamp } from "@/lib/captions";
import { cn } from "@/lib/utils";
import type { CatchUpCard } from "@/types";

type CatchUpCardViewProps = {
  card: CatchUpCard;
};

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-xs font-semibold uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </h3>
  );
}

// Scannable recap: each section is a colored small-caps label (same label
// language as the rest of the app) with short lines under it — key items
// in medium weight so highlights don't blend into a wall of text.
function CardSection({
  label,
  labelClassName,
  items,
  emphasize,
}: {
  label: string;
  labelClassName?: string;
  items: string[];
  emphasize?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-1.5">
      <SectionLabel className={labelClassName}>{label}</SectionLabel>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="text-muted-foreground">
              •
            </span>
            <span
              className={cn(
                "leading-(--app-leading)",
                emphasize && "font-medium",
              )}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CatchUpCardView({ card }: CatchUpCardViewProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    regionRef.current?.focus();
  }, []);

  const isEmpty =
    !card.currentTopic &&
    card.whatChanged.length === 0 &&
    card.decisions.length === 0 &&
    card.possibleTasksForUser.length === 0 &&
    card.openQuestions.length === 0 &&
    card.userMentions.length === 0;

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label="Catch-up recap"
      tabIndex={-1}
      className="space-y-5 rounded-xl bg-muted p-4 text-sm outline-none"
    >
      <p className="text-xs text-muted-foreground">
        Covers {formatTimestamp(card.fromTimestamp)} →{" "}
        {formatTimestamp(card.toTimestamp)}
      </p>

      {isEmpty ? (
        <p>Nothing captured in that window yet — try again in a moment.</p>
      ) : (
        <>
          {card.currentTopic && (
            <section className="space-y-1.5">
              <SectionLabel className="text-section-thread">Now</SectionLabel>
              <p className="font-medium leading-(--app-leading)">
                {card.currentTopic}
              </p>
            </section>
          )}

          <CardSection
            label="Decided"
            labelClassName="text-section-ask"
            items={card.decisions}
            emphasize
          />
          <CardSection
            label="For you"
            labelClassName="text-section-mention"
            items={card.possibleTasksForUser}
            emphasize
          />
          {card.userMentions.length > 0 ? (
            <CardSection
              label="Mentioned"
              labelClassName="text-section-mention"
              items={card.userMentions}
            />
          ) : (
            card.mentionStatus === "possibly_mentioned" && (
              <section className="space-y-1.5">
                <SectionLabel className="text-section-mention">
                  Mentioned
                </SectionLabel>
                <p className="leading-(--app-leading)">
                  You may have been mentioned, but it wasn&apos;t clear.
                </p>
              </section>
            )
          )}
          <CardSection
            label="What changed"
            labelClassName="text-muted-foreground"
            items={card.whatChanged}
          />
          <CardSection
            label="Open"
            labelClassName="text-section-tasks"
            items={card.openQuestions}
          />

          {card.suggestedQuestion && (
            <section className="space-y-1.5">
              <SectionLabel className="text-section-ask">
                Try asking
              </SectionLabel>
              <p className="font-medium leading-(--app-leading)">
                &ldquo;{card.suggestedQuestion}&rdquo;
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
