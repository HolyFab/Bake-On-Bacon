var gameWindowId = 'GameWindow';
var clicking = -1;
$(function(){
	var game = {
		playing:false,
		infinite: false,
	    width: {current: -1, default:40, min:5,max:100}, 
		height: {current: -1, default:25,min:5,max:100},
		zoom: {current: -1 , default:4, min:1, max:8},
		speed: {current: -1, default:3, min:1, max:10},
		table: [],
		tableId: 'TBL_Game',
		intervalid: -1,
		init: function(width, height, zoom, speed, inf){
			$('#' + gameWindowId).empty()
			this.height.current = height || this.height.default;
			this.width.current = width || this.width.default;
			this.changespeed(speed || this.speed.default);
			this.setinfinite(inf);
			this.table = [];
			var gameTable = $('<table>').addClass('gameStoped').attr('id',this.tableId).mousedown(function(e){
				if($(e.target).hasClass('cell') && !game.playing)
					clicking =  game.toggleCell($(e.target).attr('y'),$(e.target).attr('x'));
			});
			for(y = 0; y < this.height.current; y++){
				var row = $('<tr>');
				this.table.push([])
				for( x = 0; x < this.width.current; x++){
					row.append($('<td>').attr({y:y, x:x}).addClass('cell')/*.text('[' + y + ',' + x + ']')*/);
					this.table[y].push(0);
				}
				gameTable.append(row);
			}
			$('#' + gameWindowId).append(gameTable);
			this.changezoom(zoom || this.zoom.default);
		},
		resizewidth: function(w){
			if(w >= this.width.min && w <= this.width.max && w !== undefined){
				if(+w > +this.width.current){//Add
					for(i = 0; i < w - this.width.current; i++){
						for(row = 0; row < this.height.current; row++){
							this.table[row].push(0);
							$('#' + this.tableId +' tr:nth-child(' + (+row+1) + ')').append($('<td>').attr({y:row, x:(+this.width.current + i )}).addClass('cell'));
						}
					}
				}
				else if (+w < +this.width.current){//remove
					for(i = 0; i < this.width.current - w; i++){
						for(row = 0; row < this.height.current; row++){
							this.table[row].pop();
							$('#' + this.tableId +' tr:nth-child(' + (+row+1) + ') td.cell:nth-child(' + (+this.width.current - i ) + ')').remove()
						}
					}
				}
				this.width.current = w;
				Cookies.set('width',this.width.current);
				this.changezoom(this.zoom.current);
			}
		},
		resizeheight: function(h){
			if(h >= this.height.min && h <= this.height.max && h !== undefined){
				if(+h > +this.height.current){//add
					for(i = 0; i < h - this.height.current; i++){
						this.table.push([]);
						var row = $('<tr>');
						for (col = 0; col < this.width.current; col++){
							this.table[+this.height.current + i].push(0);
							row.append($('<td>').attr({y:(+this.height.current + i), x:col}).addClass('cell'));
						}
						$('#' + this.tableId).append(row);

					}
				}
				else if(+h < +this.height.current){
					for(i = 0; i < this.height.current - h; i++){
						this.table.pop();
						$('#' + this.tableId +' tr:nth-child(' + (+this.height.current - i) + ')').remove();
					}
				}
				this.height.current = h;
				Cookies.set('height',this.height.current);
				this.changezoom(this.zoom.current);
			}
		},
		changezoom: function(z){
			if(z >= this.zoom.min && z <= this.zoom.max && z !== undefined){
				$('#TBL_Game td.cell').css({width:((+z+1)*5) + 'px',height:((+z+1)*5) + 'px', 'border-width':((+z/2)+'px')});
				this.zoom.current = z;
				Cookies.set('zoom',this.zoom.current);
			}
		},
		changespeed: function(s){
			if(s >= this.speed.min && s <= this.speed.max && s !== undefined){
				this.speed.current = s;
				this.playpause(); this.playpause();
				Cookies.set('speed',this.speed.current);
			}
		},
		getCell: function(y,x){
			return this.table[(y < 0) ? (+this.height.current + y) : (y%this.height.current)][(x < 0) ? (+this.width.current + x) : (x%this.width.current)];

		},
		setCell: function(y,x,value){ 
			if( this.getCell(y,x) != value)
				value = this.toggleCell(y,x);
			return value;
		},
		toggleCell: function(y,x){
			y = (y < 0) ? (+this.height.current + y) : (y%this.height.current);
			x = (x < 0) ? (+this.width.current + x) : (x%this.width.current);
			var nValue = this.table[y][x] = (this.getCell(y,x) == 1 ? 0 : 1);
			this.cellChanged(y,x);
			return nValue;
		},
		cellChanged:function (y,x){
			var htmlCell = $('#' + this.tableId +' tr:nth-child(' + (+y+1) + ') td.cell:nth-child(' + (+x+1) + ')').toggleClass('alive');
		},
		updateWholeGrid:function(arr){
			for(y = 0; y < this.height.current; y++){
				for( x = 0; x < this.width.current; x++)
					this.setCell(y,x,arr[y][x]);
			}
		},
		clear:function(){
			for(y = 0; y < this.height.current; y++){
				for( x = 0; x < this.width.current; x++)
					this.setCell(y,x,0);
			}
		},
		setinfinite:function(boole){
			this.infinite = (boole === undefined) ? !this.infinite : boole;
			if(this.infinite) $('#BTN_Infinite').addClass('btn-success');
			else $('#BTN_Infinite').removeClass('btn-success');
			Cookies.set('infinite',this.infinite);
		},
		tick:function(){
			var temp = [];
			var changed = false;
			for(y = 0; y < this.height.current; y++){
				temp.push([]);
				for( x = 0; x < this.width.current; x++){
					var neighbors = this.liveNeighbors(y,x);
					if(this.getCell(y,x))
						temp[y].push(+(neighbors >= 2 && neighbors <=3));
					else
						temp[y].push(+(neighbors === 3));
					if(this.getCell(y,x) != temp[y][x])
						changed = true;
				}
			}
			if(changed)
				this.updateWholeGrid(temp);
			else
				this.playpause();
		},
		liveNeighbors: function(y,x){
			var count = 0;
			for(v = -1; v <= 1; v++){
				for(h = -1; h <= 1; h++){
					if(this.infinite)
						count += this.getCell(y+v,x+h);
					else
						count += (+y+v >= 0 && +y+v < this.height.current && +x+h >= 0 && +x+h < this.width.current) ? this.getCell(y+v,x+h) : 0;
				}
			}
			return count - this.getCell(y,x);
		},
		playpause: function(){
			if(this.playing){
				clearInterval(this.intervalid);
				this.playing = false;
				$('#BTN_PlayPause').text('Play');
				$('#TBL_Game').addClass('gameStoped')
				$('.notplay').prop('disabled',false);
				$('#BTN_PlayPause').removeClass('btn-success');
			}
			else{
				this.intervalid = setInterval(function(){game.tick()},(Math.pow(2,2-this.speed.current) * 1000));
				this.playing = true;
				$('#BTN_PlayPause').text('Pause');
				$('#TBL_Game').removeClass('gameStoped')
				$('.notplay').prop('disabled',true);
				$('#BTN_PlayPause').addClass('btn-success');
			}
		}
	}
	game.init(Cookies.get('width'),Cookies.get('height'),Cookies.get('zoom'),Cookies.get('speed'), (Cookies.get('infinite') === 'true'));
	$('#GameWindow').on('mouseover','.cell',function(){
		if(clicking >= 0)
			game.setCell($(this).attr('y'),$(this).attr('x'), (clicking));
	});
	$(document).mouseup(function(){clicking = -1;});
	
	$('<button>').addClass('controlbutton btn notplay').attr({'id': 'BTN_Tick'}).text('Next').click(function(){
			game.tick();
	}).appendTo($('#GameControl'));
	$('<button>').addClass('controlbutton btn').attr({'id': 'BTN_PlayPause'}).text('Play').click(function(){
		game.playpause();
	}).appendTo($('#GameControl'));
	$('<button>').addClass('controlbutton btn notplay').attr({'id': 'BTN_Clear'}).text('Clear').click(function(){
			game.clear();
	}).appendTo($('#GameControl'));
	$('<button>').addClass('controlbutton btn' + (game.infinite?' btn-success':'')).attr({'id': 'BTN_Infinite'}).text('Infinite ').click(function(){
			game.setinfinite();
	}).appendTo($('#GameControl'));
	

	$('<br />').appendTo('#GameControl');

	$('<div>').addClass('numberpicker').append($('<span>').text('Width:')).append($('<input>').addClass('form-control').attr({
		type:'number',value:game.width.current, min: game.width.min, max:game.width.max,id:'NB_Width'
	})).appendTo($('#GameControl'));
	$('#NB_Width').bootstrapNumber(undefined ,function(){game.resizewidth($('#NB_Width').val());});
	
	$('<div>').addClass('numberpicker').append($('<span>').text('Height:')).append($('<input>').addClass('form-control').attr({
		type:'number',value:game.height.current, min: game.height.min, max:game.height.max,id:'NB_Height'
	})).appendTo($('#GameControl'));
	$('#NB_Height').bootstrapNumber(undefined ,function(){game.resizeheight($('#NB_Height').val());});

	$('<br />').appendTo('#GameControl');

	$('<div>').addClass('numberpicker').append($('<span>').text('Zoom:')).append($('<input>').addClass('form-control').attr({
		type:'number',value:game.zoom.current, min: game.zoom.min, max:game.zoom.max,id:'NB_Zoom'
	})).appendTo($('#GameControl'));
	$('#NB_Zoom').bootstrapNumber(undefined ,function(){game.changezoom($('#NB_Zoom').val());});
	$('<div>').addClass('numberpicker').append($('<span>').text('Speed:')).append($('<input>').addClass('form-control').attr({
		type:'number',value:game.speed.current, min: game.speed.min, max:game.speed.max,id:'NB_Speed'
	})).appendTo($('#GameControl'));
	$('#NB_Speed').bootstrapNumber(undefined ,function(){game.changespeed($('#NB_Speed').val());});

});



