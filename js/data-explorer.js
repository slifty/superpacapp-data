
$(function() {
	var $base = $("#data-explorer");
	var datasets = {};
	var current_dataset = "";
	var current_filters = {};

	$("#data-explorer-graph").html("<img class='loader' src='img/ajax-loader.gif' />");

	$.when(
		$.ajax({
			dataType: "json",
			method: "GET",
			url: "data/ad_claims.json"
		}).success(function(data) { datasets["ad_claims"] = data; }),
		// $.ajax({
		// 	dataType: "json",
		// 	method: "GET",
		// 	url: "data/voting_data.json"
		// }).success(function(data) { datasets["voting_data"] = data; }),
		$.ajax({
			dataType: "json",
			method: "GET",
			url: "data/compiled_voting_data.json"
		}).success(function(data) { datasets["compiled_voting_data"] = data; }),
		$.ajax({
			dataType: "json",
			method: "GET",
			url: "data/sessions_activity.json"
		}).success(function(data) { datasets["sessions_activity"] = data; }),
		$.ajax({
			dataType: "json",
			method: "GET",
			url: "data/sessions_city.json"
		}).success(function(data) { datasets["sessions_city"] = data; }),
		$.ajax({
			dataType: "json",
			method: "GET",
			url: "data/sessions_country.json"
		}).success(function(data) { datasets["sessions_country"] = data; }),
		$.ajax({
			dataType: "json",
			method: "GET",
			url: "data/sessions_date.json"
		}).success(function(data) { datasets["sessions_date"] = data; }),
		$.ajax({
			dataType: "json",
			method: "GET",
			url: "data/sessions_state.json"
		}).success(function(data) { datasets["sessions_state"] = data; }),
		$.ajax({
			dataType: "json",
			method: "GET",
			url: "data/sessions_time.json"
		}).success(function(data) { datasets["sessions_time"] = data; })
	)
	.then(function() {
		var $option_activity = $("#data-option-activity")
			.click(function() {
				set_active_button($(this));
				render_graph(datasets["sessions_activity"]);
			});

		var $option_city = $("#data-option-city")
			.click(function() {
				set_active_button($(this));
				render_graph(datasets["sessions_city"]);
			});

		var $option_city = $("#data-option-country")
			.click(function() {
				set_active_button($(this));
				render_graph(datasets["sessions_country"]);
			});

		var $option_city = $("#data-option-date")
			.click(function() {
				console.log("TEST1");
				set_active_button($(this));
				console.log("TEST2");
				render_graph(datasets["sessions_date"]);
				console.log("TEST3");
			});

		var $option_city = $("#data-option-state")
			.click(function() {
				set_active_button($(this));
				render_graph(datasets["sessions_state"]);
			});

		var $option_city = $("#data-option-time")
			.click(function() {
				set_active_button($(this));
				render_graph(datasets["sessions_time"]);
			});

		var $filter_candidate = $("#data-filter-suppopps")
			.click(function() {
				set_active_button($(this));
				render_timeline("suppopps");
			});

		var $filter_org = $("#data-filter-org_types")
			.click(function() {
				set_active_button($(this));
				render_timeline("org_types");
			});


		set_active_button($option_activity);
		render_graph(datasets["sessions_activity"]);
	})

	function set_active_button($button) {
			$("#data-explorer-menu .active").removeClass("active");
			$button.addClass("active");
	}
	function render_timeline(type) {
		/* THIS LOADS THE UNCOMPILED DATA (and compiles it)
		var data = datasets["voting_data"];
		var core_dataset = data.items;
		var attributes = {
			tags: [],
			org_types: [],
			suppopps: []
		};
		var calculated_dataset = {};
		var dataset = [];
		var period = 1;

		for(var x in core_dataset) {
			var item = core_dataset[x];
			if(attributes["tags"].indexOf(item["tag"]) == -1)
				attributes["tags"].push(item["tag"]);
			if(attributes["suppopps"].indexOf(item["suppopp"]) == -1)
				attributes["suppopps"].push(item["suppopp"]);
			if(attributes["org_types"].indexOf(item["org_type"]) == -1)
				attributes["org_types"].push(item["org_type"]);
		}

		for(var x in attributes["tags"]) {
			calculated_dataset[attributes["tags"][x]] = {
				"suppopps": {},
				"org_types": {}
			}
			for(var y in attributes["suppopps"])
				calculated_dataset[attributes["tags"][x]]["suppopps"][attributes["suppopps"][y]] = 0;
			for(var y in attributes["org_types"])
				calculated_dataset[attributes["tags"][x]]["org_types"][attributes["org_types"][y]] = 0;
		}

		for(var x in core_dataset) {
			calculated_dataset[core_dataset[x]["tag"]]["suppopps"][core_dataset[x]["suppopp"]]++;
			calculated_dataset[core_dataset[x]["tag"]]["org_types"][core_dataset[x]["org_type"]]++;
		}
		var data = {};
		data.calculated_dataset = calculated_dataset;
		data.attributes = attributes;
		data.descriptions = {
			"suppopps":"User ad ratings by rating type and candidate.",
			"org_types":"User ad ratings by rating type and type of organization."
		}; 
		console.log(JSON.stringify(data));/**/
		var data = datasets["compiled_voting_data"];
		var calculated_dataset = data.calculated_dataset;
		var dataset = [];
		var attributes = data.attributes;
		for(var x in calculated_dataset) {
			var tag = calculated_dataset[x];
			period = 0
			for(var y in tag[type]) {
				period++;
				var item = {
					"value": tag[type][y],
					"label": y
				}
				dataset.push(item);
			}
		}

		var $graph = $("#data-explorer-graph")
			.empty()
			.append('<div id="data-explorer-yaxis" />')
			.append('<div class="scroll"><div id="data-explorer-content" /><div id="data-explorer-xaxis" /></div>')
			.append('<div id="data-filters" />')

		var $title = $("#data-explorer-title")
			.html("<h3>" + (data.descriptions[type]?data.descriptions[type]:"") + "</h3>" + (data.note?"<div class='note'>" + data.note + "</div>":""))

		var $content = $("#data-explorer-content");

		var w = $content.width();
		var h = $content.height();
		var padding = 5;

		var xScale = d3.scale.linear()
			.domain([0, dataset.length + attributes["tags"].length])
			.range([0, w]);
		var yScale = d3.scale.linear()
			.domain([0, d3.max(dataset, function(d) { return parseInt(d.value); })])
			.range([h - padding, 30]);
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")
			.ticks(5);

		var svg_content = d3.select("#data-explorer-content")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
		var svg_yaxis = d3.select("#data-explorer-yaxis")
			.append("svg")
			.attr("width", 100)
			.attr("height", h)
		var svg_xaxis = d3.select("#data-explorer-xaxis")
			.append("svg")
			.attr("width", w)
			.attr("height", 50)
		var svg_hover = d3.select("#data-explorer-xaxis")
			.append("svg")
			.attr("width", w)
			.attr("height", 70)

		svg_yaxis.append("g")
			.call(yAxis)
    		.attr("transform", "translate(100,0)")
			.attr("class","axis");

		var columns = svg_content.selectAll("rect.column")
			.data(dataset);
		var bars = svg_content.selectAll("rect")
			.data(dataset);
		var labels = svg_xaxis.selectAll("text")
			.data(dataset);

		var xicons = svg_xaxis.selectAll("image")
			.data(attributes["tags"]);
		var xlabels = svg_xaxis.selectAll("text")
	 		.data(attributes["tags"]);

		var ylabel = svg_yaxis.append("text")
			.attr("class", "ylabel")
			.text(data.units)
		ylabel
			.attr("y", h/2 + ylabel.node().getComputedTextLength() / 2)
			.attr("x", 35)
			.attr("transform","rotate(270,35," + (h/2 + ylabel.node().getComputedTextLength() / 2) + ")")

		svg_content.append("text")
			.attr("class","instructions")
			.attr("x", w - 235)
			.attr("y", 20)
			.text("Click on bars for more information");

		xicons.enter()
			.append("image")
			.attr("class","xlabel")
			.attr("xlink:href", function(d) { return "img/" + d + ".png"; })
			.attr("height", 30)
			.attr("width", 30)
			.attr("y", 0)
			.attr("x", function(d,i) { return Math.floor(i / attributes["tags"].length * w + (w / (dataset.length + attributes["tags"].length) * period) / 2) - 15; })
			.attr("text-anchor", "middle")
		xlabels.enter()
			.append("text")
			.attr("class","xlabel")
			.text(function(d) { return d; })
			.attr("y", 45)
			.attr("x", function(d,i) { return Math.floor(i / attributes["tags"].length * w + (w / (dataset.length + attributes["tags"].length) * period) / 2); })
			.attr("text-anchor", "middle")

		bars.enter()
			.append("rect")
			.attr("class","bar")
			.attr("x", function(d, i) { return xScale(i + Math.floor(i/period)); })
			.attr("width", function(d) { return w / (dataset.length + attributes["tags"].length) - 4; })
			.attr("y", function(d) { return h - padding; })
			.transition()
			.duration(300)
			.delay(function(d,i) { return i * 20; })
			.attr("height", function(d) { return h - padding - yScale(d.value); })
			.attr("y", function(d) { return yScale(d.value); })

		var highlightRow = function(d, i) {
			var container = svg_hover.append("g");
			var label = container.append("text")
				.attr("class","hoverlabel")
				.attr("y",40)
				.text(d.label)
			var value = container.append("text")
				.attr("class","value")
				.attr("y",60)
				.text(d.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))

			label.attr("x", w/2 - label.node().getComputedTextLength() / 2)
			value.attr("x", w/2 - value.node().getComputedTextLength() / 2)
			bars.attr("class", "bar")
			bars.filter(function(d, j) { return j == i; })
				.attr("class", "bar active")

		}

		columns.enter()
			.append("rect")
			.attr("class","column")
			.attr("x", function(d, i) { return xScale(i + Math.floor(i/period)); })
			.attr("width", function(d) { return w / dataset.length - 4; })
			.attr("height", function(d) { return h; })
			.on("click",  highlightRow)
			.on("mouseover",  highlightRow)
			.on("mouseout", function(d, i) {
				bars.attr("class", "bar")
				var container = svg_hover.node()
				while (container.lastChild) {
					container.removeChild(container.lastChild);
				}
			} )

	}

	function render_graph(data) {
		var dataset = data.items;

		var $title = $("#data-explorer-title")
			.html("<h3>" + data.description + "</h3>" + (data.note?"<div class='note'>" + data.note + "</div>":""))

		var $graph = $("#data-explorer-graph")
			.empty()
			.append('<div id="data-explorer-yaxis" />')
			.append('<div class="scroll"><div id="data-explorer-content" /><div id="data-explorer-xaxis" /></div>');
		var $content = $("#data-explorer-content");

		var w = $content.width();
		var h = $content.height();
		var padding = 5;

		var xScale = d3.scale.linear()
			.domain([0, dataset.length])
			.range([0, w-10]);
		var yScale = d3.scale.linear()
			.domain([0, d3.max(dataset, function(d) { return parseInt(d.value); })])
			.range([h - padding, 30]);
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")
			.ticks(5);

		var svg_content = d3.select("#data-explorer-content")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
		var svg_yaxis = d3.select("#data-explorer-yaxis")
			.append("svg")
			.attr("width", 100)
			.attr("height", h)
		var svg_xaxis = d3.select("#data-explorer-xaxis")
			.append("svg")
			.attr("width", w)
			.attr("height", 20)
		var svg_hover = d3.select("#data-explorer-xaxis")
			.append("svg")
			.attr("width", w)
			.attr("height", 70)

		if(data.xlabel == "dates") {
			svg_xaxis.attr("height", Math.max(50,d3.max(dataset, function(d) { return d.label.length; }) * 5))
			var labels = svg_xaxis.selectAll("text")
				.data(dataset);
			labels.enter()
				.append("text")
				.attr("class", "tiny")
				.attr("x", function(d, i) { return xScale(i); })
				.attr("y", 5)
				.text(function(d,i) { return (i%5 == 0)?d.label:""; })
	    		.attr("transform", function(d, i) { return "rotate(70," + (xScale(i)) + ",5)"; })
		} else if(dataset.length > 25) {
			var xlabel = svg_xaxis.append("text")
				.attr("class", "xlabel")
				.text(data.xlabel)
			xlabel
				.attr("y", 20)
				.attr("x", w/2 - xlabel.node().getComputedTextLength() / 2)
		} else {
			svg_xaxis.attr("height", Math.max(50,d3.max(dataset, function(d) { return d.label.length; }) * 5))
			var labels = svg_xaxis.selectAll("text")
				.data(dataset);
			labels.enter()
				.append("text")
				.attr("x", function(d, i) {
	            	return xScale(i) + 5;
				})
				.attr("y", 10)
				.text(function(d) { return d.label })
	    		.attr("transform", function(d, i) { return "rotate(40," + (xScale(i) + 7) + ",10)"; })
		}

		svg_yaxis.append("g")
			.call(yAxis)
    		.attr("transform", "translate(100,0)")
			.attr("class","axis");

		var ylabel = svg_yaxis.append("text")
			.attr("class", "ylabel")
			.text(data.ylabel)
		ylabel
			.attr("y", h/2 + ylabel.node().getComputedTextLength() / 2)
			.attr("x", 35)
			.attr("transform","rotate(270,35," + (h/2 + ylabel.node().getComputedTextLength() / 2) + ")")

		svg_content.append("text")
			.attr("class","instructions")
			.attr("x", w - 235)
			.attr("y", 20)
			.text("Click on bars for more information");

		var columns = svg_content.selectAll("rect.column")
			.data(dataset);
		var bars = svg_content.selectAll("rect.bar")
			.data(dataset);

		bars.enter()
			.append("rect")
			.attr("class","bar")
			.attr("x", function(d, i) { return xScale(i); })
			.attr("width", function(d) { return w / dataset.length - 4; })
			.attr("y", function(d) { return h - padding; })
			.transition()
			.duration(300)
			.delay(function(d,i) { return i * 20; })
			.attr("height", function(d) { return h - padding - yScale(d.value); })
			.attr("y", function(d) { return yScale(d.value); })

		var highlightRow = function(d, i) {
			var container = svg_hover.append("g");
			var label = container.append("text")
				.attr("class","hoverlabel")
				.attr("y",40)
				.text(d.label)
			var value = container.append("text")
				.attr("class","value")
				.attr("y",60)
				.text(d.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))

			label.attr("x", w/2 - label.node().getComputedTextLength() / 2)
			value.attr("x", w/2 - value.node().getComputedTextLength() / 2)

			bars.attr("class", "bar")
			bars.filter(function(d, j) { return j == i; })
				.attr("class", "bar active")
		};
		columns.enter()
			.append("rect")
			.attr("class","column")
			.attr("x", function(d, i) { return xScale(i); })
			.attr("width", function(d) { return w / dataset.length - 4; })
			.attr("height", function(d) { return h; })
			.on("click",  highlightRow)
			.on("mouseover",  highlightRow)
			.on("mouseout", function(d, i) {
				bars.attr("class", "bar")
				var container = svg_hover.node()
				while (container.lastChild) {
					container.removeChild(container.lastChild);
				}
			} )
	}
});