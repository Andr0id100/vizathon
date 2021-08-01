var margin = { top: 50, right: 10, bottom: 300, left: 10 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

START_YEAR = 1600
END_YEAR = 2100

CENTURY_PADDING = 100
YEAR_PADDING = 100

LOAD_DURATION = 500

ERA_HEIGHT = 50
EVENT_WIDTH = 10
EVENT_HEIGHT = 40

LEGEND_HEIGHT = 200
LEGEND_UNIT_SIZE = 15

var svg = d3.select(".board")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform",
        `translate(0, ${margin.top})`)

var legend = d3.select(".legend")
    .append("svg")
    .attr("width", width)
    .attr("height", LEGEND_HEIGHT)
    .attr("transform",
        `translate(0, ${margin.top / 2})`)

let eventDescription = d3.select(".eventDescription")

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

let legendScale = d3.scaleLinear()
    .domain([0, Object.values(ERA_COLORS).length])
    .range([LEGEND_UNIT_SIZE, LEGEND_HEIGHT - 2 * LEGEND_UNIT_SIZE])

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

svg.selectAll(".centuryMarkers")
    .data(_.range(16, 21))
    .enter()
    .append("text")
    .classed("centuryMarkers", true)
    .attr("x", yearScale(100) + 50)
    .attr("y", d => centuryScale(d) - ERA_HEIGHT/2)
    .text(d => `${d}00s`)


timeline.transition()
    .duration(LOAD_DURATION)
    .attr("x2", yearScale(100))
    .delay((d, i) => LOAD_DURATION * i)

function addLegend() {
    legend.selectAll(".legendFigure")
        .data(Object.values(ERA_COLORS))
        .enter()
        .append("rect")
        .classed("legendFigure", true)
        .attr("fill", d => d)
        .attr("x", width * 0.1)
        .attr("y", (d, i) => legendScale(i))
        .attr("width", LEGEND_UNIT_SIZE)
        .attr("height", LEGEND_UNIT_SIZE)

    legend.selectAll(".legendText")
        .data(Object.keys(ERA_COLORS))
        .enter()
        .append("text")
        .classed("legendText", true)
        .attr("x", width * 0.1 + 2 * LEGEND_UNIT_SIZE)
        .attr("y", (d, i) => legendScale(i) + LEGEND_UNIT_SIZE)
        .text(d => d)

    legend.append("rect")
        .classed("legendFigure", true)
        .attr("fill", "black")
        .attr("fill-opacity", 0.6)
        .attr("x", width * 0.4)
        .attr("y", legendScale(1))
        .attr("width", LEGEND_UNIT_SIZE)
        .attr("height", LEGEND_UNIT_SIZE)

    legend.append("text")
        .classed("legendText", true)
        .attr("x", width * 0.4 + 2 * LEGEND_UNIT_SIZE)
        .attr("y", legendScale(1) + LEGEND_UNIT_SIZE)
        .text("Protest/Court Ruling/Law/etc.")

    legend.append("rect")
        .classed("legendFigure", true)
        .attr("fill", "orange")
        .attr("x", width * 0.4)
        .attr("y", legendScale(2))
        .attr("width", LEGEND_UNIT_SIZE)
        .attr("height", LEGEND_UNIT_SIZE)

    legend.append("text")
        .classed("legendText", true)
        .attr("x", width * 0.4 + 2 * LEGEND_UNIT_SIZE)
        .attr("y", legendScale(2) + LEGEND_UNIT_SIZE)
        .text("Current Year")

}


svg.append("rect")
    .attr("fill", "orange")
    .attr("x", yearScale(21))
    .attr("y", centuryScale(20) - 50)
    .attr("width", 2)
    .attr("height", 100)

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
        .on("end", () => {
            events
                .on("mouseover", (event, d) => {
                    eventDescription.text(d.description)
                })
                .on("mouseout", (event, d) => {
                    eventDescription.text("")
                })
        })

})

addLegend()