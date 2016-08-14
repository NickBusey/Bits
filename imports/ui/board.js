import { Template } from 'meteor/templating';

export default class Board {
	constructor() {

		this.squareLength = 40;
		this.circleRadius = 15;
		this.ratios = { rock:0.05, lava:0.05 };
		this.gridSize = { x:20, y:15 };

		this.svgSize = this.getSvgSize(this.gridSize, this.squareLength);
		this.map = this.buildMap(this.gridSize, this.ratios);
		this.start = this.pickRandomPosition(this.map)
	}
	draw() {
		var svgContainer = d3.select(".display")
		.append("svg")
		.attr("width", this.svgSize.width)
		.attr("height", this.svgSize.height);
		var scales = this.getScale(this.gridSize, this.svgSize);

		this.drawCells(svgContainer, scales, this.map.grass, "grass");
		this.drawCells(svgContainer, scales, this.map.rock, "rock");
		this.drawCells(svgContainer, scales, this.map.lava, "lava");

		var groups = { path:svgContainer.append("g"),
		position:svgContainer.append("g") };

		this.drawBoard(groups, scales, [this.start]);
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

	drawBoard(groups, scales, path) {
	    // path
	    groups.path.selectAll(".path").remove();
	    var lineFunction = d3.svg.line()
	    .x(function(d) { return scales.x(
	    	d.x + 0.5); })
	    .y(function(d) { return scales.y(
	    	d.y + 0.5); })
	    .interpolate("linear");

	    var lineGraph = groups.path.append("path")
	    .attr("d", lineFunction(path))
	    .attr("class", "path")
	    .attr("fill", "none");

	    // position
	    var circleData = groups.position.selectAll("circle").data(path);
	    circleData.exit().remove();
	    var circles = circleData.enter().append("circle");
	    var circleAttributes = circles
	    .attr("cx", function (d) { return scales.x(d.x + 0.5); })
	    .attr("cy", function (d) { return scales.y(d.y + 0.5); })
	    .attr("r", function (d) { return this.circleRadius; })
	    .attr("class", "position");

	    // position number
	    var textData = groups.position.selectAll("text").data(path);
	    textData.exit().remove();
	    var texts = textData.enter().append("text");
	    var textAttributes = texts
	    .attr("x", function (d) { return scales.x(d.x + 0.5); })
	    .attr("y", function (d) { return scales.y(d.y + 0.5); })
	    .attr("dy", ".31em")
	    .text(function(d,i) { return i; })
	    .attr("class", "positionNumber");
	}

	pickRandomPosition(map) {
		var grass = map.grass;
		var i = Math.ceil(Math.random() * grass.length);
		return grass[i];
	}

}


