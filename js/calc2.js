/** Expects DOM to contain a placeholder table (id=calcInput) for input fields, 
 * button (id=calcButton) that calls calculate() function and 
 * span (id="results") placeholder for results. */

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

function validateNumber(elem, event) {
	var isNumber = /^\d*\.{0,1}\d+$/.test(elem.value);
	elem.className = isNumber || elem.value=="" ? null : "err";
	revalidate();
}

function revalidate() {	
	totalErrors = 0;
	validateField = function(elem) { 
		if (elem.className == 'err') {++totalErrors;}
	}
	applyToAllFields( expenditures, '_wd', validateField );
	applyToAllFields( expenditures, '_ss', validateField );
	
	b = document.getElementById("calcButton");
	b.disabled = totalErrors>0;
	b.className = totalErrors > 0 ? "err" : null;
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
	setResults("Итого, в год вы тратите время на:\n\n");

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

	appendToResults(hoursToHumanReadable((1-busy)*365*24) + " ("+ parseInt(100*(1-busy))+"% времени) на остальное");

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
				result += years + 'л ';
			}

			result += months + 'м ';
		}

		result += days + 'д';
	}

	return result;
}

function toHoursAYear(wdHoursADay, wsHoursADay) {
	return 365*(5/7*parseFloat(wdHoursADay) + 2/7*parseFloat(wsHoursADay));
}

function setResults(data) {
	r = document.getElementById('calcResults');
	r.innerText = data;
}

function appendToResults(data) {
	r = document.getElementById('calcResults');
	r.innerText += data+"\n";
}

function initCalc() {
	expenditures = {
		sleep: { name: "Сон", defWd: 8, defSs: 8, normWd: 8, normSs: 8, group: "Физиологические потребности" },
		commute: { name: "Транспорт\n(на работу и обратно)", defWd: 1, group: "Работа" },
		job: { name: "Работа", defWd: 8, group: "Работа" },
		eat: { name: "Еда", defWd: 2.5, defSs: 2.5, group: "Физиологические потребности", comment: "Рекомендуемый минимум - 2,5 часа в день" },
		dress: { name: "Уход за собой", defWd: 1, defSs: 1, comment: "Рекомендуемый минимум для женщин - 1,5 час в день, для мужчин - 0,5 часа в день", group: "Физиологические потребности" },
		workComm: { name: "Общение, устное и письменное, по рабочим и околорабочим вопросам в нерабочее время, в том числе поддержание социальных связей (корпоративные праздники, полезные встречи)", group: "Работа" },
		workRead: { name: "Чтение профессиональной литературы (журналы, газеты, книги, учебная литература)", group: "Работа" },
		sport: { name: "Спорт", group: "Личное" },
		sex: { name: "Секс", group: "Личное" },
		tv: { name: "Просмотр телевизора, серфинг по интернету", group: "Личное" },
		friendsComm: { name: "Общение с близкими, друзьями", group: "Личное" },
		hobby: { name: "Хобби", group: "Личное" },
		entertainment: { name: "Прочие развлечения (без учета просмотра телевизора, бессмысленного серфинга по интернету, полезных встреч и необходимых пьянок)", group: "Личное" },
		shopping: { name: "Покупки", group: "Личное" },
		trainingWork: { name: "Образование, связанное с наиболее оптимальным выполнением рабочих функций (курсы иностранных языков, курсы повышения квалификации)", group: "Работа" },
		trainingOther: { name: "Образование, не связанное с выполнением рабочих функций", group: "Личное" }
	}

	createTable(expenditures, document.getElementById("calcInput"));
}