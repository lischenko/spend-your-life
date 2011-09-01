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
	var isNumber = /^\d*\.{0,1}\d+$/.test(elem.value.replace(/,/g, '.'));
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
		newDescCell.innerHTML = exp.name;
		
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
			newComment.innerHTML = array[exp].comment;
			newFieldCell.appendChild(newComment);
		}
*/

		newTable.appendChild(newRow);
	}
 }

function calculate() {
	resDiv = document.getElementById('calcResultsDiv');
	resDiv.style.display = 'inline';

	clearResults();

	sumWd = 0;
	applyToAllFields(expenditures, '_wd', function(elem) {
		sumWd += getFloat(elem);
	});

	sumSs = 0;
	applyToAllFields(expenditures, '_ss', function(elem) {
		sumSs += getFloat(elem);
	});

	function getFloat(elem) {
		v = elem.value.replace(/,/g, '.');
		if (v == "") { v = 0; }
		return parseFloat(v);
	}

	applyToAllFieldPairs(expenditures, function(e, wdElem, ssElem) {
		var totalElem = document.getElementById(e + "_totalPerExp");

		hoursAYear = toHoursAYear( getFloat(wdElem), getFloat(ssElem) );
		totalElem.innerHTML = hoursToHumanReadable( hoursAYear );		
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


	if (busy <= 1) {
		remaining = "У вас остаётся " + hoursToHumanReadable((1-busy)*365*24) + " ("+ parseInt(100*(1-busy))+"%) на остальное.";		
	} else {
		remaining = "Вам не хватает " + parseInt((busy-1)*365) + " дней в году.";				
	}
	document.getElementById('calcRemaining').innerHTML = remaining;

}

function hoursToHumanReadable(h) {
	if (0 == h) {
		return "-";
	}

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

function appendToResults(data) {
	listItem = document.createElement('li');

	setItemText(listItem, data);
	
	list = document.getElementById('calcResults');
	list.appendChild(listItem);
}

function clearResults() {
	list = document.getElementById('calcResults');
	removeAllChildren(list);
}

function setItemText(listItem, data) {
        ie = getInternetExplorerVersion();
        if (ie > -1) {
                listItem.innerText = data; //not supported by FF
        } else {
                listItem.textContent = data; // not supported by IE
        }
}

// http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx
function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

//http://matthom.com/archive/2007/05/03/removing-all-child-nodes-from-an-element
function removeAllChildren(cell) {
	if ( cell.hasChildNodes() ) {
	    while ( cell.childNodes.length >= 1 ) {
	        cell.removeChild( cell.firstChild );       
	    } 
	}
}

function initCalc() {
	gWork = "работу";
	gPhys = "физиологические потребности";
	gPers = "личные дела";
	gWaste = "убийство времени с отягощающими обстоятельствами"
	expenditures = {
		sleep: { name: "Сон", defWd: 8, defSs: 8, normWd: 8, normSs: 8, group: gPhys },
		commute: { name: "Транспорт\n(на работу и обратно)", defWd: 1, group: gWork },
		job: { name: "Работа", defWd: 8, group: gWork },
		eat: { name: "Еда", defWd: 2.5, defSs: 2.5, group: gPhys, comment: "Рекомендуемый минимум - 2,5 часа в день" },
		dress: { name: "Уход за собой", defWd: 1, defSs: 1, comment: "Рекомендуемый минимум для женщин - 1,5 час в день, для мужчин - 0,5 часа в день", group: gPhys },
		workComm: { name: "Общение по рабочим вопросам в нерабочее время, в том числе корпоративные праздники, полезные встречи", group: gWork },
		workRead: { name: "Чтение профессиональной литературы (журналы, газеты, книги, учебная литература)", group: gWork },
		sport: { name: "Спорт", group: gPers },
		sex: { name: '"Отдых" от работы - алкоголь', group: gWaste},
		tv: { name: "Просмотр телевизора, серфинг по интернету", group: gWaste},
		friendsComm: { name: "Общение с близкими, друзьями", group: gPers },
		hobby: { name: "Хобби", group: gPers },
		entertainment: { name: "Прочие развлечения (без учета просмотра телевизора, серфинга по интернету, полезных встреч и пьянок)", group: gPers },
		shopping: { name: "Шоппинг", group: gPers },
		trainingWork: { name: "Образование, связанное с работой (курсы иностранных языков, курсы повышения квалификации)", group: gWork },
		trainingOther: { name: "Образование, не связанное с работой", group: gPers }
	}

	createTable(expenditures, document.getElementById("calcInput"));
}
