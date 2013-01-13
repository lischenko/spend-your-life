gWork = "Work";
gPhys = "Animal Needs";
gPers = "Personal Affairs";
gWaste = "Time Killing"

i18n = {
	headingExpenditures: "Hours you spend",
	activity: "Activity",
	workDays: "On workdays",
	weekEnds: "On weekends",
	buttonCount: "Calculate",
	resultsHeading: "A year of your life",
	diagramFreeTime: "Spare time",
	diagramLackTime: "Lack of time",
	remainingFree: "You have {0} ({1}%) of spare time.",
	remainingLack: "You lack {0} days a year.",
	none: "-",
	years: 'y',
	months: 'm',
	days: 'd',

	expenditures: {
		job: { name: "Job", defWd: 8, group: gWork },
		commute: { name: "Commute\n(back and forth)", defWd: 1, group: gWork },
		workRead: { name: "Reading professional literature", group: gWork },
		trainingWork: { name: "Job-related education", group: gWork },
		workComm: { name: "Job-related communication outside of business hours", group: gWork },

		sleep: { name: "Sleeping", defWd: 8, defSs: 8, normWd: 8, normSs: 8, group: gPhys },
		eat: { name: "Eating", defWd: 2.5, defSs: 2.5, group: gPhys, comment: "Medics recommend at least 2.5 hours a day" },
		dress: { name: "Personal hygiene and care", defWd: 1, defSs: 1, group: gPhys, comment: "Psychologists recommended at least 1 hour a day" },
	
		tv: { name: "TV, Internet surfing", group: gWaste},
		alcohol: { name: "Buzz (parties etc)", group: gWaste},

		sport: { name: "Sport", group: gPers },
		familyComm: { name: "Time spent with family", group: gPers },
		friendsComm: { name: "Time spent with friends", group: gPers },
		reading: { name: "Reading", group: gPers },
		hobby: { name: "Hobby", group: gPers },		
		shopping: { name: "Shopping", group: gPers },
		entertainment: { name: "Misc entertainment", group: gPers },
		trainingOther: { name: "Self-eductation (unrelated to job)", group: gPers }
	}
}