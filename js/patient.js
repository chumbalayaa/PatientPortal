//Client code for patient.html

//forms data structure
// [{  type: "SleepLog",
// 	patient: "MarshallMathers",
// 	dueDate: Datetime,
// 	doctor: "Dr.Dre",
//	html: ...
// },
// {	type: "EatingLog",
// 	patient: "MarshallMathers",
// 	dueDate: Datetime,
// 	doctor: "Dr.Dre",
//	html: ...
// }
// ]

$(function() {

	//Data Structures
	var forms = [{
					type:"Anxiety",
					patient:"MarshallMathers",
					dueDate:"Apr 15, 2015",
					doctor:"Dr.Dre",
					html:'<iframe src="https://docs.google.com/forms/d/1kDZ19hpSOj53k2yhiTATE--fsaoqgj8HUB-8CR9aOjc/viewform?embedded=true" width="100%" height="400" frameborder="0" marginheight="0" marginwidth="0" id="anxietyForm" onsubmit="submitted=true;">Loading...</iframe>'
				},{
					type:"Sleep",
					patient:"MarshallMathers",
					dueDate:"Apr 11, 2015",
					doctor:"Dr.Dre",
					html:'<iframe src="https://docs.google.com/forms/d/10xn9Qp9T6goWqZsXCq6GEpThAPx4J1eW8M5338kGnW4/viewform?embedded=true" width="100%" height="400" frameborder="0" marginheight="0" marginwidth="0" id="sleepForm" onsubmit="submitted=true;">Loading...</iframe>'
				},{
					type:"Mood",
					patient:"MarshallMathers",
					dueDate:"Apr 18, 2015",
					doctor:"Dr.Dre",
					html:'<iframe src="https://docs.google.com/forms/d/1Hk_DksNNvJ-OTJFhRNiVQhMroPHMcHi9PlMlElhqpV4/viewform?embedded=true" width="100%" height="400" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>'
				}];

	//var submitted=false;

	$("#sleepForm").click(function(){
		// $("#form").html(forms[1].html);
		// $("#formName").html(forms[1].type);
		//alert(submitted);
		loadRightPanel('./forms/sleep-form')
	});

	$("#anxietyForm").click(function(){
		// $("#form").html(forms[0].html);
		// $("#formName").html(forms[0].type);
		//alert(submitted);
		loadRightPanel('./forms/anxiety-form')
	});

	$("#moodForm").click(function(){
		// $("#form").html(forms[2].html);
		// $("#formName").html(forms[2].type);
		alert('sorry, havent gotten around making the correct form quite yet 8===D');
		loadRightPanel('./forms/mood-form')
	});

	//Remove form
	var removeForm = function(form) {
		var i = forms.indexOf(form);
		if(i != -1) {
			forms.splice(i, 1);
		}
	};

	var loadRightPanel = function(file) {
		//var html = new EJS({url: 'templates/graphs.html'});
		//$("#leftPanel").innerHTML = html;

		$.ajax({
			url: file+'.html',
			context: document.body,
			success: function(response) {
				$("#form").html(response);
			}
		});	
	};

	//Add form
	var addForm = function(form) {
		forms.push(form);
	};

	//Sort form data Structure
	var sortFormsByTime = function() {
		forms.sort(function(a,b) {
			return Date.parse(a.dueDate) - Date.parse(b.dueDate);
		});
	};

});
