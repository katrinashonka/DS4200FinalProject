// Set up the dimensions for the histogram
const margin = { top: 20, right: 30, bottom: 40, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG container for the histogram
const svg = d3.select("#histogram")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load the data from the CSV file
d3.csv("Cleaned_Panic_Dataset.csv").then(function(data) {

    // Convert necessary columns to numbers
    data.forEach(function(d) {
        d.Age = +d.Age;
        d.Gender = +d.Gender; // Ensure Gender is numeric
    });

    // Create a function to update the histogram when the filter is changed
    function updateHistogram(genderFilter) {
        // Filter the data based on the selected Gender
        const filteredData = data.filter(d => d.Gender === genderFilter);

        // Create the histogram generator
        const histogram = d3.histogram()
            .value(d => d.Age)  // Age is the variable to bin
            .domain([15, d3.max(filteredData, d => d.Age)])  // Set domain from 0 to max Age value
            .thresholds(40);  // Number of bins

        // Generate bins
        const bins = histogram(filteredData);

        // Create the x scale based on the bins
        const x = d3.scaleLinear()
            .domain([15, d3.max(filteredData, d => d.Age)])
            .range([0, width]);

        // Create the y scale based on the bin count
        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .nice()
            .range([height, 0]);

        // Clear the SVG container before redrawing
        svg.selectAll("*").remove();

        // Append the x axis to the SVG container
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .style("font-family", "Roboto Mono");  // Apply Roboto Mono font to x-axis text

        // Append the y axis to the SVG container
        svg.append("g")
            .call(d3.axisLeft(y))
            .style("font-family", "Roboto Mono");  // Apply Roboto Mono font to y-axis text

        // Append the bars for the histogram
        svg.selectAll(".bar")
            .data(bins)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.x0))
            .attr("y", d => y(d.length))
            .attr("width", d => x(d.x1) - x(d.x0) - 1)
            .attr("height", d => height - y(d.length))
            .attr("fill", "#89CFF0");
        
        // Kernel Density Estimation function
function kernelDensityEstimator(kernel, xValues) {
    return function(sample) {
        return xValues.map(function(x) {
            return {x: x, y: d3.mean(sample, function(v) { return kernel(x - v); })};
        });
    };
}

function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}

// Generate x values across the histogram range
const kdeX = d3.range(15, d3.max(filteredData, d => d.Age), 0.5);

// Compute density values
const kde = kernelDensityEstimator(kernelEpanechnikov(3), kdeX);
const density = kde(filteredData.map(d => d.Age));

// Create y scale for density if needed
const yDensity = d3.scaleLinear()
    .domain([0, d3.max([...bins.map(d => d.length), ...density.map(d => d.y)])])
    .nice()
    .range([height, 0]);

// Scale KDE to match histogram bin heights based on total count and bin width
const totalCount = filteredData.length;
const binWidth = bins[0].x1 - bins[0].x0;

density.forEach(d => {
    d.y = d.y * totalCount * binWidth;
});


// Draw the density line
svg.append("path")
    .datum(density)
    .attr("fill", "none")
    .attr("stroke", "#1f77b4")
    .attr("stroke-width", 2)
    .attr("class", "density-line")
    .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(d => x(d.x))
        .y(d => y(d.y)) // now this is scaled to match histogram height
    );



        // Add axis labels with Roboto Mono font
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .style("font-family", "Roboto Mono")  // Apply Roboto Mono font
            .text("Age");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 20)
            .attr("text-anchor", "middle")
            .style("font-family", "Roboto Mono")  // Apply Roboto Mono font
            .text("Count");
    }

    // Initial histogram with Gender 0 selected
    updateHistogram(0);

    // Add an event listener to the Gender filter dropdown
    d3.select("#genderFilter").on("change", function() {
        const genderFilter = +this.value;
        updateHistogram(genderFilter); // Update the histogram based on the selected gender
    });

}).catch(function(error) {
    console.error("Error loading the data: ", error);
});

