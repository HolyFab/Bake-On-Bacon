$(function(){
	
})

var notificationBox = {
	lastNotif:{
		text:"",
		div:"",
		times:0
	},
	clearHidden: function(){
		var bottom = $('#fading').position().top + $('#fading').outerHeight(true);
		$('.notification').each(function(){
			if($(this).position().top > bottom){
				$(this).remove();
			}
		});
	},
	print: function(t){
		if(t !== this.lastNotif.text)
		{
			var notif = $('<div>').addClass('notification').css('opacity','0').html(t).prependTo('div#notifications');
			notif.animate({opacity: 1}, 500, 'linear',function(){
				notificationBox.clearHidden()
			});
			this.lastNotif = {
				text:t,
				div:notif,
				times:1
			};
		}
		else{
			this.lastNotif.times += 1;
			$(this.lastNotif.div).html(this.lastNotif.text + "(" + this.lastNotif.times + ")");
		}
		
	},
	printNoResources: function(missings){
		if(missings !== undefined && missings.length){
			var str = "";
			for (i = 0; i < missings.length; i++){
				str += '<b>' + missings[i] + '</b>, ';
			}
			this.print('You don\'t have enough ' + str.slice(0, str.length - 2) + '.')
		}
		else
			this.print('You don\'t have enough ressources.'); 
	},
	printMaximum: function(titles){
		this.print('You already are at maximum <b>' + titles + '</b>.');
	},
	printSalary: function(title,nSalary,tSalary,loss){
		this.print('You payed your ' + title + 's ' + nSalary + ' <b>' + tSalary + '</b>');
	},
	printLoss: function(title, loss){
		this.print(loss + ' ' + (loss > 1 ? title + 's' : title) + ' resigned because of underpayment.');
	}
}
