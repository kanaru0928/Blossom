$(function () {
    var data = [];
    var http = new XMLHttpRequest();
    http.open("GET", "suffix.csv");
    http.send(null);
    http.onload = function(){
    let data_org = http.responseText;
    let data_en = data_org.split(/\n/);
    for(let i = 0; i < data_en.length; i++){
        data[i] = data_en[i].split(",");
    }
    for(let i = 0; i < data.length; i++){
        $("#list").append(
            "<tr><td>" + data[i][0] + "</td>" +
            "<td>" + data[i][1] + "</td>" +
            "<td>" + data[i][2] + "</td></tr>"
        );
        }
    };
});
