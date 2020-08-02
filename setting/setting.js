var get_data = localStorage.getItem("custom_word");
var data = JSON.parse(get_data);
$(function(){
    var after_test = localStorage.getItem("after_test");
    var study_h = localStorage.getItem("study_h");
    var study_m = localStorage.getItem("study_m");
    $(".review_notice").prop('checked', after_test != null);
    $(".study_notice").prop('checked', study_h != null);

    if(after_test != null)
        $("#after_test").val(after_test);
    if(study_h != null)
        $("#study_h").val(study_h);
    if(study_m != null)
        $("#study_m").val(study_m);

    if(localStorage.getItem("after_test") != null){
        $("#after_test").val();
    }

    $(".review_notice").change(function () { 
        if($(this).prop('checked')){
            if(!Push.Permission.has()){
                $(this).prop('checked', false);
                Push.Permission.request(approved, dinied);
            }
            if(Push.Permission.has()){
                $(this).prop('checked', true);
                localStorage.setItem("after_test", $("#after_test").val());
            }
        }else{
            localStorage.removeItem("after_test");
        }
    });
    $(".study_notice").change(function () { 
        if($(this).prop('checked')){
            if(!Push.Permission.has()){
                $(this).prop('checked', false);
                Push.Permission.request(approved, dinied);
            }
            if(Push.Permission.has()){
                $(this).prop('checked', true);
                localStorage.setItem("study_h", $("#study_h").val());
                localStorage.setItem("study_m", $("#study_m").val());
            }
        }else{
            localStorage.removeItem("study_h");
            localStorage.removeItem("study_m");
        }
    });

    $("#after_test").change(function () { 
        var val = Number($(this).val());
        if(Number.isInteger(val) && val >= 0){
            if($(".review_notice").prop('checked'))
                localStorage.setItem("after_test", val);
        }else if(val < 0){
            $(this).val(0);
            if($(".review_notice").prop('checked'))
                localStorage.setItem("after_test", 0);
        }else{
            var integer = Math.floor(val);
            $(this).val(Math.floor(integer));
            if($(".review_notice").prop('checked'))
                localStorage.setItem("after_test", integer);
        }
    });

    $("#study_h").change(function () { 
        h = Number($("#study_h").val());
        check_h(h);
    });
    $("#study_m").change(function () { 
        m = Number($("#study_m").val());
        check_m(m);
    });

    // カスタムデータを取得
    if(data == null) data = [];
    for(let i = 0; i < data.length; i++){
        $("#parent_list").append(`<option class='set'>${data[i]['name']}</option>`);
    }
    check_dis();
    $("#parent_list").change(function () { 
        set_change();
    });
    function set_change() {
        var index = $("#parent_list").prop("selectedIndex");
        $(".word").remove();
        check_dis();
        for(let i = 0; i < data[index]['data'].length; i++){
            $("#child_list").append(`<option class='word'>${data[index]['data'][i][0]}</option>`);
        }
        $("#name").val(data[index]['name']);
        $("#word").val("");
        $("#mean").val("");
    }

    $("#child_list").change(function () { 
        word_change();
    });
    function word_change(){
        var parent = $("#parent_list").prop("selectedIndex");
        var child = $("#child_list").prop("selectedIndex");
        $("#word").val(data[parent]['data'][child][0]);
        $("#mean").val(data[parent]['data'][child][1]);
    }
    $("#add_set").on('click', function () {
        if(data == null) data = [];
        data.push({'name': 'New category', 'id': get_max() + 1, 'data': []});
        $("#parent_list").append(`<option class='set'>New category</option>`);
        check_dis();
        save();
        $("#parent_list").prop("selectedIndex", $("#parent_list > option").length - 1);
        set_change();
    });
    $("#remove_set").on('click', function(){
        var index = $("#parent_list").prop("selectedIndex");
        data.splice(index, 1);

        $("#parent_list").children("option:selected").remove();
        save();
        $("#parent_list").prop("selectedIndex", index - 1);
        check_dis();
        set_change();
    });
    $("#add_word").on('click', function () {
        var index = $("#parent_list").prop("selectedIndex");
        data[index]['data'].push(['New word', 'New mean']);
        $("#child_list").append("<option class='word'>New word</option>");
        save();
        $("#child_list").prop("selectedIndex", $("#child_list > option").length - 1);
        word_change();
    });
    $("#remove_word").on('click', function () {
        var parent = $("#parent_list").prop("selectedIndex");
        var child = $("#child_list").prop("selectedIndex");
        data[parent]['data'].splice(child, 1);
        $("#child_list").children("option:selected").remove();
        save();
        if(child >= $("#child_list > option").length || $("#child_list > option").length == 0){
            var child2 = child - 1;
        }else{
            var child2 = child;
        }
        $("#child_list").prop("selectedIndex", child2);
        if(child2 != -1) word_change();
        check_dis();
    });

    $("#name").change(function () { 
        var index = $("#parent_list").prop("selectedIndex");
        var new_name = $(this).val()
        data[index]['name'] = new_name;
        $("#parent_list").children("option:selected").html(new_name);
        save();
    });
    $("#word").change(function () { 
        var parent = $("#parent_list").prop("selectedIndex");
        var child = $("#child_list").prop("selectedIndex");
        var new_name = $(this).val();
        data[parent]['data'][child][0] = new_name;
        $("#child_list").children("option:selected").html(new_name);
        save();
    });
    $("#mean").change(function () { 
        var parent = $("#parent_list").prop("selectedIndex");
        var child = $("#child_list").prop("selectedIndex");
        var new_name = $(this).val();
        data[parent]['data'][child][1] = new_name;
        save();
    });

    // Import
    $('.import_btn').on('click', function () {
        var import_data = $('.import').val().trim();
        var en_data = import_data.split(/\n/);
        var add_data = new Array(en_data.length);
        for(let i = 0; i < en_data.length; i++){
            add_data[i] = en_data[i].split(/,|\t/);
        }

        var json = {"name": "Imported", "id": get_max() + 1};
        if(add_data == null){
            $('.error').show();
        }else{
            $('.error').hide();
            json['data'] = add_data;
            var custom = localStorage.getItem("custom_word");
            var custom_json = JSON.parse(custom);
            if(custom_json == null){
                custom_json = [];
            }
            custom_json.push(json);
            var str = JSON.stringify(custom_json);
            localStorage.setItem("custom_word", str);
            document.location.reload();
        }
    });
});

