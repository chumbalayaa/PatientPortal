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
			console.log(fullName);
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
	$('#bloodPressure').html('<span class="text-primary">Blood Pressure:</span> '+bio['bloodPressure']);
	$('#heartRate').html('<span class="text-primary">Heart Rate: </span> '+bio['heartRate']+'bpm');
	$('#recentUpdates').html('<h6>Recent Updates:</h6>'+bio['recentUpdates']);
	$('#overview').html('<h6>Overview:</h6>'+bio['overview']);
};


//Load form into right panel
var assignNewForm = function() {
	console.log("assigning new form");
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
var editBio = function(fullName, height, weight, bloodPressure, heartRate, newUpdate, newOverview, newPicture) {
	var bioFieldStrings = ['height', 'weight', 'bloodPressure', 'heartRate', 'recentUpdates', 'overview', 'photo'];
	var bioFields = [height, weight, bloodPressure, heartRate, recentUpdates, overview, photo];
	var currentBio = Patients[fullName]['bio'];
	for (var i = 0; i < bioFields.length; i ++){
		console.log(bioFieldStrings[i]);
		if (bioFields[i] != null){
			Patients[fullName]['bio'][bioFieldStrings[i]] = bioFields[i];
		}
	}
};

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################
//Editing Password code
var editPassword = function(fullName, isDoctor, oldPassword, newPassword) {
	fullName = fullName.replace(/\s/g, '');
	if (isDoctor) {
		console.log(Doctors[fullName]['password']);
		console.log(oldPassword);
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
					'bio': basicBio}};
	Patients[fullName]= patientJSON;
	addPatientToSideNav(firstName, lastName);
};

var addPatientToSideNav = function(firstName, lastName) {
	$('#sideNavPatientList').append('<li class="patient"><a href="#" class="patient">'+firstName+' '+lastName+'</a></li>')
};


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//################################################################################
//################################################################################

$( document ).ready(function() {
    reassignListeners();
});