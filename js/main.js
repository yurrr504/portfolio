var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // 움직임 줄이기 설정
var introTimer = [];
var projectST = null; // PROJECT 가로 스크롤 (gsap scrollTrigger)

//intro
function introStart() {
	if ($('.intro').length == 0 || $('html').hasClass('no-intro')) {
		$('.intro').remove();
		heroStart();
		return;
	}

	$('html').addClass('is-intro');
	introTimer.push(setTimeout(function () {
		$('.intro').addClass('is-in'); // YURI + RRR 등장
	}, 100));
	introTimer.push(setTimeout(function () {
		$('.intro').addClass('is-merge'); // YURRR 로 합쳐짐
	}, 1600));
	introTimer.push(setTimeout(introEnd, 2700));

	// 클릭하거나 키보드 누르면 건너뛰기
	$('.intro').click(introEnd);
	$(document).on('keydown.intro', introEnd);
}

function introEnd() {
	for (var i = 0; i < introTimer.length; i++) {
		clearTimeout(introTimer[i]);
	}
	$('html').removeClass('is-intro');
	$('.intro').addClass('is-done');
	setTimeout(function () {
		$('.intro').remove();
	}, 400);
	$(document).off('keydown.intro');

	try {
		sessionStorage.setItem('yurrr-intro-seen', '1'); // 같은 탭에서는 한 번만
	} catch (e) {}

	heroStart();
}

//hero
function heroStart() {
	$('body').addClass('is-loaded');
	countNum();
}

//숫자 카운트
function countNum() {
	if (reduceMotion) return;

	$('.stat__num').each(function (i) {
		var el = $(this);
		var txt = el.text().trim(); // ex) 17+
		var finalNum = parseInt(txt, 10); // 17
		var unit = txt.replace(finalNum, ''); // +

		if (isNaN(finalNum)) return;

		el.text('0' + unit);
		$({ num: 0 }).delay(500 + i * 80).animate({ num: finalNum }, {
			duration: 1200,
			step: function (now) {
				el.text(Math.round(now) + unit);
			},
			complete: function () {
				el.text(txt);
			}
		});
	});
}

//header
function headerFixed() {
	var scrollTop = $(window).scrollTop();
	var headerMid = scrollTop + $('.header').outerHeight() / 2;
	var onDark = false;

	if (scrollTop > 8) {
		$('.header').addClass('is-scrolled');
	} else {
		$('.header').removeClass('is-scrolled');
	}

	// 어두운 영역(PROJECT, FOOTER) 위에서는 헤더도 어둡게
	$('.is-dark').each(function () {
		var top = $(this).offset().top;
		var bottom = top + $(this).outerHeight();
		if (headerMid >= top && headerMid <= bottom) {
			onDark = true;
		}
	});

	if (onDark) {
		$('.header').addClass('is-on-dark');
	} else {
		$('.header').removeClass('is-on-dark');
	}
}

//mobile menu
function menuOpen() {
	$('body').addClass('is-nav-open');
	$('.gnb__toggle').attr('aria-expanded', 'true');
	$('.gnb__toggle .sr-only').text('메뉴 닫기');
}

function menuClose() {
	$('body').removeClass('is-nav-open');
	$('.gnb__toggle').attr('aria-expanded', 'false');
	$('.gnb__toggle .sr-only').text('메뉴 열기');
}

function mobileMenu() {
	$('.gnb__toggle').click(function () {
		if (!$('body').hasClass('is-nav-open')) {
			menuOpen();
		} else {
			menuClose();
		}
	});

	$('.gnb__link').click(function () {
		menuClose();
	});

	// esc 키로 닫기
	$(document).on('keydown', function (e) {
		if (e.key == 'Escape' && $('body').hasClass('is-nav-open')) {
			menuClose();
			$('.gnb__toggle').focus();
		}
	});

	// pc 화면이 되면 닫기
	$(window).on('resize', function () {
		if ($(window).width() > 767) {
			menuClose();
		}
	});
}

//gnb on (화면 가운데에 있는 섹션 메뉴 표시)
function gnbOn() {
	var line = $(window).scrollTop() + $(window).height() / 2;

	$('.gnb__link').each(function () {
		var section = $($(this).attr('href'));
		if (section.length == 0) return;

		var top = section.offset().top;
		var bottom = top + section.outerHeight();

		if (line >= top && line < bottom) {
			$('.gnb__link').removeAttr('aria-current');
			$(this).attr('aria-current', 'true');
		}
	});
}

