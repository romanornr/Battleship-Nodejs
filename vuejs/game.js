var socket = io('');

socket.on('test', function(socket){
	vm.statusMessage = 'Enemy found';
	console.log('test');
});

socket.on('enemyIsFound', function(){
	vm.statusMessage = 'Enemy has been spotted on the radar. Quick place your ships!';
	socket.emit('init');
});

socket.on('init', function(obj){
	vm.player = obj;
});

socket.on('PlayerJoined', function(){
	vm.statusMessage = 'Not ready';
});

socket.on('enemyReady', function(){
	vm.enemyReady = true;
	vm.statusMessage = 'Ready';
	console.log('Enemy is ready');
});

Vue.component('board', {
	props:['columns', 'rows'],
	template: '#board-template',
	
		computed:{
		board: function(){
			var height = this.columns *60;
			var width = this.rows * 60;
			var id = 0;

				var element = []; 
				for (var i = 0; i <this.columns; i++){
					element += id++;
				}
				return element;
			}
	},

	methods: {
		placeTheShip: function(el){

			console.log(this.$root.chosenShip);

			if(this.$root.chosenShip == null || this.$root.chosenShip.available == 0) return;
			var setCoordination = el.currentTarget.getAttribute('data-coordination');
			var size = this.$root.chosenShip.size;
			var hoveredTile = document.querySelectorAll('.tile-hover');
			var overlap = false; //check for placing colission 

			for (var i = size - 1; i >= 0; i--) {
				if(this.$root.rotated){
					if(parseInt(setCoordination.split("").reverse().join("")[0]) + size <= this.columns){
						var e = document.querySelector('[data-coordination="'+(parseInt(setCoordination) + (i))+'"]');
						if (e.className == 'placed-tile') overlap = true;
					}else{
						var e = document.querySelector('[data-coordination="' + (parseInt(setCoordination) - (i))+'"]'); 
						if (e.className == 'placed-tile') overlap = true;
						}
					} if(!this.$root.rotated){
						if(document.querySelector('[data-coordination="' + (parseInt(setCoordination) + (i * 10)) + '"]') != null){
							var e = document.querySelector('[data-coordination="'+ (parseInt(setCoordination) + (i * 10)) +'"]');
							if(e.className == 'placed-tile') overlap = true;
						}else{
							console.log('no');
							var e = document.querySelector('[data-coordination="'+ (parseInt(setCoordination) - ((size - i) *10)) + '"]');
							if(e.className == 'placed-tile') overlap = true;
						}
					}
				}

				if(!overlap){
					console.log(this.$root.chosenShip);
					for (var i = hoveredTile.length - 1; i >= 0; i--) {
						hoveredTile[i].className = 'placed-tile';
						this.$root.chosenShip.location.push(parseInt(hoveredTile[i].getAttribute('data-coordination')));
					}
					this.$root.chosenShip.available--;
					console.log(socket.emit('place', this.$root.chosenShip));
				}

			},
changeStyle: function(el) {

			if(this.$root.chosenShip == null || this.$root.chosenShip.available == 0)
				return;

			var setCoordination = el.currentTarget.getAttribute('data-coordination');

			var size = this.$root.chosenShip.size;
				

			for (var i = 0; i < size; i++) {
				var e = document.querySelector('[data-coordination="'+ setCoordination + (i)+'"]');

				if(this.$root.rotated) {
					if (parseInt(setCoordination.split("").reverse().join("")[0]) + size <= this.columns) {
						var e = document.querySelector('[data-coordination="'+ (parseInt(setCoordination) + (i)) +'"]');
						e.className = e.className == 'placed-tile' ? 'placed-tile' : 'tile-hover';
					}
					else {
						var e = document.querySelector('[data-coordination="'+ (parseInt(setCoordination) - (i)) +'"]');
						e.className = e.className == 'placed-tile' ? 'placed-tile' : 'tile-hover';
					}
				} else if (!this.$root.rotated) {
					if (document.querySelector('[data-coordination="'+ (parseInt(setCoordination) + (i * 10)) +'"]') != null) {
						var e = document.querySelector('[data-coordination="'+ (parseInt(setCoordination) + (i * 10)) +'"]');
						e.className = e.className == 'placed-tile' ? 'placed-tile' : 'tile-hover';
					}
					else {
						var e = document.querySelector('[data-coordination="'+ (parseInt(setCoordination) - ((size - i) * 10)) +'"]');
						e.className = e.className == 'placed-tile' ? 'placed-tile' : 'tile-hover';
					}
				}

			}

		},

		setDef: function(el) {
			if(this.$root.chosenShip == null) return;
			var setCoordination = el.currentTarget.getAttribute('data-coordination');

			var size = this.$root.chosenShip.size;

			for (var i = 0; i < size; i++)
				if(this.$root.rotated) {
					if (parseInt(setCoordination.split("").reverse().join("")[0]) + size <= this.columns) {
						var e = document.querySelector('[data-coordination="'+ (parseInt(setCoordination) + (i * 1)) +'"]');
						e.className  = e.className == 'placed-tile' ? 'placed-tile' : 'tile';
					}
					else {
						var e = document.querySelector('[data-coordination="'+ (parseInt(setCoordination) - ((i) * 1)) +'"]');
						e.className  = e.className == 'placed-tile' ? 'placed-tile' : 'tile';
					}
				} else if (!this.$root.rotated) {
					if (document.querySelector('[data-coordination="'+ (parseInt(setCoordination) + (i * 10)) +'"]') != null) {
						var e = document.querySelector('[data-coordination="'+ (parseInt(setCoordination) + (i * 10)) +'"]');
						e.className  = e.className == 'placed-tile' ? 'placed-tile' : 'tile';
					}
					else {
						var e = document.querySelector('[data-coordination="'+ (parseInt(setCoordination) - ((size - i) * 10)) +'"]');
						e.className  = e.className == 'placed-tile' ? 'placed-tile' : 'tile';
					}
				}
		}
	}

});

