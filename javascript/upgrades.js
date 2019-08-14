var baconPancakes = {
	unclocked: false,
	ammount: 0,
	cmp: 0,
	max:{
		m:10,
		cost:0.5,
		perUpg: 2,
		unlocked:false,
		unlockCost:6,
		unlock: function(){
			if(!this.unlocked && baconPancakes.ammount >= this.unlockCost){
				baconPancakes.remove(this.unlockCost);
				unlocked = true;
				$('#MK_' + baconPancakes.id).append(createUpgradeMaximumBTN(
					function(){return baconPancakes.max.upgrade()},
					function(){return baconPancakes.max.tooltip()}
				));
				notificationBox.print('You can now upgrade your maximum' + baconPancakes.title);
				return true;
			}
			else{
				notificationBox.printNoResources([baconPancakes.title]);
				return false;
			}
		},
		tooltipUnlock:function(){return baconPancakes.title + ': ' + this.unlockCost;},
		tooltip:function(){
			return '<b>Maximum ' + baconPancakes.title + '</b><br />' +
					baconPancakes.title + ': ' + Math.floor(this.m * this.cost);
		},
		upgrade:function(){
			if(this.canUpgrade()){
				baconPancakes.remove(this.cost * this.m);
				this.m += this.perUpg;
				$('#TXT_MAX_' + baconPancakes.id).text(this.m);
				return true;
			}
			else{
				notificationBox.printNoResources([baconPancakes.title]);
				return false;
			}
		},
		canUpgrade: function(){return baconPancakes.ammount >= (this.cost * this.m);}

	},
	priceBacons: 50,
	fbrMult: 1,
	fbrTime: 5,
	fbring: 0,
	fbrIntervalId: 0,
	color:"CC6600",
	id:"BaconPancakes",
	title:"Bacon Pancake",
	ttdescription:"It's delicious!",
	fabricate: function(){
		this.fbring--;
		this.add(1);
		notificationBox.print('You baked a delicious pancake.');
		if(!this.fbring){
			$('#LD_' + this.id).css({'animation-iteration-count': 0});
			clearInterval(this.fbrIntervalId);
			this.fbrIntervalId = 0;
		}
		else{
			$('#LD_' + this.id).css({'animation-play-state': "running" })
		}
	},
	startFabricate: function(){
		if(this.canFbr()){
			this.unclocked = true;
			this.pay();
			this.fbring += 1;
			if(!this.fbrIntervalId){
				$('#LD_' + this.id).css({'animation-iteration-count': "infinite"})
				$('#LD_' + this.id).css({'animation-duration': this.fbrTime + "s" })
				$('#LD_' + this.id).css({'animation-play-state': "running" })
				this.fbrIntervalId = setInterval(function(){baconPancakes.fabricate()}, this.fbrTime * 1000);
			}
		}
	},
	canFbr: function(){
		if(this.fbring >= this.fbrMult){
			return false;
		}
		else if(this.ammount >= this.max.m){
			notificationBox.printMaximum(this.title + 's');
			return false;
		}
		else{
			var can = true;
			var missings = [];
			if(bacons.ammount < this.priceBacons){
				can = false;
				missings.push(bacons.title)
			}
			if(!can)
				notificationBox.printNoResources(missings);
			return can;
		}
	},
	pay: function(){bacons.remove(this.priceBacons);},
	add: function(nb){this.ammount = (this.ammount+nb <= this.max.m) ? this.ammount+nb : this.max.m; this.cmp+=nb},
	remove: function(nb){this.ammount = (this.ammount-nb >= 0)? this.ammount-nb : 0;},
	tooltip: function(){
		return '<b>' + this.ttdescription + '</b><br />Bacons: ' + this.priceBacons;
	}
}
var cats ={
	unlocked: false,
	ammount: 0,
	cmp: 0,
	max:4,
	priceBacons: 50,
	pricePancakes: 2,
	fbrMult: 1,
	fbrTime: 10,
	fbring: 0,
	fbrIntervalId: 0,
	color:"FF9500",
	id:"Cats",
	title:"Cat",
	ttdescription:"They flip bacon for you.",
	fabricate: function(){
		this.fbring--;
		this.add(1);
		notificationBox.print('You hired a cute cat.');
		if(!this.fbring){
			$('#LD_' + this.id).css({'animation-iteration-count': 0});
			clearInterval(this.fbrIntervalId);
			this.fbrIntervalId = 0;
		}
		else{
			$('#LD_' + this.id).css({'animation-play-state': "running" })
		}
	},
	startFabricate: function(){
		if(this.canFbr()){
			this.pay();
			this.fbring += 1;
			if(!this.fbrIntervalId){
				$('#LD_' + this.id).css({'animation-iteration-count': "infinite"})
				$('#LD_' + this.id).css({'animation-duration': this.fbrTime + "s" })
				$('#LD_' + this.id).css({'animation-play-state': "running" })
				this.fbrIntervalId = setInterval(function(){
					cats.fabricate();
				}, this.fbrTime * 1000);
			}
		}
	},
	canFbr: function(){
		if(this.fbring >= this.fbrMult){
			return false;
		}
		else if(this.ammount >= this.max){
			notificationBox.printMaximum(this.title + 's');
			return false;
		}
		else{
			var can = true;
			var missings = [];
			if(bacons.ammount < this.priceBacons){
				can = false;
				missings.push(bacons.title)
			}
			if(baconPancakes.ammount < this.pricePancakes){
				can = false;
				missings.push(baconPancakes.title)
			}
			if(!can)
				notificationBox.printNoResources(missings);
			return can;
		}
	},
	pay: function(){bacons.remove(this.priceBacons); baconPancakes.remove(this.pricePancakes);},
	add: function(nb){this.ammount = (this.ammount+nb <= this.max) ? this.ammount+nb : this.max; this.cmp += nb;},
	remove: function(nb){this.ammount = (this.ammount-nb >= 0)? this.ammount-nb : 0;},
	tooltip: function(){
		return '<b>' + this.ttdescription + '</b><br>' + bacons.title + ': ' + this.priceBacons + '<br />' + baconPancakes.title + ': ' + this.pricePancakes;
	},
	cmpSal: 0,
	timer: -1,
	levels: [1,0],
	salary: [0,3],
	initTimerInterval: function(){setInterval(function(){cats.intervalTimer()},1000);},
	intervalTimer: function(){          
		if (this.ammount > 0){
			if(this.timer++ < 300){
				$('#SLR_' + this.id).animate({left: ((this.timer / 3)-2)+'%'}, 100, 'linear');
				this.catsDoingTheirJob();
			}
			else{
				this.timer = -1;
				this.paySal();
			}
		}
		else{
			this.timer = -1;
			$('#SLR_' + this.id).animate({left: (0-3)+'%'}, 100, 'linear');
		}
	},
	catsDoingTheirJob: function(){bacons.add(this.ammount * this.levels[0]);},
	paySal: function(){
		var loss = 0;
		if(baconPancakes.ammount < (this.salary[1] * this.ammount)){
			loss = this.ammount - Math.floor(baconPancakes.ammount / this.salary[1]);
			this.ammount -= loss;
			notificationBox.printLoss(this.title, loss);
		}
		baconPancakes.remove(this.salary[1] * this.ammount);
		this.cmpSal++;
		if(this.ammount > 0)
			notificationBox.printSalary(this.title,this.salary[1] * this.ammount,baconPancakes.title + 's',loss);
		
	},
	salTooltip: function(){
		return '<b>Levels: </b>' + order(this.levels) + '<br /><b>Salary:</b>' + order(this.salary);
	}
}

