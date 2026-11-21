export interface ManifestoItem {
  title: string;
  body: string;
}

export const manifesto: ManifestoItem[] = [
  { title: "Answer before explaining", body: "Put the direct answer in the opening lines, then add the proof, nuance, and next action. This helps readers and answer engines find the point quickly." },
  { title: "Name the exact entity", body: "Use the real product, person, place, version, and date—not vague pronouns. Clear entities make a claim easier to understand and cite." },
  { title: "Write the strange follow-up", body: "The second, awkward question is often the one no competing page answers. It creates useful long-tail coverage without keyword stuffing." },
  { title: "Show one real example", body: "A concise worked example can turn a generic claim into evidence. It improves comprehension and gives generative systems something concrete to ground on." },
  { title: "Links carry meaning", body: "Link from a relevant sentence on a trusted internal page. Descriptive anchors communicate more context than a generic navigation link." },
  { title: "Consolidate overlap", body: "When two pages answer the same intent, merge them into one stronger resource and redirect the weaker route. Fewer, clearer choices beat competing near-duplicates." },
  { title: "Update with a reason", body: "Do not change dates as decoration. Update a page when the examples, recommendation, data, or product behavior genuinely changed." },
  { title: "Measure the full path", body: "Indexing and rank are inputs. The useful signal is whether the right visitor clicks, understands, and completes a valuable next step." },
];