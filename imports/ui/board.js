import { Template } from 'meteor/templating';
import { Bits } from '../api/bits.js';

export default class Board {
	constructor() {
		this.squareLength = 20;
		this.circleRadius = 15;
		this.ratios = { rock:0.05, lava:0.05 };
		this.gridSize = { x:20, y:20 };

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
			path:this.svgContainer.append("g"),
			position:this.svgContainer.append("g"),
			bits:this.svgContainer.append("g"),
		};

		this.mapCreated = true;
	}

	update() {
		var that = this;
		if (!this.mapCreated) return;
		var scales = this.getScale(this.gridSize, this.svgSize);
		this.groups.bits.selectAll("rect").remove();

		// console.log(this.map.lava);

		var bits = Bits.find({});
		bits.forEach(function (bit) {
			var data = [{x:bit.left,y:bit.top,type:"bit"}];
			var cell = that.groups.bits
				.append("rect")
				.data(data);

			var cellAttributes = cell
				.attr("x", function (d) { return scales.x(d.x); })
				.attr("y", function (d) { return scales.y(d.y); })
				.attr("width", function (d) { return that.squareLength; })
				.attr("height", function (d) { return that.squareLength; })
				.attr("class", 'bit');

			// Check to see if we hit lava
			for (var i = that.map.lava.length - 1; i >= 0; i--) {
				var lava = that.map.lava[i];
				if (lava.x == bit.left && lava.y == bit.top) {
					Bits.remove(bit._id);
					cell.attr("class", 'deadBit');
				}
			}
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

	pickRandomPosition(map) {
		var grass = map.grass;
		var i = Math.ceil(Math.random() * grass.length);
		return grass[i];
	}

		gameLoop() {
		setTimeout('that.gameLoop()',this.tickTime);
		// Decrement spawn time
		this.spawnTime = this.spawnTime-this.spawnSpeed();
		if (this.spawnTime < 0) {
			this.spawnTime = this.spawnTimeDefault;
			this.spawnBit();
		}
		
		var bits = Bits.find({});
		bits.forEach(function (bit) {
			if (bit.health < 1) {
				Bits.remove(bit._id);
			}
			var bit = that.updateBitPosition(bit);
			Bits.update(bit._id, {
			  $set: { left: bit.left, top: bit.top, health: bit.health - 1 },
			});
		});
		this.board.update();
	}
	spawnSpeed() {
		return this.spawnTickSpeed;
	}
	updateBitPosition(bit) {
		var that = this;
		var rnd = Math.random();
		if (rnd < .3) {
			bit.left = bit.left + 1;
		}
		if (rnd >= .3 && rnd < .6) {
			bit.left = bit.left - 1;
		}
		var rnd = Math.random();
		if (rnd < .3) {
			bit.top = bit.top + 1;
		}
		if (rnd >= .3 && rnd < .6) {
			bit.top = bit.top - 1;
		}
		if (bit.left > 19) bit.left = 19;
		if (bit.left < 1) bit.left = 1;
		if (bit.top > 19) bit.top = 19;
		if (bit.top < 1) bit.top = 1;

		// Now check if the new location is a rock. If so, try again.
		for (var i = that.map.rock.length - 1; i >= 0; i--) {
			var rock = that.map.rock[i];
			if (rock.x == bit.left && rock.y == bit.top) {
				return updateBitPosition(bit);
			}
		}


		return bit;
	}

}


