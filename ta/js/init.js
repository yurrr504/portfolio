$(document).ready(function(){		
	$('.header .user_m').click(function(){
			if(!$('.m_pop_mypage').hasClass('on')){
				$('.m_pop_mypage').addClass('on');
			}else{
				$('.m_pop_mypage').removeClass('on');
			}
	});
	$('.m_pop_mypage .btn_close').click(function(){
			if(!$('.m_pop_mypage').hasClass('on')){
				$('.m_pop_mypage').addClass('on');
			}else{
				$('.m_pop_mypage').removeClass('on');
			}
	});

	/** selectBox **/
	$('.selectBox').each(function(){
		$(this).find('.nowSelect').click(function(){
			if (!$(this).next('.selectList').hasClass('on')){
				$(this).next('.selectList').addClass('on');
				$(this).next('.selectList').find('.list > li').each(function(){
					$(this).click(function(){
						if ($(this).find('input').prop('disabled')){		  		
						}else{
							var selectBank = $(this).text();
							$(this).parent().parent().siblings('.nowSelect').find('.now').text(selectBank);
							$(this).parent().parent().removeClass('on');
						}																			
					});
					$('.selectList .ft').click(function(){
						$(this).parent().removeClass('on');
					})
				});
			}else{
				$(this).removeClass('on');
			}
		});		
	})

	$(document).click(function() {
		var container = $(".selectBox");
		if (!container.is(event.target) && !container.has(event.target).length) {
			$('.selectList').removeClass('on');
		}
	});

	$(document).click(function() {
		var container = $(".dataList");
		if (!container.is(event.target) && !container.has(event.target).length) {
			$('.es-input').removeClass('open');
		}
	});
	
});