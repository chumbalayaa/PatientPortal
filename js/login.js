
var patientLogIn = function(username, password){
	if((Patients["MarshallMathers"]["username"] != username) || (Patients["MarshallMathers"]["password"] != password)){
		return false;
	};
};

var drLogIn = function(username, password){
	if((Doctors["Dr.Dre"]["username"] != username) || (Doctors["Dr.Dre"]["password"] != password)){
		return false;
	}
};