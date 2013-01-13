gWork = "Работа";
gPhys = "Физиологические потребности";
gPers = "Личные дела";
gWaste = "Убийство времени с отягощающими обстоятельствами"

i18n = {
	headingExpenditures: "Затраты времени (часов)",
	activity: "Занятие",
	workDays: "В рабочие дни",
	weekEnds: "На выходных",
	buttonCount: "Посчитать",
	resultsHeading: "На что вы тратите год своей жизни?",

	diagramFreeTime: "Свободное время",
	diagramLackTime: "Не хватает",
	remainingFree: "У вас остаётся {0} ({1}%) на остальное.",
	remainingLack: "Вам не хватает {0} дней в году.",
	none: "-",
	years: 'л',
	months: 'м',
	days: 'д',

	expenditures: {
		job: { name: "Работа", defWd: 8, group: gWork },
		commute: { name: "Транспорт\n(на работу и обратно)", defWd: 1, group: gWork },
		workRead: { name: "Чтение профессиональной литературы", group: gWork },
		trainingWork: { name: "Образование, связанное с работой", group: gWork },
		workComm: { name: "Общение по рабочим вопросам в нерабочее время, в том числе корпоративы, встречи", group: gWork },

		sleep: { name: "Сон", defWd: 8, defSs: 8, normWd: 8, normSs: 8, group: gPhys },
		eat: { name: "Еда", defWd: 2.5, defSs: 2.5, group: gPhys, comment: "Рекомендуемый минимум - 2,5 часа в день" },
		dress: { name: "Уход за собой", defWd: 1, defSs: 1, group: gPhys, comment: "Рекомендуемый минимум для женщин - 1,5 час в день, для мужчин - 0,5 часа в день" },
	
		tv: { name: "Просмотр телевизора, серфинг по интернету", group: gWaste},
		alcohol: { name: "Посиделки с алкоголем", group: gWaste},

		sport: { name: "Спорт", group: gPers },
		friendsComm: { name: "Общение с близкими, друзьями", group: gPers },
		reading: { name: "Чтение", group: gPers },
		hobby: { name: "Хобби", group: gPers },		
		shopping: { name: "Шоппинг", group: gPers },
		entertainment: { name: "Прочие развлечения", group: gPers },
		trainingOther: { name: "Образование, не связанное с работой", group: gPers }
	}
}