function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample 
  // this should be calling the tables hosted via the flask app, thus it only calls the table name and row id of the desired sample 
  d3.json('/metadata/' + sample).then(function(metadata) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var metad = d3.select('#sample-metadata')
    // Use `.html("") to clear any existing metadata
    metad.html('');

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(metadata).forEach(function([key, value]) {

      // Key is the header, value is the sample's value for that header
      // If I don't use a template string I keep getting an error
      // We have to define our append function with some element to ensure that it shows up
        // h3 despite being the format for metadata's header comes out a lot bigger in the box
      metad.append('h5').text(`${key}: ${value}`);
    });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // Create a Bubble Chart that uses data from your samples route (/samples/<sample>) to display each sample.
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json('/samples/' + sample).then(function(sampleData) {
    // extract values from the json call and store them in variables to be used shortly
    var ids = sampleData.otu_ids;
    var labels = sampleData.otu_labels;
    var values = sampleData.sample_values;
    // @TODO: Build a Bubble Chart using the sample data

    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.
    // Use otu_labels for the text values.
    var trace1 = {
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        size: values,
        color: ids
      }
    };

    var data = [trace1];

    // Per the example, the x Title
    var layout = {
      xaxis: { title: "OTU ID" }
    };

    Plotly.plot(kind='bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // Use sample_values as the values for the PIE chart.
    // Use otu_ids as the labels for the pie chart.
    // Use otu_labels as the hovertext for the chart.

    pieValues = values.slice(0,10);
    pieIDs = ids.slice(0,10);
    pieLabels = labels.slice(0,10);

    // I realize now that my choice of variable name is confusing for the actual set up
    // Using the labels as text looks awful and doesn't appear to actually reset when you change sample
    // ... And the guidelines say to use labels as hovertext any way. 
    var trace2 = {
      type: 'pie',
      values: pieValues,
      labels: pieIDs,
      hovertext: pieLabels
    };
    
    pieData = [trace2];

    var pieLay = {title: 'OTU Breakdown'};

    // Similarly, we need feed a matrix of kind, data, and layout
    Plotly.plot('pie', pieData, pieLay)
  });
}

// below is all preprogrammed stuff, just got to make sure nothing breaks for those calls


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
