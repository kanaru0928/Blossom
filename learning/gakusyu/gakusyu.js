$(function(){
    var json = localStorage.getItem("custom_word");
    var data = JSON.parse(json);
    if(data != null){
        for(let i = 0; i < data.length; i++){
            var str = `<tr><td class="subtitle custom">${data[i]['name']} </td>
            <td><a class="btn1" href="reading.html?name=${i}"><i class="fas fa-book-reader"></i> 読み</a></td>
            <td><a class="btn1" href="writing.html?name=${i}"><i class="fas fa-pen-alt"></i> 書き</a></td></tr>`
            $("#list").append(str);
        }
    }
})