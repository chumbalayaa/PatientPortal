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

	//alert('update0');

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

	var formInfo = {
	"anxiety":
		{"tele":{"0":false,"1":false,"2":false,"3":false},
		"groups":{"0":false,"1":false,"2":false,"3":false},
		"eating":{"0":false,"1":false,"2":false,"3":false},
		"drinking":{"0":false,"1":false,"2":false,"3":false},
		"authority":{"0":false,"1":false,"2":false,"3":false}
		},
	"sleep":
		{"tele":{"0":false,"1":false,"2":false,"3":false},
		"groups":{"0":false,"1":false,"2":false,"3":false},
		"eating":{"0":false,"1":false,"2":false,"3":false},
		"drinking":{"0":false,"1":false,"2":false,"3":false},
		"authority":{"0":false,"1":false,"2":false,"3":false}
		},
	"mood":
		{"sad":{"0":false,"1":false,"2":false,"3":false,"4":false},
		"guilty":{"0":false,"1":false,"2":false,"3":false,"4":false},
		"lonely":{"0":false,"1":false,"2":false,"3":false,"4":false},
		"angry":{"0":false,"1":false,"2":false,"3":false,"4":false},
		"embarrassed":{"0":false,"1":false,"2":false,"3":false,"4":false}
		}
	};
	//alert(formInfo.anxiety);

	

	$("#sleepForm").click(function(){
		// $("#form").html(forms[1].html);
		// $("#formName").html(forms[1].type);
		loadRightPanel('sleep',reassignListeners);

	});

	$("#anxietyForm").click(function(){
		// $("#form").html(forms[0].html);
		// $("#formName").html(forms[0].type);
		loadRightPanel('anxiety',reassignListeners);

	});

	$("#moodForm").click(function(){
		// $("#form").html(forms[2].html);
		// $("#formName").html(forms[2].type);
		//alert('sorry, havent gotten around making the correct form quite yet 8===D');
		loadRightPanel('mood',reassignListeners);
		//reassignListeners();

	});

	//reassignListeners();

	//Remove form
	var removeForm = function(form) {
		var i = unfinishedForms.indexOf(form);
		if(i != -1) {
			unfinishedForms.splice(i, 1);
		}
	};

	var loadRightPanel = function(file, callback) {
		currentForm=file;
		$.ajax({
			url: './forms/'+file+'-form.html',
			context: document.body,
			success: function(response) {
				$("#form").html(response);
				callback();
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
			loadRightPanel(unfinishedForms[0], reassignListeners);
			//alert(unfinishedForms);
		}
		else{
			removeForm(currentForm);
			loadRightPanel('done', reassignListeners);
		}
	};

	var reassignListeners = function() {
		//alert('reassignListeners');
		unbindListeners();
		assignListeners();
		refillForm();
	};

	var refillForm = function() {
		//alert('trying to fill form');
		//$('#drinking0').attr('checked', true);
		for(var formType in formInfo){
			// alert(formType);
			// alert(formInfo[formType]);
			for(var question in formInfo[formType]){
				for(var radioButton in formInfo[formType][question]){
					//alert('question radio button number: '+question+radioButton+"\nshould it be checked: "+formInfo[formType][question][radioButton]);
					//alert(question+radioButton+", "+formInfo[formType][question][radioButton])
					$('#'+question+radioButton).attr('checked', formInfo[formType][question][radioButton]);
					//RadionButtonSelectedValueSet(question+radioButton,formInfo.formType.question.radioButton);
				}
			}
		}
	};

	var updateFormInfo = function(radioButtonId) {
		var i=0;
		for(i; i<formInfo[currentForm][radioButtonId.substring(0,radioButtonId.length-1)].length;i++){
			formInfo[currentForm][radioButtonId.substring(0,radioButtonId.length-1)][i]=false;
		}
		alert(formInfo[currentForm][radioButtonId.substring(0,radioButtonId.length-1)][radioButtonId.substring(radioButtonId.length-1,radioButtonId.length)]);
		formInfo[currentForm][radioButtonId.substring(0,radioButtonId.length-1)][radioButtonId.substring(radioButtonId.length-1,radioButtonId.length)]=true;
		alert(formInfo[currentForm][radioButtonId.substring(0,radioButtonId.length-1)][radioButtonId.substring(radioButtonId.length-1,radioButtonId.length)]);

		//alert(typeOf(radioButtonId);
		//formInfo[currentForm[radioButtonId]]
	}

	//Add this function to the listeners on the left
	var assignListeners = function() {

		$("#ss-submit").click(function(){
			//alert('submit');
			updateRightPanel();
		});

		$('input.ss-q-radio').click(function(){
			//alert('selection');
			updateFormInfo($(this).attr('id'));
			//var parentId = $(this).attr('id');
		});
	};

	var unbindListeners = function() {
		$("#ss-submit").unbind('click');
		$('input.ss-q-radio').unbind('click');
	};



//});
