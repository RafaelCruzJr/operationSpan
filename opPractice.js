function runPractice() {
	var allTrials = [['D','6 / 2 + 5 = 9',0],['K','5 x 3 - 2 = 13',1],['I','4 x 2 + 6 = 18',1],['P','8 / 2 - 3 = 1',1],['H','9 x 2 - 3 = 4',0]], // full set of practice trials
		timePrompt = Number(opener.document.getElementById("arithAVG").value), // grab average from arithmetic
		SD = Number(opener.document.getElementById("arithSD").value),// grab SD from arithmetic
		cbAnswer = Number(opener.document.getElementById('cbAnswer').value),
	    	timerID, // initialize eventTimer ID
		trialN = 0, // initialize trial number
		labels = ['lab1','lab2','lab3','lab4','lab5','lab6','lab7','lab8','lab9','lab10','lab11','lab12'], // labels associated with response screen
		inputs = ['let1','let2','let3','let4','let5','let6','let7','let8','let9','let10','let11','let12'], // actual inputs
		attend = document.getElementById("attend"), // grab element for showing prompts
		opDiv = document.getElementById("opDiv"), // grab element for response screen
		opButton = document.getElementById("opButton"); // grab element for span task button
		pracButton = document.getElementById("pracButton"); // grab element for practice button

	document.getElementById("holder").style.display = 'none'; // remove instructions

	if (document.documentElement.requestFullscreen) {
		document.documentElement.requestFullscreen();
	} else if (document.documentElement.webkitRequestFullscreen) {
		document.documentElement.webkitRequestFullscreen();
	} else if (document.documentElement.msRequestFullscreen) {
		document.documentElement.msRequestFullscreen();
	} // for setting it full screen depending on web browser

	function displayAttend(newText = '*****') {
		attend.innerHTML = newText;
		attend.style.display = 'block';
	} // make displaying attention simple

	function removeAttend() {
		attend.style.display = 'none';
	} // make removing attention simple

	function mathKeys(event) {
		if (cbAnswer == 1) {
			switch (event.key) {
				case 'a':
					document.removeEventListener('keydown',mathKeys); // remove eventListener
					removeAttend();
					eventTimer.cancelRequest(timerID); // stop "slow" from showing
					eventTimer.setTimeout(endTrial,200); // end current trial
					break;
				case 'l':
					document.removeEventListener('keydown',mathKeys);
					removeAttend();
					eventTimer.cancelRequest(timerID);				
					eventTimer.setTimeout(endTrial,200);
					break;
				default:
					break;					
			}
		} else {
			switch (event.key) {
				case 'l':
					document.removeEventListener('keydown',mathKeys); // remove eventListener
					removeAttend();
					eventTimer.cancelRequest(timerID); // stop "slow" from showing
					eventTimer.setTimeout(endTrial,200); // end current trial
					break;
				case 'a':
					document.removeEventListener('keydown',mathKeys);
					removeAttend();
					eventTimer.cancelRequest(timerID);				
					eventTimer.setTimeout(endTrial,200);
					break;
				default:
					break;					
			}
		}
	}

	// function to run 1 entire trial of operation span
	function runSeq() {
		displayAttend(allTrials[trialN][0]); // display letter
		eventTimer.setTimeout(removeAttend,2000); // remove it
		eventTimer.setTimeout(function() {displayAttend(allTrials[trialN][1]); document.addEventListener('keydown',mathKeys);},3000); // display equation and listen for response
		timerID = eventTimer.setTimeout(slow, 3000 + timePrompt + SD); // prepare "slow" function if too slow
	}

	function slow() { // show "too slow" if no response
		document.removeEventListener('keydown',mathKeys);
		displayAttend('Too Slow');
		eventTimer.setTimeout(endTrial, 200)
	}

	function endTrial() { // either go to next trial or show answer screen
		removeAttend();
		trialN++;
		if (trialN == 5) {
			answerScreen();
		} else {
			runSeq();
		}
	}

	// function to create the screen to allow pariticpants to input in which order they saw letters
	function answerScreen() {
		var options = ['D','K','I','P','H'], // shuffle options
			letCopy = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']; // copy of the alphabet
		for (i = 0; i < options.length; i++) { // iterate through letters
			letCopy.splice(letCopy.indexOf(options[i]),1); // remove the correct answers from letters
		}
		for (i = 0; i < 7; i++) { // iterate through letters for the remaining number of options
			idxA = Math.floor(Math.random() * letCopy.length); // index randomly into letters
			alpha = letCopy[idxA]; // grab letter
			letCopy.splice(idxA,1); // remove it from list of letters
			options.push(alpha); // put it into options
		}
		shuffle(options);
		for (i = 0; i < 12; i++) { // iterate through options
			document.getElementById(labels[i]).innerHTML = options[i]; // place them in HTML
		}
		opDiv.style.display = 'block'; // display HTML of screen
	}

	// function for submit button for answer screen
	pracButton.onclick = function() {
		for (i = 0; i < 12; i++) { // iterate through HTML elements
			document.getElementById(inputs[i]).value = ''; // blank them
		}
		opDiv.style.display = 'none'; // remove answer screen
		pracButton.style.display = 'none';
		opButton.style.display = 'block';
		document.getElementById("holder").style.display = 'block';
		document.getElementById("next").style.display = 'block';
		document.getElementById("previous").style.display = 'none';
		document.getElementById("prac").style.display = 'none';

	}

	eventTimer.setMultipleTO([ // show a countdown, then start practice
		[function() {displayAttend('3');}, 100], 
		[function() {displayAttend('2');}, 1100],
		[function() {displayAttend('1');}, 2100],
		[removeAttend, 3100],
		[runSeq, 3400]
	])	
}
