$(function(){


});


$(document).on('click', '.ref-param-line .add', function(e){
    e.preventDefault();

    var line = $(this).parent('div');
    var new_line = line.clone();
    new_line.find('input').val('');
    new_line.insertAfter(line);

    line.find('.action').removeClass('add').addClass('remove');

});

$(document).on('click', '.ref-param-line .remove', function(e){
    e.preventDefault();

    $(this).parent('div').remove();

});
