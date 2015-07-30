/*

$("body").append('<script type="text/javascript" src="http://s11.ogame.cn/scan.js"></script>');


 */


(function(){

    if (typeof window.$ == 'undefined') {
        document.write('No jquery loaded.');
        return;
    }

    var g = 0;
    var s = 0;
    var scanning = false;
    var isMatch = function(pos){
        return false;
    };
    var desc = function(pos){
        return 'Found ' + pos.position;
    };
    var workers = [];
    for (var i=0; i<10; i++) {
        workers[i] = new MyWorker(i, processResult);
    }
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

    var scanRange = [];
    var targetType, targetValue, isTargetOff;


    $("body").html('<div>' +
    '<h3>扫描类型：<select id="target-type">' +
    '<option value="player">联盟和玩家</option>' +
    '<option value="debris">废墟所需回收船不低于</option>' +
    '<option value="rank">排名不低于</option>' +
    '</select>' +
    '<h3>扫描目标值：<input id="target-value"> </h2>' +
    '<h4><label for="target-off">7/28天未活动：</label><input type="checkbox" id="target-off" checked="true"></h4>' +
    '<h3>扫描范围：' +
    '<input type="checkbox" class="target-range" id="range-1" value="1" checked="true"> <label for="range-1">Y1</label> ' +
    '<input type="checkbox" class="target-range" id="range-2" value="2" checked="true"> <label for="range-2">Y2</label> ' +
    '<input type="checkbox" class="target-range" id="range-3" value="3" checked="true"> <label for="range-3">Y3</label> ' +
    '<input type="checkbox" class="target-range" id="range-4" value="4" checked="true"> <label for="range-4">Y4</label> ' +
    '<input type="checkbox" class="target-range" id="range-5" value="5" checked="true"> <label for="range-5">Y5</label> ' +
    '<input type="checkbox" class="target-range" id="range-6" value="6" checked="true"> <label for="range-6">Y6</label> ' +
    '<input type="checkbox" class="target-range" id="range-7" value="7" checked="true"> <label for="range-7">Y7</label> ' +
    '<input type="checkbox" class="target-range" id="range-8" value="8" checked="true"> <label for="range-8">Y8</label> ' +
    '<input type="checkbox" class="target-range" id="range-9" value="9" checked="true"> <label for="range-9">Y9</label> ' +
    '</h2>' +
    '<button id="start-scan">开始扫描</button><button id="stop-scan">停止</button>' +
    '<h3>正在扫描星系 <span id="cur" style="color: cyan;"></span> ...</h3>' +
    '<ul id="result" style="color: #aaa; font-family: \'微软雅黑\', verdana, arial, helvetica, sans-serif; font-size: 0.9em;" ></ul>' +
    '</div>')
        .css({"background-color": "black", "color": "#bbb"})
        .delegate('#start-scan', 'click', function(){
        if (!scanning) {
            init();
            $(".target-range").each(function(i, elem){
               if (elem.checked) {
                   scanRange.push(parseInt(elem.value));
               }
            });
            targetType = $("#target-type").val();
            targetValue = $("#target-value").val();
            isTargetOff = !!$("#target-off")[0].checked;
            desc = scanType[targetType].desc;
            scanning = true;
            workers.forEach(function(worker){
                worker.postMessage({
                    action: "prepare",
                    type: targetType,
                    value: targetValue,
                    isOff: isTargetOff
                });
            });

            doScan();
        }
    }).delegate('#stop-scan', 'click', function(){
        scanning = false;
    });

    function init(){
        g = 0;
        s = 0;
        scanning = false;
        scanRange = [];
        $("#result").empty();
        $("#cur").empty();
        isMatch = undefined;
    }

    function doScan(){
        workers.forEach(function(worker, id){
            assignTask(worker);
        });
    }


    function assignTask(worker){
        var pos = getNextPos();
        if (pos !== false) {
            worker.postMessage({
                action: "scan",
                pos: pos
            });
        }
    }

    function getNextPos(){
        if (!scanning) {
            return false;
        }

        if (s < 499) {
            s++;
        } else {
            s = 1;
            g = 0;
        }

        if (g == 0) {
            while (scanRange.length) {
                g = scanRange.pop();
                if (g != 0) {
                    break;
                }
            }
        }

        if (g == 0) {
            console.warn('扫描结束！');
            scanning = false;
            return false;
        }

        $("#cur").text(g + ', ' + s);
        return {g: g, s: s};
    }


    function processResult(data){
        var id = data.id;
        switch (data.situation) {
            case 'found':
                setTimeout(function(){
                    var log = desc(data.pos);
                    console.log(log);
                    $("#result").append('<li>' + log + '</li>');
                }, 1);
                break;
            case 'error':
                assignTask(workers[id]);
                break;
            case 'end':
                assignTask(workers[id]);
                break;
        }
    }

    function MyWorker(id, callback){

        this.id = id;
        this.isMatch = function(){return false;};
        this.callback = callback;
        console.log('Inited. id=' + id);
    }

    MyWorker.prototype.postMessage = function(data){
        switch (data.action) {
            case "prepare":
                this.isMatch = this.buildMatchFunction(data.type, data.value, data.isOff);
                console.log('Prepared. id=' + this.id);
                break;
            case "scan":
                console.log('Scanning. id=' + this.id);
                this.scanSystem(data.pos.g, data.pos.s);
                break;
        }
    };

    MyWorker.prototype.buildMatchFunction = function(type, value, isOff){
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
    };

    MyWorker.prototype.scanSystem = function(galaxy, system) {
        var ths = this;
        $.post('http://s11.ogame.cn/server.php', {
            mod: 'galaxy',
            xid: 0,
            galaxy: galaxy,
            system: system
        }, function(json){
            ths.checkResponse(json);
        }, 'json');
    };

    MyWorker.prototype.checkResponse = function(json){
        var ret = json[2];
        if (typeof ret != 'undefined' &&
            typeof ret.mod != 'undefined' &&
            ret.mod == 'galaxy' && ret.error == '0') {
            var posList = ret.msg.data;
            for (var i=1; i<16; i++) {
                var pos = posList[i];
                if (this.isMatch(pos)) {
                    this.submit('found', pos);
                }
            }
            this.submit('end');
        } else {
            console.error('Unexpected response. ');
            console.log(json);
            this.submit('error');
        }
    };

    MyWorker.prototype.submit = function(situation, pos){
        this.callback.call(this, {
            id: this.id,
            situation: situation,
            pos: pos
        });
    };


})();




/*
 activity: ""
 aid: "73"
 alliance: "sky星际联盟"
 banned: 0
 canatt: 1
 candeploy: 0
 canfriend: true
 canmsg: true
 canspy: 1
 cantrans: 1
 canundef: 0
 crystal: "0"
 debris: 0
 holiday: 0
 image: "gas_9"
 isnpc: false
 metal: "0"
 moonactivity: ""
 mooncandeploy: 0
 mooncantrans: 1
 moonid: 272881
 moonimage: "moon_1"
 moonname: "月球"
 name: "广告位招商"
 off7: 0
 off28: 0
 pid: 271144
 player: "薮猫"
 position: "1:1:1"
 rank: 47
 recyship: 0
 status: false
 strong: false
 uid: 104225
 weak: false
 */