function Step(e){
	this.unlocked = false;
	this.event = e;
}

function stepStart(){
	if(!this.unlocked){
		this.unlocked = true;
		var divBaconFlip = $('<div>').attr('id', 'DIV_FlipPan')
		divBaconFlip.append($('<span>').addClass('p_Pan').text('-----\\____/').attr('id','aniPan'))
		divBaconFlip.append($('<span>').addClass('p_Bacon').text('~~').attr('id','aniBacon'));
		divBaconFlip.mouseover(function(){hoverEvent = function(){bacon.shot();};
		}).mouseout(function(){hoverEvent = function(){};});
		$('#DIV_Side').append(divBaconFlip);
		return true;
	}
	return false;
}
function stepBacons(){
	if(!this.unlocked && bacon.ammount >= 15){
		this.unlocked = true;
		var fieldset = $('<fieldset>').append($('<legend>').text('Stock'));
		var divStats = $('<div>').attr('id','DIV_Stats').append(fieldset.append($('<table>').addClass('TBL_Stats').attr('id','TBL_Stock').append(createStatsRow("Bacons: ", bacon.id, false))));
		$('#DIV_Side').append(divStats);
		screenUpdates.push(function(){
			$('#TXT_' + bacon.id).html(bacon.ammount);
		});
		
		return true;
	}
	return false;
}

function stepFbrPancakes(){
	if(!this.unlocked && bacon.ammount >= 50){
		this.unlocked = true;
		var div = $('<div>').addClass("MK_Item").attr('id','MK_' + baconPancakes.id);
		div.append(createLoader(baconPancakes.title ,baconPancakes.id,function(){return baconPancakes.tooltip()}));
		$("#DEV_Fbr").append(createSeparatorWithText('Fabricate')).append(div);
		$("#DEV_Hire").hide();$("#DEV_Upg").hide();
		$("#TAB_Dev").show();
		TAB_Click("Dev");
		$('#LD_' + baconPancakes.id).on("animationend", function(){
			$('#LD_' + baconPancakes.id).css({'animation-play-state': "paused" });
		});
		newItem("Dev");
		$("#BTN_" + baconPancakes.id).click(function(){
			baconPancakes.startFabricate();
		});
		return true;
	}
	return false;
}
function stepPancakes(){
	if(!this.unlocked && baconPancakes.ammount){
		this.unlocked = true;
		$("#TBL_Stock tbody").append(createStatsRow("Bacon Pancakes: ", baconPancakes.id));
		$('#TXT_MAX_' + baconPancakes.id).text(baconPancakes.max.m);
		screenUpdates.push(function(){
			$("#TXT_" + baconPancakes.id).html(baconPancakes.ammount);
		});
	}
}

function stepTurkeyBacon(){
	if(!this.unlocked && baconPancakes.ammount >= 3){
		this.unlocked = true;
		var div = $('<div>').addClass("MK_Item").attr('id',	bacon.components.MK);
		div.append(createLoader(bacon.nextUpgrade.title,'UpgBacon', function(){return bacon.tooltip();}));
		$('#DEV_Upg').show().append(createSeparatorWithText('Upgrade')).append(div);
		bacon.setLoader();
		$("#TAB_Dev").removeClass("invisible");
		$(bacon.components.LD).on("animationend", function(){
			$(	bacon.components.LD).css({'animation-play-state': "paused" });
		});
		newItem("Dev");
		debugger;
		$(bacon.components.BTN).click(function(){
			bacon.startUpgrade();
		});
	}
}

function stepCats(){
	if(!this.unlocked && bacon.currentUpgrade == bacon.types.Turkey){
		this.unlocked = true;
		var div = $('<div>').addClass("MK_Item").attr('id','MK_' + cats.id);
		div.append(createLoader(cats.title,cats.id,function(){return cats.tooltip();}));
		$("#DEV_Hire").show().append(createSeparatorWithText('Hire')).append(div)
		$('#LD_' + cats.id).on("animationend", function(){
			$('#LD_' + cats.id).css({'animation-play-state': "paused" });
		});
		newItem("Dev");
		$("#BTN_" + cats.id).click(function(){
			cats.startFabricate();
		});
		var fieldset = $('<fieldset>').append(createTooltip($('<legend>').text('Employees'),function(){
			return 	'<b>Level</b> is the ammount of specified<br />' + 
					'resource the employee makes by seconds.<br />' + 
					'<b>Salary</b> is what it costs by employee<br />' + 
					'of the type each cycles.<br />' + 
					'<b>Order: [Bacons][Pancakes]</b>';	
		}));
		$('#DIV_Stats').append('<br />').append(fieldset.append($('<table>').addClass('TBL_Stats').attr('id','TBL_Employees').append(createStatsRow("Cats: ", cats.id, true , function(){return cats.salTooltip();}))));
		screenUpdates.push(function(){
			$("#TXT_" + cats.id).html(cats.ammount);
		});
		$('#TXT_MAX_' + cats.id).text(cats.max);
		$('#TBL_Employees').append(createTimerRow(cats.id));
		cats.initTimerInterval();
		return true;
	}
	return false;
}