//scroll fade (화면 아래 90% 지점에 들어오면 보이기)
function scrollFade() {
	if (reduceMotion) {
		$('.reveal').addClass('is-visible');
		return;
	}

	var line = $(window).scrollTop() + $(window).height() * 0.9;

	$('.reveal').each(function () {
		if (!$(this).hasClass('is-visible') && $(this).offset().top < line) {
			$(this).addClass('is-visible');
		}
	});
}

//project 번호
function projectNum() {
	var item = $('.project__item');
	var totalNum = item.length;

	if (totalNum < 10) {
		totalNum = '0' + totalNum;
	}
	$('[data-project-total]').text(totalNum);

	item.each(function (i) {
		var num = i + 1;
		if (num < 10) {
			num = '0' + num;
		}
		$(this).find('.project-card__num').text(num);
	});
}

//project 진행 표시 (per : 0 ~ 1)
function projectPager(per) {
	var total = $('.project__item').length;
	var nowNum = Math.round(per * (total - 1)) + 1;

	if (nowNum < 10) {
		nowNum = '0' + nowNum;
	}
	$('[data-project-current]').text(nowNum);
	$('[data-project-bar]').css('transform', 'scaleX(' + per + ')');
}

//project 카드가 가로로 이동할 거리
function projectWidth() {
	var trackW = $('[data-project-track]')[0].scrollWidth;
	var viewW = $('[data-project-viewport]').width();
	return Math.max(0, trackW - viewW);
}

//project 가로 스크롤
function projectSlide() {
	// 태블릿·모바일 : 카드 영역을 손가락으로 가로 스크롤
	$('[data-project-viewport]').on('scroll', function () {
		if (projectST) return;
		var max = this.scrollWidth - this.clientWidth;
		if (max > 0) {
			projectPager(this.scrollLeft / max);
		} else {
			projectPager(0);
		}
	});

	// 키보드(tab)로 화면 밖 카드에 가면 그 카드가 보이는 위치로 이동
	$('.project__item').on('focusin', function () {
		if (!projectST) return;
		var x = Math.min(this.offsetLeft, projectWidth());
		$('[data-project-viewport]').scrollLeft(0);
		window.scrollTo({ top: projectST.start + x, behavior: 'instant' });
	});

	if (!window.gsap || !window.ScrollTrigger) return;
	gsap.registerPlugin(ScrollTrigger);

	// pc : 1024px 이상 + 높이 700px 이상일 때만 실행 (조건 벗어나면 return 함수로 정리)
	gsap.matchMedia().add('(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)', function () {
		$('#project').addClass('is-pinned');

		var slide = gsap.to('[data-project-track]', {
			x: function () {
				return -projectWidth(); // 왼쪽으로 이동
			},
			ease: 'none',
			scrollTrigger: {
				trigger: '.project__stage',
				start: 'top top', // 섹션 위쪽이 화면 위쪽에 닿으면 시작
				end: function () {
					return '+=' + projectWidth(); // 이동 거리만큼 스크롤하면 끝
				},
				pin: true, // 그동안 섹션 고정
				scrub: 0.6, // 스크롤에 맞춰 따라옴
				invalidateOnRefresh: true, // 리사이즈 시 다시 계산
				onUpdate: function (self) {
					projectPager(self.progress);
				}
			}
		});
		projectST = slide.scrollTrigger;

		return function () {
			projectST = null;
			$('#project').removeClass('is-pinned');
			projectPager(0);
		};
	});

	// 이미지·폰트 다 불러온 뒤 위치 다시 계산
	$(window).on('load', function () {
		ScrollTrigger.refresh();
	});
}

//hero design / code 보기
function viewChange() {
	// 코드 원본을 한 줄씩 넣기 (줄 번호는 css counter)
	var codeLine = $.trim($('#hero-code-source').html()).split('\n');
	for (var i = 0; i < codeLine.length; i++) {
		$('<span class="code-line">').text(codeLine[i] || ' ').appendTo('[data-code-target]');
	}

	$('[data-view-btn]').click(function () {
		var view = $(this).data('view-btn');

		$('.hero__stage').attr('data-view', view);
		$('[data-view-btn]').attr('aria-pressed', 'false');
		$(this).attr('aria-pressed', 'true');

		if (view == 'code') {
			$('[data-view-panel="code"]').prop('hidden', false);
		} else {
			$('[data-view-panel="code"]').prop('hidden', true);
		}
	});
}

$(document).ready(function () {
	introStart();
	mobileMenu();
	projectNum();
	projectSlide();
	viewChange();

	headerFixed();
	gnbOn();
	scrollFade();

	$(window).on('scroll resize', function () {
		headerFixed();
		gnbOn();
		scrollFade();
	});

	// 링크 없는 a 태그 클릭 시 맨 위로 안 튀게
	$('a[href="#"]').click(function (e) {
		e.preventDefault();
	});
});
