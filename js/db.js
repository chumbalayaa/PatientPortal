var Patients = {
	"MarshallMathers": {
		"firstName": "Marshall",
		"lastName": "Mathers",
		"username": "mmathers",
		"password": "rapGod",
		"bio": {
			"height": "5' 10''",
			"weight": "180",
			"systolicBloodPressure": "120",
			"diastolicBloodPressure": "70",
			"heartRate": "68",
			"recentUpdates": "Marshall suffers from severe depression caused by his recent divorce.",
			"overview": "Marshall has started taking medicine A on 12/6/2014.",
			"photo": "./images/marshall.jpg"
		},
		"forms": ["sleep"],
		"annotations": {
			'sleep': [
			]
		}
	},
	"JaneGoodall": {
		"firstName": "Jane",
		"lastName": "Goodall",
		"username": "jgoodall",
		"password": "monkeysRcool",
		"bio": {
			"height": "5' "+ '3"',
			"weight": "110",
			"systolicBloodPressure": "110",
			"diastolicBloodPressure": "80",
			"heartRate": "58",
			"recentUpdates": "Jane has sleep apnea",
			"overview": "Jane was perscribed intranasal corticosteroid medicine on 12/25/2015. She has been adhering to the medicine rigorously.",
			"photo": "./images/janeGoodall.png"
		},
		"forms": ["sleep"],
		"annotations": {
			"sleep": [
			]
		}
	}
};

var Doctors = {
	"Dr.Dre": {
		"firstName": "Dr.",
		"lastName": "Dre",
		"username": "ddre",
		"password": "ddre"
	}
};

var basicBio = {
	"height": "5' "+ '9"',
	"weight": "150",
	"systolicBloodPressure": "120",
	"diastolicBloodPressure": "80",
	"heartRate": "72",
	"recentUpdates": "None",
	"overview": "None",
	"photo": "None"
};

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