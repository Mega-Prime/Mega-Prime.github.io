# URSpective — setup

Nine steps. Steps 1–3 get the site live. Everything after that is optional and can wait.

Nothing here needs a code editor beyond typing into a text box. If a step goes wrong,
the site keeps working — features that aren't configured stay quietly switched off rather
than breaking the page.

---

## 1. Clear out the old site

In your `mega-prime.github.io` repo, **make a copy of it first** (Settings → General →
scroll down, or just download a ZIP). Then delete:

- `index.html`
- `about.html`
- any other `.html` files from the old site
- the old `_layouts` / `_includes` folders if they exist

**Keep** your image files. `20200308141822_IMG_1959.jpg` and
`20200308141459_IMG_1944.jpg` are the two headshots — you'll want them in step 3.

> The stray `---title: Mega Thoughts---` text showing at the top of your live pages
> right now is Jekyll front matter that never got processed. Deleting those files
> removes the bug. If you find a file named `.nojekyll` in the repo, delete that too —
> it's what was stopping Jekyll from running.

---

## 2. Drop this folder in

Copy everything in this folder into the root of the repo, so the structure looks like:

```
mega-prime.github.io/
├── _config.yml
├── _includes/
├── _layouts/
├── _posts/          ← 33 thoughts, migrated
├── _data/
├── admin/
├── assets/
├── index.html
├── archive.html
├── about.html
├── subscribe.html
├── shop.html
├── 404.html
└── CNAME
```

Commit and push. GitHub builds it automatically — no Actions to set up, no Node, no
local install. Give it about a minute, then check
`https://mega-prime.github.io`.

If the build fails, GitHub emails you and the reason appears under the repo's
**Actions** tab. The usual culprit is a typo in `_config.yml`.

---

## 3. Add your photos

Put these two files in `assets/img/`:

| Save it as | It's used on |
|---|---|
| `mega.jpg` | the About page portrait |
| `og.jpg` | link previews when someone shares the site (1200×630 works best) |

Rename your existing headshot to `mega.jpg`. For `og.jpg`, anything readable at small
size works — the wordmark on the ink background is a good default.

---

## 4. Point urspective.com at it

Two halves. Do both.

**At GitHub:** the `CNAME` file is already in this folder, so nothing to do. Confirm
under repo **Settings → Pages** that the custom domain shows `urspective.com` and that
**Enforce HTTPS** is ticked once it becomes available (it can take an hour).

**At your registrar,** replace the current parking records with:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `mega-prime.github.io` |

Verify these against GitHub's current docs before pasting — the IPs change rarely, but
they do change. DNS takes anywhere from ten minutes to a few hours to settle.

---

## 5. Email

1. Sign up at **buttondown.com** (free to 1,000 subscribers).
2. Settings → find your username.
3. Paste it into `_config.yml` under `services: buttondown_username:`.
4. In Buttondown, turn on **RSS-to-email** and point it at
   `https://urspective.com/feed.xml`.

That last step is what makes posting one action instead of two. Publish a thought,
the email goes out on its own.

Until you fill that in, every subscribe box on the site shows a short note pointing
people at `hello@urspective.com` instead. Nothing looks broken.

---

## 6. Studio (the editor at /studio)

Studio needs one small piece it can't get from GitHub Pages: a login helper.
GitHub Pages can't run server code, and OAuth needs a server. It's free and you set it
up once.

1. Deploy **sveltia-cms-auth** to Cloudflare Workers (free tier). Their README walks
   through it — about ten minutes.
2. Create a GitHub OAuth app: GitHub → Settings → Developer settings → OAuth Apps.
   Callback URL is the Worker's address.
3. Put the Worker's address into `admin/config.yml` as `base_url`.
4. While you're in that file, check `repo:` and `branch:` match your actual repo.

Then visit `urspective.com/studio`, sign in with GitHub, and write.

**If you'd rather skip this entirely:** you can post by adding a file to `_posts/`
through GitHub's own web interface, using an existing post as a template. It's clunkier,
but it works from a phone browser and needs no setup. Studio is the nicer version of
the same thing.

---

## 7. Comments

1. Sign up at **hyvor.com/talk** (~$5/month, guest commenting, no signup wall for readers).
2. Console → copy your **Website ID**.
3. Paste it into `_config.yml` under `services: hyvor_website_id:`.
4. In the Hyvor console, turn on **moderation / pre-approval** so nothing appears until
   you approve it.

Switches, all in `_config.yml` under `features:`:

- `comments: false` — hides every thread across the whole site, instantly
- per-thought, add `comments: false` to that post's front matter

---

## 8. The rest of the switches

Everything below lives in `_config.yml` under `features:`.

| Switch | What it does |
|---|---|
| `comments` | master on/off for all comment threads |
| `shop` | `false` hides Shop from the menu and shows a holding page |
| `sms` | `false` turns the phone field into a waitlist |
| `show_gaps` | the dashed "days quiet" markers on the thread |
| `cause_block` | the Jimmy Fund block on thought pages |

**Leave `shop: false` until at least three products are real.** An empty shop reads
as an abandoned site.

---

## 9. hello@urspective.com

Most registrars sell email forwarding for a few pounds a year, or include it free.
Set `hello@urspective.com` to forward to your Protonmail. It's already wired into the
footer, the contact links, and every fallback message on the site.

---

## Text messages — read before you spend anything

SMS is the one item here with real cost and real paperwork:

- US carriers require **10DLC brand and campaign registration** before marketing texts
  will deliver. Roughly $20–60 one-off, then a few dollars a month.
- Around a cent per message per person. At 200 subscribers, daily, that's ~$60/month.
- You must keep **opt-in records** and handle **STOP** and **HELP** replies. That's law,
  not a nicety.

The waitlist on `/subscribe/` costs nothing and answers the question for you. If forty
people sign up, it's worth doing. If four do, you saved yourself the paperwork.

---

## Writing a new thought by hand

Create `_posts/2026-08-07-your-title.md`:

```markdown
---
title: "Your Title"
topic: "Mindset"
summary: "One line, under 90 characters, shows on the thread."
pull: "The line worth screenshotting. Optional."
comments: true
---

Write here. **Bold** with two stars, *italic* with one.

Blank line between paragraphs.
```

The thought number, the permalink, the RSS entry, the email, the search index and the
share card are all generated from that. You never type a number.
