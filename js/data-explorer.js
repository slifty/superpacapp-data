
$(function() {
	var $base = $("#data-explorer");
	var datasets = {};
	var current_dataset = "";

	$(window).resize(function() { render_dataset(current_dataset); });
	$("#data-explorer-graph").html("<img class='loader' src='img/ajax-loader.gif' />");

	$.when(
		$.ajax({
			dataType: "json",
			method: "GET",
			url: "data/ad_claims.json"
		}).success(function(data) { datasets["ad_claims"] = data; }),
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
				render_dataset(datasets["sessions_activity"]);
			});

		var $option_city = $("#data-option-city")
			.click(function() {
				render_dataset(datasets["sessions_city"]);
			});

		var $option_city = $("#data-option-country")
			.click(function() {
				render_dataset(datasets["sessions_country"]);
			});

		var $option_city = $("#data-option-date")
			.click(function() {
				render_dataset(datasets["sessions_date"]);
			});

		var $option_city = $("#data-option-state")
			.click(function() {
				render_dataset(datasets["sessions_state"]);
			});

		var $option_city = $("#data-option-time")
			.click(function() {
				render_dataset(datasets["sessions_time"]);
			});

		render_dataset(datasets["sessions_activity"]);
	})

	function render_dataset(dataset) {
		current_dataset = dataset;
		var $graph = $("#data-explorer-graph")
			.empty()
			.append('<div id="data-explorer-yaxis" />')
			.append('<div class="scroll"><div id="data-explorer-content" /><div id="data-explorer-xaxis" /></div>');
		var $content = $("#data-explorer-content");

		console.log($content.height("height"));
		var w = dataset.length * 50;
		var h = $content.height();
		var padding = 5;

		var xScale = d3.scale.linear()
			.domain([0, dataset.length])
			.range([0, w]);
		var yScale = d3.scale.linear()
			.domain([0, d3.max(dataset, function(d) { return parseInt(d.value); })])
			.range([h - padding, 0]);
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

		svg_yaxis.append("g")
			.call(yAxis)
    		.attr("transform", "translate(60,0)")
			.attr("class","axis");
		var bars = svg_content.selectAll("rect")
			.data(dataset);
		var labels = svg_xaxis.selectAll("text")
			.data(dataset);

		bars.enter()
			.append("rect")
			.attr("x", function(d, i) { return xScale(i); })
			.attr("width", function(d) { return w / dataset.length - 2; })
			.attr("y", function(d) { return h - padding; })
			.transition()
			.duration(300)
			.delay(function(d,i) { return i * 50; })
			.attr("height", function(d) { return h - padding - yScale(d.value); })
			.attr("y", function(d) { return yScale(d.value); })

		labels.enter()
			.append("text")
			.attr("x", function(d, i) {
            	return xScale(i) + 15;
			})
			.attr("y", 10)
			.text(function(d) { return d.label })
    		.attr("transform", function(d, i) { return "rotate(40," + (xScale(i) + 15) + ",10)"; })
	}
});