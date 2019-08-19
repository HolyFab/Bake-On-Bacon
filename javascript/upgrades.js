class CostObj {
    constructor(bacons, pancakes) {
        this.bacons = bacons; this.pancakes = pancakes;
    }

    canBuy(showNotif = false) {
        var missings = []
        if (bacon.ammount < this.bacons)
            missings.push(bacon.title)
        if (baconPancakes.ammount < this.pancakes)
            missings.push(baconPancakes.title)
        if (missings.length > 0 && showNotif)
            notificationBox.printNoResources(missings);
        return !missings.length
    }

    buy() {
        bacon.remove(this.bacons);
        baconPancakes.remove(this.pancakes);
    }
}

var baconPancakes = {
    unclocked: false,
    ammount: 0,
    cmp: 0,
    stack: {
        m: 0,
        current: 0,
        cost: new CostObj(1000, 15),
        unlockCost: new CostObj(1000, 12),
        costMultiplier: 2,
        unlocked: false,
        unlock: function () {
            if (this.unlocked || !this.unlockCost.canBuy())
                return false;
            this.unlockCost.buy();
            unlocked = true;
            $('#MK_' + baconPancakes.id).append(createUpgradeMaximumBTN(
                function () { return baconPancakes.stack.upgrade() },
                function () { return baconPancakes.stack.tooltip() }
            ));
            notificationBox.print('You can now buy pancakes stack ' + baconPancakes.title);
            return true;
        },
        tooltipUnlock: function () { return `${baconPancakes.title}: ${this.unlockCost.pancakes} <br /> ${bacon.title}: ${this.unlockCost.bacons}`; },
        tooltip: function () {
            return `<b>Stack ${baconPancakes.title} </b><br />
                ${bacon.title}: ${this.unlockCost.bacons}<br />
                ${baconPancakes.title}: ${this.unlockCost.pancakes}`;
        },
        upgrade: function(){
            if(!this.unlockCost.canBuy(true))
                return false;
            this.unlockCost.pay();
            this.m++;
            return true;
        }

    },
    max: {
        m: 10,
        cost: 0.5,
        perUpg: 2,
        unlocked: false,
        unlockCost: new CostObj(0, 5),
        unlock: function () {
            if (this.unlocked || !this.unlockCost.canBuy())
                return false;
            this.unlockCost.buy();
            unlocked = true;
            $('#MK_' + baconPancakes.id).append(createUpgradeMaximumBTN(
                function () { return baconPancakes.max.upgrade() },
                function () { return baconPancakes.max.tooltip() }
            ));
            notificationBox.print('You can now upgrade your maximum ' + baconPancakes.title);
            return true;
        },
        tooltipUnlock: function () { return `${baconPancakes.title}: ${this.unlockCost.pancakes}`; },
        tooltip: function () {
            return `<b>Maximum ${baconPancakes.title} </b><br />
                ${baconPancakes.title}: ${Math.floor(this.m * this.cost)}`;
        },
        upgrade: function () {
            if (!this.canUpgrade()) {
                notificationBox.printNoResources([baconPancakes.title]);
                return false;
            }

            baconPancakes.remove(this.cost * this.m);
            this.m += this.perUpg;
            $('#TXT_MAX_' + baconPancakes.id).text(this.m);
            return true;
        },
        canUpgrade: function () { return baconPancakes.ammount >= (this.cost * this.m); }

    },
    priceBacons: 50,
    fbrMult: 3,
    fbrTime: 5,
    fbring: 0,
    fbrIntervalId: 0,
    color: "CC6600",
    id: "BaconPancakes",
    title: "Bacon Pancake",
    ttdescription: "It's delicious!",
    fabricate: function () {
        this.fbring--;
        this.add(1);
        notificationBox.print('You baked a delicious pancake.');
        if (!this.fbring) {
            $('#LD_' + this.id).css({ 'animation-iteration-count': 0 });
            clearInterval(this.fbrIntervalId);
            this.fbrIntervalId = 0;
        }
        else {
            $('#LD_' + this.id).css({ 'animation-play-state': "running" })
        }
    },
    startFabricate: function () {
        if (this.canFbr()) {
            this.unclocked = true;
            this.pay();
            this.fbring += 1;
            if (!this.fbrIntervalId) {
                $('#LD_' + this.id).css({ 'animation-iteration-count': "infinite" })
                $('#LD_' + this.id).css({ 'animation-duration': this.fbrTime + "s" })
                $('#LD_' + this.id).css({ 'animation-play-state': "running" })
                this.fbrIntervalId = setInterval(function () { baconPancakes.fabricate() }, this.fbrTime * 1000);
            }
        }
    },
    canFbr: function () {
        if (this.fbring >= this.fbrMult) {
            return false;
        }
        else if (this.ammount >= this.max.m) {
            notificationBox.printMaximum(this.title + 's');
            return false;
        }
        else {
            var can = true;
            var missings = [];
            if (bacon.ammount < this.priceBacons) {
                can = false;
                missings.push(bacon.title)
            }
            if (!can)
                notificationBox.printNoResources(missings);
            return can;
        }
    },
    pay: function () { bacon.remove(this.priceBacons); },
    add: function (nb) { this.ammount = (this.ammount + nb <= this.max.m) ? this.ammount + nb : this.max.m; this.cmp += nb },
    remove: function (nb) { this.ammount = (this.ammount - nb >= 0) ? this.ammount - nb : 0; },
    tooltip: function () {
        return '<b>' + this.ttdescription + '</b><br />Bacons: ' + this.priceBacons;
    }
}
var cats = {
    unlocked: false,
    ammount: 0,
    cmp: 0,
    max: 4,
    cost: new CostObj(50, 2),
    fbrMult: 1,
    fbrTime: 10,
    fbring: 0,
    fbrIntervalId: 0,
    color: "FF9500",
    id: "Cats",
    title: "Cat",
    ttdescription: "They flip bacon for you.",
    fabricate: function () {
        this.fbring--;
        this.add(1);
        notificationBox.print('You hired a cute cat.');
        if (!this.fbring) {
            $('#LD_' + this.id).css({ 'animation-iteration-count': 0 });
            clearInterval(this.fbrIntervalId);
            this.fbrIntervalId = 0;
        }
        else {
            $('#LD_' + this.id).css({ 'animation-play-state': "running" })
        }
    },
    startFabricate: function () {
        if (!this.canFbr())
            return;
        this.pay();
        this.fbring += 1;
        if (!this.fbrIntervalId) {
            $('#LD_' + this.id).css({ 'animation-iteration-count': "infinite" })
            $('#LD_' + this.id).css({ 'animation-duration': this.fbrTime + "s" })
            $('#LD_' + this.id).css({ 'animation-play-state': "running" })
            this.fbrIntervalId = setInterval(function () {
                cats.fabricate();
            }, this.fbrTime * 1000);
        }
    },
    canFbr: function () {
        if (this.fbring >= this.fbrMult) {
            return false;
        }
        else if (this.ammount >= this.max) {
            notificationBox.printMaximum(this.title + 's');
            return false;
        }
        return this.cost.canBuy(true);
    },
    pay: function () { this.cost.buy() },
    add: function (nb) { this.ammount = (this.ammount + nb <= this.max) ? this.ammount + nb : this.max; this.cmp += nb; },
    remove: function (nb) { this.ammount = (this.ammount - nb >= 0) ? this.ammount - nb : 0; },
    tooltip: function () {
        return '<b>' + this.ttdescription + '</b><br>' + bacon.title + ': ' + this.cost.bacons + '<br />' + baconPancakes.title + ': ' + this.cost.pancakes;
    },
    cmpSal: 0,
    timer: -1,
    levels: [1, 0],
    salary: [0, 3],
    initTimerInterval: function () { setInterval(function () { cats.intervalTimer() }, 1000); },
    intervalTimer: function () {
        if (this.ammount > 0) {
            if (this.timer++ < 300) {
                $('#SLR_' + this.id).animate({ left: ((this.timer / 3) - 2) + '%' }, 100, 'linear');
                this.catsDoingTheirJob();
            }
            else {
                this.timer = -1;
                this.paySal();
            }
        }
        else {
            this.timer = -1;
            $('#SLR_' + this.id).animate({ left: (0 - 3) + '%' }, 100, 'linear');
        }
    },
    catsDoingTheirJob: function () { bacon.add(this.ammount * this.levels[0]); },
    paySal: function () {
        var loss = 0;
        if (baconPancakes.ammount < (this.salary[1] * this.ammount)) {
            loss = this.ammount - Math.floor(baconPancakes.ammount / this.salary[1]);
            this.ammount -= loss;
            notificationBox.printLoss(this.title, loss);
        }
        baconPancakes.remove(this.salary[1] * this.ammount);
        this.cmpSal++;
        if (this.ammount > 0)
            notificationBox.printSalary(this.title, this.salary[1] * this.ammount, baconPancakes.title + 's', loss);

    },
    salTooltip: function () {
        return '<b>Levels: </b>' + order(this.levels) + '<br /><b>Salary:</b>' + order(this.salary);
    }
}

