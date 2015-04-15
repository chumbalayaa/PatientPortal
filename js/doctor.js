//################################################################################
//################################################################################
//--------------------------------------------------------------------------------
//Patient in navbar stuff --------------------------------------------------------
var patientsInNavBar = ["MarshallMathers", "JaneGoodall"];


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
var loadLeftPanel = function(file) {
	//var html = new EJS({url: 'templates/'+file+'.ejs'});
	//$("#leftPanel").innerHTML = html;

	$.ajax({
		url: 'templates/'+file+'.html',
		context: document.body,
		success: function(response) {
			$("#leftPanel").html(response);
		}
	});
	currentPatient = file;
};

var loadRightPanel = function(file) {
	//var html = new EJS({url: 'templates/graphs.html'});
	//$("#leftPanel").innerHTML = html;

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
	loadRightPanel('graphs');
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

$( document ).ready(function() {
    reassignListeners();
    loadLeftPatient("MarshallMathers");
});