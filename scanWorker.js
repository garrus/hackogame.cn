
var id;
var isMatch;
var scanType = {
    player: {
        match: function (pos, value) {
            return pos.alliance == value || pos.player == value;
        },
        desc: function(pos){
            return '发现 ' + pos.player + ' (排名' + pos.rank + ') 位于 ' + pos.position;
        }
    },
    debris: {
        match: function(pos, value){
            return pos.recyship >= value;
        },
        desc: function(pos){
            return '发现 ' + pos.player + ' (废墟回收船：' + pos.recyship + '艘) 位于 ' + pos.position;
        }
    },
    rank: {
        match: function(pos, value){
            return pos.rank && pos.rank <= value;
        },
        desc: function(pos){
            return '发现 ' + pos.player + ' (排名' + pos.rank + ') 位于 ' + pos.position;
        }
    }
};


onmessage = function(event){
    var data = event.data;
    switch (data.action) {
        case "init":
            id = data.id;
            console.log('Inited. id=' + id);
            break;
        case "prepare":
            isMatch = buildMatchFunction(data.type, data.value, data.isOff);
            console.log('Prepared. id=' + id);
            break;
        case "scan":
            console.log('Scanning. id=' + id);
            scanSystem(data.pos.g, data.pos.s);
            break;
    }
};



function buildMatchFunction(type, value, isOff){
    var scanMatchFunc = scanType[type].match;
    if (isOff) {
        return function(pos){
            return !pos.holiday && (pos.off28 || pos.off7) && scanMatchFunc.call(null, pos, value);
        }
    } else {
        return function (pos) {
            return !pos.holiday && scanMatchFunc.call(null, pos, value);
        }
    }
}

function scanSystem(galaxy, system) {

    var xml = new XMLHttpRequest();
    xml.open('post', 'http://xhr.ogame.cn/server.php', true);
    xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xml.onreadystatechange = function(){
        console.debug('On ready state change. ');
        console.log(xml);
        if (xml.readyState == 4 && xml.status == 200) {
            var json = JSON.parse(xml.responseText);
            if (json) {
                checkResponse(json);
            }
        }
    };
    xml.send("mod=galaxy&xid=0&galaxy=" + galaxy + "&system=" + system);
    console.log('request sent.');
}

function checkResponse(json){
    var ret = json[2];
    if (typeof ret != 'undefined' &&
        typeof ret.mod != 'undefined' &&
        ret.mod == 'galaxy' && ret.error == '0') {
        var posList = ret.msg.data;
        for (var i=1; i<16; i++) {
            var pos = posList[i];
            if (isMatch(pos)) {
                submit('found', pos);
            }
        }
        submit('end');
    } else {
        console.error('Unexpected response. ');
        console.log(json);
        submit('error');
    }
}

function submit(situation, pos){
    postMessage({
        id: id,
        situation: situation,
        pos: pos
    });
}

