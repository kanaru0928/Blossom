var flag = false;
var issp = navigator.userAgent.match(/iPhone|Android.+Mobile/);
var after_test_c = $.cookie("after_test");
var study_cflag = $.cookie("study_flag");
timerID1 = setInterval('alerm()', 1000);

$(function(){
    $("#learning_btn").hover(function () {
            // over
            $("#learning_btn .dropdown").stop().slideDown('fast');
        }, function () {
            // out
            $("#learning_btn .dropdown").stop().slideUp();
        }
    );
    $("#other_btn").hover(function () {
            // over
            $("#other_btn .dropdown").stop().slideDown('fast');
        }, function () {
            // out
            $("#other_btn .dropdown").stop().slideUp();
        }
    );
});

function gettime(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var now_time = now.getTime();
    var time = [year, month, day, hour, minute, now_time];
    return time;
}

function alerm(){
    var now = gettime();
    if(now[3].toString() == localStorage.getItem("study_h") && now[4].toString() == localStorage.getItem("study_m") && !flag){
        if(study_cflag != "True"){
            Push.create("Blossom", {
                body: "学習の時間です。",
                icon: '/favicon/favicon.ico',
                onclick: function(){
                    window.focus();
                    this.close();
                }
            });
            flag = true;
            var date = new Date();
            date.setTime(date.getTime(60 * 1000));
            $.cookie("study_flag", "True", {expries: date, path: "/"});
        }
    }

    if(after_test_c != null){
        if(Math.floor(now[5] / 1000 / 60) == parseInt(after_test_c)){
            after_test_c = null;
            $.removeCookie("after_test", {path: "/"});
            Push.create("Blossom", {
                body: "復習の時間です。",
                icon: '/favicon/favicon.ico',
                onclick: function(){
                    window.focus();
                    this.close();
                }
            });
        }
    }
}

function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
    }
    return array;
}
