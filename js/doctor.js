//################################################################################
//################################################################################
//--------------------------------------------------------------------------------
//Patient in navbar stuff --------------------------------------------------------
var patientsInNavBar = [];

//
var sideNav = false;

var slideSide = function() {
	if (sideNav) {
		sideNav = false;
		$('#sideNavToggle').empty();
		$('#sideNavToggle').html('<span class="glyphicon glyphicon-chevron-right"></span><br> \
              					  <span class="glyphicon glyphicon-chevron-right"></span><br> \
              					  <span class="glyphicon glyphicon-chevron-right"></span>');
	} else {
		sideNav = true;
		$('#sideNavToggle').empty();
		$('#sideNavToggle').html('<span class="glyphicon glyphicon-chevron-left"></span><br> \
              					  <span class="glyphicon glyphicon-chevron-left"></span><br> \
              					  <span class="glyphicon glyphicon-chevron-left"></span>');
	}
}

//Take patient names out of the navbar - UI
var assignNavbarXClickListener = function() {
	$('a.navIconButton').click(function (e) {
		var id = this.id;
		var name = id.substring(1);
		$('#'+name).remove();
		removePatientFromNavbar(name);
    });
};

//Remove patient from Data Structure
var removePatientFromNavbar = function(fullName) {
	var i = patientsInNavBar.indexOf(fullName);
	if(i != -1) {
		patientsInNavBar.splice(i, 1);
	}
};

var patientIsInNavbar = function(firstName, lastName) {
	var i = patientsInNavBar.indexOf(firstName+lastName);
	if (i != -1) {
		return true;
	} else {
		return false;
	}
};

var removePatientThatIsNot = function(firstName, lastName) {
	for (var i = 0; i < patientsInNavBar.length; i++) {
		if (patientsInNavBar[i] != firstName+lastName) {
			$('#'+patientsInNavBar[i]).remove();
			patientsInNavBar.splice(i, 1);
			return;
		}
	}
};

//Add person to top navbar
var addPatientToNav = function(firstName, lastName) {
	if (patientIsInNavbar(firstName, lastName)) {
		return;
	}
	else {
		if (patientsInNavBar.length > 3) {
			removePatientThatIsNot(firstName, lastName);
		}
		$('#patientNavList').append(
			'<li class="patientNavbar" id="'+firstName+lastName+'"> \
    	      <a href="#" class="patientInNav" style="float: left;">'+firstName+' '+lastName+'</a> \
    	      <a href="#" style="float:right;" class="navIconButton" id="x'+firstName+lastName+'"> \
    	        <span class="glyphicon glyphicon-remove-circle"></span> \
    	      </a> \
    	    </li>'
		);
		patientsInNavBar.push(firstName+lastName);
		reassignListeners();
	}
};
//Add this function to the listeners on the left
var assignPatientClickListener = function() {
	$('a.patient').click(function (e) {
		var fullName = this.text;
		var nameArray = fullName.split(" ");
		addPatientToNav(nameArray[0], nameArray[1]);
	});
};

var unbindListeners = function() {
	$('a.navIconButton').unbind('click');
	$('a.patient').unbind('click');
	$('.patientInNav').unbind('click');
	$('.patient').unbind('click');
};
var reassignListeners = function() {
	unbindListeners();
	assignPatientClickListener();
	assignNavbarXClickListener();
	addPatientSideNavListener();
	addPaitientTopNavListener();
};

//End patients in navbar stuff ---------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################



//################################################################################
//################################################################################
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Panel Loading

var currentPatient = "";


//Loading HTML into panels
var loadLeftPanel = function(fullName) {
	$.ajax({
		url: 'templates/patientBio.html',
		context: document.body,
		success: function(response) {
			$("#leftPanel").html(response);
			populateBio(fullName);
		}
	});
	currentPatient = fullName;
	if (currentPatient == "MarshallMathers") {
		$('#patientName').html("Marshall Mathers");
	}
	else {
		$('#patientName').html("Jane Goodall");
	}
};

var loadRightPanel = function(file) {
	$.ajax({
		url: file+'.html',
		context: document.body,
		success: function(response) {
			$("#rightPanel").html(response);
		}
	});	
};

var loadPatient = function(fullName) {
	loadLeftPanel(fullName);
	loadRightPanel('graph');
};

var populateBio = function(fullName) {
	var bio = Patients[fullName]['bio'];
	$('#patientPicture').attr('src', bio['photo']);
	$('#height').html('<span class="text-primary">Height:</span> '+bio['height']);
	$('#weight').html('<span class="text-primary">Weight:</span> '+bio['weight']+ ' lbs');
	$('#bloodPressure').html('<span class="text-primary">Blood Pressure:</span> '+bio['systolicBloodPressure'] + '/' + bio['diastolicBloodPressure']);
	$('#heartRate').html('<span class="text-primary">Heart Rate: </span> '+bio['heartRate']+' bpm');
	$('#recentUpdates').html('<h6>Recent Updates:</h6>'+bio['recentUpdates']);
	$('#overview').html('<h6>Overview:</h6>'+bio['overview']);
};


