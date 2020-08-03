var state;
var switch_state;
var btn_state;
var data;
var max_ind;

var clickStart = issp ? 'touchstart' : 'mousedown';
var clickEnd = issp ? 'touchend' : 'mouseup';

var is_only = $.cookie("wronged_only") == "True";
var record = {};
var json_str = localStorage.getItem("record");

$(function(){
    record = JSON.parse(json_str);
    // getパラメーターを取得
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
    getwordset(get['name'], get['default']);

    switch_state = false;
    btn_state = false;
    $(".switch.en_jp").css("color", "#DA2BEE");
    $(".switch.jp_en").click(function () { 
        $(this).css("color", "#DA2BEE");
        $(".switch.en_jp").css("color", "#3f3f3f");
        switch_state = true;
        update();
    });
    $(".switch.en_jp").click(function () { 
        $(this).css("color", "#DA2BEE");
        $(".switch.jp_en").css("color", "#3f3f3f");
        switch_state = false;
        update();
    });

    $("#left").on("click", function () {
        if(state > 0){
            state--;
            update();
        }
    });
    $("#right").on("click", function () {
        next();
    });

    $("#show_ans").on(clickStart, function () { 
        btn_state = true;
        update();
    }).on(clickEnd, function(){
        btn_state = false;
        update();
    });

    document.addEventListener('keydown', (e) => {
        var keyname = e.key;
        switch(keyname){
            case " ":
                btn_state = true;
                update();
                break;
            case "ArrowRight":
                next();
                break;
            case "ArrowLeft":
                prev();
                break;
        }
    });
    document.addEventListener('keyup', (e) => {
        var keyname = e.key;
        if(keyname == " "){
            btn_state = false;
            update();
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

            del_data(name);

            max_ind = data.length - 1
            update();
        };
    }else{
        var json = localStorage.getItem("custom_word");
        var tmp = JSON.parse(json);
        var index = parseInt(name);
        if(tmp != null){
            console.log("tmp", tmp);
            for(let i = 0; i < tmp.length; i++){
                if(tmp[i]['id'] == index){
                    data = tmp[i]['data'];
                    break;
                }
            }
        }else{
            data = [];
        }
        
        del_data(name + 'c');
        max_ind = data.length - 1;
        update();
    }
}

function del_data(n){
    if(is_only){
        if(record == null){
            return false;            
        }
        if(typeof record[n] == "undefined"){
            return false;
        }
        var rc_str = [];
        for(let i = 0; i < record[n].length; i++){
            if((record[n][i][2] || record[n][i][2] === null) && (record[n][i][3] || record[n][i][3] === null))
                rc_str.push(record[n][i][0]);
        }
        console.log(rc_str);
        data = data.filter((v) => {return rc_str.indexOf(v[0]) == -1});
    }
    
    if(!(data.length > 0)){
        data = [["No data", "データがありません"]];
    }
}

// 文字を更新
function update(){
    var str = data[state][switch_state ^ btn_state ? 1 : 0];
    $("#word").html(str);
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
}

// 次の単語へ
function next(){
    if(state < max_ind){
        state++;
        update();
    }
}

// 前の単語へ
function prev(){
    if(state > 0){
        state--;
        update();
    }
}
