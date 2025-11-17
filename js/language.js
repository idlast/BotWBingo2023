function getBingoBoard(bingoList, size, options = { seed: "", mode: "normal", lang: "name" }) {

	var LANG = options.lang;
	var SEED = options.seed;
	var MODE = options.mode;

	function mirror(i) {
		if (i == 0) { i = 4; }
		else if (i == 1) { i = 3; }
		else if (i == 3) { i = 1; }
		else if (i == 4) { i = 0; }
		return i;
	}

	var noTypeCount = 0;

	var lineCheckList = [];

	if (size == 5) {
		lineCheckList[1] = [1, 2, 3, 4, 5, 10, 15, 20, 6, 12, 18, 24];
		lineCheckList[2] = [0, 2, 3, 4, 6, 11, 16, 21];
		lineCheckList[3] = [0, 1, 3, 4, 7, 12, 17, 22];
		lineCheckList[4] = [0, 1, 2, 4, 8, 13, 18, 23];
		lineCheckList[5] = [0, 1, 2, 3, 8, 12, 16, 20, 9, 14, 19, 24];

		lineCheckList[6] = [0, 10, 15, 20, 6, 7, 8, 9];
		lineCheckList[7] = [0, 12, 18, 24, 5, 7, 8, 9, 1, 11, 16, 21];
		lineCheckList[8] = [5, 6, 8, 9, 2, 12, 17, 22];
		lineCheckList[9] = [4, 12, 16, 20, 9, 7, 6, 5, 3, 13, 18, 23];
		lineCheckList[10] = [4, 14, 19, 24, 8, 7, 6, 5];

		lineCheckList[11] = [0, 5, 15, 20, 11, 12, 13, 14];
		lineCheckList[12] = [1, 6, 16, 21, 10, 12, 13, 14];
		lineCheckList[13] = [0, 6, 12, 18, 24, 20, 16, 8, 4, 2, 7, 17, 22, 10, 11, 13, 14];
		lineCheckList[14] = [3, 8, 18, 23, 10, 11, 12, 14];
		lineCheckList[15] = [4, 9, 19, 24, 10, 11, 12, 13];

		lineCheckList[16] = [0, 5, 10, 20, 16, 17, 18, 19];
		lineCheckList[17] = [15, 17, 18, 19, 1, 6, 11, 21, 20, 12, 8, 4];
		lineCheckList[18] = [15, 16, 18, 19, 2, 7, 12, 22];
		lineCheckList[19] = [15, 16, 17, 19, 23, 13, 8, 3, 24, 12, 6, 0];
		lineCheckList[20] = [4, 9, 14, 24, 15, 16, 17, 18];

		lineCheckList[21] = [0, 5, 10, 15, 16, 12, 8, 4, 21, 22, 23, 24];
		lineCheckList[22] = [20, 22, 23, 24, 1, 6, 11, 16];
		lineCheckList[23] = [2, 7, 12, 17, 20, 21, 23, 24];
		lineCheckList[24] = [20, 21, 22, 24, 3, 8, 13, 18];
		lineCheckList[25] = [0, 6, 12, 18, 20, 21, 22, 23, 19, 14, 9, 4];
	}

	function getModeWeightBounds(mode) {
		var modeKey = mode || "normal";
		if (typeof BingoConfig !== 'undefined' && BingoConfig.modeWeightBounds[modeKey]) {
			return BingoConfig.modeWeightBounds[modeKey];
		}
		return { min: 2, max: 80 };
	}

	function difficulty(i) {
		// To create the magic square we need 2 random orderings of the numbers 0, 1, 2, 3, 4.
		// The following creates those orderings and calls them Table5 and Table1

		var Num3 = SEED % 1000;	// Table5 will use the ones, tens, and hundreds digits.

		var Rem8 = Num3 % 8;
		var Rem4 = Math.floor(Rem8 / 2);
		var Rem2 = Rem8 % 2;
		var Rem5 = Num3 % 5;
		var Rem3 = Num3 % 3;	// Note that Rem2, Rem3, Rem4, and Rem5 are mathematically independent.
		var RemT = Math.floor(Num3 / 120);	// This is between 0 and 8

		// The idea is to begin with an array containing a single number, 0.
		// Each number 1 through 4 is added in a random spot in the array's current size.
		// The result - the numbers 0 to 4 are in the array in a random (and uniform) order.
		var Table5 = [0];
		Table5.splice(Rem2, 0, 1);
		Table5.splice(Rem3, 0, 2);
		Table5.splice(Rem4, 0, 3);
		Table5.splice(Rem5, 0, 4);

		Num3 = Math.floor(SEED / 1000);	// Table1 will use the next 3 digits.
		Num3 = Num3 % 1000;

		Rem8 = Num3 % 8;
		Rem4 = Math.floor(Rem8 / 2);
		Rem2 = Rem8 % 2;
		Rem5 = Num3 % 5;
		Rem3 = Num3 % 3;
		RemT = RemT * 8 + Math.floor(Num3 / 120);	 // This is between 0 and 64.

		var Table1 = [0];
		Table1.splice(Rem2, 0, 1);
		Table1.splice(Rem3, 0, 2);
		Table1.splice(Rem4, 0, 3);
		Table1.splice(Rem5, 0, 4);

		i--;
		RemT = RemT % 5;		//  Between 0 and 4, fairly uniformly.
		x = (i + RemT) % 5;		//  RemT is horizontal shift to put any diagonal on the main diagonal.
		y = Math.floor(i / 5);

		// The Tables are set into a single magic square template
		// Some are the same up to some rotation, reflection, or row permutation.
		// However, all genuinely different magic squares can arise in this fashion.
		var e5 = Table5[(x + 3 * y) % 5];
		var e1 = Table1[(3 * x + y) % 5];

		// Table5 controls the 5* part and Table1 controls the 1* part.
		var baseValue = 5 * e5 + e1; // 0-24
		var bounds = getModeWeightBounds(MODE);
		var normalized = baseValue / 24; // 0-1 range
		var weight = bounds.min + normalized * (bounds.max - bounds.min);
		return weight;
	}

	function checkLine(i, typesA) {
		var synergy = 0;
		if (typeof typesA != 'undefined') {
			for (var j = 0; j < lineCheckList[i].length; j++) {
				var typesB = bingoBoard[lineCheckList[i][j] + 1].types;
				if (typeof typesB != 'undefined') {
					for (var k = 0; k < typesA.length; k++) {
						for (var l = 0; l < typesB.length; l++) {
							if (typesA[k] == typesB[l]) {
								synergy++; // if match increase
								if (k == 0) { synergy++; } // if main type increase
								if (l == 0) { synergy++; } // if main type increase
							}
						}
					}
				}
			}
		}
		return synergy;
	}

	var bingoBoard = []; //the board itself stored as an array first
	for (var i = 1; i <= 25; i++) {
		bingoBoard[i] = { difficulty: difficulty(i) }; //array with objects that
		//console.log(bingoBoard[i].difficulty);       //store the difficulty
	}                                          // in order 1-25

	var usedNames = new Set();
	var BASE_TOLERANCE = 5;
	var MAX_POOL_ATTEMPTS = 5;

	function buildGoalPool(targetWeight) {
		var attempt = 1;
		var pool = [];
		while (pool.length === 0 && attempt <= MAX_POOL_ATTEMPTS) {
			var tolerance = BASE_TOLERANCE * attempt;
			pool = bingoList.filter(goal => Math.abs(goal.difficulty - targetWeight) <= tolerance);
			attempt++;
		}
		if (pool.length === 0) {
			pool = bingoList.slice();
		}
		return pool;
	}

	function pickGoalFromPool(pool, boardIndex, allowUsed) {
		var RNG = Math.floor(pool.length * Math.random());
		var j = 0, synergy = 0, currentObj = null, minSynObj = null;
		do {
			currentObj = pool[(j + RNG) % pool.length];
			if (!allowUsed && usedNames.has(currentObj.name)) {
				j++;
				continue;
			}
			synergy = checkLine(boardIndex, currentObj.types);
			if (minSynObj == null || synergy < minSynObj.synergy) {
				minSynObj = { synergy: synergy, value: currentObj };
			}
			j++;
		} while ((minSynObj == null || (synergy != 0)) && (j < pool.length));
		return minSynObj;
	}

	//populate the bingo board in the array
	for (i = 1; i <= 25; i++) {
		var targetWeight = bingoBoard[i].difficulty;
		var goalPool = buildGoalPool(targetWeight);
		var minSynObj = pickGoalFromPool(goalPool, i, false);
		if (minSynObj == null) {
			minSynObj = pickGoalFromPool(goalPool, i, true);
		}
		if (minSynObj == null) {
			minSynObj = { synergy: 0, value: goalPool[0] };
		}

		var chosenGoal = minSynObj.value;
		usedNames.add(chosenGoal.name);
		bingoBoard[i].types = chosenGoal.types;
		bingoBoard[i].name = chosenGoal[LANG] || chosenGoal.name;
		bingoBoard[i].synergy = minSynObj.synergy;
		bingoBoard[i].difficulty = chosenGoal.difficulty;
	}

	return bingoBoard;
}

