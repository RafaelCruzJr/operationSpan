function runSpan() {
	var	tfList = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], // list of true and false for 42 trials
		spanSize = [3,4,5,6,7,8,9], // possible span sizes
		timePrompt = Number(opener.document.getElementById("arithAVG").value), // grab RT mean
		SD = Number(opener.document.getElementById("arithSD").value), // grab RT SD
		trialN = 0, // initialize trial number
		setN = 0, // initialize set number
		accuracy = 0, // initialize subject accuracy
		setStor = [], // store the order in which sets were displayed
		allTrials = [], // complete set of trials
		answers = [], // correct answers for each set
		responses = [], // participant inputs
		timerID, // eventTimer ID
		attend = document.getElementById("attend"), // grab prompt element
		opDiv = document.getElementById("opDiv"), // grab answer screen element
		button = document.getElementById("opButton"), // grab button element for submitting answers

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

	function randomWholeNumber(min, max) { // random number from min to max
	    min = Math.ceil(min);
    	max = Math.floor(max);
    	return Math.floor(Math.random() * (max - min + 1)) + min;	
	}

	function isWholeNumber(value) {
	  if (value % 1 === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}

	function isPositiveNumber(value) {
	  if (value >= 0) {
	    return true;
	  } else {
	    return false;
	  }
	}

	function mathKeys(event) {
		switch (event.key) {
			case 'a':
				document.removeEventListener('keydown',mathKeys);
				if (allTrials[setN][trialN][2] == 1) {
					accuracy++;
				}
				removeAttend();
				eventTimer.cancelRequest(timerID);				
				eventTimer.setTimeout(endTrial,200);
				break;
			case 'l':
				document.removeEventListener('keydown',mathKeys);
				if (allTrials[setN][trialN][2] == 0) {
					accuracy++;
				}
				removeAttend();
				eventTimer.cancelRequest(timerID);				
				eventTimer.setTimeout(endTrial,200);
				break;
			default:
				break;					
		}
	}

	function prepareOneSpan(n) {
		var symbols = ['+','-'], // addition or subtraction
		solution, // solution to equation
		numberA, // number to be added or subtracted
		numberB, // number ... to incorrect solution
		symbolA, // addition or substraction
		symbolB, // ... for incorrect solution
		tfValue, // true false value of single trial
		equation, // complete math equation
		letterValue, // letter to be prompted
		firstHalf, // first half of equation
		trialList = [], // trial list for 1 set
		alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
		equationList = ['1/1','2/1','2/2','3/1','3/3','4/1','4/2','4/4','5/1','5/5','6/1','6/2','6/3','6/6','7/1','7/7','8/1','8/2','8/4','8/8','9/1','9/3','9/9',
		'1*2','1*3','2*2','1*4','1*5','3*2','2*3','1*6','1*7','4*2','2*4','1*8','3*3','1*9','5*2','2*5','6*2','4*3','3*4','2*6','7*2','2*7','5*3','3*5','8*2'];		
		for (i = 0; i < n; i++) {
			firstHalf = equationList[Math.floor(Math.random() * equationList.length)]; // grab first half of equation from equationList
			symbolA = symbols[Math.floor(Math.random() * symbols.length)]; // addition or subtraction
			numberA= randomWholeNumber(1,9);
			while (!isPositiveNumber(Function('return('+ firstHalf + symbolA + numberA + ');')())) { // keep trying until equation is positive
				numberA = randomWholeNumber(1,9);
			}
			solution = Function('return('+ firstHalf + symbolA + numberA + ');')(); // save solution
			tfValue = tfList[Math.floor(Math.random() * tfList.length)]; // grab truth value from possible
			tfList.splice(tfList.indexOf(tfValue),1); // remove it from list
			if (tfValue == 1) { // if equation is supposed to be correct, save it as such
				firstHalf = firstHalf.replace('*',' x ');
				firstHalf = firstHalf.replace('/',' / ');				
				equation = firstHalf + ' ' + symbolA + ' ' + numberA + ' ' + '=' + ' ' + solution;
			} else { // if not, =/- 3 solution to make equation incorrect
				symbolB = symbols[Math.floor(Math.random() * symbols.length)];
				numberB = randomWholeNumber(1,3);
				while (!isPositiveNumber(Function('return('+ solution + symbolB + numberB + ');')())) { // keep trying until solution is positive
					symbolB = symbols[Math.floor(Math.random() * symbols.length)];
					numberB = randomWholeNumber(1,3);
				}
				solution = Function('return('+ solution + symbolB + numberB + ');')();
				firstHalf = firstHalf.replace('*',' x ');
				firstHalf = firstHalf.replace('/',' / ');
				equation = firstHalf + ' ' + symbolA + ' ' + numberA + ' ' + '=' + ' ' + solution;													
			}
			letterValue = alphabet[Math.floor(Math.random() * alphabet.length)]; // random letter
			alphabet.splice(alphabet.indexOf(letterValue),1); // remove letter from alphabet
			trialList.push([letterValue,equation,tfValue]); // push 1 trial
		}		
		return trialList;
	}

	function prepareAllSpans() { // prepare entire set of trials
		shuffle(spanSize);
		setStor.push(spanSize.slice()); // store set order
		for (let n of spanSize) { // iterate through sets to make entire list of trials
			temp = prepareOneSpan(n);
			allTrials.push(temp);
		}
	}

	// function to run 1 entire set of operation span
	function runSeq() {
		displayAttend(allTrials[setN][trialN][0]); // display letter
		answers.push(allTrials[setN][trialN][0]); // store as correct answer
		eventTimer.setTimeout(removeAttend,2000); // remove it
		eventTimer.setTimeout(function() {displayAttend(allTrials[setN][trialN][1]); document.addEventListener('keydown',mathKeys);},3000); // display equation and listen for response
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
		if (typeof allTrials[setN][trialN] === 'undefined') {
			trialN = 0;
			answerScreen();
		} else {
			runSeq();
		}
	}

	// function to create the screen to allow pariticpants to input in which order they saw letters
	function answerScreen() {
		var options = answers.slice(), // shuffle options
			alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
			labels = ['lab1','lab2','lab3','lab4','lab5','lab6','lab7','lab8','lab9','lab10','lab11','lab12']; // used to iterate through label elements		
		for (i = 0; i < options.length; i++) { // iterate through letters
			alphabet.splice(alphabet.indexOf(options[i]),1); // remove the correct answers from letters
		}
		for (i = 0; i < 12-answers.length; i++) { // iterate through letters for the remaining number of options
			idxA = Math.floor(Math.random() * alphabet.length); // index randomly into letters
			alpha = alphabet[idxA]; // grab letter
			alphabet.splice(idxA,1); // remove it from list of letters
			options.push(alpha); // put it into options
		}
		shuffle(options);
		for (i = 0; i < 12; i++) { // iterate through options
			document.getElementById(labels[i]).innerHTML = options[i]; // place them in HTML
		}
		opDiv.style.display = 'block'; // display HTML of screen
	}

	// function for submit button for answer screen
	button.onclick = function() {
		var inputs = ['let1','let2','let3','let4','let5','let6','let7','let8','let9','let10','let11','let12'], // used to iterate through input elements
			labels = ['lab1','lab2','lab3','lab4','lab5','lab6','lab7','lab8','lab9','lab10','lab11','lab12'];	
		for (i = 0; i < answers.length; i++) { // for each answer...
			for (j = 0; j < 12; j++) { // iterate through options on screen
				if (answers[i] == document.getElementById(labels[j]).innerHTML) { // if option equals answer...
					if (document.getElementById(inputs[j]).value == i+1) { // ...and if correct position is given
						responses.push(1); // then store correct answer
					} else { // else...
						responses.push(0); // store incorrect answer
					}
				}
			}
		}
		for (i = 0; i < 12; i++) { // iterate through HTML elements
			document.getElementById(inputs[i]).value = ''; // blank them
		}
		answers = []; // reset answer store
		opDiv.style.display = 'none'; // remove answer screen
		setN++; // increment block number
		if (typeof allTrials[setN] !== 'undefined') { // if there are still more trials
		 	eventTimer.setTimeout(runSeq,1000); // go to next trial
		} else if (setN < 14) { // else if we've only done 1 span
			displayAttend(`You've reached the half. Your current accuracy is ${(accuracy/42 * 100).toFixed(2)}%. Press spacebar to continue.`);
			tfList = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0];
			document.addEventListener('keydown',nextBlock);
		} else { // else experiment is over
			window.close()
			opener.document.getElementById("menuInstructions").innerHTML = "You have completed the task. Please press 'submit' to submit your data.";
			opener.document.getElementById("opButton").style.display = "none";
			opener.document.getElementById("formButton").style.display = "block";
			opener.document.getElementById("accuracy").value = accuracy;
			opener.document.getElementById("setStor").value = setStor;
			opener.document.getElementById("responses").value = responses;
		}
	}

	function nextBlock(keys) { // eventListener to allow for 2nd block
		if (event.key == ' ') {
			document.removeEventListener('keydown',nextBlock);
			prepareAllSpans();
			runSeq();
		}
	}

	eventTimer.setMultipleTO([ // show a countdown, then start experiment
		[function() {displayAttend('3'); prepareAllSpans();}, 100], 
		[function() {displayAttend('2');}, 1100],
		[function() {displayAttend('1');}, 2100],
		[removeAttend, 3100],
		[runSeq, 3400]
	])
}