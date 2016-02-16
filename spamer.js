window.uba = (function(topWin){
	
	var pending = 0;
	
	function request(data, callback){
		var xhr = topWin.proxy.contentWindow.xmlHttp();
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4) {
				pending--;
				if (xhr.status == 200) {
					if (typeof callback == 'function')
						callback.call(null, JSON.parse(xhr.responseText));
				}
			}
		};
		xhr.open('POST', 'http://s11.ogame.cn/server.php', true);
		xhr.send(typeof data == 'object' ? helper.stringifyObj(data) : data);
		pending++;
	}
	
	
	var helper = {
		stringifyObj: function(obj){
			var arr = [];
			for (var k in obj) {
				arr.push(k + '=' + encodeURIComponent(obj[k]));
			}
			return arr.join('&');
		}
	};
	
	var game = {
		searchByName: function(name, callback){
			request({mod: 'search', xid: 1, keywords: name}, function(res){
				if (res.length == 2) {
					callback.call(null, res[1].msg[0]);
				} else {
					callback.call(null, false);
				}
			});
		},
		getPlanetByPos: function(galaxy, system, position, callback){
			request({mod: 'galaxy', xid: 0, galaxy: galaxy, system: system}, function(res){
				if (res.length == 3) {
					callback.call(null, res[2].msg.data[position]);
				} else {
					callback.call(null, false);
				}
			});
		},
		sendMessage: function(username, title, content, callback){
			if (pending > 30) return;
			request({mod: 'messagesend', xid: 1, to_user: username, title: title, content: content});
		},
		heartBeat: function(){
			
		}
	};
	
	
	return {
		test: function(){
			request({
				mod: 'user',
				xid: 0,
				uid: 98397,
				position: 10,
				galaxy: 5,
				system: 110
			}, function(res){
				console.log(res);
			});
		},
		spamUser: function(name, interval){
			return setInterval(function(){
				game.sendMessage(name, 'Internal Service Error!', '未知错误。请联系管理员解决此问题。');
			}, typeof interval == 'undefined' ? 10 : interval);
		}
	};
	
})(window);

var users = ['rel', '星霸2510', 'POOH', '十三爺', 'ぴ亦风ヅ亦雨ぴ', '沙尘暴'];
for (var i=0; i<1; i++) {
	window.uba.spamUser(users[i]);
}
window.uba.spamUser('fireman', 60000);


