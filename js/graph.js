MIN_DATE = "20141201";
MAX_DATE = "20141230";

average = function(a) {
  var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
  for(var m, s = 0, l = t; l--; s += a[l]);
  for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
  return r.deviation = Math.sqrt(r.variance = s / t), r;
}
//patientName is all lowercase with an underscore between first and last name 
// e.g. jane_goodall mood
function drawGraph(fullName, graphType, startDate, endDate, minDate, maxDate) {
    var names = fullName.match(/[A-Z][a-z]+/g);
    firstName = names[0].toLowerCase();
    lastName = names[1].toLowerCase();
    var patientName = firstName.concat('_').concat(lastName);
    var div_name = patientName.concat('_').concat(graphType);
    if ($("#".concat(div_name)).length) {
      d3.select("#".concat(div_name)).remove();
    }
    // insertDiv(patientName, graphType, div_name);
    $("#main").append('<div id="'.concat(div_name).concat('" class="').concat(graphType).concat('-graph"></div>'));
    // delete the previous graph is there is one
    
    var formatDate = d3.time.format("%Y%m%d"),
        parseDate = formatDate.parse,
        bisectDate = d3.bisector(function(d) { return d.TimeOfDay; }).left;
    addDownloadButton(div_name);
    addDateRange(div_name, fullName, graphType, parseDate(startDate), parseDate(endDate), parseDate(minDate), parseDate(maxDate));

    // $("#main").append('<div id="'.concat(div_name).concat('"></div>'));


    var FLAG_LOCATION = 210; // dont know what this does
    var containerWidth = document.getElementById('main').offsetWidth;
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

    // if (graphType == "mood") {
    //     formatOutput0 = function(d) { return  d.First; }, // The focus text
    //     formatOutput1 = function(d) { return  d.Second; };
    //     formatOutput2 = function(d) { return  d.Third; };
    // } else if (graphType == "anxiety") {
    
    // } else {
    var formatOutput0 = function(d) { 
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
    var annotations = [];//[[parseDate("20141213"), "<b>".concat(parseDate("20141213").toDateString()).concat("</b><br>Marshall started taking Xanax.")]]//[[date, html],...]
    var fullName = capitalizeFirstLetter(firstName).concat(capitalizeFirstLetter(lastName));

    var persistent_annotations = Patients[fullName]['annotations'][graphType];
    var a_date;
    var a_txt;
    for (var i = 0; i < persistent_annotations.length; i++){
        a_date = persistent_annotations[i]["date"];
        a_txt = persistent_annotations[i]["text"];
        annotations.push([a_date, a_txt]);
    }


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



    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", main_width)
        .attr("height", main_height);

    var main = svg.append("g")
        .attr("transform", "translate(" + main_margin.left + "," + main_margin.top + ")");

    d3.csv("data/".concat(div_name).concat(".txt"), function(error, data) {
      
      // Trim the data
      var temp = [];
      data.forEach(function(d) {
          if ((parseDate(d.TimeOfDay) >= parseDate(startDate)) && (parseDate(d.TimeOfDay) <= parseDate(endDate))) {
            temp.push(d)

          }
      });

      data = temp;
      var stat_array = [[],[],[]];
      data.forEach(function(d) {          
            d.TimeOfDay = parseDate(d.TimeOfDay); //TimeOfDay

            if (graphType == "sleep") {
              d.First = +d.WakeUpTime;
              d.Second = +d.TimeInBed; //Qty
              d.Third = +d.FellAsleep;
              stat_array[0].push(Number(d.WakeUpTime))
              stat_array[1].push(Number(d.TimeInBed))
              stat_array[2].push(Number(d.FellAsleep))
            } else if (graphType == "mood"){
              d.First = +d.LowMood;
              d.Second = +d.HighMood; //Qty
              d.Third = +d.Irritability;
              stat_array[0].push(Number(d.LowMood))
              stat_array[1].push(Number(d.HighMood))
              stat_array[2].push(Number(d.Irritability))
            } 
            else if (graphType == "anxiety") {
              d.First = +d.CompositeScore;
              d.Second = +d.HighMood; //Qty
              d.Third = +d.Irritability;
              stat_array[0].push(Number(d.CompositeScore))
            }
     });
    var result = [[],[],[]];
    result[0] = average(stat_array[0]);
    result[1] = average(stat_array[1]);
    result[2] = average(stat_array[2]);

    var labels = ["Wake Up Time Avg: ".concat(Math.round(result[0].mean)), "Time in Bed Avg: ".concat(Math.round(result[1].mean)), "Fell Asleep Avg: ".concat(Math.round(result[2].mean))]
    if (graphType == "mood") {
      labels = ["Low Mood Avg: ".concat(Math.round(result[0].mean)), "High Mood Avg: ".concat(Math.round(result[1].mean)), "Irritability Avg: ".concat(Math.round(result[2].mean))];
    } else if (graphType == "anxiety") {
      labels = ["Composite Score Avg: ".concat(Math.round(result[0].mean))];
    }

  
        
  

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
        .attr("transform", "translate(" + (main_width-40) + "," + main_y0(data[data.length-1].First) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text(labels[0]);

    if ((graphType == "sleep") || (graphType == "mood")){
        svg.append("text")
          .attr("transform", "translate(" + (main_width-40) + "," + main_y0(data[data.length-1].Second) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .style("fill", "indianred")
          .text(labels[1]);
        var text_location = main_y0(data[data.length-1].Third);
        if (text_location == main_y0(data[data.length-1].Second) ){
          text_location = text_location + 14;
        }
        svg.append("text")
          .attr("transform", "translate(" + (main_width-40) + "," + text_location + ")")
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
            }  else { // if in the add annotation box

               $('#annotationModal').modal('show'); 
                // new_annotation.transition()        
                //             .duration(200)      
                //             .style("opacity", .9);  
                // new_annotation.html("<div>Add your annotation below:<br><textarea id='annotation-text' name='paragraph_text' cols='15' rows='5'></textarea><br><input type='submit' id='submit_annotation'  value='Submit'><br><input type='submit' id='cancel_annotation'  value='Cancel'>");
                
                var date = d.TimeOfDay;

                var submit_annotation = document.getElementById("submit-annotation");
                submit_annotation.onclick = function(evt){
                  onClick="document.getElementById('annotationForm').reset()"
                  var annotationText = "<b>".concat(date.toDateString()).concat("</b><br>").concat($('#annotationText').val());
                  // [parseDate("20141213"), "<b>".concat(parseDate("20141213").toDateString()).concat("</b><br>")Marshall started taking Xanax.")]
                  var annotation = {'date': date, 'text': annotationText};
                  addAnnotation(capitalizeFirstLetter(firstName), capitalizeFirstLetter(lastName), graphType, annotation);
                  annotations.push([date, "<b>".concat(date.toDateString()).concat("</b><br>").concat($('#annotationText').val())]);
                  drawFlag(main_x(d.TimeOfDay));
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

// Wrapper code that handles resizing the graph
function makeGraph(fullName, graphType, startDate, endDate, minDate, maxDate) {
  drawGraph(fullName, graphType, startDate, endDate, minDate, maxDate);
    window.addEventListener('resize', function(event){
        drawGraph(fullName, graphType, startDate, endDate, minDate, maxDate); // just call it again...
    });
}

function addDownloadButton(div_name){
  var args = "'/".concat(div_name).concat(".txt', '/").concat(div_name).concat("'");
  $("#".concat(div_name)).append('<button onclick="csvExport('.concat(args).concat(')" type="button" class="download-button btn btn-default">Download CSV</button>'));
}

function addDateRange(div_name, fullName, graphType, startDate, endDate, minDate, maxDate) {
  var startdate_name = div_name.concat("_startdate");
  var enddate_name = div_name.concat("_enddate");
  var formatted_enddate = d3.time.format("%m/%d/%Y")(endDate);
  var formatted_startdate = d3.time.format("%m/%d/%Y")(startDate);
  
  $("#".concat(div_name)).append('<div class="startdate-picker">Beginning of date range: <input type="text" placeholder="'.concat(formatted_startdate ).concat('" name="selected_date" id="')
    .concat(startdate_name).concat('" />').concat('  End of date range: <input type="text" placeholder="').concat(formatted_enddate ).concat('" name="selected_date" id="').concat(enddate_name).concat('" /></div>'));
  
  var endDateMinus = new Date(endDate);
  endDateMinus.setDate(endDate.getDate()-1);

  var startDatePlus = new Date(startDate);
  startDatePlus.setDate(startDate.getDate()+1);

  $("#".concat(startdate_name)).removeClass('hasDatepicker').datepicker(); 
  $(function(){
    $( "#".concat(startdate_name) ).datepicker({ 
      minDate: minDate, 
      maxDate: endDateMinus,
      onSelect: function(selected,evnt) {
         var updatedDate = $("#".concat(startdate_name)).datepicker("getDate");
         drawGraph(fullName, graphType, d3.time.format("%Y%m%d")(updatedDate), d3.time.format("%Y%m%d")(endDate), d3.time.format("%Y%m%d")(minDate), d3.time.format("%Y%m%d")(maxDate));
      } 
    });
  //Pass the user selected date format 
    // $( "#format" ).change(function() {
    //   $( "#datepicker" ).datepicker( "option", "dateFormat", $(this).val() );
    // });
  });
  $(function(){
    $( "#".concat(enddate_name) ).datepicker({
      minDate: startDatePlus, 
      maxDate: maxDate,
      onSelect: function(selected,evnt) {
         var updatedDate = $("#".concat(enddate_name)).datepicker("getDate");
         drawGraph(fullName, graphType, d3.time.format("%Y%m%d")(startDate), d3.time.format("%Y%m%d")(updatedDate), d3.time.format("%Y%m%d")(minDate), d3.time.format("%Y%m%d")(maxDate));
         
      } 
    });
  //Pass the user selected date format 
    // $( "#format" ).change(function() {
    //   $( "#datepicker" ).datepicker( "option", "dateFormat", $(this).val() );
    // });
  });
// 
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Export to CSV
var csvExport = function(dataFile) {
    var csvContent = "data:text/csv;charset=utf-8,";
    $.ajax({
        type: "GET",
        url: "./data/"+dataFile,
        dataType: "text",
        success: function(allText) {
            var allTextLines = allText.split(/\r\n|\n/);
            var lines = [];
            for (var i=0; i<allTextLines.length; i++) {
                var data = allTextLines[i].split(',');
                lines.push(data);
            }
            lines.forEach(function(infoArray, index){
                dataString = infoArray.join(",");
                csvContent += dataString+ "\n";
            });
            var encodedUri = encodeURI(csvContent);
            window.open(encodedUri);
        }
     });
};
// currentPatient

$( document ).ready(function() {
  for (var i = 0; i < Patients[currentPatient]["forms"].length; i++){
    makeGraph(currentPatient, Patients[currentPatient]["forms"][i], "20141201", "20141221", MIN_DATE, MAX_DATE);
  }
});
//makeGraph(currentPatient, "sleep", "20141201", "20141221", MIN_DATE, MAX_DATE);
// makeGraph("MarshallMathers", "sleep", "20141201", "20141221", MIN_DATE, MAX_DATE);
// makeGraph("jane", "goodall", "mood", "20141201", "20141220", MIN_DATE, MAX_DATE);
// makeGraph("jane", "goodall", "anxiety", "20141201", "20141220", MIN_DATE, MAX_DATE);
// makeGraph("jane_goodall", "anxiety");
// makeGraph("marshall_mathers", "sleep");
// makeGraph("marshall_mathers", "mood");
// makeGraph("marshall_mathers", "anxiety");

