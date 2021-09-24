var text = document.getElementById('opInstructions'), // grab instructions element
	nextButton = document.getElementById('next'), // grab next button element
	previousButton = document.getElementById('previous'), // grab previous button element
	prac = document.getElementById('prac'), // grab practice button element
	op = document.getElementById('op'), // grab operation span button element
    	cbAnswer = Number(opener.document.getElementById('cbAnswer').value),
	numIns = 0; // initialize instruction number

prac.addEventListener("click",function() {numIns++; changeText(instructions[numIns]);}); // onClick function to continue after practice

if (cbAnswer == 1) {
	var A = "'A'",
		B = "'L'";
} else {
	var A = "'L'",
		B = "'A'";
}

var	instructions = [
	"For this portion of the task, you will be performing a memory task at the same time as solving math equations.",
	"A letter will appear (ex: F), then a simple math equation (ex: [5/5] + 2 = 3), then another letter, and another equation, and so on for anywhere from 3 to 9 cycles.",
	`The math equations may be correct or incorrect. When an equation is shown to you, you must respond with either ${A} for correct or ${B} for not.`,
	"Your job is to remember the letters and in which order they appeared, while accurately deciding whether the math equations are correct or not.",
	"At the end of each set of cycles you will be asked to input in which order the letters appeared. There will be 7 sets of cycles (3 to 9) and you will do this twice for a total of 14 sets.",
	"Try to be as accurate as possible with the equations, while remembering as many letters as possible.",
	"You must respond to the equations within a certain time limit based on how well you did during the practice equations.",
	"Let's first do a short practice set of 5 letters to allow you to get used to the format. Press the button when you are ready.",
	"You should have entered '1','2','3','4','5' for 'D','K','I','P','H', respectively.",
	"Let's now move on to the main task. You will be expected to correctly answer at least 75% of the math equations within the time limit for the main task.",
	"You will be given a break halfway through the task, during which your accuracy will be shown to you. Press the button when ready."]; // series of instructions

function next() {
	numIns++;
	if (numIns == 1) {
		previousButton.style.display = 'block';
	}
	if (numIns == 7) {
		nextButton.style.display = 'none';
		prac.style.display = 'block';
	}
	if (numIns == 9) {
		previousButton.style.display = 'block';
	}
	if (numIns == 10) {
		nextButton.style.display = 'none';
		op.style.display = 'block';
	}
	text.innerHTML = instructions[numIns]; // display the current instruction text
}

function previous() {
	numIns--;
	if (numIns == 0) {
		previousButton.style.display = 'none';
	}
	if (numIns == 6) {
		nextButton.style.display = 'block';
		prac.style.display = 'none';
	}
	if (numIns == 8) {
		previousButton.style.display = 'none';
	}
	if (numIns == 9) {
		nextButton.style.display = 'block';
		op.style.display = 'none';
	}
	text.innerHTML = instructions[numIns]; // display the current instruction text
}
