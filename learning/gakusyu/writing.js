var state;
var data;
var place;
var nextchar;
var max_ind
var key = new Audio('/item/keyboard.wav');

$(function(){
    key.volume = 0.5;
    var get_str = window.location.search;
    var get = new Object;
    get_str = get_str.substring(1);
    var param = get_str.split("&");
    for(let i = 0; i < param.length; i++){
        var elem = param[i].split("=");
        paramName = decodeURIComponent(elem[0]);
        paramVal = decodeURIComponent(elem[1]);
        get[paramName] = paramVal;
    }

    state = 0;
    place = 0;
    getwordset(get['name'], get['default']);

    $("#left").on("click", function () {
        if(state > 0){
            state--;
            update();
        }
    });
    $("#right").on("click", function () {
        next();
    });

    $("#show_ans").on('click', function () { 
        update();
    });
    $("#keybord").on("touchstart", function () {
        $("#dummy").focus();
    });

    $("#write_area").change(function () { 
        str = $(this).val();
        if(str == data[state][0]){
            next();
        }
    });

    document.addEventListener('keypress', (e) => {
        var keyname = e.key;
        if(keyname == nextchar || keyname == nextchar.toLowerCase()){
            key.pause();
            key.currentTime = 0;
            key.play();
            place++;
            update();
        }
    });
    document.addEventListener('keydown', (e) =>{
        var keyname = e.key;
        switch(keyname){
            case "ArrowRight":
                next();
                break;
            case "ArrowLeft":
                prev();
                break;
        }
    })
});

// 単語セットを取得
function getwordset(name, f){
    if(f == '1'){
        let filename = "../item/" + name + ".csv";
        data = [];
        let http = new XMLHttpRequest();
        http.open("GET", filename);
        http.send(null);
        http.onload = function () {  
            let data_org = http.responseText;
            let data_en = data_org.split(/\n/);
            for(let i = 0; i < data_en.length; i++){
                data[i] = data_en[i].split(",");
            }
            max_ind = data.length - 1
            update();
        };
    }else{
        var json = localStorage.getItem("custom_word");
        var tmp = JSON.parse(json);
        var index = parseInt(name);
        if(tmp != null){
            data = tmp[index]['data'];
            max_ind = data.length - 1;
        }else{
            data = [];
        }
        update();
    }
}

// 文字を更新
function update(){
    // 端の場合移動ボタンをリセット
    if(state == 0){
        $("#left").addClass("disable");
    }else{
        $("#left").removeClass("disable");
    }
    if(state == max_ind){
        $("#right").addClass("disable");
    }else{
        $("#right").removeClass("disable");
    }
    japanese = data[state][1];
    str_r = data[state][0].slice(0, place);
    str_b = data[state][0].slice(place);
    $("#japanese").html(japanese);
    $("#word_red").html(str_r);
    $("#word_black").html(str_b);
    if(place >= data[state][0].length){
        next();
    }else{
        nextchar = data[state][0].charAt(place);
        $("#next").html(nextchar);
        if(nextchar == " "){
            place++;
            update();
        }
    }
}

// 次の単語へ
function next(){
    if(state < max_ind){
        place = 0;
        $("#write_area").val("");
        state++;
        update();
    }
}

// 前の単語へ
function prev(){
    if(state > 0){
        place = 0;
        $("#write_area").val("");
        state--;
        update();
    }
}