Vue.component('enemy-board', {
	template: "#enemyBoard-template", 
	props: ['columns', 'rows'], 

	computed:{
		enemyBoard: function(){
			var height = this.columns *60;
			var width = this.rows * 60;
			var id = 0;

				var element = []; 
				for (var i = 0; i <this.columns; i++){
					element += id++;
				}
				return element;
			}
	}, 

	methods: {
		fire: function(el){
			if(el.currentTarget.getAttribute('data-hittable') == 'true')
			{
				if(!vm.player) return;
				console.log(parseInt(el.currentTarget.getAttribute('data-enemyCoordination')));
				socket.emit('fire', {'player':vm.player, 'coordination' : parseInt(el.currentTarget.getAttribute('data-enemyCoordination'))});
				el.currentTarget.className = 'missed-tile';
				el.currentTarget.setAttribute('data-hittable', 'false');
			}
		}
	}
});

var vm = new Vue({
	el: '#battleship',

	data: {
		ships: [
		{'type': 'Aircaft', 'size': 5, 'rekt': false, 'available': 1, 'location' : []},
		{'type': 'Battleship', 'size': 4, 'rekt': false, 'available': 2, 'location' : []},
		{'type': 'Destroyer', 'size': 3, 'rekt': false, 'available': 3, 'location' : []},
		{'type': 'Submarine', 'size': 3, 'rekt': false, 'available': 3, 'location' : []},
		{'type': 'Patrolboat', 'size': 2, 'rekt': false, 'available': 4, 'location' : []}
	],

	chosenShip: null,
	statusMessage: 'Waiting for enemy....',
	rotated: false,
	enemyReady: false,
	ready: false
	//player: null,
	}, 

	methods: {
		setChosenShip: function(ship){
			this.chosenShip = ship;
			console.log(this.chosenShip = ship);
		}
	}, 

	computed: {
		ready: function(){

			var ready = true;
			for (var i = ships.length - 1; i >= 0; i--) {
				if(ships[i].available >= 0) ready = true;
			}
		// 	if (ready){
		// 		socket.emit('ready', this.playerid)
		// 	}
		// 	return ready;
		}
	}

});