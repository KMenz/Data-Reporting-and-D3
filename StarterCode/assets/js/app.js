// @TODO: YOUR CODE HERE!
//Create SVG
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import Data
d3.csv("./assets/data/data.csv").then(function(healthData) {

    //Parse Data/Cast As Numbers
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    
    //Create Scale Functions
    var xLinearScale = d3.scaleLinear()
     .domain([8, d3.max(healthData, d => d.poverty)])
     .range([8, width]);

    var yLinearScale = d3.scaleLinear()
     .domain([0, d3.max(healthData, d => d.healthcare)])
     .range([height, 0]);

    //Create Axis Functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Apend Axis To Chart
    chartGroup.append("g")
     .attr("transform", `translate(0, ${height})`)
     .call(bottomAxis);

    chartGroup.append("g")
     .call(leftAxis);

    //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
     .data(healthData)
     .enter()
     .append("circle")
     .attr("cx", d => xLinearScale(d.poverty))
     .attr("cy", d => yLinearScale(d.healthcare))
     .attr("r", "20")
     .attr("fill", "blue")
     .attr("opacity", ".5")
     
    //Append Text To Circles
    chartGroup.append("text")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .selectAll("tspan")
      .data(healthData)
      .enter()
      .append("tspan")
          .attr("x", function(d) {
              return xLinearScale(d.poverty - 0);
          })
          .attr("y", function(d) {
              return yLinearScale(d.healthcare - 0.2);
          })
          .text(function(d) {
              return d.abbr
          });
    
     

    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .style("background", "rgba(197, 49, 49, 0.719)")
      .style("padding", "6px")
      .style("font-size", "12px")
      .style("line-height", "1")
      .style("line-height", "1.5em")
      .style("border-radius", "4px")
      .html(function(d) {
        return (`<strong style = 'color: black'>${d.state}<br>Poverty Rate: ${d.poverty}<br>Healthcare Rate: ${d.healthcare}</strong>`);
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    //Create Listeners To Display and Hide ToolTip
    circlesGroup.on("click", function(data) { 
        toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
    });
    
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare Rates (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty Rates (%)");
});