//대부분의 플레이어 기능 구현 (클라이언트), 페이지이동, AJAX 등등


var isSet = false;
var isPlay = true;

var playlist={
	current : 0,
	playlist : [],
	volume : 0.5

};


$("#player-volume").popover({
	placement : 'bottom', // top, bottom, left or right
	html: 'true', 
	tabindex: "-1",
	content : '<input type="text" class="volumeslider" value="" data-slider-min="0" data-slider-max="1" data-slider-step="0.01" data-slider-value="0.5" data-slider-orientation="vertical" data-slider-selection="after" data-slider-tooltip="hide">'

});
$('#player-volume').on('shown.bs.popover', function () {
	console.log("aaa");
	sli = $(".volumeslider").slider();
	sli.slider('setValue', 1-playlist.volume)
	sli.on('slide', function(ev){
		playlist.volume=1-$(".volumeslider").slider("getValue");
		setvolume(playlist.volume);
  	});
});

/*
$('#player-volume').click(function(){
	$('#popoverContent').slider();
    var $target = $('#popoverContent');
    $target.toggle(!$target.is(':visible'));
});
*/
function playbyid(id){
	var json_data = {};
	json_data["id"]=id;
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		url: $SCRIPT_ROOT + "/musicstream",
		data: JSON.stringify(json_data),
		success: function (data) {
			//console.log(data);
			console.log(data.flv);
			$("#play").removeClass('glyphicon-play').addClass('glyphicon-pause');
			if (!isSet){
				set("rtmp://165.132.149.58/vod/")
				setInterval(setprogress, 500);
				isSet=true;
			}
			start(data.flv);
			isPlay=true;
			setvolume(playlist.volume);
			
			//$("#playtable").empty().append(playlisttable());
			$("#player-list").popover('destroy');
			$("#player-list").popover({
				placement : 'bottom', // top, bottom, left or right
				title : 'Playlist', 
				html: 'true', 
				tabindex: "-1",
				content : "<div id=playtable>"+playlisttable()+"</div>"
			});

		},
		dataType: "json"
	});


};
function timeformat(time){

	if (time%60 > 9)
		return Math.floor(time/60)+':'+time%60
	else
		return Math.floor(time/60)+':0'+time%60
}

function streamFinish() {
	//call by Flash
	if (isPlay)
		playnext();
}


function playprev(){
	if (playlist.current != 0){
		playlist.current = playlist.current-1;
		playbyid(playlist.playlist[playlist.current].id);
		
	}
	else{
		playlist.current = playlist.playlist.length-1;
		playbyid(playlist.playlist[playlist.playlist.length-1].id);
		
	}
}

function playnext(){
	if (playlist.current != playlist.playlist.length-1){
		playlist.current = playlist.current+1;
		playbyid(playlist.playlist[playlist.current].id);
		
	}
	else{
		playlist.current = 0;
		playbyid(playlist.playlist[0].id);
		
	}
}
function playlisttable(){
	var table = ""
	table +='<table class="table table-striped table-hover"><thead><tr><th>#</th><th>제목</th></tr></thead>'
	table +='<tbody>'

	for (var musicid in playlist.playlist){
		table += '<tr class="musiclist" data-id="'+playlist.playlist[musicid].id+'" data-albumid="'+playlist.playlist[musicid].albumid+'"data-num='+playlist.playlist[musicid].num+'>'
		if (musicid == playlist.current){
			table += '<td><span class="glyphicon glyphicon-chevron-right"></td>'
		}
		else{
			table += '<td> </td>'
		}

		
		table += '<td>'+playlist.playlist[musicid].name+'</td>'
		table += '</tr>'
	}

	table += '</tbody> </table>'

	return table;
}


$('#volume').slider({
});

$(".block-body").on("click",".album",function(e){
	var id = $(this).data("id");
	albummodal(id);


} );


