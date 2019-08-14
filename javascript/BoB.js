var hoverEvent = function(){};
var screenUpdates = [
	
];
$(function(){
	$('#DIV_Side').prepend($('<button>').text('Cheat').click(function(){
			cheat();
		}));
	$(".MainTab").click(function(){
		var Tab = this.id;
		TAB_Click(Tab.substring(Tab.length - 3,Tab.length))
	});
	
});

var SelectedTab = "";
function TAB_Click(Tab){
	if(!$("#TAB_" + Tab).hasClass("MainTabSelected")){
		var options = {percent: 100};
		$("#TAB_" + SelectedTab).removeClass("MainTabSelected");
		$("#DIV_" + SelectedTab).addClass("invisible")
		
		$("#TAB_" + Tab).addClass("MainTabSelected");
		$("#TAB_" + Tab).removeClass("MainTabNotif");
		$("#DIV_" + Tab).removeClass("invisible")
		SelectedTab = Tab;
	}
}

var steps = [
	new Step(stepStart),
	new Step(stepBacons),
	new Step(stepFbrPancakes),
	new Step(stepPancakes),
	new Step(stepTurkeyBacon),
	new Step(stepCats),
	new Step(stepUpgMaxPancakes)
];
function checkSteps(){
	for( i = 0; i < steps.length; i++){
		if(steps[i].event() === true){
			steps.splice(i,1)
			i--;
		}
	}
}



function screenUpdate(){
	for(i = 0; i < screenUpdates.length; i++)
		screenUpdates[i]();
	checkSteps();
}
setInterval(screenUpdate, 100);

/*setInterval(function(){
	bacon.tick();
},1000);*/

setInterval(function(){
	hoverEvent();
},500);
function cheat(){
	bacon.add(250);
	baconPancakes.add(baconPancakes.max.m);
	checkSteps();
	cats.add(1);
	cats.cmpSal++;
	$("legend").click(function(){cats.timer = 299;});
	makeAppear('#DIV_Page',function(){notificationBox.print('<h1>You little cheater ;)</h1>');});
}