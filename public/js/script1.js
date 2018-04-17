$(function(){

    height_fixed();

    // if($('.v-line-sp-but').length){
    //     var follower = $('.v-line-sp-but');
    //     var mouseX = 0;
    //     var ww = window.innerWidth || document.documentElement.clientWidth;
    //     var scale = ww/40;
    //     $(window).mousemove(function(e){
    //         mouseX = e.pageX;
    //         if (mouseX < 0) mouseX = 0;
    //
    //         follower.css({
    //             'margin-left': -46 + (mouseX/scale) - 20
    //         });
    //     });
    // }

    if($('.v-line-sp-but').length){
        var follower = $('.v-line-sp-but .arr');
        var mouseX = 0;
        var mouseY = 0;

        var offset = follower.offset();
        var c_x = offset.left+26;
        var c_y = offset.top+26;

        $(window).mousemove(function(e){
            mouseX = e.pageX;
            mouseY = e.pageY;
            if (mouseX < 0) mouseX = 0;
            if (mouseY < 0) mouseY = 0;

            var angle = Math.round( Math.atan( ( mouseY - c_y ) / ( mouseX - c_x ) ) * ( 180 / Math.PI ) );

            if(mouseX < c_x){
                angle = angle-180;
            }else if(mouseX == c_x){
                angle = angle+180;
            }

            follower.css({
                '-webkit-transform': 'rotate('+angle+'deg)',
                '-ms-transform': 'rotate('+angle+'deg)',
                'transform': 'rotate('+angle+'deg)'
            });
        });
    }



});

function height_fixed(){
    var height = window.innerHeight || document.documentElement.clientHeight;
    if($('.rccol').length){
        if($('.rccol').height() > height){
            $('body,html').css({
                    'height': 'auto',
                    'min-height': 'auto'
                }
            );
        }else{
            $('body,html').css({
                    'height': '100%',
                    'min-height': '100%'
                }
             );
        }
    }
}

$(document).on('change', '.custom-select select', function(){
    var val = $(this).val();
    if(val){
        $(this).siblings('.val').removeClass('placeholder').html(val);
    }else{
        $(this).siblings('.val').addClass('placeholder').html($(this).attr('placeholder'));
    }
});

$(document).on('click', '.custom-radio', function(){
    if(!$(this).hasClass('act')){
        var val = $(this).data('val');
        var input = $(this).data('input');
        $('.custom-radio[data-group="'+$(this).data('group')+'"]').removeClass('act');
        $(this).addClass('act');
        $('#'+input).val(val);
    }
});

$(document).on('click', '.phone-country', function(){
    $(this).find('.list').fadeToggle();
});
$(document).on('click', '.phone-country .list .item', function(){
    var img = $(this).find('img').clone();
    $(this).closest('.phone-country').find('.val').html(img);
});


$(document).on('click', '.but-slider', function () {
    $(this).toggleClass('on');
});

$(document).on('click', '.curtail-box', function () {
    if($(this).hasClass('act')){
        $(this).find('.min').hide();
        $(this).find('.plus').show();
        $(this).removeClass('act');
        $(this).closest('.grey-box').find('.tb-data').hide();
    }else{
        $(this).find('.min').show();
        $(this).find('.plus').hide();
        $(this).addClass('act');
        $(this).closest('.grey-box').find('.tb-data').show();
    }
});

$(document).on('keyup', '.signup-phone', function () {
    if($(this).val()){
        $('.sp-get-code').show();
        $('.sp-code-input').show();
    }else{
        $('.sp-get-code').hide();
        $('.sp-code-input').hide();
    }
});

$(document).on('click', '.custom-checkbox', function(){
    var val = $(this).data('val');
    var input = $(this).data('input');
    if(!$(this).hasClass('act')){
        $(this).addClass('act');
        $('#'+input).val(val);
    }else{
        $(this).removeClass('act');
        $('#'+input).val('');
    }
});

$(document).on('click', '.faq-group .item', function(){
    $(this).toggleClass('act');
    $(this).find('.answer').slideToggle(400, 'swing', function(){
        height_fixed();
    });
});

$(document).on('click', '.faq-group-list .item', function(){
    var group = $(this).data('group');
    $('.faq-group-list .item').removeClass('act');
    $(this).addClass('act');

    $('.faq-group').hide();
    $('.gr'+group).show();

    $('.support-form').hide()
});

$(document).on('click', '.sc-us-data-but.sf', function(){
    $('.faq-group-list .item').removeClass('act');
    $('.faq-group').hide();
    $('.support-form').show();
});