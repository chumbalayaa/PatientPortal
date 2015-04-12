//Client code for patient.html

//forms data structure
// [{  type: "SleepLog",
// 	patient: "MarshallMathers",
// 	dueDate: Datetime,
// 	doctor: "Dr.Dre"
// },
// {	type: "EatingLog",
// 	patient: "MarshallMathers",
// 	dueDate: Datetime,
// 	doctor: "Dr.Dre"
// }
// ]

//Data Structures
var forms = [];

//Remove form
var removeForm = function(form) {
	var i = forms.indexOf(form);
	if(i != -1) {
		forms.splice(i, 1);
	}
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