Vue.component('board', {
	props['columns', 'rows'],
	

});


new Vue({
	el: '#battelship',

	data: {
		ships: [
		{'type': 'Aircaft', 'size': 5, 'rekt': false, 'available': 1},
		{'type': 'Battleship', 'size': 5, 'rekt': false, 'available': 2},
		{'type': 'Destroyer', 'size': 3, 'rekt': false, 'available': 3},
		{'type': 'Submarine', 'size': 3, 'rekt': false, 'available': 3},
		{'type': 'Patrolboat', 'size': 2, 'rekt': false, 'available': 4},
	],

	chosenShips: [];
	rotated: false
	}
});