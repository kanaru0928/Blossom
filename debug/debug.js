$(function(){
    $("#cusotm_word").val(localStorage.getItem("custom_word"));
    $("#record").val(localStorage.getItem("record"));
});

function setting() {  
    localStorage.setItem("custom_word", $("#custom_word").val());
    localStorage.setItem("record", $("#record").val());
}
