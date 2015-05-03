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

//$(function() {

	alert('update5');

	var currentForm;

	var unfinishedForms=['anxiety','sleep','mood'];

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

	$("#sleepForm").click(function(){
		// $("#form").html(forms[1].html);
		// $("#formName").html(forms[1].type);
		//alert(submitted);
		loadRightPanel('sleep');
		reassignListeners();

	});

	$("#anxietyForm").click(function(){
		// $("#form").html(forms[0].html);
		// $("#formName").html(forms[0].type);
		//alert(submitted);
		loadRightPanel('anxiety');
		reassignListeners();

	});

	$("#moodForm").click(function(){
		// $("#form").html(forms[2].html);
		// $("#formName").html(forms[2].type);
		//alert('sorry, havent gotten around making the correct form quite yet 8===D');
		loadRightPanel('mood');
		reassignListeners();

	});

	$("#ss-submit").click(function(){
		alert('hi');
		updateRightPanel();
	});

	$('span').click(function(){
		alert('hi0');
	});

	$('input').click(function(){
		alert('hi1');
	});

	$('label').click(function(){
		alert('hi2');
	});

	$('ul').click(function(){
		alert('hi3');
	});

	$('li').click(function(){
		alert('hi4');
	});

	$('#test').click(function(){
		alert('hi4');
	});

	

	//Remove form
	var removeForm = function(form) {
		var i = unfinishedForms.indexOf(form);
		if(i != -1) {
			unfinishedForms.splice(i, 1);
		}
	};

	var loadRightPanel = function(file) {
		currentForm=file;
		$.ajax({
			url: './forms/'+file+'-form.html',
			context: document.body,
			success: function(response) {
				$("#form").html(response);
			}
		});	
	};

	//Add form
	var addForm = function(form) {
		unfinishedForms.push(form);
	};

	//Sort form data Structure
	var sortFormsByTime = function() {
		unfinishedForms.sort(function(a,b) {
			return Date.parse(a.dueDate) - Date.parse(b.dueDate);
		});
	};

	var updateRightPanel = function() {
		var response = window.confirm('Are you sure you want to submit?');
		if (response==false){
			return;
		}
		//disable proper button 
		//load in next due form
		//remove from unfinished form list
		$('#'+currentForm+'Form').prop("disabled",true);
		$('#'+currentForm+'FormText').html("Finished!");	
		$('#'+currentForm+'FormDiv').removeClass("dueForm");		
		$('#'+currentForm+'FormText').removeClass("urgentForm");	
		$('#'+currentForm+'FormDiv').addClass("completedForm");
	
		if(unfinishedForms.length>1){
			removeForm(currentForm);
			loadRightPanel(unfinishedForms[0]);
			//alert(unfinishedForms);
		}
		else{
			removeForm(currentForm);
			loadRightPanel('done');
		}
		reassignListeners();
	};

	var reassignListeners = function() {
		//unbindListeners();
		unbindListeners();
		assignListeners();
	};

	//Add this function to the listeners on the left
	var assignListeners = function() {
		//alert('reassigning');
		$("#ss-submit").click(function(){
			alert('hi');
			updateRightPanel();
		});

		$('span').click(function(){
			alert('hi0');
		});

		$('input').click(function(){
			alert('hi1');
		});

		$('label').click(function(){
			alert('hi2');
		});

		$('ul').click(function(){
			alert('hi3');
		});

		$('li').click(function(){
			alert('hi4');
		});

		$('#test').click(function(){
			alert('hi4');
		});
	};

	var unbindListeners = function() {
		$("#ss-submit").unbind('click');
		$('span').unbind('click');
		$('input').unbind('click');
		$('label').unbind('click');
		$('ul').unbind('click');
		$('li').unbind('click');
		$('#test').unbind('click');
	};



//});