function GetBaconUpgrade(cost, multiplier, color, title, tooltip, time) {
    return { cost, multiplier, color, title, tooltip, time };
}

class Bacon {
    constructor() {
        this.types = {
            Normal: GetBaconUpgrade(undefined, 1, '000000', 'Bacon', 'Flips bacon', 0),
            Turkey: GetBaconUpgrade(new CostObj(150, 7), 2, 'FF0000', 'Turkey Bacon', 'Doubles Bacons By Flip', 4),
            Dinosaur: GetBaconUpgrade(new CostObj(2000, 25), 4, '09DB10', 'Dinosaur Bacon', 'Flips 4 bacon at a time', 4)
        };
        this.upgradeList = [this.types.Normal, this.types.Turkey, this.types.Dinosaur];
        this.ammount = 0;
        this.cmp = 0;
        this.id = 'Bacons',
            this.title = 'Bacon',
            this.upgradeIntervalId = 0;
        this.components = {
            LD: `#LD_${'UpgBacon'}`,
            MK: `#MK_${'UpgBacon'}`,
            BTN_TXT: `#BTN_TXT_${'UpgBacon'}`,
            BTN: `#BTN_${'UpgBacon'}`,
            aniBacon: '#aniBacon'
        }
        this.upgrading = false;
        this.currentUpgrade = this.upgradeList.shift();
        this.nextUpgrade = this.upgradeList.shift();
    }
    add(nb) { this.ammount += nb; this.cmp += nb; }
    shot() { this.add(this.currentUpgrade.multiplier * 1); }
    remove(nb) { this.ammount = (this.ammount - nb >= 0) ? this.ammount - nb : 0; }
    tick() { this.add(cats.ammount); }
    canUpgrade() {
        if (this.upgrading)
            return false;
        return this.nextUpgrade.cost.canBuy(true);
    }
    pay() {
        this.nextUpgrade.cost.buy();
    }
    setLoader() {
        $(this.components.LD).css({ 'background-color': `#${this.nextUpgrade.color}` });
        $(this.components.BTN_TXT).text(this.nextUpgrade.title);
    }
    upgrade() {
        this.upgrading = false;
        $(this.components.LD).css({ 'animation-iteration-count': 0 });
        this.effect();
    }
    startUpgrade() {
        if (!this.canUpgrade())
            return;
        this.pay();
        this.upgrading = true;
        $(this.components.LD).css({ 'animation-iteration-count': "infinite" })
        $(this.components.LD).css({ 'animation-duration': `${this.nextUpgrade.time}s` })
        $(this.components.LD).css({ 'animation-play-state': "running" })
        setTimeout(this.upgrade.bind(this), this.nextUpgrade.time * 1000);
    }
    effect() {
        this.currentUpgrade = this.nextUpgrade;
        this.nextUpgrade = this.upgradeList.shift();
        notificationBox.print(`You upgraded to ${this.currentUpgrade.title} and can do more bacon: x${this.currentUpgrade.multiplier}`);
        $("#aniBacon").css({ color: `#${this.currentUpgrade.color}` });
        //Do something
        if (this.nextUpgrade === undefined)
            $(this.components.MK).remove();
        else
            this.setLoader();
    }
    tooltip() {
        return `<b>${this.nextUpgrade.tooltip} </b><br />Bacons: ${this.nextUpgrade.cost.bacons}<br />Pancakes: ${this.nextUpgrade.cost.pancakes}`;
    }
}
var bacon = new Bacon();

function order(arr) {
    var str = '';
    for (i = 0; i < arr.length; i++)
        str += '[' + arr[i] + ']';
    return str;
}
function addPlural(n) {
    return (n > 1 ? 's' : '');
}