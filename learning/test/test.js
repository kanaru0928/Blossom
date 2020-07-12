$(function(){
    var json = localStorage.getItem("custom_word");
    var data = JSON.parse(json);
    if(data != null){
        for(let i = 0; i < data.length; i++){
            var str = `<tr><td class="subtitle custom">${data[i]['name']} </td>
            <td><a class="btn1 reading" id="${i}"><i class="fas fa-book-reader"></i> 読み</a></td>
            <td><a class="btn1" href="writing.html?name=${i}"><i class="fas fa-pen-alt"></i> 書き</a></td></tr>`
            $("#list").append(str);
        }
    }

    $(".reading").on('click', function () {
        $(".overlay_parent").fadeIn();
        $("#en_jp").attr('href', `reading.html?name=${$(this).attr('id')}&type=en_jp${$(this).hasClass('def') ? '&default=1': ''}`);
        $("#jp_en").attr('href', `reading.html?name=${$(this).attr('id')}&type=jp_en${$(this).hasClass('def') ? '&default=1': ''}`);
    });
    $(".overlay_parent").on('click', function () {
        $(this).fadeOut();
    });

});