$("body").on("click",".musiclist",function(e){
	var id = $(this).data("id");
	var albumid = $(this).data("albumid");
	var num = $(this).data("num");

	switch ($(this).data("type")){
		case "album" : setPlaylistAlbum(albumid); break;
		case "list" : if ($(this).data("list")!="curlist") setPlaylistList($(this).data("list")); break;


	}
	for (var musicid in playlist.playlist){
			if (playlist.playlist[musicid].id == id)
				playlist.current=parseInt(musicid);
	}
	playbyid(id);
	
	

	



} );


$("#play").on("click",function(e){

	
	
	if(isPlay){
       pause();
        $("#play").removeClass('glyphicon-pause').addClass('glyphicon-play');
        isPlay=false;
       } else {
         play();
         $("#play").removeClass('glyphicon-play').addClass('glyphicon-pause');
         
         isPlay=true;
    }

} );


$("#player-star").on("click",function(e){
	var json_data = {};
	json_data["id"]=playlist.playlist[playlist.current].id;

	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		url: $SCRIPT_ROOT + "/addfav",
		data: JSON.stringify(json_data),
		success: function (data) {
			//playlist.current = num;
		},
		dataType: "json"
	});
	
	

} );



$("#back").on("click",function(e){
	playprev();
	
	
	
	

} );

$("#next").on("click",function(e){
	playnext();
	
} );


$("#player-list").on("click",function(e){
	$("#plaer-list").popover('toggle');
} );

$(".block-body").on("click","a#menu",function(e){
	e.preventDefault();
	
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		url: $(this).attr('href'),
		success: function(data){
			$('.block-body').empty();
			$('.block-body').append(data);
		}
	});


});

$(".block-body").on("click","a.dellistitem",function(e){
	e.preventDefault();
	e.stopPropagation();
	var json_data = {};
	var delitem = $(this)
	json_data["order"]=parseInt($(this).data("order"));
	json_data["listid"]=parseInt($(this).data("list"));
	$.ajax({
		type: "POST",
		data: JSON.stringify(json_data),
		contentType: "application/json; charset=utf-8",
		url: $SCRIPT_ROOT + "/dellistitem",
		success: function(data){


			console.log($(this).closest("tr").html())
			delitem.closest("tr").remove();

		}
	});


});


function albummodal (albumid){
	
	var json_data = {};
	json_data["id"]=albumid;

	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		url: $SCRIPT_ROOT + "/albuminfo",
		data: JSON.stringify(json_data),
		success: function (data) {
			

			var modal = '<div class="modal fade" id="album'+data.id+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
			modal +='<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Album Info</h4></div><div class="modal-body">'
			modal +='<img class = "albuminfo" src ="/static/img/album/' +data.url+ '"></img>'
			modal +='<h2>'+data.name+'</h2>'
			modal +='<h3>'+data.singer+'</h3>'
			modal +='<h4> 총 '+data.musicnum+'곡</h4>'
			modal +='<br>'
			modal +='<table class="table table-striped table-hover"><thead><tr><th>#</th><th>제목</th><th>가수</th><th>시간</th></tr></thead>'
			modal +='<tbody>'

			for (var musicid in data.musiclist){
				modal += '<tr class="musiclist" data-id="'+data.musiclist[musicid].id+'" data-albumid="'+albumid+'"data-num='+data.musiclist[musicid].num+' data-type="album">'
				modal += '<td>'+data.musiclist[musicid].num+'</td>'
                modal += '<td>'+data.musiclist[musicid].name+'</td>'
                modal += '<td>'+data.musiclist[musicid].singer+'</td>'
                modal += '<td>'+timeformat(data.musiclist[musicid].length)+'</td>'
                modal += '</tr>'

			}

			modal += '</tbody> </table></div></div></div></div>'
			$(".albummodal").empty().append(modal);
			$('#album'+albumid).modal()
			

			

		},
		dataType: "json"
	});
	
}

function setPlaylistAlbum (albumid){
	var json_data = {};
	json_data["id"]=albumid;

	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		url: $SCRIPT_ROOT + "/albuminfo",
		data: JSON.stringify(json_data),
		success: function (data) {
			console.log(data);
			playlist.playlist = data.musiclist;
			//playlist.current = num;
		},
		dataType: "json"
	});

}

