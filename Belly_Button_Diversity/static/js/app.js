/*----------------------------------------------------------------------------
CREAR EL PANEL DE METADATA
-----------------------------------------------------------------------------*/

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    //console.log(sample);
  // Use `d3.json` to fetch the metadata for a sample
    
    d3.json(`/metadata/${sample}`).then(data => {
        // console.log(data)
        
    // Use d3 to select the panel with id of `#sample-metadata`
        var metadataPanel = d3.select('#sample-metadata')
        // Use `.html("") to clear any existing metadata
        metadataPanel.html("");
        
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
        
        Object.entries(data).forEach(([key,value]) =>{
            newInfo = metadataPanel.append("p").text(`${key}: ${value}`);
            //console.log(key, value);
            
            });
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};






//-----------------------------------------------------------------------------------
//Crear charts :v
//----------------------------------------------------------------------------------

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then(data =>{
       // console.log(data); 
        
        // @TODO: Build a Pie Charts
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).
        
        var trace = {
            labels: data['otu_ids'].slice(0,10),
            values: data['sample_values'].slice(0,10),
            hovertext: data['otu_labels'].slice(0,10),
            showlegend:true,
            type: 'pie'
        };
        
        var data1 = [trace];
        
        var layout = {
            title:'Top 10 sample values by Otu ID'
        };
        
        Plotly.newPlot('pie',data1, layout);
        
        // @TODO: Build a Bubble Chart using the sample data
        
        var trace = {
            x: data['otu_ids'],
            y: data['sample_values'],
            text: data['otu_labels'],
            mode: 'markers',
            marker:{
                size: data['sample_values'],
                color: data['otu_ids']
            }
        };
        
        var data1 = [trace];
        
        var layout = {
            title:'Otu IDs vs. Sample Values'
        };
        
        Plotly.newPlot('bubble',data1, layout)
        
    });
    
    

};




//---------------------------------------------------------------------------
//Inicializar todo ;v
//--------------------------------------------------------------------------

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
};


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
