var text = document.getElementById('arithInstructions'), // grab instructions element
	nextButton = document.getElementById('next'),  // grab next button element
	previousButton = document.getElementById('previous'), // grab previous button element
	arith = document.getElementById('arith'), // grab arithmetic button element
	instructions = [
	"For this portion of the task, we want you to practice answering math equations that will show up during the main task.",
	"Math equations will be displayed to you. You must press 'A' if the answer is correct or 'L' if it is not.",
	"Please try to respond as quickly as possible without making mistakes.",
	"Press the button when you are ready to begin."], // series of instructions
	numIns = 0; // initialize instruction number

function next() { // onClick function for next button
	numIns++;
	if (numIns == 1) {
		previousButton.style.display = 'block';
	}
	if (numIns == 3) {
		nextButton.style.display = 'none';
		arith.style.display = 'block';
	}
	text.innerHTML = instructions[numIns]; // display the current instruction text
}

function previous() { // onClick function for previous button
	numIns--;
	if (numIns == 0) {
		previousButton.style.display = 'none';
	}
	if (numIns == 2) {
		nextButton.style.display = 'block';
		arith.style.display = 'none';
	}
	text.innerHTML = instructions[numIns]; // display the current instruction text
}