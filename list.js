$(function () {
    var data = {};
    var json_str = localStorage.getItem("record");
    data = JSON.parse(json_str);
    if(data == null){
        $("#noword").show();
    }else{
        for(d in data){
            for(let i = 0; i < data[d].length; i++){
                let is_enjp = data[d][i][2] != null && data[d][i][2];
                let is_jpen = data[d][i][3] != null && data[d][i][3];
                let is_write = data[d][i][4] != null && data[d][i][4];
                let str = `<tr><td>${data[d][i][0]}</td><td>${data[d][i][1]}</td>` + 
                          `<td style='background:${is_enjp ? "limegreen'>○": "#ff5f5f'>×"}</td>` +
                          `<td style='background:${is_jpen ? "limegreen'>○": "#ff5f5f'>×"}</td>` +
                          `<td style='background:${is_write ? "limegreen'>○": "#ff5f5f'>×"}</td>`;
                $("#list").append(str);
            }
        }
    }
});
