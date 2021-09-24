function arithmetic() {
	var	accuracy = 0, // initiliaze participant accuracy
	RTs = [], // set of participant reaction times
	truth = [], // set to store true values of equations
	trialList = [], // set to store math equations
	t0, // time at t0
	t1, // time at t1
	cbAnswer = Number(opener.document.getElementById('cbAnswer').value),
	attend = document.getElementById("attend"); // grab element to show prompts

	document.getElementById("holder").style.display = 'none'; // remove instructions
	document.getElementById("helper").style.display = 'grid'; // show keys on bottom row

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

	function randomWholeNumber(min, max) {
	    min = Math.ceil(min);
    	max = Math.floor(max);
    	return Math.floor(Math.random() * (max - min + 1)) + min;	
	} // find a random whole number between max and min

	function isWholeNumber(value) {
	  if (value % 1 === 0) {
	    return true;
	  } else {
	    return false;
	  }
	} // return whether value is a whole number

	function isPositiveNumber(value) {
	  if (value >= 0) {
	    return true;
	  } else {
	    return false;
	  }
	} // return whether value is a positive number

	function keys(event) { // eventListener for equations
		if (cbAnswer == 1) {
			switch (event.key) {
				case 'a':
					document.removeEventListener('keydown', keys); // remove the eventListener
					if (truth[0] == 1) { // if equation is correct then add to accuracy
						accuracy++;
					}
					truth.shift(); // remove current trial
					t1 = performance.now(); // grab current time
					RTs.push(t1-t0); // subtract current time from previous and save to RTs
					removeAttend(); // remove prompt
					eventTimer.setMultipleTO([ // display asterisks, remove asterisks, then go to next trial
						[displayAttend, randomWholeNumber(50,100)],
						[removeAttend, randomWholeNumber(150,200)],
						[runIt, randomWholeNumber(250,300)]
					]);
					break;
				case 'l':
					document.removeEventListener('keydown', keys);
					if (truth[0] == 0) { // if equation is incorrect then add to accuracy
						accuracy++;
					}
					truth.shift();
					t1 = performance.now();
					RTs.push(t1-t0);
					removeAttend();
					eventTimer.setMultipleTO([
						[displayAttend, randomWholeNumber(50,100)],
						[removeAttend, randomWholeNumber(150,200)],
						[runIt, randomWholeNumber(250,300)]
					]);
					break;
				default:
					break;					
			}
		} else {
			switch (event.key) {
				case 'l':
					document.removeEventListener('keydown', keys);
					if (truth[0] == 1) {
						accuracy++;
					}
					truth.shift();
					t1 = performance.now();
					RTs.push(t1-t0);
					removeAttend();
					eventTimer.setMultipleTO([
						[displayAttend, randomWholeNumber(50,100)],
						[removeAttend, randomWholeNumber(150,200)],
						[runIt, randomWholeNumber(250,300)]
					]);
					break;
				case 'a':
					document.removeEventListener('keydown', keys);
					if (truth[0] == 0) {
						accuracy++;
					}
					truth.shift();
					t1 = performance.now();
					RTs.push(t1-t0);
					removeAttend();
					eventTimer.setMultipleTO([
						[displayAttend, randomWholeNumber(50,100)],
						[removeAttend, randomWholeNumber(150,200)],
						[runIt, randomWholeNumber(250,300)]
					]);
					break;
				default:
					break;					
			}			
		}
	}

	function prepareTrials() {
		var symbols = ['+','-'], // addition or subtraction
		tfList = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], // list of whether equation is true or false
		equationList = ['1/1','2/1','2/2','3/1','3/3','4/1','4/2','4/4','5/1','5/5','6/1','6/2','6/3','6/6','7/1','7/7','8/1','8/2','8/4','8/8','9/1','9/3','9/9',
		'1*2','1*3','2*2','1*4','1*5','3*2','2*3','1*6','1*7','4*2','2*4','1*8','3*3','1*9','5*2','2*5','6*2','4*3','3*4','2*6','7*2','2*7','5*3','3*5','8*2'], // list of multiplication or division equations
		tfValue, // true false value of single trials
		numberA, // number to be added or subtracted
		numberB, // number ... to incorrect solution
		symbolA, // addition or substraction
		symbolB, // ... for incorrect solution
		solution, // solution to equation
		firstHalf; // first half of equation		
		for (i = 0; i < 20; i++) {
			firstHalf = equationList[Math.floor(Math.random() * equationList.length)]; // grab first half of equation from equationList
			symbolA = symbols[Math.floor(Math.random() * symbols.length)]; // addition or subtraction
			numberA = randomWholeNumber(1,9);
			while (!isPositiveNumber(Function('return('+ firstHalf + symbolA + numberA + ');')())) { // keep trying until equation is positive
				numberA = randomWholeNumber(1,9);
			}
			solution = Function('return('+ firstHalf + symbolA + numberA + ');')(); // save solution
			tfValue = tfList[Math.floor(Math.random() * tfList.length)]; // grab truth value from possible
			tfList.splice(tfList.indexOf(tfValue),1); // remove it from list
			truth.push(tfValue); // store it
			if (tfValue == 1) { // if equation is supposed to be correct, save it as such
				firstHalf = firstHalf.replace('*',' x ');
				firstHalf = firstHalf.replace('/',' / ');				
				trialList.push([firstHalf + ' ' + symbolA + ' ' + numberA + ' ' + '=' + ' ' + solution])
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
				trialList.push([firstHalf + ' ' + symbolA + ' ' + numberA + ' ' + '=' + ' ' + solution])													
			}
		}		
	}

	function getMean(array) {
		var sum = 0;
		for (i in array) {
			sum += array[i];
		}
		return (sum / array.length);
	}

	function getSD(array, mean) {
		var sqDif = 0;
		for (i in array) {
			sqDif += (array[i] - mean) * (array[i] - mean);
		}
		return (Math.sqrt(sqDif / array.length));
	}

	function runIt() { // run all 20 trials
		if (trialList.length > 0) { // if there are trials left...
			document.addEventListener('keydown', keys); // add event listener for key presses
			displayAttend(trialList[0]); // show equation
			t0 = performance.now(); // get current time
			trialList.shift(); // remove current trial
		} else { // if there are no trials left
			endIt(); // end the sequence of trials
		}
	}

	function endIt() { // end math equations and go to next portion
		document.removeEventListener('keydown', keys); // remove eventListener
		window.close();
		if (accuracy < 16) {
			opener.document.getElementById("menuInstructions").innerHTML = "It looks like you were not at least 75% accurate on the math equations. Please press the button to try again.";
		} else {
			var avg = getMean(RTs), // get the mean RT
				sd = getSD(RTs, avg); // get the SD of RT			
			opener.document.getElementById("menuInstructions").innerHTML = "You will now perform the main task. Please press the button when you are ready.";
			opener.document.getElementById("arithButton").style.display = "none";
			opener.document.getElementById("opButton").style.display = "block";
			opener.document.getElementById("arithAVG").value = avg;
			opener.document.getElementById("arithSD").value = sd;
		}
	}

	eventTimer.setMultipleTO([ // show a countdown, then start showing equations
		[function() {displayAttend('3'); prepareTrials();}, 100], 
		[function() {displayAttend('2');}, 1100],
		[function() {displayAttend('1');}, 2100],
		[runIt, 3100]
	])
}
