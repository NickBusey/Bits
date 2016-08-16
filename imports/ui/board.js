import { Template } from 'meteor/templating';
import { Bits } from '../api/bits.js';
import { Foods } from '../api/foods.js';

export default class Board {
	constructor() {
		this.squareLength = 5;
		this.circleRadius = 15;
		this.ratios = { rock:0.005, lava:0.005 };
		this.gridSize = { x:100, y:100 };

		this.svgSize = this.getSvgSize(this.gridSize, this.squareLength);
		this.map = this.buildMap(this.gridSize, this.ratios);
	}

	drawMap() {
		this.svgContainer = d3.select(".display")
		.append("svg")
		.attr("width", this.svgSize.width)
		.attr("height", this.svgSize.height);
		var scales = this.getScale(this.gridSize, this.svgSize);

		
		this.drawCells(this.svgContainer, scales, this.map.grass, "grass");
		this.drawCells(this.svgContainer, scales, this.map.rock, "rock");
		this.drawCells(this.svgContainer, scales, this.map.lava, "lava");

		this.groups = {
			bits:this.svgContainer.append("g"),
			foods:this.svgContainer.append("g"),
		};

		this.mapCreated = true;
	}

	update() {
		var that = this;
		if (!this.mapCreated) return;

		var scales = this.getScale(this.gridSize, this.svgSize);
		this.groups.bits.selectAll("rect").remove();
		this.groups.foods.selectAll("rect").remove();

		// Redraw all bits (this can certainly be improved)
		var foods = Foods.find({});
		var bits = Bits.find({});
		bits.forEach(function (bit) {
			var data = [{x:bit.left,y:bit.top,type:"bit"}];
			var cell = that.groups.bits
				.append("rect")
				.data(data)
			;

			var health = Math.min(Math.round(bit.health * 2.55),250);

			var cellAttributes = cell
				.attr("x", function (d) { return scales.x(d.x); })
				.attr("y", function (d) { return scales.y(d.y); })
				.attr("width", function (d) { return that.squareLength; })
				.attr("height", function (d) { return that.squareLength; })
				.attr("class", 'bit')
				.attr("style", 'fill: rgb(0,0,'+health+');')
			;

			if (bit.active) {
				cell.attr("style", 'fill: rgb('+health+','+health+',0);');
			}

			if (bit.shieldAge > app.newShieldTime) {
				cell.attr('class', 'bit shield');
			}

			// Check to see if we hit lava
			for (var i = that.map.lava.length - 1; i >= 0; i--) {
				var lava = that.map.lava[i];
				if (lava.x == bit.left && lava.y == bit.top) {
					// We hit lava. Do we have a shield? If so, drop that, otherwise, die.
					if (bit.shieldAge > app.newShieldTime) {
						Bits.update(bit._id, {
						  $set: { shieldAge: 0 },
						});
					} else {
						Bits.remove(bit._id);
						cell.attr("class", 'deadBit');
					}
				}
			}

			// Check to see if we hit food
			foods.forEach(function (food) {
				if (food.left == bit.left && food.top == bit.top) {
					Foods.remove(food._id);
					Bits.update(bit._id, {
					  $set: { health: bit.health + app.foodHealthBonus },
					});
				}
			});
		});

		foods.forEach(function (food) {
			var data = [{x:food.left,y:food.top,type:"food"}];
			var cell = that.groups.foods
				.append("rect")
				.data(data)
			;

			var cellAttributes = cell
				.attr("x", function (d) { return scales.x(d.x); })
				.attr("y", function (d) { return scales.y(d.y); })
				.attr("width", function (d) { return that.squareLength; })
				.attr("height", function (d) { return that.squareLength; })
				.attr("class", 'food')
			;
		});


	}

	getSvgSize(gridSize, squareLength) {
		var width = gridSize.x * squareLength;
		var height = gridSize.y * squareLength;
		return { width:width, height:height };
	}

	isBorder(x, y, gridSize) {
		return x==0 || y == 0 || x == (gridSize.x-1) || y == (gridSize.y-1);
	}

	buildMap(gridSize, ratios) {
		var map = { grid:[], grass:[], rock:[], lava:[] };
		for (x = 0; x < gridSize.x; x++) {
			map.grid[x] = [];
			for (y = 0; y < gridSize.y; y++) {
				var rock = Math.random() < ratios.rock;
				var lava = Math.random() < ratios.lava;
				var type = this.isBorder(x, y, gridSize)?"rock":"grass";
				if(rock) {
					type = "rock";
				}
				if(lava) {
					type = "lava";
				}
				var cell = { x:x, y:y , type:type };
				map.grid[x][y] = cell;
				map[type].push(cell);
			}
		}
		return map;
	}

	getScale(gridSize, svgSize) {
		var xScale = d3.scale.linear().domain([0,gridSize.x]).range([0,svgSize.width]);
		var yScale = d3.scale.linear().domain([0,gridSize.y]).range([0,svgSize.height]);
		return { x:xScale, y:yScale };
	}

	drawCells(svgContainer, scales, data, cssClass) {
		var that = this;
		var gridGroup = svgContainer.append("g");
		var cells = gridGroup.selectAll("rect")
		.data(data)
		.enter()
		.append("rect");
		var cellAttributes = cells
		.attr("x", function (d) { return scales.x(d.x); })
		.attr("y", function (d) { return scales.y(d.y); })
		.attr("width", function (d) { return that.squareLength; })
		.attr("height", function (d) { return that.squareLength; })
		.attr("class", cssClass);
	}
}