function setPlaylistList (listid){
	var json_data = {};
	json_data["id"]=listid;

	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		url: $SCRIPT_ROOT + "/getlist",
		data: JSON.stringify(json_data),
		success: function (data) {
			console.log(data);
			playlist.playlist = data.musiclist;
			//playlist.current = num;
		},
		dataType: "json"
	});

}


$(".block-body").on("click",".menulist",function(e){
	e.preventDefault();
	var id =  $(this).data("id");
	var name = $(this).data("name");
	console.log(id)
	var musiclist = [];
	if (id == "curlist"){

		musiclist = playlist.playlist;
		var list = "";
		list +=  "<h2 class ='listname'>" +  $(this).data("name") + "</h2>";
		if (musiclist.length != 0){

			list +='<table class="table table-striped table-hover"><thead><tr><th>#</th><th>제목</th><th>가수</th><th>시간</th></tr></thead>'
			list +='<tbody>'

			for (var musicid in  musiclist){
				list += '<tr class="musiclist" data-id="'+ musiclist[musicid].id+'" data-albumid="'+musiclist[musicid].albumid+'"data-num='+ musiclist[musicid].num+' data-type="list" data-list='+id+'>'
				list += '<td>'+ (parseInt(musicid)+1)+'</td>'
				list += '<td>'+ musiclist[musicid].name+'</td>'
				list += '<td>'+ musiclist[musicid].singer+'</td>'
				list += '<td>'+timeformat(musiclist[musicid].length)+'</td>'
				list += '</tr>'
			}

			list += '</tbody> </table>'
		}
		else {
			list += "<h3 class = 'listname'> 리스트에 음악이 없습니다. </h3>"
		}


		$("#listarea").empty().append(list);

	}
	else {
		var json_data = {};
		json_data["id"]=id;
		json_data["name"]=name;



		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: $SCRIPT_ROOT + "/getlist",
			data: JSON.stringify(json_data),
			success: function (data) {
				musiclist = data.musiclist;
				var list = "";
				list +=  "<h2 class ='listname'>" +  data.name + "</h2>";
				if (musiclist.length != 0){

					list +='<table class="table table-striped table-hover"><thead><tr><th>#</th><th>제목</th><th>가수</th><th>시간</th><th></th></tr></thead>'
					list +='<tbody>'

					for (var musicid in  musiclist){
						list += '<tr class="musiclist" data-id="'+ musiclist[musicid].id+'" data-albumid="'+musiclist[musicid].albumid+'"data-num='+ musiclist[musicid].num+' data-type="list" data-list='+id+' data-order='+musiclist[musicid].order+'>'
						list += '<td>'+ (parseInt(musicid)+1)+'</td>'
						list += '<td>'+ musiclist[musicid].name+'</td>'
						list += '<td>'+ musiclist[musicid].singer+'</td>'
						list += '<td>'+timeformat(musiclist[musicid].length)+'</td>'
						list += '<td><a class ="dellistitem" data-list='+id+' data-order='+musiclist[musicid].order+'>삭제</a></td>'
						list += '</tr>'
					}

					list += '</tbody> </table>'
				}
				else {
					list += "<h3 class = 'listname'> 리스트에 음악이 없습니다. </h3>"
				}


				$("#listarea").empty().append(list);
				
			},
			dataType: "json"
		});
		
	}
	
	
} );

function setprogress(){
	if (isPlay){
		$("#musicprogress").css("width",gettime()/playlist.playlist[playlist.current].length*100+'%');
	}

}
$(".pbar").hover(function(){
	$(".pbar").css("height","50%");

}, function(){

	$(".pbar").css("height","10%");
});


$(".pbar").on("click",function(e){
	if (!isPlay){
		play();
        $("#play").removeClass('glyphicon-play').addClass('glyphicon-pause');
		isPlay=true;
	}
	if(e.pageX > $(window).width()/2 -150 && e.pageX < $(window).width()/2 +150){
		seek((e.pageX - $(window).width()/2 + 150 )*playlist.playlist[playlist.current].length/300);

	}

});