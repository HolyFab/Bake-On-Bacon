var bacons = { 
	ammount: 0, 
	cmp: 0,
	byShot: 1,
	id: 'Bacons',
	title:'Bacon',
	add: function(nb){this.ammount += nb; this.cmp += nb;},
	shot: function(){this.add(this.byShot);},
	remove: function(nb){this.ammount = (this.ammount-nb >= 0)? this.ammount-nb : 0;},
	tick: function(){this.add(cats.ammount);}
}
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

var upgBacon = {
	owned: [false,false],
	getOwned: function(){return this.owned[this.nextUpg];},
	priceBacons: [150,150],
	getPriceBacons: function(){return this.priceBacons[this.nextUpg];},
	pricePancakes: [7,7],
	getPricePancakes: function(){return this.pricePancakes[this.nextUpg];},
	baconMultiplier:[2,5],
	getBaconMultiplier: function(){return this.baconMultiplier[this.nextUpg];},
	id: 'UpgBacon',
	colors:['FF0000','09DB10'],
	getColor: function(){return this.colors[this.nextUpg];},
	titles:['Turkey Bacon', 'Dinosaur Bacon'],
	getTitle: function(){return this.titles[this.nextUpg];},
	ttdescription:['Doubles bacons by flip','Flips 5 bacon at a time!!'],
	getTTdescription: function(){return this.ttdescription[this.nextUpg];},
	upging:false,
	upgtime:[4,4],
	getUpgtime: function(){return this.upgtime[this.nextUpg];},
	upgIntervalId: 0,
	nextUpg: 0,
	upgrade: function(){
		this.upging = false;
		this.owned[this.nextUpg] = true;
		notificationBox.print("You upgraded to " + this.getTitle() + " and can you more bacon: x" + this.getBaconMultiplier());
		$('#LD_' + this.id).css({'animation-iteration-count': 0});
		clearInterval(this.upgIntervalId);
		this.upgIntervalId = 0;
		this.effect(this.nextUpg);
	},
	startUpgrade: function(){
		if(this.canUpg(this.nextUpg)){
			this.pay(this.nextUpg);
			this.upging = true;
			if(!this.upgIntervalId){
				$('#LD_' + this.id).css({'animation-iteration-count': "infinite"})
				$('#LD_' + this.id).css({'animation-duration': this.getUpgtime() + "s" })
				$('#LD_' + this.id).css({'animation-play-state': "running" })
				this.upgIntervalId = setInterval(function(){upgBacon.upgrade()}, this.getUpgtime() * 1000);
			}
		}
	},
	canUpg: function(){
		if(this.upging){
			return false;
		}
		else{
			var can = true;
			var missings = [];
			if(bacons.ammount < this.getPriceBacons()){
				can = false;
				missings.push(bacons.title)
			}
			if(baconPancakes.ammount < this.getPricePancakes()){
				can = false;
				missings.push(baconPancakes.title)
			}
			if(!can)
				notificationBox.printNoResources(missings);
			return can;
		}
	},
	pay: function(){
		bacons.remove(this.getPriceBacons());
		baconPancakes.remove(this.getPricePancakes());
	},
	setLoader: function(){
		$('#LD_UpgBacon').css({'background-color': '#' + this.getColor()});
		$('#BTN_TXT_' + this.id).text(this.getTitle());
	},
	effect:function(){
		bacons.byShot = upgBacon.getBaconMultiplier();
		$("#aniBacon").css({color : "#" + this.getColor()});
		if(this.nextUpg++ < this.owned.length)
			this.setLoader();
		else
			$('#MK_' + this.id).remove();
	},
	tooltip: function(){
		return '<b>' + this.getTTdescription() + ' </b><br />Bacons: ' + this.getPriceBacons()  + '<br />Pancakes: '  + this.getPricePancakes();
	}
}
function order(arr){
	var str = '';
	for(i= 0; i < arr.length ; i++)
		str += '['+arr[i]+']';
	return str;
}
function addPlural(n){
	return (n > 1? 's':'');
}