var bingo = function (bingoList, size) {

	function gup(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if (results == null)
			return "";
		return results[1];
	}
	var LANG = gup('lang') || 'name';
	var SEED = gup("seed");
	var MODE = gup("mode");
	var EXPLORATION = gup("exploration");

	if (SEED == "") return reseedPage(MODE);

	var cardtype = "string";

	if (MODE == "long") { cardtype = "Long"; }
	if (MODE == "short") { cardtype = "Short"; }
	else if (MODE == "veryshort") { cardtype = "VeryShort"; }
	else { cardtype = "Normal"; }

	if (typeof size == 'undefined') size = 5;

	Math.seedrandom(SEED); //sets up the RNG
	var MAX_SEED = 999999; //1 million cards

	var qSeed = "?seed=" + SEED;
	var qMode = (MODE == "short" || MODE == "veryshort" || MODE == "long") ? "&mode=" + MODE : "";
	var qEx = EXPLORATION ? '&exploration=1' : '';
	var results = $("#results");
	actualqMode = qMode
	if (qMode == "&mode=veryshort") {
		actualqMode = "short"
	} else if (qMode == "&mode=short") {
		actualqMode = "&mode=short"
	} else if (qMode == "&mode=long") {
		actualqMode = "&mode=long"
	} else {
		actualqMode = ""
	}
	results.append('<a href="' + qSeed + actualqMode + qEx + '"><img src="./img/jpn.png" alt="Japanese"></a>&emsp;<a href="' + qSeed + actualqMode + qEx + '&lang=en"><img src="./img/usa.png" alt="English"></a><p>SRB EX: <strong>v1</strong>&emsp;Seed: <strong>' +
		SEED + "</strong>&emsp;Card type: <strong>" + cardtype + "</strong></p>")

	if (!EXPLORATION) {
		$('.popout').click(function () {
			var mode = null;
			var line = $(this).attr('id');
			var name = $(this).html();
			var items = [];
			var cells = $('#bingo .' + line);
			for (var i = 0; i < 5; i++) {
				items.push(encodeURIComponent($(cells[i]).html()));
			}
			console.log("items:" + items)
			window.open('./bingo-popout.shtml#' + name + '=' + items.join(';;;'), "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=220, height=460");
			window.open('./counter.shtml#' + name + '=' + items.join(';;;'), "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=600, height=180");
		}
		);
	}

	$("#selected td").toggle(
		function () { $(this).addClass("greensquare"); },
		function () { $(this).addClass("redsquare").removeClass("greensquare"); },
		function () { $(this).addClass("bluesquare").removeClass("redsquare"); },
		function () { $(this).addClass("yellowsquare").removeClass("bluesquare"); },
		function () { $(this).removeClass("yellowsquare"); }
	);

	$("#bingo tr").on('click', 'td:not(.popout):not(.hidden)',
		function () {
			if ($(this).hasClass('greensquare')) {
				$(this).addClass('redsquare').removeClass('greensquare');
			} else if ($(this).hasClass('redsquare')) {
				$(this).addClass('bluesquare').removeClass('redsquare');
			} else if ($(this).hasClass('bluesquare')) {
				$(this).addClass('yellowsquare').removeClass('bluesquare');
			} else if ($(this).hasClass('yellowsquare')) {
				$(this).removeClass('yellowsquare')
			} else {
				$(this).addClass('greensquare');
				var slot = parseInt($(this).attr('id').slice(4));
				// maybe unhide more goals
				// dividable by 5? nothing to the right
				if (slot % 5 != 0) {
					$('#slot' + (slot + 1)).removeClass('hidden');
				}
				// nothing to the left
				if (slot % 5 != 1) {
					$('#slot' + (slot - 1)).removeClass('hidden');
				}
				// top down doesn't matter
				$('#slot' + (slot + 5)).removeClass('hidden');
				$('#slot' + (slot - 5)).removeClass('hidden');
			}
		}
	);

	$("#row1").hover(function () { $(".row1").addClass("hover"); }, function () { $(".row1").removeClass("hover"); });
	$("#row2").hover(function () { $(".row2").addClass("hover"); }, function () { $(".row2").removeClass("hover"); });
	$("#row3").hover(function () { $(".row3").addClass("hover"); }, function () { $(".row3").removeClass("hover"); });
	$("#row4").hover(function () { $(".row4").addClass("hover"); }, function () { $(".row4").removeClass("hover"); });
	$("#row5").hover(function () { $(".row5").addClass("hover"); }, function () { $(".row5").removeClass("hover"); });

	$("#col1").hover(function () { $(".col1").addClass("hover"); }, function () { $(".col1").removeClass("hover"); });
	$("#col2").hover(function () { $(".col2").addClass("hover"); }, function () { $(".col2").removeClass("hover"); });
	$("#col3").hover(function () { $(".col3").addClass("hover"); }, function () { $(".col3").removeClass("hover"); });
	$("#col4").hover(function () { $(".col4").addClass("hover"); }, function () { $(".col4").removeClass("hover"); });
	$("#col5").hover(function () { $(".col5").addClass("hover"); }, function () { $(".col5").removeClass("hover"); });

	$("#tlbr").hover(function () { $(".tlbr").addClass("hover"); }, function () { $(".tlbr").removeClass("hover"); });
	$("#bltr").hover(function () { $(".bltr").addClass("hover"); }, function () { $(".bltr").removeClass("hover"); });

	var bingoBoard = getBingoBoard(bingoList, size, { seed: SEED, mode: MODE, lang: LANG });

	//populate the actual table on the page
	for (i = 1; i <= 25; i++) {
		$('#slot' + i).append(bingoBoard[i].name);
		if (EXPLORATION && i != 7 && i != 19) {
			$('#slot' + i).addClass('hidden');
		}
		//$('#slot'+i).append("<br/>" + bingoBoard[i].types.toString());
		//$('#slot'+i).append("<br/>" + bingoBoard[i].synergy);
	}

	function renderDebugWeights(show) {
		for (var slot = 1; slot <= 25; slot++) {
			var cell = $('#slot' + slot);
			cell.find('.goal-weight').remove();
			if (show) {
				var field = bingoBoard[slot];
				if (field && typeof field.difficulty !== 'undefined') {
					var formatted = Math.round(field.difficulty * 10) / 10;
					cell.append('<div class="goal-weight">' + formatted + '</div>');
				}
			}
		}
	}

	var debugToggle = $('#debug-toggle');
	if (debugToggle.length) {
		renderDebugWeights(debugToggle.is(':checked'));
		debugToggle.on('change', function () {
			renderDebugWeights(this.checked);
		});
	}

	if (EXPLORATION) {
		$('#bingosync-goals').text("goals are hidden for Exploration bingo");
	} else {
		// populate the bingosync-goals
		// useful to use a test board for bingosync
		var bingosync_goals = JSON.stringify(bingoBoard.filter(field => field != null).map(field => ({ "name": field.name })));
		$('#bingosync-goals').text(bingosync_goals);
	}

	return bingoBoard;
}; // setup

function reseedPage(mode) {
	actualMode = mode
	if (mode == "veryshort") {
		actualMode = "short"
	} else if (mode == "short") {
		actualMode = "normal"
	} else {
		actualMode = "long"
	}
	var qSeed = "?seed=" + Math.ceil(999999 * Math.random());
	var qMode = (actualMode == "short" || actualMode == "long") ? "&mode=" + actualMode : "";
	var qEx = $('#exploration-check').is(':checked') ? '&exploration=1' : '';
	window.location = qSeed + qMode + qEx;
	return false;
}

// Backwards Compatability
var srl = { bingo: bingo };