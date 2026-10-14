/* =========================================================
   YURRR Portfolio — main.js (jQuery)
   1. 인트로
   2. 헤더 (스크롤 배경 / 어두운 영역 표시)
   3. 모바일 메뉴
   4. 현재 섹션 메뉴 활성화
   5. 스크롤 등장 효과
   6. PROJECT 가로 스크롤 (GSAP ScrollTrigger)
   7. 숫자 카운트
   8. Design ⇄ Code 전환
   ========================================================= */
$(function () {
  var $win = $(window);
  var $html = $('html');
  var $body = $('body');
  var $header = $('#header');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. 인트로: YURI + RRR → YURRR → 사라지면서 로고 표시 */
  var $intro = $('.intro');
  var introTimers = [];

  function startHero() {
    $body.addClass('is-loaded');
    countStats();
  }

  function finishIntro() {
    $.each(introTimers, function (i, t) { clearTimeout(t); });
    $html.removeClass('is-intro');
    $intro.addClass('is-done');
    setTimeout(function () { $intro.remove(); }, 400);
    try { sessionStorage.setItem('yurrr-intro-seen', '1'); } catch (e) {}
    $(document).off('keydown.intro');
    startHero();
  }

  if ($intro.length && !$html.hasClass('no-intro')) {
    $html.addClass('is-intro');
    introTimers.push(setTimeout(function () { $intro.addClass('is-in'); }, 100));     // 글자 등장
    introTimers.push(setTimeout(function () { $intro.addClass('is-merge'); }, 1600)); // YURRR로 합쳐짐
    introTimers.push(setTimeout(finishIntro, 2700));                                  // 사라짐
    $intro.on('click', finishIntro);                  // 클릭하면 건너뛰기
    $(document).on('keydown.intro', finishIntro);     // 아무 키나 누르면 건너뛰기
  } else {
    $intro.remove();
    startHero();
  }

  /* 2. 헤더: 스크롤하면 배경 / 어두운 영역(PROJECT, FOOTER) 위에서는 어둡게 */
  var $darkAreas = $('.is-dark');

  function updateHeader() {
    var scrollTop = $win.scrollTop();
    var headerMid = scrollTop + $header.outerHeight() / 2;
    var onDark = false;

    $darkAreas.each(function () {
      var top = $(this).offset().top;
      var bottom = top + $(this).outerHeight();
      if (headerMid >= top && headerMid <= bottom) onDark = true;
    });

    $header.toggleClass('is-scrolled', scrollTop > 8);
    $header.toggleClass('is-on-dark', onDark);
  }

  /* 3. 모바일 메뉴 */
  var $toggle = $('.gnb__toggle');
  var $navLinks = $('.gnb__link');

  function setNav(open) {
    $body.toggleClass('is-nav-open', open);
    $toggle.attr('aria-expanded', open);
    $toggle.find('.sr-only').text(open ? '메뉴 닫기' : '메뉴 열기');
  }

  $toggle.on('click', function () {
    setNav(!$body.hasClass('is-nav-open'));
  });

  $navLinks.on('click', function () {
    setNav(false);
  });

  // Esc 키로 메뉴 닫기
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $body.hasClass('is-nav-open')) {
      setNav(false);
      $toggle.trigger('focus');
    }
  });

  // 화면이 넓어지면 모바일 메뉴 닫기
  $win.on('resize', function () {
    if ($win.width() > 767) setNav(false);
  });

  /* 4. 현재 섹션 메뉴 활성화: 화면 가운데에 있는 섹션의 메뉴에 aria-current */
  function updateNav() {
    var line = $win.scrollTop() + $win.height() / 2;

    $navLinks.each(function () {
      var $section = $($(this).attr('href'));
      if (!$section.length) return;

      var top = $section.offset().top;
      var bottom = top + $section.outerHeight();

      if (line >= top && line < bottom) {
        $navLinks.removeAttr('aria-current');
        $(this).attr('aria-current', 'true');
      }
    });
  }

  /* 5. 스크롤 등장 효과: 화면 아래 90% 지점에 들어오면 표시 */
  var $reveals = $('.reveal');

  function updateReveal() {
    var line = $win.scrollTop() + $win.height() * 0.9;

    $reveals.not('.is-visible').each(function () {
      if ($(this).offset().top < line) $(this).addClass('is-visible');
    });
  }

  if (reduceMotion) $reveals.addClass('is-visible');

  // 스크롤할 때마다 2·4·5 갱신
  function onScroll() {
    updateHeader();
    updateNav();
    if (!reduceMotion) updateReveal();
  }
  $win.on('scroll resize', onScroll);
  onScroll();

  /* 6. PROJECT 가로 스크롤
     - PC(1024px 이상): GSAP ScrollTrigger로 섹션을 고정(pin)하고, 세로 스크롤만큼 카드를 가로로 이동(scrub)
     - 태블릿·모바일: 카드 영역을 손가락으로 가로 스크롤 */
  var $project = $('#project');
  var $viewport = $project.find('[data-project-viewport]');
  var $track = $project.find('[data-project-track]');
  var $items = $track.find('.project__item');
  var total = $items.length;
  var projectST = null;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  // 카드 번호와 전체 개수 표시
  $project.find('[data-project-total]').text(pad(total));
  $items.each(function (i) {
    $(this).find('.project-card__num').text(pad(i + 1));
  });

  // 진행 표시 (p: 0 ~ 1)
  function renderProgress(p) {
    $project.find('[data-project-bar]').css('transform', 'scaleX(' + p + ')');
    $project.find('[data-project-current]').text(pad(Math.round(p * (total - 1)) + 1));
  }

  // 카드 트랙이 가로로 이동해야 하는 거리
  function getDistance() {
    return Math.max(0, $track[0].scrollWidth - $viewport.width());
  }

  // 태블릿·모바일: 가로 스크롤 위치로 진행 표시
  $viewport.on('scroll', function () {
    if (projectST) return;
    var max = this.scrollWidth - this.clientWidth;
    renderProgress(max > 0 ? this.scrollLeft / max : 0);
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // 조건에 맞는 화면에서만 실행, 벗어나면 return 함수로 자동 정리
    gsap.matchMedia().add('(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)', function () {
      $project.addClass('is-pinned');

      var tween = gsap.to($track[0], {
        x: function () { return -getDistance(); },  // 왼쪽으로 이동
        ease: 'none',
        scrollTrigger: {
          trigger: $project.find('.project__stage')[0],
          start: 'top top',                                       // 섹션 위쪽이 화면 위쪽에 닿으면 시작
          end: function () { return '+=' + getDistance(); },      // 이동 거리만큼 스크롤하면 끝
          pin: true,                                              // 그동안 섹션 고정
          scrub: 0.6,                                             // 스크롤에 맞춰 부드럽게 따라옴
          invalidateOnRefresh: true,                              // 화면 크기가 바뀌면 다시 계산
          onUpdate: function (self) { renderProgress(self.progress); }
        }
      });
      projectST = tween.scrollTrigger;

      return function () {
        projectST = null;
        $project.removeClass('is-pinned');
        renderProgress(0);
      };
    });

    // 폰트·이미지를 다 불러온 뒤 위치 다시 계산
    $win.on('load', function () { ScrollTrigger.refresh(); });
  }

  // 키보드(Tab)로 화면 밖 카드에 포커스가 가면 그 카드가 보이는 위치로 이동
  $items.on('focusin', function () {
    if (!projectST) return;
    var x = Math.min(this.offsetLeft, getDistance());
    $viewport.scrollLeft(0);
    window.scrollTo({ top: projectST.start + x, behavior: 'instant' });
  });

  /* 7. HOME 숫자 카운트: jQuery animate로 0부터 실제 값까지 */
  function countStats() {
    if (reduceMotion) return;

    $('.stat__num').each(function (i) {
      var $num = $(this);
      var text = $num.text().trim();       // 예: "17+"
      var end = parseInt(text, 10);         // 17
      var suffix = text.replace(end, '');   // "+"
      if (isNaN(end)) return;

      $num.text('0' + suffix);
      $({ value: 0 }).delay(500 + i * 80).animate({ value: end }, {
        duration: 1200,
        easing: 'swing',
        step: function (now) { $num.text(Math.round(now) + suffix); },
        complete: function () { $num.text(text); }
      });
    });
  }

  /* 8. HOME Design ⇄ Code 전환 */
  var $stage = $('.hero__stage');
  var $viewBtns = $('[data-view-btn]');
  var $codePanel = $('[data-view-panel="code"]');
  var $codeTarget = $('[data-code-target]');

  // 코드 원본을 줄 단위로 나눠 출력 (줄 번호는 CSS counter)
  var lines = $.trim($('#hero-code-source').html()).split('\n');
  $.each(lines, function (i, line) {
    $('<span class="code-line">').text(line || ' ').appendTo($codeTarget);
  });

  $viewBtns.on('click', function () {
    var view = $(this).data('view-btn');
    $stage.attr('data-view', view);
    $codePanel.prop('hidden', view !== 'code');
    $viewBtns.attr('aria-pressed', 'false');
    $(this).attr('aria-pressed', 'true');
  });

  /* 미정 링크(href="#") 클릭 시 맨 위로 튀지 않게 */
  $('a[href="#"]').on('click', function (e) { e.preventDefault(); });
});