function stepUpgMaxPancakes(){
	if(!this.unlocked && cats.cmpSal > 0){
		this.unlocked = true;
		$('#MK_' + baconPancakes.id).append(createNewFeatureBTN(
			function(){return baconPancakes.max.unlock()},
		 	function(){return baconPancakes.max.tooltipUnlock()}
		).css('opacity','0').animate({opacity:'1'},500,'linear'));
		return true;
	}
	return false;
}

var TTcss = {
	'font-weight': 'normal','font-style': 'italic','text-align': 'left','font-size': '14px',
	'z-index':'10','position':'absolute','border-radius':'5px','padding':'1px',
	'color':'#111','border':'1px solid #DCA', 'background':'#fffAF0'
};
function createTooltip(element, fcontent, style){
	if (style === undefined)
		style = TTcss;
	element.mouseover(function(e){
		$('body > #TT').html(fcontent()).css({display:'inline'});
		$('body > #TT').css(style);
	}).mouseleave(function(e){
		$('body > #TT').html('').css({display:'none', left:'0px', top:'0px'});
		$('body > #TT').css(style);
	}).mousemove(function(e){
		$('body > #TT').css({left:(e.pageX + 20)+'px', top:(e.pageY + 20)+'px'});
	});
	
	return element;
}
function createLoader(content,id,ftooltipContent){
	var loader = $('<span>').addClass('loader').attr('id','LD_' + id);
	var meter = $('<div>').addClass('meter').attr('id','BTN_' + id).append($('<span>').attr('id','BTN_TXT_' + id).text(content)).append(loader);
	return createTooltip(meter,ftooltipContent);
}
function createStatsRow(content,id,max,ftooltipContent){
	var row = $('<tr>');
	var td1 = $('<td>');
	var title = $('<span>').text(content);
	var td2 = $('<td>').append($('<span>').attr('id','TXT_' + id))
	if(max === true || max === undefined)
		td2.append(' / ').append($('<span>').attr('id','TXT_MAX_'+id));
	if(ftooltipContent !== undefined)
		title =  createTooltip(title,ftooltipContent);
	return row.append(td1.append(title)).append(td2);
}
function createTimerRow(id){
	var divBox = $('<div>').addClass('salarybox').append($('<div>').addClass('salaryframe').append($('<div>').addClass('salarytimer').attr('id','SLR_' + id)));
	return row = $('<tr>').append($('<td>').attr('colspan',2).append(divBox));
}
function createSeparatorWithText(content){
	return $('<div>').append($('<div>').addClass('separatorwithtext').append($('<span>').text(content))).append($('<br />'));
}

function createNewFeatureBTN(fFeature, ftooltipContent){
	return createTooltip($('<div>').addClass('smallbutton newfeature').text(ftooltipContent !== undefined ? '$':'?').click(function(){
		if (fFeature())
			$(this).trigger('mouseleave').remove();
	}),ftooltipContent !== undefined ? function(){return '<b>Buy new feature</b><br />' + ftooltipContent()} : function(){return '<b>Unlock new feature</b>'});
}
function createUpgradeMaximumBTN(effect, ftooltipContent){
	return createTooltip($('<div>').addClass('smallbutton').text('+').click(function(){
		effect();
	}),ftooltipContent);
}
function newItem(Tab){
	if (!$("#TAB_" + Tab).hasClass("MainTabSelected") && !$("#TAB_" + Tab).hasClass("MainTabNotif"))
		$("#TAB_" + Tab).addClass("MainTabNotif");
}
function makeAppear(id,fcomplete){
	if(fcomplete === undefined)fcomplete = function(){};
	$(id).css('opacity','0').animate({opacity: 1}, 500, 'linear',fcomplete);
}
