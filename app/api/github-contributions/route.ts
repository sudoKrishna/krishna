const USERNAME = "sudoKrishna";

export const revalidate = 3600; // re-scrape at most once an hour

export async function GET() {
  try {
    const res = await fetch(`https://github.com/users/${USERNAME}/contributions`, {
      headers: {
        // GitHub serves a stripped-down response without a browser UA
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`GitHub responded with ${res.status}`);
    }

    const html = await res.text();

    const dayRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
    const days: { date: string; level: number }[] = [];

    let match: RegExpExecArray | null;
    while ((match = dayRegex.exec(html))) {
      days.push({ date: match[1], level: Number(match[2]) });
    }

    if (days.length === 0) {
      throw new Error("no contribution cells found in response");
    }

    // the table markup emits cells row-major (by weekday), not in date order
    days.sort((a, b) => a.date.localeCompare(b.date));

    const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in the last year/);
    const total = totalMatch
      ? Number(totalMatch[1].replace(/,/g, ""))
      : days.length;

    const weeks: number[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7).map((d) => d.level));
    }

    return Response.json(
      { weeks, total, source: "live" },
      { headers: { "Cache-Control": "public, max-age=3600" } }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "failed to fetch contributions" },
      { status: 502 }
    );
  }
}
