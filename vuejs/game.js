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
		}
	}

});