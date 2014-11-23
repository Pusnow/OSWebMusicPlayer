
$(".block-body").on("click",".album",function(e){
	var id = $(this).data("id");
	albummodal(id);


} );


$(".block-body").on("click","a",function(e){
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
			modal +='<br>'
			modal +='<table class="table table-striped table-hover"><thead><tr><th>#</th><th>제목</th><th>가수</th><th>시간</th></tr></thead>'
			modal +='<tbody>'

			for (var musicid in data.musiclist){
				modal += '<tr>'
				modal += '<td>'+data.musiclist[musicid].order+'</td>'
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