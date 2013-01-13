/** Expects DOM to contain a placeholder table (id=calcInput) for input fields, 
 * button (id=calcButton) that calls calculate() function, 
 * div (id=calcResultsDiv) that contains ul (id=calcResults) placeholder for results by group
 * and span (id=calcRemaining) placeholder for remaining time result. */

var expenditures;

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

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

 	var prevGroup;

 	for(e in expenditures) {
 		exp = expenditures[e];

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

		newRow = document.createElement("tr");
		newTable.appendChild(newRow);

		addCell(newRow, function() {
			var newContent = document.createElement("span");
			newContent.innerHTML = exp.name;
			return newContent;			
		})		

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
	resDiv.style.visibility = 'visible';

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
		totalElem.innerHTML = hoursToHumanReadable( hoursAYear ).split(' ').join('&nbsp;');	
	})

	groupHours = new Array();

	applyToAllFieldPairs(expenditures, function(e, wdElem, ssElem) {
		exp = expenditures[e];

		current = groupHours[exp.group]
		if (isNaN(current)) { current = 0 }
		groupHours[exp.group] = current + toHoursAYear( getFloat(wdElem), getFloat(ssElem) )
	})

	for(var i in groupHours) {
		//print out members of the group
		members = document.createElement("ul");
		applyToAllExpenditures( expenditures, function(elemName) {
			elem = expenditures[elemName];
			if (elem.group == i) {
				lItem = document.createElement("li");
				lItem.setAttribute('style', "font-size: 75%")

				setItemText(lItem, elem.name)

				members.appendChild(lItem); 
			}
		})

		groupItem = appendToResults( i + ": " + hoursToHumanReadable(groupHours[i]) )
		groupItem.appendChild(members)

	}

	total = toHoursAYear(sumWd, sumSs);
	busy = (5/7*sumWd + 2/7*sumSs)/24;

	freeHours = (1-busy)*365*24;
	lackHours = (busy-1)*365*24;
	if (busy <= 1) {
		remaining = i18n.remainingFree.format(hoursToHumanReadable(freeHours), parseInt(100*(1-busy)));		
	} else {
		remaining = i18n.remainingLack.format(parseInt(lackHours/24));				
	}
	document.getElementById('calcRemaining').innerHTML = remaining;

	// ----------------------------------
	//
	// Сollect data for charts - XXX: duplicates some of the above code
	//
	// Time consumed by each of the expenditures
	var toRetHoursAYearPerExp = [];
	count = 0;
	applyToAllFieldPairs(expenditures, function(e, wdElem, ssElem) {
		toRetHoursAYearPerExp[count++] = { 
			label: expenditures[e].name, data: toHoursAYear( getFloat(wdElem), getFloat(ssElem) ) };
	})
	if (busy <= 1) {
		toRetHoursAYearPerExp[count++] = { label: i18n.diagramFreeTime, data: freeHours }
	} else {
		toRetHoursAYearPerExp[count++] = { label: i18n.diagramLackTime, data: lackHours }
	}

	// Time consumed by each of the groups
	//
	var toRetHoursAYearPerGroup = [];
	count = 0;
	for(var i in groupHours) {
		toRetHoursAYearPerGroup[count++] = { label: i, data: groupHours[i] }
	}
	if (busy <= 1) {
		toRetHoursAYearPerGroup[count++] = { label: i18n.diagramFreeTime, data: freeHours }
	} else {
		toRetHoursAYearPerGroup[count++] = { label: i18n.diagramLackTime, data: lackHours }
	}

//	return toRetHoursAYearPerExp;
	return toRetHoursAYearPerGroup;
}

function hoursToHumanReadable(h) {
	if (0 == h) {
		return i18n.none;
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
				result += years + i18n.years + ' ';
			}

			result += months + i18n.months + ' ';
		}

		result += days + i18n.days;
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

	return listItem;
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

function chartExpenditures(data) {
	$.plot($("#graphByExp"), data, 
	{
		series: {
			pie: { 
				show: true
			}
		},
		legend: {
			show: false
		}
	});
}

function initCalcGui(topLevelDiv) {
	var table = $("<table>")
	topLevelDiv.append(table)

	var head = $("<thead>")
	table.append( head )

	var r1 = $("<tr>")
	head.append(r1)
	r1.append($("<th>"))
	r1.append($("<th>").attr("colspan", 2).text(i18n.headingExpenditures))

	var r2 = $("<tr>")
	head.append(r2)

	r2.append($("<th>").text(i18n.activity))
	r2.append($("<th>").text(i18n.workDays))
	r2.append($("<th>").text(i18n.weekEnds))

	table.append($("<tbody>").attr("id", "calcInput"))

	topLevelDiv.append(
		$("<button>").attr("id", "calcButton").click(function() {
			results = calculate(); chartExpenditures(results);
		}).text(i18n.buttonCount)
	)

	topLevelDiv.append($("<p>"))
	topLevelDiv.append($("<a>").attr("name", "calcResultsAnchor"))

	var resultsDiv = $("<div>").attr("id", "calcResultsDiv").attr("style", 'visibility:hidden')
	topLevelDiv.append(resultsDiv)

	resultsDiv.append($("<h3>").text(i18n.resultsHeading))

	var list = $("<ul>").attr("id", "calcResults")
	resultsDiv.append(list)
	list.append($("<li>"))

	resultsDiv.append($("<span>").attr("id", "calcRemaining"))

	var graph = $("<div>").attr("id", "graphByExp").attr("style", "width:600px;height:300px")

	resultsDiv.append(graph)

	expenditures = i18n.expenditures
	createTable(expenditures, document.getElementById("calcInput"));
}
