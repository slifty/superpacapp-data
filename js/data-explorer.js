
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
		$.ajax({
			dataType: "json",
			method: "GET",
			url: "data/voting_data.json"
		}).success(function(data) { datasets["voting_data"] = data; }),
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
				set_active_button($(this));
				render_graph(datasets["sessions_date"]);
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

		var $filter_love = $("#data-filter-love")
			.click(function() {
				set_active_button($(this));
				render_timeline("love");
			});

		var $filter_fail = $("#data-filter-fail")
			.click(function() {
				set_active_button($(this));
				render_timeline("fail");
			});

		var $filter_fishy = $("#data-filter-fishy")
			.click(function() {
				set_active_button($(this));
				render_timeline("fishy");
			});

		var $filter_false = $("#data-filter-fair")
			.click(function() {
				set_active_button($(this));
				render_timeline("fair");
			});


		set_active_button($option_activity);
		render_graph(datasets["sessions_activity"]);
	})

	function set_active_button($button) {
			$(".active").removeClass("active");
			$button.addClass("active");
	}
	function render_timeline(tag) {
		var core_dataset = datasets["voting_data"];
		var filtered_dataset = [];
		var calculated_dataset = {};
		var dataset = [];
		for(var x in core_dataset) {
			if(core_dataset[x]["tag"] != tag)
				continue;
			filtered_dataset.push(core_dataset[x]);
		}
		
		for(var x in filtered_dataset) {
			if(!(filtered_dataset[x].date_only in calculated_dataset)) {
				calculated_dataset[filtered_dataset[x].date_only] = {
					label: filtered_dataset[x].date_only,
					value: 0
				}
			}
			calculated_dataset[filtered_dataset[x].date_only].value++;
		}
		for(var x in calculated_dataset)
			dataset.push(calculated_dataset[x]);
		dataset = dataset.reverse();

		var $graph = $("#data-explorer-graph")
			.empty()
			.append('<div id="data-explorer-yaxis" />')
			.append('<div class="scroll"><div id="data-explorer-content" /><div id="data-explorer-xaxis" /></div>')
			.append('<div id="data-filters" />')
		var $content = $("#data-explorer-content");

		var w = dataset.length * 50;
		var h = $content.height();
		var padding = 5;

		var xScale = d3.scale.linear()
			.domain([0, dataset.length])
			.range([0, w]);
		var yScale = d3.scale.linear()
			.domain([0, 2500])
			.range([h - padding, 10]);
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
			.attr("width", w + 40)
			.attr("height", 40)

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
			.attr("width", function(d) { return w / dataset.length - 4; })
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

	function render_graph(dataset) {
		var current_dataset = dataset;
		var $graph = $("#data-explorer-graph")
			.empty()
			.append('<div id="data-explorer-yaxis" />')
			.append('<div class="scroll"><div id="data-explorer-content" /><div id="data-explorer-xaxis" /></div>');
		var $content = $("#data-explorer-content");

		var w = dataset.length * 50;
		var h = $content.height();
		var padding = 5;

		var xScale = d3.scale.linear()
			.domain([0, dataset.length])
			.range([0, w]);
		var yScale = d3.scale.linear()
			.domain([0, d3.max(dataset, function(d) { return parseInt(d.value); })])
			.range([h - padding, 10]);
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
			.attr("width", w + 40)
			.attr("height", Math.max(50,d3.max(dataset, function(d) { return d.label.length; }) * 5))

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
			.attr("width", function(d) { return w / dataset.length - 4; })
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