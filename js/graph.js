//patientName is all lowercase with an underscore between first and last name 
// e.g. jane_goodall mood
function draw_graph(patientName, graphType) {
    // delete the previous graph is there is one
    d3.select('svg').remove();
    var div_name = patientName.concat('_').concat(graphType);
    $("#main").append('<div id="'.concat(div_name).concat('"></div>'));
    

    // append the correct type of labels
    var labels = ["Fell Asleep", "Time in Bed", "Wake Up Time"]
    if (graphType == "mood") {
      labels = ["Low Mood", "High Mood", "Irritability"];
    } else if (graphType == "anxiety") {
      labels = ["Composite Score"];
    }
    

    var FLAG_LOCATION = 210; // dont know what this does
    var containerWidth = document.getElementById('main').offsetWidth;
    var containerHeight = containerWidth/1.6;

    console.log("containerWidth".concat(containerWidth));



    var main_margin = {top: 20, right: 100, bottom: 100, left: 40},
        mini_margin = {top: 430, right: 80, bottom: 20, left: 40},
        main_width = containerWidth - main_margin.left - main_margin.right,
        main_height = containerHeight - main_margin.top - main_margin.bottom;

    function timeToText(time){
        var hour = Math.floor(time);
        var min =  ("0" + Math.floor((time - hour)*60)).slice(-2);
        return hour.toString().concat(":").concat(min);
      }

    var formatDate = d3.time.format("%Y%m%d"),
        parseDate = formatDate.parse,
        bisectDate = d3.bisector(function(d) { return d.TimeOfDay; }).left,
    // if (graphType == "mood") {
    //     formatOutput0 = function(d) { return  d.First; }, // The focus text
    //     formatOutput1 = function(d) { return  d.Second; };
    //     formatOutput2 = function(d) { return  d.Third; };
    // } else if (graphType == "anxiety") {
    
    // } else {
        formatOutput0 = function(d) { 
          if (graphType == "sleep") { 
            return  timeToText(d.First) + " O'Clock"; 
          } else { 
            return d.First;
          }
        }, // The focus text
        formatOutput1 = function(d) { 
          if (graphType == "sleep") { 
            return  timeToText(d.Second) + " O'Clock"; 
          } else { 
            return d.Second;
          } },
        formatOutput2 = function(d) { 
          if (graphType == "sleep") { 
            return  timeToText(d.Third) + " O'Clock"; 
          } else { 
            return d.Third;
          } };
    // }
    var annotations = [[parseDate("20141213"), "<b>".concat(parseDate("20141213").toDateString()).concat("</b><br>Marshall started taking Xanax.")]]//[[date, html],...]

    //
    var main_x = d3.time.scale()
        .range([0, main_width]);

    var main_y0 = d3.scale.linear()  
        .range([main_height, 0]),
        main_y1 = d3.scale.linear()
        .range([main_height, 0]);  // defines the y axis .sqrt() is another way to do it

    var main_xAxis = d3.svg.axis()
        .scale(main_x)
        .tickFormat(d3.time.format("%b%e"))
        .orient("bottom");

    var main_yAxisLeft = d3.svg.axis()
        .scale(main_y0)
        .orient("left");
        main_yAxisRight = d3.svg.axis()
        .scale(main_y1)
        .orient("right");

    function draw_line(data) {

    }
    //blue line
    var main_line0 = d3.svg.line()
        .interpolate("linear")
        .x(function(d) { return main_x(d.TimeOfDay); })
        .y(function(d) { return main_y0(d.First); }); 

    if ((graphType == "sleep") || (graphType == "mood")){
      var main_line1 = d3.svg.line()
          .interpolate("linear")
          .x(function(d) { return main_x(d.TimeOfDay); })
          .y(function(d) { return main_y0(d.Second); }); //red line

      var main_line2 = d3.svg.line()
          .interpolate("linear")
          .x(function(d) { return main_x(d.TimeOfDay); })
          .y(function(d) { return main_y0(d.Third); }); //green line
    }
    // displays the tooltip
    var annotation = d3.select("#".concat(div_name)).append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);  

    var new_annotation = d3.select("#".concat(div_name)).append("div")   
        .attr("class", "new-annotation")               
        .style("opacity", 0);  


    var svg = d3.select("#".concat(div_name)).append("svg")
        .attr("width", main_width + main_margin.left + main_margin.right)
        .attr("height", main_height + main_margin.top + main_margin.bottom); //sets the bounding space 

    // Allow the graph to be resized
    // function updateWindow(){
    //   console.log('here');
    //   var w = window,
    //       d = document,
    //       e = d.documentElement,
    //       g = d.getElementsByTagName('body')[0],
    //       x = w.innerWidth || e.clientWidth || g.clientWidth,
    //       y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    //   x = w.innerWidth || e.clientWidth || g.clientWidth;
    //   y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    //   console.log(x);
    //   console.log(y);
    //   svg.attr("width", x)
    //      .attr("height", y); 
    //   // var containerWidth = document.getElementById('main').offsetWidth
    //   // var containerHeight = containerWidth/1.6;
    //   // var main_margin = {top: 20, right: 100, bottom: 100, left: 40},
    //   //     mini_margin = {top: 430, right: 80, bottom: 20, left: 40},
    //   //     main_width = containerWidth - main_margin.left - main_margin.right,
    //   //     main_height = containerHeight - main_margin.top - main_margin.bottom;
      
    //   // svg.attr("width", main_width + main_margin.left + main_margin.right)
    //   //   .attr("height", main_height + main_margin.top + main_margin.bottom); 
    // }
    // window.onresize = updateWindow;



    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", main_width)
        .attr("height", main_height);

    var main = svg.append("g")
        .attr("transform", "translate(" + main_margin.left + "," + main_margin.top + ")");

    d3.csv("data/".concat(div_name).concat(".txt"), function(error, data) {
      data.forEach(function(d) {

        d.TimeOfDay = parseDate(d.TimeOfDay); //TimeOfDay

        if (graphType == "sleep") {
          d.First = +d.WakeUpTime;
          d.Second = +d.TimeInBed; //Qty
          d.Third = +d.FellAsleep;
        } else if ((graphType == "mood") /*|| (graphType == "anxiety")*/){
          d.First = +d.LowMood;
          d.Second = +d.HighMood; //Qty
          d.Third = +d.Irritability;
        } 
        else if (graphType == "anxiety") {
          d.First = +d.CompositeScore;
          d.Second = +d.HighMood; //Qty
          d.Third = +d.Irritability;
        }
     });
        
  

    svg.append("text")
        .attr("transform", "translate(" + (main_width+3) + "," + -200 + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("Close");


      data.sort(function(a, b) {
        return a.TimeOfDay - b.TimeOfDay;
      });

      main_x.domain([data[0].TimeOfDay, data[data.length - 1].TimeOfDay]); //builds the x-axis
      console.log('step3')
      // sets the domains for the x axis
      if (graphType == "mood") {
        main_y0.domain([-3.5, 3.5])
      } else if (graphType == "anxiety") {
        main_y0.domain([0, 65])  
      } else { // sleep
        main_y0.domain([0, 24.5])  
        // main_y0.domain(d3.extent(d3.extent(data, function(d) { return d.Third; }).concat( d3.extent(data, function(d) { return d.First; })))); // builds the left axis that the BLUE line is plotted on
      }
      
      

      // main_y1.domain(d3.extent(data, function(d) { return d.TimeInBed; })); //builds the right axis that the red line is plotted on

      svg.append("text")
        .attr("transform", "translate(" + (main_width+3) + "," + main_y0(data[data.length-1].First) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text(labels[0]);

    if ((graphType == "sleep") || (graphType == "mood")){
        svg.append("text")
          .attr("transform", "translate(" + (main_width+3) + "," + main_y0(data[data.length-1].Second) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .style("fill", "indianred")
          .text(labels[1]);

        svg.append("text")
          .attr("transform", "translate(" + (main_width+3) + "," + main_y0(data[data.length-1].Third) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .style("fill", "#92CCA6")
          .text(labels[2]);
      }

      main.append("path")
          .datum(data)
          .attr("clip-path", "url(#clip)")
          .attr("class", "line line0")
          .attr("d", main_line0); //appends the blue line

      if ((graphType == "sleep") || (graphType == "mood")){
        main.append("path")
            .datum(data)
            .attr("clip-path", "url(#clip)")
            .attr("class", "line line1")
            .attr("d", main_line1); // appends the red line 


        main.append("path")
            .datum(data)
            .attr("clip-path", "url(#clip)")
            .attr("class", "line line2")
            .attr("d", main_line2); // appends the green line 
      }
      main.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + main_height + ")")
          .call(main_xAxis);

      main.append("g")
          .attr("class", "y axis axisLeft")
          .call(main_yAxisLeft)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Time"); //builds the left y axis
      
      var annotationBoxSize = 30; // inversely proportional to annotation box size
      
      var focus = main.append("g")
          .attr("class", "focus")
          .style("display", "none");
      
      /*
        Annotation Box 
       */
      //  addAnnotation Box
      var annotationBox = focus.append("g")
          .attr("class", "annotationBox");

      annotationBox.append("rect")
          .attr("class", "annotationBox")
          .attr("height", main_height/annotationBoxSize)
          .attr("width", main_height/annotationBoxSize)

      annotationBox.append("line")
          .attr("x1",  (main_height/annotationBoxSize)/2)
          .attr("x2", (main_height/annotationBoxSize)/2)
          .attr("y1", annotationBoxSize/12)
          .attr("y2", +main_height/annotationBoxSize - annotationBoxSize/12)
          .attr("class", "annotationBox");

      annotationBox.append("line")
          .attr("x1",  annotationBoxSize/12)
          .attr("x2", (main_height/annotationBoxSize) - annotationBoxSize/12)
          .attr("y1", (main_height/annotationBoxSize)/2)
          .attr("y2", (main_height/annotationBoxSize)/2)
          .attr("class", "annotationBox");      

       // Display on the timeline
      focus.append("line")
          .attr("class", "x")
          .attr("y1", 0 )
          .attr("y2",  main_height)

      focus.append('text')
          .attr("class", "x")
          .attr("dy", "-1em")
          .attr("y1", main_height/2 - 6 )
          .attr("y2", main_height/2 + 6 );
      
      focus.append("line")
          .attr("class", "y0")
          .attr("x1", main_width - 6) // nach links
          .attr("x2", main_width + 6); // nach rechts

      // Display on the right bar
      focus.append("line")
          .attr("class", "y1")
          .attr("x1", main_width - 6)
          .attr("x2", main_width + 6);

      focus.append("line")
          .attr("class", "y2")
          .attr("x1", main_width - 6)
          .attr("x2", main_width + 6);      

      focus.append("circle")
          .attr("class", "y0")
          .attr("r", 4);

      focus.append("text")
          .attr("class", "y0")
          .attr("dy", "-1em");

      focus.append("circle")
          .attr("class", "y1")
          .attr("r", 4);

      focus.append("text")
          .attr("class", "y1")
          .attr("dy", "-1em");

      focus.append("circle")
          .attr("class", "y2")
          .attr("r", 4);

      focus.append("text")
          .attr("class", "y2")
          .attr("dy", "-1em");

      main.append("rect")
          .attr("class", "overlay")
          .attr("width", main_width)
          .attr("height", main_height)
          .on("mouseover", function() { focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mousemove)
          .on("mousedown", mousedown);

      for (var i = 0; i < annotations.length; i++){
        drawFlag(main_x(annotations[i][0]));
      }

      function drawFlag(x_coord) {
          main.append("line")
          .attr("x1", x_coord)
          .attr("x2", x_coord)
          .attr("y1", 0)
          .attr("y2", main_height)
          .attr("stroke-width", 2)
          .attr("stroke", "red");
      }

      function isInBox(coordinates, d){
          var min = main_x(d.TimeOfDay);
          var max = main_x(d.TimeOfDay)+ main_height/annotationBoxSize;
          if ((coordinates[0]>min) && (coordinates[0]<max)) {
            return true;
          } else {
            return false;
          }
      }


      

      function genFlagLocations(){
        var result = [];
        for (var i =0; i< annotations.length; i++){
          result.push(main_x(annotations[i]))
        }
        return result;
      }
      //returns whether a flag is at the given x-coordinate
      function isFlag(x_coord) {
        for (var i =0; i< annotations.length; i++){
          if (x_coord == main_x(annotations[i][0])) {
            return true;
          }
        }

        return false;
      }

      function mousedown() { 
        // if (ANNOTATION_ON == false) {
        //     ANNOTATION_ON = true;
            var x0 = main_x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.TimeOfDay > d1.TimeOfDay - x0 ? d1 : d0;
            var coordinates = [0, 0];
            coordinates = d3.mouse(this);
            
             if (isFlag(main_x(d.TimeOfDay))) { // on the flag
                // new_annotation.transition()        
                //             .duration(200)      
                //             .style("opacity", .9);  
                // new_annotation.html("<b>December 5th, 2014</b><br>Marshall was prescribed Xanax.<input  type='submit' id='hide' value='Hide'>")  
            }  else /*if (isInBox(coordinates, d))*/{ // if in the add annotation box
                new_annotation.transition()        
                            .duration(200)      
                            .style("opacity", .9);  
                new_annotation.html("<div>Add your annotation below:<br><textarea id='annotation-text' name='paragraph_text' cols='15' rows='5'></textarea><br><input type='submit' id='submit_annotation'  value='Submit'><br><input type='submit' id='cancel_annotation'  value='Cancel'>");
                
                var date = d.TimeOfDay;

                var submit_annotation = document.getElementById("submit_annotation");
                submit_annotation.onclick = function(evt){
                   var added_annotation = $('#annotation-text').val()
                   annotations.push([date, "<b>".concat(date.toDateString()).concat("</b><br>").concat(added_annotation)]);
                   new_annotation.transition()        
                              .duration(200)      
                              .style("opacity", 0);
                  drawFlag(main_x(d.TimeOfDay));
                }; 
                // functionality in the cancel annotation button
                var cancel_annotation = document.getElementById("cancel_annotation");
                cancel_annotation.onclick = function(evt){
                   new_annotation.transition()        
                              .duration(200)      
                              .style("opacity", 0);
                }; 
            } 
      }


      function getAnnotation(date) {
        for (var i =0; i< annotations.length; i++){
          if (annotations[i][0].getTime() == date.getTime()) {

            return annotations[i][1]
          }
        }
        return "ERROR"
      }

      function hideAnnotation() {
        annotation.transition()        
                    .duration(200)      
                    .style("opacity", 0);      
      }


      function mousemove() {
        var x0 = main_x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.TimeOfDay > d1.TimeOfDay - x0 ? d1 : d0;

        // get mous coords
        var coordinates = [0, 0];
        coordinates = d3.mouse(this);

        focus.select("circle.y0").attr("transform", "translate(" + main_x(d.TimeOfDay) + "," + main_y0(d.First) + ")");
        focus.select("text.y0").attr("transform", "translate(" + main_x(d.TimeOfDay) + "," + main_y0(d.First) + ")").text(formatOutput0(d));
        if ((graphType == "sleep") || (graphType == "mood") ){
          focus.select("circle.y1").attr("transform", "translate(" + main_x(d.TimeOfDay) + "," + main_y0(d.Second) + ")"); //draws the circle on the top
          focus.select("text.y1").attr("transform", "translate(" + main_x(d.TimeOfDay) + "," + main_y0(d.Second) + ")").text(formatOutput1(d)); // writes the text on the top
          focus.select("circle.y2").attr("transform", "translate(" + main_x(d.TimeOfDay) + "," + main_y0(d.Third) + ")"); //draws the circle on the top
          focus.select("text.y2").attr("transform", "translate(" + main_x(d.TimeOfDay) + "," + main_y0(d.Third) + ")").text(formatOutput2(d)); // writes the text on the top
        }
          focus.select(".x").attr("transform", "translate(" + main_x(d.TimeOfDay) + ",0)");
        // focus.select("text.x").attr("transform", "translate(" + main_x(d.TimeOfDay) + ","+ main_height/2 +")").text('Click to add Annotation');
        focus.select(".y0").attr("transform", "translate(" + main_width * -1 + ", " + main_y0(d.First) + ")")
        .attr("x2", main_width + main_x(d.TimeOfDay)); //makes the line to the left
        if ((graphType == "sleep") || (graphType == "mood") ){
          focus.select(".y1").attr("transform", "translate(" + main_width * -1 + ", " + main_y0(d.Second) + ")")
          .attr("x2", main_width + main_x(d.TimeOfDay)); //makes the line
          focus.select(".y2").attr("transform", "translate(" + main_width * -1 + ", " + main_y0(d.Third) + ")")
          .attr("x2", main_width + main_x(d.TimeOfDay)); //makes the line to the right
        }
        //building the dynamic annotation box
        if (!isFlag(main_x(d.TimeOfDay))) { //not on the flag
          var box_middle = coordinates[1]-main_height/(annotationBoxSize*2);
          annotationBox.attr("opacity", "1");
          annotationBox.attr("transform", "translate(" + main_x(d.TimeOfDay) + ","+ box_middle +")")

          // focus.select("rect.addAnnotation").attr("opacity", "1");
          // focus.select("rect.addAnnotation").attr("transform", "translate(" + main_x(d.TimeOfDay) + ","+ box_middle +")");
          // focus.select("line.addAnnotation").attr("transform", "translate(" + main_x(d.TimeOfDay) + ","+ box_middle +")");
          hideAnnotation()
        } else { // on the flag
          annotationBox.attr("opacity", "0");
          annotation.transition()        
                            .duration(200)      
                            .style("opacity", .9);  

          annotation.html(getAnnotation(d.TimeOfDay));//"<b>December 5th, 2014</b><br>Marshall was prescribed Xanax.") 
        }
      }
    });
}

function make_graph(patientName, graphType) {
  draw_graph(patientName, graphType);
    window.addEventListener('resize', function(event){
      console.log('here')
        draw_graph(patientName, graphType); // just call it again...
    });
}

//Export to CSV
//data is a 2-D array, each sub-array creates a newline
//Example: [[1,2,3], ['chums', 'is', 'tight']] makes
//1,2,3
//'chums','is','tight'
//filename is the name of the file (MarshallMathersSleep?)
var csvExport = function(data, filename) {
    var csvContent = "data:text/csv;charset=utf-8,";
    $("#csvExport").click(function(){
        data.forEach(function(infoArray, index){
            dataString = infoArray.join(",");
            csvContent += dataString+ "\n";
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename+".csv");

        link.click();
    });
};

make_graph("jane_goodall", "sleep");
// make_graph("jane_goodall", "mood");
// make_graph("jane_goodall", "anxiety");
// make_graph("marshall_mathers", "sleep");
// make_graph("marshall_mathers", "mood");
// make_graph("marshall_mathers", "anxiety");

