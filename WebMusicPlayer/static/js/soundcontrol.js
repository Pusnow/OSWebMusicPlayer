
function set(server){
	console.log($("#rtmpplay").get(0));
	$("#rtmpplay").get(0).set_(server);
}
function start(stream){
	$("#rtmpplay").get(0).start(stream);
}
function pause(){
	$("#rtmpplay").get(0).pause();
}
function play(){
	$("#rtmpplay").get(0).play();
}
function stop(){
	$("#rtmpplay").get(0).stop();
}

var flashvars = {};
var params = {};
var attributes = {};
attributes.id = "rtmpplay";
swfobject.embedSWF("/static/flash/rtmpplay.swf", "player", "1", "1", "9.0.0", false, flashvars, params, attributes);

