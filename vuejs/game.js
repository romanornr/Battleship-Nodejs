Vue.config.debug = true;

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
		placeTheShip: function(game){

			console.log(game.currentTarget.getAttribute('data-coordination'));

			if(this.$root.chosenShip == null || this.$root.chosenShip == 0) return;
			var setCoordination = game.currentTarget.getAttribute('data-coordination');
			var size = this.$root.chosenShip.size;
			var hoveredTile = document.querySelectorAll('.title-hover');
			var overlap = false; //check for placing colission 

			for(var i = 0; i < size; i++){
				if(this.$root.rotated){
					if(parseInt(setCoordination.split(".").reverse().join(".")[0]) + size <=this.columns){
						var e = document.querySelector('[data-coordination="'+(parseInt(setCoordination) + (i))+'"]');
						if (e.className == 'placed-tile') overlap = true;
					}else{
						var e = document.querySelector('[data-coordination="' + (parseInt(setCoordination) - (i))+'"]'); 
						if (e.className = 'placed-tile') overlap = true;
						}
					} else if(!this.$root.rotated){
						if(document.querySelector('[data-coordination="' + (parseInt(setCoordination) + (i * 10)) + '"]') != null){
							var e = document.querySelector('[data-coordination="'+ (parseInt(setCoordination) + (i * 10)) +'"]');
							if(e.className = 'placed-tile') overlap=true;
						}else{
							var e = document.querySelector('[data-coordination="'+ (parseInt(setCoordination) - ((size - i) *10)) + '"]');
							if(e.className == 'placed-tile') overlap= true; 
						}
					}
					console.log(e.className);

				}if(!overlap){
					this.$root.chosenShip.amount--;
					for (var i=0; i < hoveredTile.length; i++){
						hoveredTile[i].className = 'placed-tile';
					}
				}
			},
changeStyle: function(el) {

			if(this.$root.chosenShip == null || this.$root.chosenShip.amount == 0)
				return;

			var setCoordination = el.currentTarget.getAttribute('data-coordination');

			var size = this.$root.chosenShip.size;

			console.log(setCoordination + ' is the Coordination');
				

			for (var i = 0; i < size; i++) {
				var e = document.querySelector('[data-coordination="'+ setCoordination + (i)+'"]');
				console.log(e);

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
			if(this.$root.chosenShip == null)
				return;
			var setCoordination = el.currentTarget.getAttribute('data-coordination');

			var size = this.$root.chosenShip.size;

			for (var i = 0; i < size; i++)
				if(this.$root.rotated) {
					if (parseInt(setCoordination.split("").reverse().join("")[0]) + size <= this.cols) {
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

var vm = new Vue({
	el: '#battleship',

	data: {
		ships: [
		{'type': 'Aircaft', 'size': 5, 'rekt': false, 'available': 1},
		{'type': 'Battleship', 'size': 5, 'rekt': false, 'available': 2},
		{'type': 'Destroyer', 'size': 3, 'rekt': false, 'available': 3},
		{'type': 'Submarine', 'size': 3, 'rekt': false, 'available': 3},
		{'type': 'Patrolboat', 'size': 2, 'rekt': false, 'available': 4}
	],

	chosenShip: null,
	statusMessage: 'Waiting for enemy....',
	rotated: false,
	enemyReady: false,
	playerid: null,
	Fire: false
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
			this.ships.Foreach(function(element, index){
				if(element.available > 0)
					ready = false;
			});
			if (ready){
				//socket.io
			}
			return ready;
		}
	}

});