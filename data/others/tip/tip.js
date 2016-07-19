function getCSVFile() {	
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		createArray(xhr.responseText);
	};
	xhr.open("get", "./data/others/tip/tip_data.csv", true);
	xhr.send(null);
};
getCSVFile();
function createArray(csvData) {
	var d = csvData.split("\n");
	var tips = csv2json(d);
};
function csv2json(csvArray){
	tips = [];
	var items = csvArray[0].split(',');
	for (var i = 1; i < csvArray.length; i++) {
		var a_line = new Object();
		var csvArrayD = csvArray[i].split(',');
		for (var j = 0; j < items.length; j++) {
			a_line[items[j]] = csvArrayD[j];
		}
		tips.push(a_line);
	}
	//console.log(tips);
};

