timerID = setInterval('clock()', 1000);

$(function(){
    // 初訪問なら設定の案内を表示
    check_device();
    var isVisited = $.cookie("isVisited");
    if(isVisited == "True"){
        $("#setting_inf").hide();
    }
    $.cookie("isVisited", "True", {expries: 30});

    // 初訪問なら覚えた単語を初期化
    var got_count = localStorage.getItem("got_count");
    var wrong_count = localStorage.getItem("wrong_count");
    if(got_count == null){
        $(".words_count.got").html("0<span>個</span>");
        localStorage.setItem("got_count", "0");
    }else{
        $(".words_count.got").html(got_count + "<span>個</span>");
    }
    if(wrong_count == null){
        $(".words_count.wrong").html("0<span>個</span>");
        localStorage.setItem("wrong_count", "0");
    }else{
        $(".words_count.wrong").html(wrong_count + "<span>個</span>");
    }
});

function check_device(){
    if(issp){
        $("#sp_inf").show();
    }else{
        $("#sp_inf").hide();
    }
}

function clock(){
    $('.clock').html(tune());
}

function tune(){
    now = gettime();
    str = now[0] + "年 <span style='font-size:28pt'>" 
    + now[1] + "</span> <span style='font-size:24pt'>月</span> <span style='font-size:28pt'>" 
    + now[2] + "</span> <span style='font-size:24pt'>日</span>　<span style='font-size:28pt'>" 
    + ('00' + now[3]).slice(-2) + ":" + ('00' + now[4]).slice(-2);
    return str;
}
