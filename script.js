var margin = { top: 200, right: 10, bottom: 150, left: 10 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var svg = d3.select(".board")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform",
        `translate(0, ${margin.top})`)

var legend = d3.select(".legend")
    .append("svg")
    .attr("width", width)
    .attr("height", 50)
    .attr("transform",
        `translate(0, ${margin.top/2})`)

START_YEAR = 1600
END_YEAR = 2100

CENTURY_PADDING = 100
YEAR_PADDING = 100

TIMELINE_WIDTH = 10
LOAD_DURATION = 100

ERA_HEIGHT = 50
EVENT_WIDTH = 10
EVENT_HEIGHT = 40

ERA_COLORS = {
    "Prologue": "#1597BB",
    "The Segregation Era": "#EEB76B",
    "World War II & Post War Years": "#7B113A",
    "Civil Rights Era": "#9C3D54",
    "Civil Rights Act of 1964 and Beyond": "#E2703A",
}

let centuryScale = d3.scaleLinear()
    .domain([16, 20])
    .range([CENTURY_PADDING, height - CENTURY_PADDING])

let yearScale = d3.scaleLinear()
    .domain([0, 100])
    .range([YEAR_PADDING, width - 2 * YEAR_PADDING])

timeline = svg.selectAll(".timeline")
    .data(_.range(16, 21))
    .enter()
    .append("line")
    .classed("timeline", true)
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("x1", yearScale(0))
    .attr("y1", d => centuryScale(d))
    .attr("x2", yearScale(0))
    .attr("y2", d => centuryScale(d))

timeline.transition()
    .duration(LOAD_DURATION)
    .attr("x2", yearScale(100))
    .delay((d, i) => LOAD_DURATION * i)

svg.append("circle")
    .attr("fill", "orange")
    .attr("cx", yearScale(21))
    .attr("cy", centuryScale(20))
    .attr("r", 10)

d3.json("era-information.json").then(data => {
    eras = svg.selectAll(".eraMarker")
        .data(data)
        .enter()
        .append("rect")
        .classed("eraMarker", true)
        .attr("fill", d => ERA_COLORS[d.name])
        .attr("x", d => yearScale(d.startYear % 100) - 5)
        .attr("y", d => centuryScale(Math.floor(d.startYear / 100)) - ERA_HEIGHT * 0.9)
        .attr("width", 0)
        .attr("height", ERA_HEIGHT)
        .attr("rx", 5)
        .attr("ry", 5)

    eras.transition()
        .duration(LOAD_DURATION)
        .attr("width", d => yearScale(d.endYear) - yearScale(d.startYear) + 5)
        .delay((d, i) => LOAD_DURATION * i)

})

d3.json("event-information.json").then(data => {
    dataset = data
    events = svg.selectAll(".event")
        .data(data)
        .enter()
        .append("rect")
        .classed("event", true)
        .attr("fill", "black")
        .attr("fill-opacity", 0)
        .attr("x", d => yearScale(d.year % 100))
        .attr("y", d => centuryScale(Math.floor(d.year / 100)) - EVENT_HEIGHT + EVENT_HEIGHT / data.map(x => x.year).filter(x => x == d.year).length * d.height)
        .attr("width", EVENT_WIDTH)
        .attr("height", d => EVENT_HEIGHT / data.map(x => x.year).filter(x => x == d.year).length)
        .attr("rx", 5)
        .attr("ry", 5)


    events.transition()
        .duration(LOAD_DURATION)
        .attr("fill-opacity", 0.6)
        .delay((d, i) => i * 50)

})
