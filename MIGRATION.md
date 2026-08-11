# Archive migration — where things stand

## Done: 33 thoughts

Every thought from **10 Sep 2020 to 12 Oct 2020** is in `_posts/`, each with its own
permalink, topic, summary and pull quote. That's a contiguous run, which matters — the
thread draws dashed "days quiet" markers wherever more than fourteen days pass, so a
patchy migration would have invented gaps that were never there.

## Not done: the remaining 61

Everything from **11 Jul 2020 to 9 Sep 2020** is still only in the old `index.html`.
Say the word and they'll be batched the same way. It's about an hour of work and it
should happen before launch, for two reasons:

1. **Numbering.** Thought numbers are computed from position, oldest first. Right now
   "Take a Breath" is No. 030. Once the older 61 are added it becomes No. 091. Any number
   you share publicly before the migration finishes will be wrong afterwards.
2. **The gap markers.** With the archive starting on 10 Sep, the thread has no history
   before it. With all 94 in, the run from July reads as one unbroken line — which is
   the whole point of that design element.

## Field reference

Each migrated post carries:

| Field | Why it exists |
|---|---|
| `title` | headline, share card, search |
| `topic` | the filter chips on `/archive/` |
| `summary` | the one-liner under each thread entry, and the search index |
| `pull` | the highlighted quote, and the text on the share image |
| `featured` | picks the three under "Where to start" on About |
| `comments` | per-thought override of the site-wide switch |
| `cause` | set `false` to hide the Jimmy Fund block on that post |

## Editorial changes made during migration

The originals had some typos and duplicated blocks. Fixed silently:

- "Tolence" → "Tolerance", "undestand" → "understand", "verison" → "version",
  "execellence" → "excellence", "succes" → "success"
- The Jimmy Fund paragraph, previously pasted into ~30 posts by hand, is now a single
  component in `_includes/cause.html`. Edit the wording once in `_config.yml` and it
  changes everywhere.
- A few stray asterisks that were leaking into the rendered page as literal `*`
  characters have been cleaned up.

Nothing was rewritten for meaning. If any of it reads wrong, it's a one-line fix in the
relevant file in `_posts/`.
