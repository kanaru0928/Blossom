var state = 0;
var data;
var order;
var max_ind;
var point;
var result_flag = true;
var get = new Object;
var name_g;
var correct_sound = new Audio("/item/correct.wav");
var incorrect_sound = new Audio("/item/incorrect.wav");

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

    getwordset(get['name'], get['default']);

    $("#right").on("click", function () {
        check(false);
    });
    $("#enter").on('click', function () {
        check();
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

    document.addEventListener('keydown', (e) =>{
        var keyname = e.key;
        switch(keyname){
            case "Enter":
                check();
                break;
        }
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
        name_g = index + 'c';
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
    str = data[order[state]];
    $("#japanese").html(str[1]);
    $("#write_area").focus();
    if(state == max_ind){
        $("#right").addClass("disable");
    }else{
        $("#right").removeClass("disable");
    }
}

// 次の単語へ
function next(){
    if(state < max_ind){
        state++;
        $("#write_area").val("");
        update();
    }else{
        result();
    }
}

function check(bool = true){
    if(bool){
        if(result_flag){
            var input = $("#write_area").val();
            if(input.toLowerCase() == data[order[state]][0].toLowerCase()){
                corrected();
            }else{
                wronged();
            }
        }
    }else{
        wronged();
    }
}

function corrected(){
    $("#circle").show();
    $("#answer").html(data[order[state]][0]);
    point[order[state]] = true;
    result_flag = false;
    correct_sound.pause();
    correct_sound.currentTime = 0;
    correct_sound.play();
    setTimeout(function(){
        result_flag = true;
        next();
        $("#circle").hide();
        $("#answer").html("");
    }, 2000);
}
function wronged(){
    $("#times").show();
    $("#answer").html(data[order[state]][0]);
    point[order[state]] = false;
    result_flag = false;
    incorrect_sound.pause();
    incorrect_sound.currentTime = 0;
    incorrect_sound.play();
    setTimeout(function(){
        next();
        result_flag = true;
        $("#times").hide();
        $("#answer").html("");
    }, 2000);
}

/*
    結果を表示
*/
function result(){
    $("#resulting").show();
    result_flag = false;    // 表示中の判定は無効
    var got_add = 0;
    var wrong_add = 0;
    // 正解数を判定
    var count = 0;
    for(let i = 0; i < max_ind + 1; i++){
        if(point[i]) count++;
    }
    $(".point").html(`${count}/${max_ind + 1}`);    // 正解数を表示
    
    // 結果を取得
    var json = localStorage.getItem("record");
    var array = JSON.parse(json);   // すでに保存してあるデータのJSONを取得
    if(array == null){      // すでに保存されてるものがなかった場合初期化
        array = new Object;
    }
    if(typeof array[name_g] == "undefined"){   // 初めての範囲の場合初期化
        var tmp = Array(max_ind + 1);
        for(i = 0; i < max_ind + 1; i++){
            tmp[i] = [...data[i], null, null, null];
        }
        array[name_g] = tmp;
    }
    
    // 結果を処理
    for(let i = 0; i < max_ind + 1; i++){
        if(array[name_g][i][4] != point[i]){
            if(!point[i]){              // 新規不正解数を算出
                if(array[name_g][i].slice(2, 5).every(v => v || v == null))
                wrong_add++;
            }
            
            array[name_g][i][4] = point[i]; // 結果を取得したデータに上書き
            
            if(point[i]){               // 新規正解数を算出
                if(array[name_g][i].slice(2, 5).every(v => v || v == null))
                got_add++;
            }
        }
    }
    // 新規正解/不正解数を表示
    $("#got_word").html(`+${got_add}`);
    $("#wrong_word").html(`+${wrong_add}`);
    
    // 上書きしたデータを保存
    var json_str = JSON.stringify(array);
    localStorage.setItem("record", json_str);
    
    // 全体の正解数/不正解数を取得・保存
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
            date.setDate(date.getTime(30 * 60 * 1000));
            $.cookie("NoNotice", "True", {expries: date, path: "/"});
            date = new Date();
            date.setDate(date.getTime() + (after_test * 60 * 1000));
            $.cookie("after_test", Math.floor(date.getTime() / 1000 / 60), {expries: 1, path: "/"});
        }
    }

    // 結果画面を表示
    $("#resulting").hide();
    $(".overlay").slideDown(500);
}

function ac(){
    for(let i = 0; i < point.length; i++){
        point[i] = true;
    }
}
