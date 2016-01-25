/// <reference path="jquery.d.ts" />

class Company {
  constructor(name:string)
	{
		this.name=name;
	}
	name: string;
}

function greeter (company:Company){
	return "hallo "+company.name;
}

var company=new Company("Crate");

$(document).ready(function(){
    var message = greeter(company);
    $("#status").text(message);
});