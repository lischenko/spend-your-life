function validateNumber(elem, event) {
	var isNumber = /^\d*\.{0,1}\d+$/.test(elem.value);
	elem.className = isNumber || elem.value=="" ? null : "err";
	revalidate();
}

function revalidate() {	
	var totalErrors = 0;
	applyToAllFields( function(elem) { 
		if (elem.className == 'err') {++totalErrors;}
	});
	
	document.getElementById("button").disabled = totalErrors>0;	
}

 function initTable(sectionName) {
	var array = eval(sectionName);
	var parent = document.getElementById("table_"+sectionName);	
	for (d in array) {
		var newRow = document.createElement("tr");
		
		var newDescCell = document.createElement("td");
		newRow.appendChild(newDescCell);
		newDescCell.innerText = array[d].name;
		
		var newFieldCell = document.createElement("td");
		newRow.appendChild(newFieldCell);
		
		var newInput = document.createElement("input");
		newInput.type = 'text';
		newInput.id = sectionName+"_"+d;
		newInput.value = array[d].hasOwnProperty('def') ? array[d].def : "";

		newInput.setAttribute("onBlur", "return validateNumber(this, event)");

		newFieldCell.appendChild(newInput);
		
		if (array[d].hasOwnProperty('comment')) {
			var newComment = document.createElement("span");
			newComment.className = 'comment';
			newComment.innerText = array[d].comment;
			newFieldCell.appendChild(newComment);
		}

		parent.appendChild(newRow);
	}
 }

 function calc() {
	var total = 
		365*sumUp("daily") + 52*sumUp("weekly") + 
		12*sumUp("monthly") + sumUp("yearly");
	alert( "Всего часов: " + total );
	
 }

 function sumUp(sectionName) {
	var sum = 0;
	applyToAllSectionFields( sectionName, function(elem) { 
		var v = elem.value;
		if (v=="") { v = 0; }
		sum += parseFloat(v);
	});
	return sum;
 }


var daily = {
	sleep: { name: "Сон", def: 8, comment: "Рекомендуемый минимум 8 часов" },
	commute: { name: "Транспорт (дорога на работу и с работы)"},
	work: { name: "Работа"},
	eat: { name: "Еда", def: 2.5, comment: "Рекомендуемый минимум - 2,5 часа в день" },
	dress: { name: "Уход за собой", def: 1, comment: "Рекомендуемый минимум для женщин - 1,5 час в день, для мужчин - 0,5 часа в день" },
	workComm: { name: "Общение, устное и письменное, по рабочим и околорабочим вопросам в нерабочее время, в том числе поддержание социальных связей (корпоративные праздники, полезные встречи)"},
	workRead: { name: "Чтение профессиональной литературы (журналы, газеты, книги, учебная литература)"},
	sport: { name: "Спорт"},
	sex: { name: "Секс"},
	tv: { name: "Просмотр телевизора, бессмысленный серфинг по интернету"},
	friendsComm: { name: "Общение с близкими, друзьями"},
	hobby: { name: "Хобби"},
	entertainment: { name: "Прочие развлечения (без учета просмотра телевизора, бессмысленного серфинга по интернету, полезных встреч и необходимых пьянок)"},
	shopping: { name: "Покупки"},
	trainingWork: { name: "Образование, связанное с наиболее оптимальным выполнением рабочих функций (курсы иностранных языков, курсы повышения квалификации)"},
	trainingOther: { name: "Образование, не связанное с выполнением рабочих функций"},
	other: { name: "Другое" }
}

var weekly = {
	shopping: { name: "Покупки"},
	chores: { name: "Работу по дому"},
	other: { name: "Другое" }
}

var monthly = {
	shopping: { name: "Покупки"},
	other: { name: "Другое" }
}

var yearly = {
	vacation: { name: "Отпуск" /* уточнить по КЗОТУ, может быть, приплюсовать его к работе? */, def: 4*7*24, comment: "рекомендуемый минимум 4 недели" },
	cleanup: { name: "Генеральная уборка"},
	sickness: { name: "Болезни"},
	other: { name: "Другое" }
}

var allSectionNames=["daily", "weekly", "monthly", "yearly"];

function applyToAllSections(f) {
	for(i=0; i<allSectionNames.length; i++) {
		f(allSectionNames[i]);
	}
}

function applyToAllSectionFields(sectionName, f) {
	var array = eval(sectionName);
	for (d in array) {
		var elem = document.getElementById(sectionName+'_'+d);
		f(elem, sectionName);
	}
}

function applyToAllFields(f) {
	applyToAllSections(
		function(sectionName) {
			applyToAllSectionFields(sectionName, f)
		}
	);
}