function GetBaconUpgrade(priceBacon, pricePancake, multiplier, color, title, tooltip, time){
	return {priceBacon, pricePancake, multiplier, color, title, tooltip, time};
}
class Bacon{
	constructor(){
		this.types = {
			Normal: GetBaconUpgrade(0, 0, 1, '000000', 'Bacon', 'Flips bacon', 0),
			Turkey: GetBaconUpgrade(150, 7, 2, 'FF0000', 'Turkey Bacon', 'Doubles Bacons By Flip', 4),
			Dinosaur: GetBaconUpgrade(150, 7, 4, '09DB10', 'Dinosaur Bacon', 'Flips 4 bacon at a time', 4)
		};
		this.upgradeList = [this.types.Normal, this.types.Turkey, this.types.Dinosaur];
		this.ammount = 0;
		this.cmp = 0;
		this.id = 'Bacons',
		this.title ='Bacon',
		this.upgradeIntervalId = 0;
		this.components = {
			LD: `#LD_${'UpgBacon'}`,
			MK: `#MK_${'UpgBacon'}`,
			BTN_TXT: `#BTN_TXT_${'UpgBacon'}`,
			BTN: `BTN_${'UpgBacon'}`,
			aniBacon: '#aniBacon'
		}
		this.upgrading = false;
		this.currentUpgrade = this.upgradeList.shift();
		this.nextUpgrade = this.upgradeList.shift();
	}
	add(nb){this.ammount += nb; this.cmp += nb;}
	shot(){this.add(this.currentUpgrade.multiplier * 1);}
	remove(nb){this.ammount = (this.ammount-nb >= 0)? this.ammount-nb : 0;}
	tick(){this.add(cats.ammount);}
	canUpgrade(){
		if(this.upgrading)
			return false;
		var missings = [];
		if(this.ammount < this.nextUpgrade.priceBacon)
			missings.push(bacons.title)
		if(baconPancakes.ammount < this.nextUpgrade.pricePancake)
			missings.push(baconPancakes.title)
		if(missings.length){
			notificationBox.printNoResources(missings);
			return false;
		}
		return true;
	}
	pay(){
		this.remove(this.nextUpgrade.priceBacon);
		baconPancakes.remove(this.nextUpgrade.pricePancakes);
	}
	setLoader(){
		$(this.components.LD).css({'background-color': `#${this.nextUpgrade.color}`});
		$(this.components.BTN_TXT).text(this.nextUpgrade.title);
	}
	upgrade(){
		this.upgrading = false;
		$(this.components.LD).css({'animation-iteration-count': 0});
		this.effect();
	}
	startUpgrade(){
		debugger;
		if(!this.canUpgrade())
			return;
		this.pay();
		this.upgrading = true;
		$(this.components.LD).css({'animation-iteration-count': "infinite"})
		$(this.components.LD).css({'animation-duration': `${this.nextUpgrade.upgradingTime}s` })
		$(this.components.LD).css({'animation-play-state': "running" })
		setTimeout(function(){this.upgrade.bind(this)}, this.nextUpgrade.upgradingTime * 1000);
	}
	effect(){
		this.currentUpgrade = this.nextUpgrade;
		this.nextUpgrade = this.upgradeList.shift();
		notificationBox.print(`You upgraded to ${this.currentUpgrade.title} and can do more bacon: x${this.currentUpgrade.multiplier}`);
		$("#aniBacon").css({color : `#${this.currentUpgrade.color}`});
		//Do something
		if(this.nextUpgrade=== undefined)
			$(this.components.MK).remove();
		else
			this.setLoader();
	}
	tooltip(){
		return `<b>${this.nextUpgrade.tooltip} </b><br />Bacons: ${this.nextUpgrade.priceBacon}<br />Pancakes: ${this.nextUpgrade.pricePancake}`;
	}
}
var bacon = new Bacon();

function order(arr){
	var str = '';
	for(i= 0; i < arr.length ; i++)
		str += '['+arr[i]+']';
	return str;
}
function addPlural(n){
	return (n > 1? 's':'');
}