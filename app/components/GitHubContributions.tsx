import type { CSSProperties } from "react";
import snapshot from "../data/github-contributions.json";
import styles from "./GitHubContributions.module.css";

const username = "sudoKrishna";
const profile = `https://github.com/${username}`;
const dayMs = 86_400_000;
const monthLabel = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});
const dateLabel = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});
const numberLabel = new Intl.NumberFormat("en-US");

type Contribution = { date: string; count: number; level: number };

function parseCalendar(html: string) {
  const counts = new Map<string, number>();
  for (const [, id, label] of html.matchAll(
    /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>\s*([^<]+)/g,
  )) {
    const count = label.match(/^([\d,]+) contributions?\b/);
    if (count) counts.set(id, Number(count[1].replaceAll(",", "")));
    else if (label.startsWith("No contributions")) counts.set(id, 0);
  }
  const days = new Map<string, Contribution>();

  for (const [tag] of html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const date = tag.match(/\bdata-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    const level = tag.match(/\bdata-level="([0-4])"/)?.[1];
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    const count = id ? counts.get(id) : undefined;
    if (date && level !== undefined && count !== undefined) {
      days.set(date, { date, count, level: Number(level) });
    }
  }

  const ordered = [...days.values()].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  if (
    ordered.length < 360 ||
    ordered.length > 378 ||
    ordered.some(
      (day, index) =>
        index > 0 &&
        Date.parse(day.date) - Date.parse(ordered[index - 1].date) !== dayMs,
    )
  )
    return null;
  return ordered;
}

async function getCalendar() {
  try {
    const response = await fetch(
      `https://github.com/users/${username}/contributions`,
      {
        headers: { "Accept-Language": "en-US" },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (response.ok) {
      const days = parseCalendar(await response.text());
      if (days) return { days, archived: false };
    }
  } catch {
    // Keep the last verified snapshot available if GitHub cannot be reached.
  }
  return {
    days: snapshot.map(([date, count, level]) => ({
      date: String(date),
      count: Number(count),
      level: Number(level),
    })),
    archived: true,
  };
}

export async function GitHubContributions() {
  const { days, archived } = await getCalendar();
  const first = new Date(days[0].date);
  const start = first.getTime() - first.getUTCDay() * dayMs;
  const last = new Date(days[days.length - 1].date);
  const weekCount = Math.floor((last.getTime() - start) / (7 * dayMs)) + 1;
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const months = days.filter(
    (day, index) => index === 0 || day.date.slice(-2) === "01",
  );
  const position = (date: string) => {
    const day = Math.round((Date.parse(date) - start) / dayMs);
    return { week: Math.floor(day / 7) + 2, weekday: (day % 7) + 2 };
  };

  return (
    <section
      id="github"
      aria-labelledby="github-heading"
      className="mx-auto mt-12 w-full max-w-4xl px-6"
    >
      <h2
        id="github-heading"
        className="text-[15px] font-medium text-[#1a1a1a]"
      >
        GitHub
      </h2>
      <p className={styles.summary}>
        {numberLabel.format(total)} contributions in the last year.
        {archived && (
          <span className={styles.snapshot}>
            {" "}
            As of {dateLabel.format(last)}.
          </span>
        )}
      </p>
      <div
        className={styles.scroll}
        role="region"
        aria-label="GitHub contribution calendar"
        tabIndex={0}
      >
        <div
          className={styles.calendar}
          style={{ "--weeks": weekCount } as CSSProperties}
        >
          {months.map(({ date }) => (
            <span
              key={date}
              className={styles.month}
              style={{ gridColumn: position(date).week, gridRow: 1 }}
            >
              {monthLabel.format(new Date(date))}
            </span>
          ))}
          {[
            [3, "Mon"],
            [5, "Wed"],
            [7, "Fri"],
          ].map(([row, label]) => (
            <span
              key={label}
              className={styles.weekday}
              style={{ gridColumn: 1, gridRow: row }}
            >
              {label}
            </span>
          ))}
          {days.map(({ date, count, level }) => {
            const { week, weekday } = position(date);
            const label = `${numberLabel.format(count)} ${count === 1 ? "contribution" : "contributions"} on ${dateLabel.format(new Date(date))}`;
            return (
              <span
                key={date}
                className={styles.cell}
                data-level={level}
                title={label}
                style={{ gridColumn: week, gridRow: weekday }}
              />
            );
          })}
        </div>
      </div>
      <div className={styles.footer}>
        <a href={profile} className={styles.profile}>
          @{username} <span aria-hidden="true">↗</span>
        </a>
        <div
          className={styles.legend}
          aria-label="Contribution intensity from less to more"
        >
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              aria-hidden="true"
              className={styles.cell}
              data-level={level}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </section>
  );
}
