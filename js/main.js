(function () {
  'use strict';

  var body = document.body;
  var header = document.getElementById('header');
  var toggle = document.querySelector('.gnb__toggle');
  var toggleText = toggle.querySelector('.sr-only');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.gnb__link'));
  var mobileQuery = window.matchMedia('(max-width: 767px)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. 인트로 → Hero 진입 모션 */
  function startHero() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { body.classList.add('is-loaded'); });
    });
  }

  var root = document.documentElement;
  var intro = document.querySelector('.intro');
  var introOn = intro && !root.classList.contains('no-intro');

  if (!introOn) {
    if (intro) intro.remove();
    startHero();
  } else {
    runIntro();
  }

  function runIntro() {
    var mark = intro.querySelector('.intro__mark');
    var drops = intro.querySelectorAll('.intro__drop');
    var logoShort = document.querySelector('.logo__short');
    var timers = [];
    var finished = false;

    root.classList.add('is-intro');

    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    function finish() {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      root.classList.remove('is-intro');
      intro.classList.add('is-done');
      setTimeout(function () { intro.remove(); }, 250);
      try { sessionStorage.setItem('yurrr-intro-seen', '1'); } catch (e) {}
      window.removeEventListener('keydown', finish);
      startHero();
    }

    function merge() {
      // 현재 폭을 고정한 뒤 0으로 → RI, + 가 접히며 YURRR 로 합쳐짐
      Array.prototype.forEach.call(drops, function (el) {
        el.style.width = el.getBoundingClientRect().width + 'px';
      });
      intro.offsetWidth; // 리플로우로 시작 폭 확정
      intro.classList.add('is-merge');
      Array.prototype.forEach.call(drops, function (el) {
        el.style.width = '0px';
        el.style.marginLeft = '0px';
        el.style.marginRight = '0px';
      });
    }

    function fly() {
      var from = mark.getBoundingClientRect();
      var to = logoShort.getBoundingClientRect();
      var scale = parseFloat(getComputedStyle(logoShort).fontSize) / parseFloat(getComputedStyle(mark).fontSize);
      var dx = to.left - from.left;
      var dy = (to.top + to.height / 2) - (from.top + (from.height * scale) / 2);
      intro.classList.add('is-fly');
      mark.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(' + scale + ')';
    }

    function play() {
      intro.classList.add('is-in');   // 0.0s  YURI + RRR 등장
      later(merge, 1500);             // 1.5s  YURRR 로 합쳐짐
      later(fly, 2250);               // 2.25s 로고 자리로 이동
      later(finish, 3100);            // 3.1s  로고로 교체, 메인 시작
    }

    intro.addEventListener('click', finish);
    window.addEventListener('keydown', finish);

    // 폰트가 준비된 뒤 시작 (최대 0.8초 대기)
    var started = false;
    function go() { if (!started) { started = true; requestAnimationFrame(play); } }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
    setTimeout(go, 800);
  }

  /* 2. 스크롤 시 헤더 배경 */
  var darkAreas = document.querySelectorAll('.is-dark');

  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);

    // 어두운 영역(PROJECT, FOOTER) 위에 있을 때 헤더도 어둡게
    var mid = header.offsetHeight / 2;
    var onDark = Array.prototype.some.call(darkAreas, function (el) {
      var r = el.getBoundingClientRect();
      return r.top <= mid && r.bottom >= mid;
    });
    header.classList.toggle('is-on-dark', onDark);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* 3. 모바일 메뉴 */
  function setNav(open) {
    body.classList.toggle('is-nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggleText.textContent = open ? '메뉴 닫기' : '메뉴 열기';
  }

  toggle.addEventListener('click', function () {
    setNav(!body.classList.contains('is-nav-open'));
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () { setNav(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (!body.classList.contains('is-nav-open')) return;

    if (e.key === 'Escape') {
      setNav(false);
      toggle.focus();
      return;
    }

    // 메뉴가 열린 동안 포커스를 메뉴 안에 유지
    if (e.key === 'Tab') {
      var items = [toggle].concat(navLinks);
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  mobileQuery.addEventListener('change', function (e) {
    if (!e.matches) setNav(false);
  });

  /* 4. 현재 섹션 메뉴 활성화 */
  var sections = navLinks.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  });

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { if (section) navObserver.observe(section); });
  }

  /* 5. 스크롤 등장 효과 */
  var reveals = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* 6. PROJECT 가로 스크롤
     - 데스크톱: 섹션을 고정하고, 세로 스크롤 거리만큼 카드 트랙을 가로로 이동
     - 그 외: 카드 영역 자체의 가로 스크롤 사용 (진행 표시만 갱신) */
  var project = document.getElementById('project');
  var pin = project.querySelector('[data-project-pin]');
  var viewport = project.querySelector('[data-project-viewport]');
  var track = project.querySelector('[data-project-track]');
  var items = track.querySelectorAll('.project__item');
  var bar = project.querySelector('[data-project-bar]');
  var currentEl = project.querySelector('[data-project-current]');
  var totalEl = project.querySelector('[data-project-total]');
  var pinQuery = window.matchMedia('(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
  var isPinned = false;
  var distance = 0;
  var ticking = false;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  totalEl.textContent = pad(items.length);
  Array.prototype.forEach.call(items, function (item, i) {
    var num = item.querySelector('.project-card__num');
    if (num) num.textContent = pad(i + 1);
  });

  function renderProgress(p) {
    bar.style.transform = 'scaleX(' + p + ')';
    currentEl.textContent = pad(Math.min(items.length, Math.round(p * (items.length - 1)) + 1));
  }

  function updateProject() {
    ticking = false;
    var p;

    if (isPinned) {
      var top = pin.getBoundingClientRect().top;
      p = distance > 0 ? Math.min(Math.max(-top / distance, 0), 1) : 0;
      track.style.transform = 'translate3d(' + (-p * distance) + 'px, 0, 0)';
    } else {
      var max = viewport.scrollWidth - viewport.clientWidth;
      p = max > 0 ? viewport.scrollLeft / max : 0;
    }

    renderProgress(p);
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateProject);
    }
  }

  function measureProject() {
    isPinned = pinQuery.matches;
    project.classList.toggle('is-pinned', isPinned);
    track.style.transform = '';

    if (isPinned) {
      viewport.scrollLeft = 0;
      distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      // 가로 이동 거리만큼 세로 스크롤 공간 확보 (1:1)
      pin.style.height = (window.innerHeight + distance) + 'px';
    } else {
      distance = 0;
      pin.style.height = '';
    }

    updateProject();
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  viewport.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', measureProject);
  pinQuery.addEventListener('change', measureProject);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureProject);
  measureProject();

  // 키보드로 화면 밖 카드에 포커스가 가면, 해당 카드가 보이는 위치로 세로 스크롤 이동
  viewport.addEventListener('focusin', function (e) {
    if (!isPinned) return;
    var item = e.target.closest('.project__item');
    if (!item) return;
    viewport.scrollLeft = 0;
    var target = Math.min(item.offsetLeft, distance);
    var pinTop = pin.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: pinTop + target, behavior: 'instant' }); // CSS smooth-scroll 무시하고 즉시 이동
  });

  /* 7. 미정 링크(href="#") 클릭 시 상단 이동 방지 — 실제 링크로 교체하면 삭제 가능 */
  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* 8. HOME Design ⇄ Code 전환 */
  var stage = document.querySelector('.hero__stage');
  var viewBtns = document.querySelectorAll('[data-view-btn]');
  var codePanel = document.querySelector('[data-view-panel="code"]');
  var codeTarget = document.querySelector('[data-code-target]');
  var codeSource = document.getElementById('hero-code-source');

  function esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 간단한 HTML 구문 강조: 주석 / 태그 / 속성 / 값
  function highlightHTML(src) {
    var out = '';
    var last = 0;
    var tokenRe = /<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>/g;
    var m;

    while ((m = tokenRe.exec(src))) {
      out += esc(src.slice(last, m.index));
      var token = m[0];

      if (token.indexOf('<!--') === 0) {
        out += '<span class="tok-com">' + esc(token) + '</span>';
      } else {
        var parts = token.match(/^<(\/?)([a-zA-Z0-9-]+)([\s\S]*?)(\/?)>$/);
        var attrs = parts[3];
        var attrOut = '';
        var aLast = 0;
        var attrRe = /([\w:-]+)(?:="([^"]*)")?/g;
        var a;

        while ((a = attrRe.exec(attrs))) {
          attrOut += esc(attrs.slice(aLast, a.index));
          attrOut += '<span class="tok-attr">' + esc(a[1]) + '</span>';
          if (a[2] !== undefined) attrOut += '=<span class="tok-str">&quot;' + esc(a[2]) + '&quot;</span>';
          aLast = attrRe.lastIndex;
        }
        attrOut += esc(attrs.slice(aLast));

        out += '<span class="tok-tag">&lt;' + parts[1] + parts[2] + '</span>' + attrOut +
               '<span class="tok-tag">' + parts[4] + '&gt;</span>';
      }
      last = tokenRe.lastIndex;
    }
    out += esc(src.slice(last));

    return out.split('\n').map(function (line) {
      return '<span class="code-line">' + (line || ' ') + '</span>';
    }).join('');
  }

  if (stage && codeSource && codeTarget) {
    codeTarget.innerHTML = highlightHTML(codeSource.textContent.replace(/^\n+|\s+$/g, ''));

    viewBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var view = btn.getAttribute('data-view-btn');
        stage.setAttribute('data-view', view);
        codePanel.hidden = view !== 'code';
        viewBtns.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
      });
    });
  }

  /* 9. HOME 배경: 격자 점 물결 (마우스 근처는 포인트 컬러로 반응) */
  var hero = document.getElementById('home');
  var canvas = hero && hero.querySelector('.hero__bg');

  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var dpr = 1;
    var W = 0;
    var H = 0;
    var gap = 32;
    var pointer = { x: -9999, y: -9999, strength: 0, target: 0 };
    var heroVisible = true;
    var rafId = null;
    var css = getComputedStyle(document.documentElement);
    var dotRGB = (css.getPropertyValue('--dot-rgb') || '32, 32, 32').trim();
    var hotRGB = (css.getPropertyValue('--dot-hot-rgb') || '53, 89, 224').trim();

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth;
      H = hero.clientHeight;
      gap = W < 768 ? 26 : 32;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMotion) drawDots(0);
    }

    function drawDots(t) {
      ctx.clearRect(0, 0, W, H);
      pointer.strength += (pointer.target - pointer.strength) * 0.08;

      for (var y = gap / 2; y < H; y += gap) {
        for (var x = gap / 2; x < W; x += gap) {
          // 세 개의 사인파를 겹쳐 느린 물결 생성 (-1 ~ 1)
          var wave = (Math.sin(x * 0.010 + t * 0.0006) +
                      Math.sin(y * 0.014 - t * 0.0005) +
                      Math.sin((x + y) * 0.006 + t * 0.0004)) / 3;
          var r = 0.9 + (wave + 1) * 0.55;
          var alpha = 0.10 + (wave + 1) * 0.09;

          var dx = x - pointer.x;
          var dy = y - pointer.y;
          var near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 170) * pointer.strength;

          ctx.beginPath();
          ctx.arc(x, y, r + near * 2.2, 0, Math.PI * 2);
          if (near > 0.04) {
            ctx.fillStyle = 'rgba(' + hotRGB + ', ' + (0.25 + near * 0.6).toFixed(3) + ')';
          } else {
            ctx.fillStyle = 'rgba(' + dotRGB + ', ' + alpha.toFixed(3) + ')';
          }
          ctx.fill();
        }
      }
    }

    function loop(t) {
      drawDots(t);
      rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (reduceMotion || rafId !== null || !heroVisible || document.hidden) return;
      rafId = requestAnimationFrame(loop);
    }

    function stop() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    }

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var rect = hero.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.target = (pointer.y >= 0 && pointer.y <= rect.height) ? 1 : 0;
    }, { passive: true });

    document.addEventListener('pointerleave', function () { pointer.target = 0; });

    // 화면에 보일 때만 그리기 (성능)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
        if (heroVisible) start(); else stop();
      }).observe(hero);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    if ('ResizeObserver' in window) {
      new ResizeObserver(resizeCanvas).observe(hero);
    } else {
      window.addEventListener('resize', resizeCanvas);
    }
    resizeCanvas();
    start();
  }
})();
