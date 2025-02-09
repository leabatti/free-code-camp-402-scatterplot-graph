// Fetch Data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then((data) => {
  data.forEach((d) => {
    d.Year = new Date(d.Year.toString());
    d.Time = new Date("1970-01-01T00:" + d.Time.toString());
  });

  // Chart Dimensions
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create SVG
  const svg = d3
    .select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create Scales
  const xScale = d3
    .scaleTime()
    .domain([new Date("1993-01-01"), d3.max(data, (d) => d.Year)])
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Time))
    .range([height - margin.bottom, margin.top]);

  // Create Axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  // Create Circles
  svg
    .selectAll(".circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", (d) => `dot ${d.Doping ? "doping" : "no-doping"}`)
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Time))
    .attr("r", 5)
    .attr("data-xvalue", (d) => d.Year.toISOString())
    .attr("data-yvalue", (d) => d.Time.toISOString())
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  // Create Tooltip
  const tooltip = d3.select("#tooltip");

  function showTooltip(event, d) {
    tooltip
      .style("display", "block")
      .style("left", event.pageX - 245 + "px")
      .style("top", event.pageY - 45 + "px")
      .attr("data-date", d[0])
      .attr("data-year", d.Year.toISOString())
      .html(
        `Year: ${d.Year.getFullYear()}<br>Time: ${d3.timeFormat("%M:%S")(
          d.Time
        )}<br>Name: ${d.Name}<br>${
          d.Doping ? d.Doping : "No doping allegation"
        }`
      );
  }

  function hideTooltip() {
    tooltip.style("display", "none");
  }
});