//Load form into right panel
var assignNewForm = function() {
	loadRightPanel('assignNewForm');
};

//Add click listener for when we click on a patient in the side nav
var addPatientSideNavListener = function() {
	$('.patient').click(function (e) {
		var name = e.target.text;
		var nameArray = name.split(" ");
		var fullName = nameArray[0]+nameArray[1];
		if (currentPatient != fullName) {
			loadPatient(fullName);	
		}
	});
};
//Add click listener for when we click on a patient in the top nav
var addPaitientTopNavListener = function() {
	$('.patientInNav').click(function (e) {
		var name = e.target.text;
		var nameArray = name.split(" ");
		var fullName = nameArray[0]+nameArray[1];
		if (currentPatient != fullName) {
			loadPatient(fullName);	
		}
	});
};

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################
//Editing Bio code
var editBio = function(height, weight, bloodPressure, heartRate, newUpdate, newOverview, newPicture) {
	var bioFieldStrings = ['height', 'weight', 'systolicBloodPressure', 'diastolicBloodPressure', 'heartRate', 'recentUpdates', 'overview', 'photo'];
	var bioFields = [height, weight, systolicBloodPressure, diastolicBloodPressure, heartRate, newUpdate, newOverview, newPicture];
	console.log(bioFields);
	for (var i = 0; i < bioFields.length; i ++){
		if (bioFields[i] != ""){
			Patients[currentPatient]['bio'][bioFieldStrings[i]] = bioFields[i];
		}
	};
	populateBio(currentPatient);
};

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################
//Editing Password code
var editPassword = function(fullName, isDoctor, oldPassword, newPassword) {
	fullName = fullName.replace(/\s/g, '');
	if (isDoctor) {
		if (Doctors[fullName]['password'] == oldPassword) {
			Doctors[fullName]['password'] == newPassword;
		} else {
			alert("INCORRECT PASSWORD");
		}
	} else {
		if (Patients[fullName]['password'] == oldPassword) {
			Patients[fullName]['password'] == newPassword;
		} else {
			alert("INCORRECT PASSWORD");
		}
	}
};	


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################
//Adding new patient code
var addNewPatient = function(firstName, lastName) {
	var fullName = firstName+lastName;
	patientJSON = {fullName: {
					'firstName': firstName,
					'lastName': lastName,
					'bio': basicBio,
					'forms': [],
					'annotations': []}};
	Patients[fullName]= patientJSON;
	addPatientToSideNav(firstName, lastName);
};

var addFormToPatient = function(firstName, lastName, formType) {
	var fullName = firstName+lastName;
	if (Patients[fullName]['forms'].indexOf(formType) == -1) {
		Patients[fullName]['forms'].push(formType);
		Patients[fullName]['annotations'][formType] = [];
	} else {
		alert(firstName+" "+lastName+" already has the form: "+formType);
	}
};

var addPatientToSideNav = function(firstName, lastName) {
	$('#sideNavPatientList').append('<li class="patient"><a href="#" class="patient">'+firstName+' '+lastName+'</a></li>')
};

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################
//log in code

var drLogIn = function(username, password){
	if((Doctors["Dr.Dre"]["username"] != username) || (Doctors["Dr.Dre"]["password"] != password)){
		return false;
	}
};

//Add Annotation
var addAnnotation = function(firstName, lastName, formType, annotation) {
	var fullName = firstName+lastName;
	Patients[fullName]['annotations'][formType].push(annotation);
};

//Annotation Editing
var editAnnotation = function(firstName, lastName, formType, date, newAnnotation) {
	var fullName = firstName+lastName;
	var annotations = Patients[fullName]['annotations'][formType];
	var found = false;
	for (var i = 0; i < annotations.length; i ++) {
		if (annotations[i]["date"] == date) {
			annotations[i] = newAnnotation;
			found = true;
		}
	}
	if (!found) {
		alert("That annotation doesn't exist");
	}
};	

//Delete Annotation
var deleteAnnotation = function(firstName, lastName, formType, date) {
	var fullName = firstName+lastName;
	var annotations = Patients[fullName]['annotations'][formType];
	var found = false;
	for (var i = 0; i < annotations.length; i ++) {
		if (annotations[i]["date"] == date) {
			annotations.splice(i, 1);
			found = true;
		}
	}
	if (!found) {
		alert("That annotation doesn't exist");
	}
};

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################

$( document ).ready(function() {
    reassignListeners();
});
