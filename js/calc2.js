var expenditures;

function applyToAllFields(array, postfix, f) {
	f2 = function(e) {
		var elem = document.getElementById(e + postfix);
		f(elem);		
	}
	applyToAllExpenditures(array, f2);
}

/* For each of the available expenditures, f will be called with exp name parameter 
and two element paramaters: wd and ss */
function applyToAllFieldPairs(array, f) {
	f2 = function(e) {
		var elemWd = document.getElementById(e + '_wd');
		var elemSs = document.getElementById(e + '_ss');	
		f(e, elemWd, elemSs);
	};
	applyToAllExpenditures(array, f2);
}

function applyToAllExpenditures(array, f) {
	for (e in array) {
		f(e);
	}	
}

 function createTable(expenditures, newTable) {

 	for(e in expenditures) {
 		exp = expenditures[e];

		newRow = document.createElement("tr");
		newTable.appendChild(newRow);
		
		newDescCell = document.createElement("td");
		newRow.appendChild(newDescCell);
		newDescCell.innerText = exp.name;
		
		addCell = function(parentNode, createContent) {
			var newCell = document.createElement("td");
			parentNode.appendChild(newCell);
			
			newContent = createContent();
			newCell.appendChild(newContent);

			return newContent;
		}

		inputCreator = function() {
			var newContent = document.createElement("input");
			newContent.type = 'text';
			newContent.setAttribute("onBlur", "return validateNumber(this, event)");
			return newContent;
		}

		i1 = addCell(newRow, inputCreator);
		i1.value = exp.hasOwnProperty('defWd') ? exp.defWd : "";
		i1.id = e + '_wd';

		i2 = addCell(newRow, inputCreator);
		i2.value = exp.hasOwnProperty('defSs') ? exp.defWd : "";
		i2.id = e + '_ss';

		divCreator = function() {
			return document.createElement("div");
		}

		total = addCell(newRow, divCreator);
		total.id = e + '_totalPerExp';

/*		
		if ( exp.hasOwnProperty('comment') ) {
			var newComment = document.createElement("span");
			newComment.className = 'comment';
			newComment.innerText = array[exp].comment;
			newFieldCell.appendChild(newComment);
		}
*/

		newTable.appendChild(newRow);
	}
 }

function calculate() {
	sumWd = 0;
	applyToAllFields(expenditures, '_wd', function(elem) {
		sumWd += getFloat(elem);
	});

	sumSs = 0;
	applyToAllFields(expenditures, '_ss', function(elem) {
		sumSs += getFloat(elem);
	});

	function getFloat(elem) {
		v = elem.value;
		if (v == "") { v = 0; }
		return parseFloat(v);		
	}

	applyToAllFieldPairs(expenditures, function(e, wdElem, ssElem) {
		var totalElem = document.getElementById(e + "_totalPerExp");

		hoursAYear = toHoursAYear( getFloat(wdElem), getFloat(ssElem) );
		totalElem.innerText = hoursToHumanReadable( hoursAYear );		
	})

	groupHours = new Array();

	applyToAllFieldPairs(expenditures, function(e, wdElem, ssElem) {
		exp = expenditures[e];

		current = groupHours[exp.group]
		//alert()
		if (isNaN(current)) { current = 0 }
		groupHours[exp.group] = current + toHoursAYear( getFloat(wdElem), getFloat(ssElem) )
	})

	for(var i in groupHours) {
		appendToResults( i + ": " + hoursToHumanReadable(groupHours[i]) )
	}

/*
	applyToAllFields(expenditures, '_wd', function(elem) {
		v = elem.value;
		if (v=="") { v = 0; }
		sumWd += parseFloat(v);
	});
*/

	total = toHoursAYear(sumWd, sumSs);
	busy = (5/7*sumWd + 2/7*sumSs)/24;

	appendToResults(hoursToHumanReadable((1-busy)*365*24) + " ("+ parseInt(100*(1-busy))+"%) времени на остальное");

}

function hoursToHumanReadable(h) {
	d = new Date();
	d.setTime(h*60*60*1000);

	years = d.getYear() - 1970;
	months = d.getMonth();
	days = d.getDate() - 1;

	var result = '';
	
	if (days > 0) {

		if (months > 0) {

			if (years > 0) {
				result += years + ' лет ';
			}

			result += months + ' месяцев ';
		}

		result += days + ' дней';
	}

	return result;
}

function toHoursAYear(wdHoursADay, wsHoursADay) {
	return 365*(5/7*parseFloat(wdHoursADay) + 2/7*parseFloat(wsHoursADay));
}

function appendToResults(data) {
	r = document.getElementById('results');

	newRow = document.createElement("tr");
	r.appendChild(newRow);

	newDescCell = document.createElement("td");
	newRow.appendChild(newDescCell);
	newDescCell.innerText = data;
}

function start() {
	expenditures = {
		sleep: { name: "Сон", defWd: 8, defSs: 8, normWd: 8, normSs: 8, group: "Сон" },
		commute: { name: "Транспорт (на работу и обратно)", defWd: 1, group: "Работа" },
		job: { name: "Работа", defWd: 8, group: "Работа" }	
	}

	createTable(expenditures, document.getElementById("input"));
}