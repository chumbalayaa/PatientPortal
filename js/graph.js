//patientName is all lowercase with an underscore between first and last name 
// e.g. jane_goodall mood
function make_graph(patientName, graphType) {
    var div_name = patientName.concat('_').concat(graphType);
    $("#main").append('<div id="'.concat(div_name).concat('"></div>'));
    var FLAG_LOCATION = 210; // dont know what this does
    var containerWidth = document.getElementById('main').offsetWidth
    var containerHeight = containerWidth/1.6;



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
        formatOutput0 = function(d) { return  timeToText(d.WakeUpTime) + " O'Clock"; }, // The focus text
        formatOutput1 = function(d) { return  timeToText(d.TimeInBed) + " O'Clock"; };
        formatOutput2 = function(d) { return  timeToText(d.FellAsleep) + " O'Clock"; };

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

    //blue line
    var main_line0 = d3.svg.line()
        .interpolate("linear")
        .x(function(d) { return main_x(d.TimeOfDay); })
        .y(function(d) { return main_y0(d.WakeUpTime); }); 

    var main_line1 = d3.svg.line()
        .interpolate("linear")
        .x(function(d) { return main_x(d.TimeOfDay); })
        .y(function(d) { return main_y0(d.TimeInBed); }); //red line

    var main_line2 = d3.svg.line()
        .interpolate("linear")
        .x(function(d) { return main_x(d.TimeOfDay); })
        .y(function(d) { return main_y0(d.FellAsleep); }); //green line

      // main_line2.append("text").text("here")

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



    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", main_width)
        .attr("height", main_height);

    var main = svg.append("g")
        .attr("transform", "translate(" + main_margin.left + "," + main_margin.top + ")");


    d3.csv("data/jane_goodall_sleep.txt", function(error, data) {
      data.forEach(function(d) {

        d.TimeOfDay = parseDate(d.TimeOfDay); //TimeOfDay
        d.WakeUpTime = +d.WakeUpTime;
        d.TimeInBed = +d.TimeInBed; //Qty
        d.FellAsleep = +d.FellAsleep;
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
      main_y0.domain(d3.extent(d3.extent(data, function(d) { return d.FellAsleep; }).concat( d3.extent(data, function(d) { return d.WakeUpTime; })))); // builds the left axis that the BLUE line is plotted on
      main_y1.domain(d3.extent(data, function(d) { return d.TimeInBed; })); //builds the right axis that the red line is plotted on



      svg.append("text")
        .attr("transform", "translate(" + (main_width+3) + "," + main_y0(data[data.length-1].WakeUpTime) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("Wake Up Time");

      
      svg.append("text")
        .attr("transform", "translate(" + (main_width+3) + "," + main_y0(data[data.length-1].TimeInBed) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "indianred")
        .text("Time In Bed");

      svg.append("text")
        .attr("transform", "translate(" + (main_width+3) + "," + main_y0(data[data.length-1].FellAsleep) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "#92CCA6")
        .text("Fell Asleep");
      
      main.append("path")
          .datum(data)
          .attr("clip-path", "url(#clip)")
          .attr("class", "line line0")
          .attr("d", main_line0); //appends the blue line

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
      // focus.append("line")
      //     .attr("class", "addAnnotation")
      //     .attr("stroke-width", 10)
      //     .attr("x1", main_width - 6)
      //     .attr("x2", main_width + 6); 

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
                   console.log(annotations);
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
        // } else {
        //    ANNOTATION_ON = false;
        //    //hide_annotation();
        // }
      }

      function addAnnotation() {

      }

      function getAnnotation(date) {
        for (var i =0; i< annotations.length; i++){
          console.log("annotations")
          console.log(annotations[i][0]);
          console.log("datt")
          console.log(date);
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
        // var x = coordinates[0];
        // Ti
        // var y = coordinates[1];
        focus.select("circle.y0").attr("transform", "translate(" + main_x(d.TimeOfDay) + "," + main_y0(d.WakeUpTime) + ")");
        focus.select("text.y0").attr("transform", "translate(" + main_x(d.TimeOfDay) + "," + main_y0(d.WakeUpTime) + ")").text(formatOutput0(d));
        focus.select("circle.y1").attr("transform", "translate(" + main_x(d.TimeOfDay) + "," + main_y0(d.TimeInBed) + ")"); //draws the circle on the top
        focus.select("text.y1").attr("transform", "translate(" + main_x(d.TimeOfDay) + "," + main_y0(d.TimeInBed) + ")").text(formatOutput1(d)); // writes the text on the top
        focus.select("circle.y2").attr("transform", "translate(" + main_x(d.TimeOfDay) + "," + main_y0(d.FellAsleep) + ")"); //draws the circle on the top
        focus.select("text.y2").attr("transform", "translate(" + main_x(d.TimeOfDay) + "," + main_y0(d.FellAsleep) + ")").text(formatOutput2(d)); // writes the text on the top
        focus.select(".x").attr("transform", "translate(" + main_x(d.TimeOfDay) + ",0)");
        // focus.select("text.x").attr("transform", "translate(" + main_x(d.TimeOfDay) + ","+ main_height/2 +")").text('Click to add Annotation');
        focus.select(".y0").attr("transform", "translate(" + main_width * -1 + ", " + main_y0(d.WakeUpTime) + ")")
        .attr("x2", main_width + main_x(d.TimeOfDay)); //makes the line to the left
        focus.select(".y1").attr("transform", "translate(" + main_width * -1 + ", " + main_y0(d.TimeInBed) + ")")
        .attr("x2", main_width + main_x(d.TimeOfDay)); //makes the line
        focus.select(".y2").attr("transform", "translate(" + main_width * -1 + ", " + main_y0(d.FellAsleep) + ")")
        .attr("x2", main_width + main_x(d.TimeOfDay)); //makes the line to the right
        
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

make_graph("patientName", "graphType");


make_graph("patientName", "graphT");