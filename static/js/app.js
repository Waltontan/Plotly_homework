
// Create option list in html
sampledata = d3.json("../data/samples.json").then(data => {

    data.names.forEach((name) => {
      var option = d3.select("#selDataset").append("option");
      option.text(name);
      option.attr("value",name);
    });

    updatePlotly()
  });

//-------------------------------------------------

// Add listener to detect change on the select list
d3.selectAll("#selDataset").on("change", updatePlotly);

//-------------------------------------------------
// This function is called when a dropdown menu item is selected
function updatePlotly() {
  // Extract ID from selection
  id_Selected = d3.select("#selDataset").property("value");
  console.log(id_Selected)

  // Extract data from file
  sdata = d3.json("../data/samples.json").then(data => {
    
    // Select Data to plot bar chart
    selected_data = data.samples.filter(person =>person.id == id_Selected )[0];
    console.log(selected_data)

    // Prepare top 10 data to plot
    x_value = selected_data.otu_ids.slice(0,10);
    y_value = selected_data.sample_values.slice(0,10).reverse();
    x_value_string = x_value.map((otuID) => "OTU " + otuID).reverse();
    hover_text = selected_data.otu_labels.slice(0,10).reverse()

    // Plot Horizontal Bar
    var trace1 = {
      x: y_value,
      y: x_value_string,
      type: 'bar',
      orientation: 'h',
      text: hover_text
    };

    var plot_data = [trace1];

    var bar_layout = {
      title:`Top 10 OTU for ID${selected_data.id}`,
      xaxis: {
        title: '# of Samples',
        titlefont: {
          family: 'Arial, sans-serif',
          size: 18,
          color: 'black'
        }
        },
      yaxis: {
        title: 'OTU ID',
        titlefont: {
          family: 'Arial, sans-serif',
          size: 18,
          color: 'black'
        }
        }
    }

    Plotly.newPlot("bar", plot_data,bar_layout);
  
    // Prepare Metadata
    selected_metadata = data.metadata.filter(person =>person.id == id_Selected )[0];
    console.log(selected_metadata)

    // Insert Metadata into html
    d3.select("#sample-metadata").html("");
    Object.entries(selected_metadata).forEach(([key, value])=> {
      var unorder_list = d3.select("#sample-metadata").append("ul");
      metadata_i = unorder_list.append("li");
      unorder_list.text(`${key}:${value}`)
    });

    // Prepare data for bubble chart
    x_value = selected_data.otu_ids;
    y_value = selected_data.sample_values;
    size = selected_data.sample_values;
    colour = selected_data.otu_ids;
    hover_text = selected_data.otu_labels

    // Plot Bubble Bar
    var trace1 = {
      x: x_value,
      y: y_value,
      mode: 'markers',
      marker: {
        color: colour,
        size: size
      },
      text: hover_text
    };

    var plot_bubble = [trace1];

    var bubble_layout = {
      title:`OTU for ID${selected_data.id}`,
      xaxis: {
        title: 'OTU ID',
        titlefont: {
          family: 'Arial, sans-serif',
          size: 18,
          color: 'black'
        }
        },
      yaxis: {
        title: '# of Samples',
        titlefont: {
          family: 'Arial, sans-serif',
          size: 18,
          color: 'black'
        }
        }
    }

    Plotly.newPlot("bubble", plot_bubble, bubble_layout);    

    //Plot Gauge
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: selected_metadata.wfreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 380 },
        gauge: {
          shape: "angular",
            bar: {
                color: "blue",
                line: {
                    color: "red",
                    width: 4
                },  
                thickness: 0
            },
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 1], color: "rgb(248,255,0)"  },
            { range: [1, 2], color: "rgb(231,255,0)" },
            { range: [2, 3], color: "rgb(214,255,0)" },
            { range: [3, 4], color: "rgb(197,255,0)" },
            { range: [4, 5], color: "rgb(180,255,0)" },
            { range: [5, 6], color: "rgb(163,255,0)" },
            { range: [6, 7], color: "rgb(146,255,0)" },
            { range: [7, 8], color: "rgb(129,255,0)" },
            { range: [8, 9], color: "rgb(112,255,0)" },
          ]
        }

      }
    ];
    
    Plotly.newPlot('gauge', data);
  });

}



