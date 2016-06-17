$(function(){
	$(document).keypress(function(e){
		if(e.keyCode === 110 /*&& e.ctrlKey === true*/)
			objs.create();
	}).mousemove(function(e){
		mouse.x = e.pageX;
		mouse.y = e.pageY;
		mouse.update();
		moveobj();
	}).mousedown(function(){mouse.click = true; mouse.update();
	}).mouseup(function(){mouse.click = false; mouse.drag = -1; mouse.update();});
});
function moveobj(){
	if(mouse.drag !== -1){
		$('#' + mouse.drag).css({left:(mouse.x - mouse.offsetX) + 'px',top:(mouse.y - mouse.offsetY) + 'px'});
		return true;
	}
	else
		return false;
}
var mouse = {
	x:0,
	y:0,
	click:false,
	drag:-1,
	offsetX: -1,
	offsetY: -1,
	update: function(){
		$('#test').text(this.x + ', ' + this.y + ' ' + this.click + ' ' + (this.drag === -1?'':this.drag));
	}
}

var objs = {
	nb:0,
	colors: ['#FFFF00','#0000FF','#00FF00', '#FF0000','#000000','#00FFFF','#FF00FF'],
	create: function(){
		var objid = this.getid();
		var thing = $('<div>').attr('id',objid).addClass('obj').mousedown(function(){
			mouse.drag = objid;
			mouse.offsetX =  mouse.x - $(this).position().left; 
			mouse.offsetY =  mouse.y - $(this).position().top; 
		}).dblclick(function(){
			$('')
		}).css('background-color',this.colors[Math.floor(Math.random() * this.colors.length )]);
		$('body').append(thing);
		return objid;
	},
	count: function(){return this.nb;},
	getid: function(){return this.nb++;}
}