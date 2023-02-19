window.onload = function(){
    var url = 'https://idlast.github.io/BotWBingo2023/botwBingo2023.html?seed=741249&mode=long'
    $.ajax({
        type: 'GET',
        url: url,
        //url: document.referrer,
        dataType: 'html',
        success: function (data) {
            $('#td').append(data);
            htmlData = data;
            createCounter(htmlData);
        }
    });
}

function createCounter(htmlData) {
    console.log("ログ:" + htmlData);
}

