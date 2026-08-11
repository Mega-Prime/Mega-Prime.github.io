/* ============================================================
   URSpective — site.js
   No dependencies. Everything degrades gracefully without JS.
   ============================================================ */
(function () {
  'use strict';

  /* ---- mobile menu ------------------------------------- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.textContent = open ? 'Close' : 'Menu';
    });
  }

  /* ---- copy link --------------------------------------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    var url = b.getAttribute('data-copy');
    var done = function () {
      var old = b.textContent;
      b.textContent = 'Link copied';
      setTimeout(function () { b.textContent = old; }, 1800);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link:', url); });
    } else {
      window.prompt('Copy this link:', url);
    }
  });

  /* ---- archive: search + topic filter ------------------ */
  var q = document.getElementById('q');
  var results = document.getElementById('results');
  if (q && results) {
    var items = Array.prototype.slice.call(results.querySelectorAll('.t-item'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('#topicChips .chip'));
    var noResults = document.getElementById('noResults');
    var count = document.getElementById('resultCount');
    var topic = '';

    function apply() {
      var term = q.value.trim().toLowerCase();
      var shown = 0;
      items.forEach(function (el) {
        var okTopic = !topic || el.getAttribute('data-topic') === topic;
        var okTerm = !term || (el.getAttribute('data-text') || '').indexOf(term) !== -1;
        var show = okTopic && okTerm;
        el.hidden = !show;
        if (show) shown++;
      });
      if (noResults) noResults.hidden = shown !== 0;
      if (count) {
        var filtering = term || topic;
        count.hidden = !filtering;
        count.textContent = shown + (shown === 1 ? ' thought' : ' thoughts') + ' matching.';
      }
      // hide gap markers whenever a filter is active
      results.querySelectorAll('.t-gap').forEach(function (g) { g.hidden = !!(term || topic); });
    }

    q.addEventListener('input', apply);
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.classList.remove('on'); });
        c.classList.add('on');
        topic = c.getAttribute('data-topic') || '';
        apply();
      });
    });

    // deep link: /archive/?topic=Poems
    var param = new URLSearchParams(window.location.search).get('topic');
    if (param) {
      var match = chips.filter(function (c) { return c.getAttribute('data-topic') === param; })[0];
      if (match) match.click();
    }
  }

  /* ---- share card ---------------------------------------
     Draws a 1080x1080 card on a canvas and downloads it.
     Nothing is uploaded anywhere; it happens in the browser.
  --------------------------------------------------------- */
  var cardBtn = document.getElementById('cardBtn');
  if (cardBtn) {
    cardBtn.addEventListener('click', function () {
      var label = cardBtn.textContent;
      cardBtn.textContent = 'Making it…';
      var go = function () {
        try {
          drawCard({
            title: cardBtn.getAttribute('data-title') || '',
            quote: cardBtn.getAttribute('data-quote') || '',
            no: cardBtn.getAttribute('data-no') || '',
            date: cardBtn.getAttribute('data-date') || ''
          });
          cardBtn.textContent = 'Saved';
        } catch (err) {
          cardBtn.textContent = 'Could not save';
        }
        setTimeout(function () { cardBtn.textContent = label; }, 2000);
      };
      if (document.fonts && document.fonts.ready) { document.fonts.ready.then(go); } else { go(); }
    });
  }

  function drawCard(d) {
    var S = 1080, P = 90;
    var c = document.createElement('canvas');
    c.width = S; c.height = S;
    var x = c.getContext('2d');

    x.fillStyle = '#141B34';
    x.fillRect(0, 0, S, S);

    var glow = x.createRadialGradient(S / 2, 0, 0, S / 2, 0, 620);
    glow.addColorStop(0, 'rgba(242,169,59,0.20)');
    glow.addColorStop(1, 'rgba(242,169,59,0)');
    x.fillStyle = glow;
    x.fillRect(0, 0, S, S);

    // stamp
    x.fillStyle = '#F2A93B';
    x.font = '500 26px "IBM Plex Mono", monospace';
    x.fillText('THOUGHT No. ' + d.no + '  ·  ' + d.date, P, P + 26);

    // title
    x.fillStyle = '#FFFFFF';
    var size = 92;
    x.font = '800 ' + size + 'px Archivo, sans-serif';
    var lines = wrap(x, d.title.toUpperCase(), S - P * 2);
    while (lines.length > 3 && size > 52) {
      size -= 8;
      x.font = '800 ' + size + 'px Archivo, sans-serif';
      lines = wrap(x, d.title.toUpperCase(), S - P * 2);
    }
    var y = P + 190;
    lines.forEach(function (ln) { x.fillText(ln, P, y); y += size * 0.98; });

    // quote
    if (d.quote) {
      y += 40;
      x.fillStyle = '#D5DBEC';
      x.font = '300 40px Newsreader, Georgia, serif';
      wrap(x, d.quote, S - P * 2).slice(0, 6).forEach(function (ln) { x.fillText(ln, P, y); y += 58; });
    }

    // footer rule + wordmark
    x.strokeStyle = 'rgba(255,255,255,0.16)';
    x.lineWidth = 2;
    x.beginPath(); x.moveTo(P, S - P - 76); x.lineTo(S - P, S - P - 76); x.stroke();

    x.font = '900 40px Archivo, sans-serif';
    x.fillStyle = '#F2A93B';
    x.fillText('UR', P, S - P - 16);
    var w = x.measureText('UR').width;
    x.fillStyle = '#FFFFFF';
    x.fillText('SPECTIVE', P + w, S - P - 16);

    x.font = '400 24px "IBM Plex Mono", monospace';
    x.fillStyle = '#8592B8';
    var host = 'urspective.com';
    x.fillText(host, S - P - x.measureText(host).width, S - P - 20);

    var a = document.createElement('a');
    a.download = 'urspective-' + d.no + '.png';
    a.href = c.toDataURL('image/png');
    a.click();
  }

  function wrap(ctx, text, max) {
    var words = String(text).split(/\s+/), lines = [], line = '';
    words.forEach(function (word) {
      var test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > max && line) { lines.push(line); line = word; }
      else { line = test; }
    });
    if (line) lines.push(line);
    return lines;
  }

  /* ---- SMS waitlist (no backend yet) ------------------- */
  var sms = document.getElementById('smsWaitlist');
  if (sms) {
    sms.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.getElementById('smsNote');
      if (note) {
        note.textContent = 'Texts aren\u2019t wired up yet, so nothing was sent. Email hello@urspective.com with your number and Mega will add you to the list by hand.';
        note.style.color = 'var(--beacon-deep)';
      }
    });
  }
})();
