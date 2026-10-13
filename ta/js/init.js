

$(document).ready(function(){

	$('.open_box').each(function(){
		$(this).find('.tit_con').click(function(){
			if(!$(this).hasClass('on')){
				$(this).addClass('on');
				$(this).siblings('.cont').show();
			}else{
				$(this).removeClass('on');
				$(this).siblings('.cont').hide();
			}
		});			
	});

});