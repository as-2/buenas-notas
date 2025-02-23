const items = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
const octave = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
// const midiNoteNumbers = Array.from({ length: 79 - 48 + 1 }, (_, i) => i + 48);
const midiNoteNumbers = Array.from({ length: 71 - 60 + 1 }, (_, i) => i + 60);


let currentItem = ""; // Store the current random item
let score = 0;  // Initialize score
let currentlyPressedNote = null; // Track if a note is already being processed


function getRandomItem() {
   const randomIndex = Math.floor(Math.random() * midiNoteNumbers.length);
   return midiNoteNumbers[randomIndex];
}

function noteNumbersToNote(userMidiNoteNumber) {
    return octave[userMidiNoteNumber-60]
}


// Function to update score display
function updateScore() {
   document.getElementById("user-score").textContent = `Score: ${score}`;
}


// Function to initialize the game
function initializeGame(start=false) {
   const randomItemDisplay = document.getElementById("random-item");
   const feedback = document.getElementById("feedback");

   if (start == true) {
       score = 0;  // Initialize score
       updateScore();
   }
  
   // Pick and display a new random item
   currentItem = getRandomItem();
   currentNote = noteNumbersToNote(currentItem)
   randomItemDisplay.textContent = `Note: ${currentNote}`;
//    randomItemDisplay.textContent = `Note: ${currentItem}`;


   // Clear input field and feedback message
//    feedback.textContent = "";
}


async function startMIDI() {
   try {
       const midiAccess = await navigator.requestMIDIAccess();
       console.log("MIDI Access Granted");


       midiAccess.inputs.forEach((input) => {
           console.log(`MIDI Device Found: ${input.name}`);
           input.onmidimessage = handleMIDIMessage;
       });
   } catch (error) {
       console.error("Error accessing MIDI:", error);
   }
}


function handleMIDIMessage(event) {
   const [status, note, velocity] = event.data;
   const midiNoteDisplay = document.getElementById("midi-note");
   const feedback = document.getElementById("feedback");
   console.log(`MIDI Message Received: Status ${status}, Note ${note}, Velocity ${velocity}`);


    if (status === 144 && velocity > 0) { // Note On
        if (currentlyPressedNote !== note) {
            console.log(`Note ON: ${note}`);
            // const noteName = midiToNoteName(note);
            // midiNoteDisplay.textContent = `🎵 Note Played: ${noteName}`;
            midiNoteDisplay.textContent = `🎵 Note Played: ${note}`;
           currentlyPressedNote = note; // Set the currentlyPressedNote to this note
            if (note === currentItem) {
               feedback.textContent = "✅ Correct!";
               feedback.style.color = "green";
               score++;  // Increase score by 1
               updateScore();  // Update score display
               initializeGame();
            } else {
               feedback.textContent = "❌ Incorrect";
               feedback.style.color = "red";
            }
        }
        

       
   } else if (status === 128 || (status === 144 && velocity === 0)) { // Note Off
       console.log(`Note OFF: ${note}`);
       currentlyPressedNote = null;
   }
}

// Run when the page loads
document.addEventListener("DOMContentLoaded", () => {
   
   const restartBtn = document.getElementById("restart-btn");
   const scoreDisplay = document.getElementById("user-score"); // Create score display
   // scoreDisplay.id = "score";
   document.body.appendChild(scoreDisplay); // Add it to the page
   updateScore(); // Show initial score


   // Start the game
   initializeGame(true);


   // // Listen for "Enter" key to evaluate input
   // userInput.addEventListener("keypress", (event) => {
   //     if (event.key === "Enter") {  // Check if Enter was pressed
   //         checkInput();
   //     }
   // });

   startMIDI();

   // Restart game when button is clicked
//    restartBtn.addEventListener("click", () => initializeGame(true));
});

document.addEventListener("DOMContentLoaded", startMIDI);
document.getElementById("restart-btn").addEventListener("click", () => initializeGame(true));



