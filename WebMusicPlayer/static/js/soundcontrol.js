//자바스크립트로 플래시(스트리밍 플레이어, rtmpplay.swf)를 제어하기 위한 코드


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

function seek(sec){
	$("#rtmpplay").get(0).seek(sec);
}

function gettime(){
	return $("#rtmpplay").get(0).gettime();
}
function setvolume(vol){
	return $("#rtmpplay").get(0).setvolume(vol);
}

var flashvars = {};
var params = {};
var attributes = {};
attributes.id = "rtmpplay";
swfobject.embedSWF("/static/flash/rtmpplay.swf", "player", "1", "1", "9.0.0", false, flashvars, params, attributes);

