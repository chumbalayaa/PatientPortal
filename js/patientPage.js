//Code for everything pertaining to a patient's page

//Add listener to put new form page in right panel 
var addNewFormButtonListener = function() {
	$('#test').on('click', function (e) {
		alert("hey");
		loadRightPanel('assignNewForm');
	});
};