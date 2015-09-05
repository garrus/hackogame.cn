/*
javascript:(function(){var d=document,s=d.createElement("script");d.src="http://lightofsource.sinaapp.com/scan.wogame.net.js";d.body.appendChild(s);})();
 */

document.body.innerHTML = "<h2>正在加载……</h2>";
prepare();

function prepare() {
    if (typeof window.$ == 'undefined') {
        (function () {
            var s = document.createElement("script");
            s.src = "http://cdn.bootcss.com/jquery/1.11.3/jquery.min.js";
            document.body.appendChild(s);
        })();
        setTimeout(prepare, 500);
    } else {
        runHacker();
    }
}

function runHacker(){
    var g = 0;
    var s = 0;
    var scanning = false;
    var workers = [];
    for (var i=0; i<10; i++) {
        workers[i] = new MyWorker(i, processResult);
    }

    var scanRange = [];
    var columns;
    var targetType, targetValue, targetOff, targetHoliday;

    var scanType = {
        player: {
            match: function (pos, value) {
                if (value.indexOf(",")) {
                    value = value.split(",");
                    return value.indexOf(pos.player) != -1 || value.indexOf(pos.alliance) != -1;
                } else {
                    return pos.alliance == value || pos.player == value;
                }
            },
            columns: [
                "position",
                "status",
                "player",
                "alliance",
                "rank",
                "debris-recycles",
                "activity",
                "moon",
                "moonactivity"
            ]
        },
        debris: {
            match: function(pos, value){
                return pos.recyship >= value;
            },
            columns: [
                "position",
                "status",
                "player",
                "debris-metal",
                "debris-crystal",
                "debris-recycles",
                "activity",
                "moon",
                "moonactivity"
            ]
        },
        rank: {
            match: function(pos, value){
                return pos.rank && pos.rank <= value;
            },
            columns: [
                "position",
                "status",
                "player",
                "alliance",
                "rank",
                "activity",
                "moon",
                "moonactivity"
            ]
        }
    };


    var renderer = {
        nullContent: '<span style="color: #777;">-</span>',
        label: {
            "position": "坐标",
            "player": "玩家",
            "alliance": "联盟",
            "debris-metal": "废墟-金属",
            "debris-crystal": "废墟-晶体",
            "debris-recycles": "需要回收船",
            "rank": "排名",
            "activity": "最近活动",
            "moon": "月球",
            "moonactivity": "月球最近活动",
            "status": "活跃状态"
        },

        renderTable: function(){
            var html = "<table style=\"width: 100%; text-align: center;\"><thead><tr>";
            var label = this.label;
            columns.map(function(column){
                html += "<th>" + label[column] + "</th>";
            });
            html += "</tr></thead><tbody></tbody></table>";
            $("#result").html(html);
        },
        renderRow: function(planet){
            var html = "<tr>";
            if (planet.holiday) {
                html = '<tr style="opacity: 0.3;">';
            }
            var rowData = this.buildRowData(planet);
            columns.map(function(column){
                html += "<td>" + rowData[column] + "</td>";
            });
            html += "</tr>";
            $("#result").find("tbody").append(html);
        },

        buildRowData: function(planet) {
            return {
                "position": '<span style="color: blueviolet;">' + planet.position + "</span>",
                "player": '<span style="color:lime;">' + planet.player + "</span>",
                "alliance": planet.alliance ? '<span style="color:cyan;">' + planet.alliance + "</span>" : this.nullContent,
                "rank": '<span style="color: yellow;">' + planet.rank + '</span>',
                "debris-metal": this.renderResource(planet.metal),
                "debris-crystal": this.renderResource(planet.crystal),
                "debris-recycles": planet.recyship,
                "activity": this.renderActivity(planet.activity),
                "moon": typeof planet.moonactivity == "string" ? '<span style="color:darkolivegreen;">有</span>' : this.nullContent,
                "moonactivity": typeof planet.moonactivity == "string" ? this.renderActivity(planet.moonactivity) : this.nullContent,
                "status": this.renderStatus(planet)
            };
        },

        renderResource: function(num){
            if (num > 50000000) {
                return '<span style="color: red;">' + (num / 100000000).toFixed(2) + ' E</span>';
            }
            if (num > 1000000) {
                return '<span style="color: orange;">' + (num / 1000000).toFixed(1) + ' M</span>';
            }
            return '<span style="color: darkolivegreen;">' + num + '</span>';
        },

        renderActivity: function(activity){
            switch (activity) {
                case "":
                    return this.nullContent;
                case "*":
                    return '<span style="color:red;">刚刚</span>';
                default:
                    return '<span style="color:orange;">' + activity + "分钟</span>";
            }
        },

        renderStatus: function(planet){
            var str = "";
            if (planet.holiday) {
                return '<span style="color: lightsteelblue;">休</span>';
            } else if (planet.off28) {
                return '<span style="color: silver;">28</span>';
            } else if (planet.off7) {
                return '<span style="color: gray;">7</span>';
            } else {
                return this.nullContent;
            }
        }
    };



    $("body").html('<div>' +
    '<h3>扫描类型：<select id="target-type">' +
    '<option value="player">联盟或玩家名</option>' +
    '<option value="debris">废墟所需回收船不低于</option>' +
    '<option value="rank">排名不低于</option>' +
    '</select>' +
    '<h3>扫描目标值：<input id="target-value"> </h2>' +
    '<h4><label for="target-off">7/28天未活动：</label><select id="target-off">' +
    '<option value="-1" selected="selected">不限</option>' +
    '<option value="1">是</option>' +
    '<option value="0">否</option>' +
    '</select></h4>' +
    '<h4><label for="target-holiday">假期模式：</label><select id="target-holiday">' +
    '<option value="-1">不限</option>' +
    '<option value="1">是</option>' +
    '<option value="0" selected="selected">否</option>' +
    '</select></h4>' +
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
    '<h3>正在扫描 <span id="cur" style="color: cyan;"></span> ...</h3>' +
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
            scanRange.reverse();
            targetType = $("#target-type").val();
            targetValue = $("#target-value").val();
            targetOff = $("#target-off").val();
            targetHoliday = $("#target-holiday").val();
            columns = scanType[targetType].columns;
            renderer.renderTable();
            scanning = true;
            workers.forEach(function(worker){
                worker.postMessage({
                    action: "prepare",
                    type: targetType,
                    value: targetValue,
                    off: targetOff,
                    holiday: targetHoliday
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
                    renderer.renderRow(data.planet);
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
                this.isMatch = this.buildMatchFunction(data);
                console.log('Prepared. id=' + this.id);
                break;
            case "scan":
                console.log('Scanning. id=' + this.id);
                this.scanSystem(data.pos.g, data.pos.s);
                break;
        }
    };

    MyWorker.prototype.buildMatchFunction = function(options){
        var scanMatchFunc = scanType[options.type].match;
        return function(planet){
            if ((options.off == 1 && !(planet.off28 || planet.off7))
                || (options.off == 0 && (planet.off28 || planet.off7))
                || (options.holiday == 1 && planet.holiday)
                || (options.holiday == 0 && !planet.holiday)) {
                return false;
            }
            return scanMatchFunc.call(null, planet, options.value);
        };
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

    MyWorker.prototype.submit = function(situation, planet){
        this.callback.call(this, {
            id: this.id,
            situation: situation,
            planet: planet
        });
    };
}






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