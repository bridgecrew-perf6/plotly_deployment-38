function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desiredSample = samples.filter(obj => obj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = desiredSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIDs.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse()

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      // hover text
      text: otuLabels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h',
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // BUBBLE CHART
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      // hover text
      text: otuLabels,
      mode: 'markers',
      marker: {
        // Use otu_ids for the marker colors
        color: otuIDs,
        // Use sample_values for the marker size
        size: sampleValues,
        colorscale: 'Portland'
      }
    }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Belly Button Samples</b>",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

    // GAUGE CHART 
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // Create a variable that holds the first sample in the array.
    var metadata = data.metadata;
    var filteredMetadata = metadata.filter(obj => obj.id == sample)[0];
    
  
    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(filteredMetadata.wfreq);

    // Create the Trace
    var gaugeData = [{
      value: washFreq,
      title: {text: "<b>Belly Button Washing Frequency (Times per Week)</b>",
              font: {size: 17}
              },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        bar: {color: 'black'},
        axis: { range: [null, 10] },
        steps: [
            { range: [0, 2], color: 'rgb(214, 39, 40)' },
            { range: [2, 4], color: 'rgb(255, 255, 0)' },
            { range: [4, 6], color: 'rgb(127, 0, 255)' },
            { range: [6, 8], color: 'rgb(0, 0, 255)' },
            { range: [8, 10], color: 'rgb(0, 204, 0)' },
        ]},
    }];

    // Define Plot Lay
    var gaugeLayout = {
      width: 500, height: 400, margin: { t: 0, b: 0 } 
    };

    // Plot the data
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}