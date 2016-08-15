import { Template } from 'meteor/templating';

export default class Board {
	constructor() {
		this.squareLength = 40;
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
		this.groups = { path:this.svgContainer.append("g"),
		position:this.svgContainer.append("g") };
		this.mapCreated = true;
	}

	update() {
		if (!this.mapCreated) return;
		var scales = this.getScale(this.gridSize, this.svgSize);
		var path = this.pickRandomPosition(this.map);
		console.log(path);
	    var textData = this.groups.position.selectAll("text").data([path]);
	    textData.exit().remove();
	    var texts = textData.enter().append("text");
	    var textAttributes = texts
	    .attr("x", function (d) { return scales.x(d.x + 0.5); })
	    .attr("y", function (d) { return scales.y(d.y + 0.5); })
	    .attr("dy", ".31em")
	    .text(function(d,i) { return i; })
	    .attr("class", "positionNumber");

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

}


