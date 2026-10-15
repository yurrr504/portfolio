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
	textWave();
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

//hero 글자 물결 (마우스 닿은 글자가 위로 올라갔다 내려옴)
function textWave() {
	var title = $('.hero__display');
	if (title.length == 0 || reduceMotion) return;

	// 스크린리더는 원래 문장 한 줄로 읽도록
	title.prepend('<span class="sr-only">' + $.trim(title.text().replace(/\s+/g, ' ')) + '</span>');
	title.find('.hero__line').attr('aria-hidden', 'true');

	// 글자를 하나씩 span 으로 나누기 (단어 단위로 묶어서 줄바꿈 방지)
	function splitText(el) {
		$(el).contents().each(function () {
			if (this.nodeType == 3) {
				var words = this.nodeValue.split(/(\s+)/);
				var html = '';
				for (var i = 0; i < words.length; i++) {
					if (words[i] == '') continue;
					if ($.trim(words[i]) == '') {
						html += ' ';
					} else {
						html += '<span class="word">';
						for (var j = 0; j < words[i].length; j++) {
							html += '<span class="char">' + words[i].charAt(j) + '</span>';
						}
						html += '</span>';
					}
				}
				$(this).replaceWith(html);
			} else if (this.nodeType == 1) {
				splitText(this);
			}
		});
	}
	title.find('.hero__line-inner').each(function () {
		splitText(this);
	});

	// 등장 모션이 끝난 뒤부터 동작
	setTimeout(function () {
		title.addClass('is-wave');
	}, 1300);

	title.on('mouseenter', '.char', function () {
		var char = $(this);
		if (!title.hasClass('is-wave') || char.hasClass('is-up')) return;
		char.addClass('is-up');
	});

	title.on('animationend', '.char', function () {
		$(this).removeClass('is-up');
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
	if (document.readyState == 'complete') {
		ScrollTrigger.refresh();
	} else {
		$(window).on('load', function () {
			ScrollTrigger.refresh();
		});
	}
}

//메뉴·버튼 클릭 시 해당 섹션으로 부드럽게 이동
function scrollMove() {
	$('a[href^="#"]').not('[href="#"]').click(function (e) {
		var target = $($(this).attr('href'));
		if (target.length == 0) return;
		e.preventDefault();

		var top = target.offset().top - $('.header').outerHeight();
		if (target.hasClass('is-pinned')) {
			top = target.offset().top; // 고정되는 PROJECT 는 헤더 여백이 안에 있어서 섹션 맨 위로
		}
		if (top < 0) top = 0;

		$('html, body').stop().animate({ scrollTop: top }, reduceMotion ? 0 : 700, function () {
			// 키보드 사용자를 위해 이동한 곳으로 포커스도 옮기기
			if (!target.is('a, button, input, [tabindex]')) {
				target.attr('tabindex', '-1');
			}
			target[0].focus({ preventScroll: true });
		});

		history.pushState(null, '', $(this).attr('href'));
	});
}

//새로고침 시 보던 위치로 돌아가기
//브라우저 기본 복원은 GSAP 고정 영역이 생기기 전에 실행돼서 위치가 어긋남 → 직접 저장·복원
function scrollRestore() {
	if (!('scrollRestoration' in history)) return;
	history.scrollRestoration = 'manual';

	$(window).on('beforeunload', function () {
		try {
			sessionStorage.setItem('yurrr-scroll', $(window).scrollTop());
		} catch (e) {}
	});

	function restore() {
		var nav = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
		var saved = null;
		try {
			saved = sessionStorage.getItem('yurrr-scroll');
		} catch (e) {}

		if (nav && nav.type == 'reload' && saved !== null) {
			if (window.ScrollTrigger) ScrollTrigger.refresh();
			window.scrollTo(0, parseInt(saved, 10));
		}
	}

	// 이미 다 불러온 상태면 바로, 아니면 load 후 실행
	if (document.readyState == 'complete') {
		restore();
	} else {
		$(window).on('load', restore);
	}
}

$(document).ready(function () {
	introStart();
	mobileMenu();
	projectNum();
	projectSlide();
	scrollMove();
	scrollRestore();

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
