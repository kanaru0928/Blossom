var state;          // 現在の単語の位置
var switch_state;   // 英日切り替え
var data;
var max_ind;        // 単語の個数
var order;          // ランダムな順番
var correct;
var point;
var get = new Object;
var name_g;         // 単語セットの名前
var correct_sound = new Audio("/item/correct.wav");
var incorrect_sound = new Audio("/item/incorrect.wav");

var clickStart = issp ? 'touchstart' : 'mousedown';
var clickEnd = issp ? 'touchend' : 'mouseup';

$(function(){
    var get_str = window.location.search;
    get_str = get_str.substring(1);
    var param = get_str.split("&");
    for(let i = 0; i < param.length; i++){
        var elem = param[i].split("=");
        paramName = decodeURIComponent(elem[0]);
        paramVal = decodeURIComponent(elem[1]);
        get[paramName] = paramVal;
    }

    state = 0;
    switch_state = get['type'] == 'en_jp';
    getwordset(get['name'], get['default']);

    
    $(".switch").html(switch_state ? '英→日' : '日→英');


    $("#right").on('click', wronged);

    $(".choices").on('click', function () {
        var selected = $(this).attr('id');
        $(".choices").prop('disabled', true);
        if(selected == `c${correct + 1}`){
            corrected();
        }else{
            wronged();
        }
    });

    $("#enter").on('click', function () {
        check();
    });
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

            max_ind = data.length - 1;
            order = shuffle([...Array(max_ind + 1)].map((_, i)=>i));
            point = Array(max_ind + 1);
            name_g = get['name'];
            update();
        };
    }else{
        var json = localStorage.getItem("custom_word");
        var tmp = JSON.parse(json);
        var index = parseInt(name);
        name_g = index + "c";
        if(tmp != null){
            for(let i = 0; i < tmp.length; i++){
                if(tmp['id'] == index){
                    data = tmp[i]['data'];
                    break;
                }
            }
            max_ind = data.length - 1;
        }else{
            data = [];
        }
        order = shuffle([...Array(max_ind + 1)].map((_, i)=>i));
        point = Array(max_ind + 1);
        update();
    }
}

// 文字を更新
function update(){
    var str = data[order[state]];
    $("#word").html(str[switch_state ? 0 : 1]);

    if(state == max_ind){
        $("#right").addClass("disable");
    }else{
        $("#right").removeClass("disable");
    }

    // 選択肢作成
    correct = Math.floor(Math.random() * 4);    // 正解を決定
    var wrong_tmp = shuffle([...Array(data.length)].map((_, i)=>i));
    var wrong = wrong_tmp.filter(n => n !== order[state]);  // 問題数の長さの重複なしの配列から正解のインデックスを削除
    // 要素に選択肢を代入
    let i = 0;
    if(correct == 0){
        $("#c1").html(str[switch_state ? 1 : 0]);
    }else{
        $("#c1").html(data[wrong[i]][switch_state ? 1 : 0]);
        i++;
    }
    if(correct == 1){
        $("#c2").html(str[switch_state ? 1 : 0]);
    }else{
        $("#c2").html(data[wrong[i]][switch_state ? 1 : 0]);
        i++;
    }
    if(correct == 2){
        $("#c3").html(str[switch_state ? 1 : 0]);
    }else{
        $("#c3").html(data[wrong[i]][switch_state ? 1 : 0]);
        i++;
    }
    if(correct == 3){
        $("#c4").html(str[switch_state ? 1 : 0]);
    }else{
        $("#c4").html(data[wrong[i]][switch_state ? 1 : 0]);
        i++;
    }
}

// 次の単語へ
function next(){
    if(state < max_ind){
        state++;
        update();
    }else{
        result();
    }
}

// 前の単語へ
function prev(){
    if(state > 0){
        state--;
        update();
    }
}

function corrected(){
    $("#circle").show();
    $("#correct").html(data[order[state]][switch_state ? 1 : 0]);
    point[order[state]] = true;
    correct_sound.pause();
    correct_sound.currentTime = 0;
    correct_sound.play();
    setTimeout(function(){
        next();
        $("#circle").hide();
        $("#correct").html("");
        $(".choices").prop('disabled', false);
    }, 2000);
}
function wronged(){
    $("#times").show();
    $("#correct").html(data[order[state]][switch_state ? 1 : 0]);
    point[order[state]] = false;
    incorrect_sound.pause();
    incorrect_sound.currentTime = 0;
    incorrect_sound.play();
    setTimeout(function(){
        next();
        $("#times").hide();
        $("#correct").html("");
        $(".choices").prop('disabled', false);
    }, 2000);
}

function result(){
    $("#resulting").show();
    var got_add = 0;
    var wrong_add = 0;
    var count = 0;

    for(let i = 0; i < max_ind + 1; i++){
        if(point[i]) count++;
    }
    $(".point").html(`${count}/${max_ind + 1}`);
    var json = localStorage.getItem("record");
    var array = JSON.parse(json);
    if(array == null){
        array = new Object;
    }
    if(typeof array[name_g] == "undefined"){
        var tmp = Array(max_ind + 1);
        for(i = 0; i < max_ind + 1; i++){
            tmp[i] = [...data[i], null, null, null];
        }
        array[name_g] = tmp;
    }
    for(let i = 0; i < max_ind + 1; i++){
        if(array[name_g][i][switch_state ? 2 : 3] != point[i]){
            if(!point[i]){
                if(array[name_g][i].slice(2, 5).every(v => v || v == null))
                wrong_add++;
            }
            array[name_g][i][switch_state ? 2 : 3] = point[i];
            if(point[i]){
                if(array[name_g][i].slice(2, 5).every(v => v || v == null))
                got_add++;
            }
        }
    }
    $("#got_word").html(`+${got_add}`);
    $("#wrong_word").html(`+${wrong_add}`);
    var json_str = JSON.stringify(array);
    localStorage.setItem("record", json_str);
    
    var got = 0;
    var wrong = 0;
    for(d in array){
        for(let i = 0; i < array[d].length; i++){
            let a = array[d][i].slice(2, 5);
            if(a.every(v => v == true)) got++;
            else if(a.some(v => v == false && v != null)) wrong++;
        }
    }
    localStorage.setItem("got_count", got);
    localStorage.setItem("wrong_count", wrong);

    // 復習通知設定
    var after_test = parseInt(localStorage.getItem("after_test"));
    if(after_test != null){
        if($.cookie("NoNotice") == "True"){
            $.removeCookie("NoNotice", {path: "/"});
        }else{
            var date = new Date();
            date.setTime(date.getTime() + 30 * 60 * 1000);
            $.cookie("NoNotice", "True", {expries: date, path: "/"});
            date = new Date();
            date.setTime(date.getTime() + (after_test * 60 * 1000));
            $.cookie("after_test", Math.floor(date.getTime() / 1000 / 60), {expries: 1, path: "/"});
        }
    }
    
    $("#resulting").hide();
    $(".overlay").slideDown(500);
}

function ac(){
    for(let i = 0; i < point.length; i++){
        point[i] = true;
    }
}
