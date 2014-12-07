var isSet = false;
var isPlay = true;

var playlist={
	current : 0,
	playlist : []

};


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
				set("rtmp://os.pusnow.com/vod/")
				isSet=true;
			}
			start(data.flv);
			isPlay=true;
			
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

function streamFinish() {
	//call by Flash
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
	setPlaylistAlbum(albumid);
	playbyid(id);
	
	for (var musicid in playlist.playlist){
			if (playlist.playlist[musicid].id == id)
				playlist.current=parseInt(musicid);
	}

	



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
				modal += '<tr class="musiclist" data-id="'+data.musiclist[musicid].id+'" data-albumid="'+albumid+'"data-num='+data.musiclist[musicid].num+'>'
				modal += '<td>'+data.musiclist[musicid].num+'</td>'
                modal += '<td>'+data.musiclist[musicid].name+'</td>'
                modal += '<td>'+data.musiclist[musicid].singer+'</td>'
                modal += '<td>'+Math.floor(data.musiclist[musicid].length/60)+':'+data.musiclist[musicid].length%60+'</td>'
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
