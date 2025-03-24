window.onload = function() {
    console.log("D3 script is running!");

    let data = [
        { Category: 'Chest Pain', Sub1: 431, Sub2: 655},
        { Category: 'Dizziness', Sub1: 564, Sub2: 522},
        { Category: 'Shortness of Breath', Sub1: 676, Sub2: 410},
        { Category: 'Sweating', Sub1: 748, Sub2: 338},
        { Category: 'Trembling', Sub1: 537, Sub2: 549 }
    ];

    // Sort data by Sub1 in descending order
    data.sort((a, b) => b.Sub1 - a.Sub1);

    const margin = { top: 50, right: 150, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#barplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Frequency of Panic Attack Symptoms");

    const x = d3.scaleBand()
        .domain(data.map(d => d.Category)) // Now sorted
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Sub1 + d.Sub2)])
        .nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(["Sub1", "Sub2"])
        .range(["#007bff", "#d3d3d3"]); // Blue for Yes, Light Grey for No

    const stack = d3.stack().keys(["Sub1", "Sub2"]);
    const stackedData = stack(data);

    svg.selectAll(".layer")
        .data(stackedData)
        .enter().append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
        .attr("x", d => x(d.data.Category))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

    // X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Presence of Symptom");

    // Y-axis
    svg.append("g").call(d3.axisLeft(y));

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Count");

    // Legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width + 20}, 20)`);

    const legendData = [
        { key: "Sub1", label: "Yes", color: "#007bff" },
        { key: "Sub2", label: "No", color: "#d3d3d3" }
    ];

    const legendItems = legend.selectAll(".legend-item")
        .data(legendData)
        .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    legendItems.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => d.color);

    legendItems.append("text")
        .attr("x", 25)
        .attr("y", 12)
        .text(d => d.label)
        .style("font-size", "14px")
        .attr("alignment-baseline", "middle");
};