function check_dis(){
    if($("#parent_list").prop("selectedIndex") == -1)
        $(".word_btn").hide()
    else
        $(".word_btn").show();
}

function save(){
    var json = JSON.stringify(data);
    localStorage.setItem("custom_word", json);
}

function check_h(h){
    if(!Number.isInteger(h)){
        h = Math.floor(h);
        $("#study_h").val(h);
        check_h(h);
    }else if(h < 0){
        h = 0;
        $("#study_h").val(h);
        check_h(h);
    }else if(h > 23){
        h = 23;
        $("#study_h").val(h);
        check_h(h);
    }else{
        if($(".study_notice").prop('checked'))
            localStorage.setItem("study_h", Number(h));
    }
}
function check_m(m){
    if(!Number.isInteger(m)){
        m = Math.floor(m);
        $("#study_m").val(m);
        check_m(m);
    }else if(m < 0){
        m = 0;
        $("#study_m").val(m);
        check_m(m);
    }else if(m > 59){
        m = 23;
        $("#study_m").val(m);
        check_m(m);
    }else{
        if($(".study_notice").prop('checked'))
            localStorage.setItem("study_m", Number(m));
    }
}

function request_notie(){
}

function approved(){
}

function dinied(){
    alert("通知を拒否されています");
}

function get_max(){
    let id = data[-1]['id'];
    var res;
    if(typeof id == "undefined"){
        res = -1;
    }else{
        res = id;
    }
    return res;
}
