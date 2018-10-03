function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;
  d3.json(url).then(function(data) {
    console.log("Metadata");    
    console.log(data);
    console.log("---------------------------");

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      var text = panel.append("p");
      text.text(key + ': ' + value);
    });

    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
 });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/" + sample;

  d3.json(url).then(function(data) {
    console.log("Sample data for building charts")
    console.log(data);
    console.log("---------------------------");

    var otuIDs = data.otu_ids;
    var sampleValues = data.sample_values;
    var otuLabels = data.otu_labels;

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIDs,
        //opacity: [1, 0.8, 0.6, 0.4],
        size: sampleValues
      }
    };
    console.log("trace1 data for bubble chart");
    console.log(trace1);

    var data = [trace1];
    
    var layout = {
      title: 'Bubble',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: {title:'OTU ID'},
      yaxis: {title:'Sample Value'}
    };
    
    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart with the top 10
    var trace1 = {
      labels: otuIDs,
      values: sampleValues,
      text: otuLabels,
      type: 'pie'
    };

    var reorgTrace1 = [];
    for(var i=0; i < trace1.labels.length; i++){
      reorgTrace1.push({label:trace1.labels[i],
                    value:trace1.values[i],
                    text:trace1.text[i]
      })
    }
    reorgTrace1.sort(function(a, b) {
      return b.value-a.value;
    });
    console.log("Reorganized trace1 data for pie chart");
    console.log(reorgTrace1);
 
    topten = reorgTrace1.slice(0,10);
    topten = topten.reverse();
    console.log("topten by (sample) values for pie chart");
    console.log(topten);

    var toptenTrace1 = {
      labels: topten.map(row => row.label),
      values: topten.map(row => row.value),
      text: topten.map(row => row.text),
      textinfo: 'percent',
      type: 'pie'
    }
    console.log("topten trace1 data for pie chart");
    console.log(toptenTrace1);

    var data = [toptenTrace1];
    
    var layout = {
      title: "Top 10 Samples by Sample Value",
    };
    
    Plotly.newPlot("pie", data, layout);

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
}

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
