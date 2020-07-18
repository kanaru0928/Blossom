$(function () {
    var data = {};
    var json_str = localStorage.getItem("record");
    data = JSON.parse(json_str);
    if(data == null){
        $("#noword").show();
    }else{
        for(d in data){
            for(let i = 0; i < data[d].length; i++){
                console.log(data[d][i]);

                let is_enjp = data[d][i][2];
                let is_jpen = data[d][i][3];
                let is_write = data[d][i][4];

                let noresult = "lightgray'>-";
                let correct = "limegreen'>○";
                let incorrect = "#ff5f5f'>×";

                let enjp_str;
                let jpen_str;
                let write_str;
                switch (is_enjp) {
                    case null:
                        enjp_str = noresult;
                        break;
                    case true:
                        enjp_str = correct;
                        break;
                    case false:
                        enjp_str = incorrect;
                }
                switch (is_jpen) {
                    case null:
                        jpen_str = noresult;
                        break;
                    case true:
                        jpen_str = correct;
                        break;
                    case false:
                        jpen_str = incorrect;
                }
                switch (is_write) {
                    case null:
                        write_str = noresult;
                        break;
                    case true:
                        write_str = correct;
                        break;
                    case false:
                        write_str = incorrect;
                }

                let str = `<tr><td>${data[d][i][0]}</td><td>${data[d][i][1]}</td>` + 
                          `<td style='background:${enjp_str}</td>` +
                          `<td style='background:${jpen_str}</td>` +
                          `<td style='background:${write_str}</td>`;
                $("#list").append(str);
            }
        }
    }
});
