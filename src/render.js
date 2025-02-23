const items = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
const midiNotes = Array.from({ length: 79 - 48 + 1 }, (_, i) => i + 48);
console.log(midiNotes);


let currentItem = ""; // Store the current random item
let score = 0;  // Initialize score


function getRandomItem() {
   const randomIndex = Math.floor(Math.random() * midiNotes.length);
   return midiNotes[randomIndex];
}


// Function to update score display
function updateScore() {
   document.getElementById("user-score").textContent = `Score: ${score}`;
}


// Function to initialize the game
function initializeGame(start=false) {
   const randomItemDisplay = document.getElementById("random-item");
   const userInput = document.getElementById("user-input");
   const feedback = document.getElementById("feedback");


   if (start == true) {
       score = 0;  // Initialize score
       updateScore();
   }
  
   // Pick and display a new random item
   currentItem = getRandomItem();
   randomItemDisplay.textContent = `Note: ${currentItem}`;

   // Clear input field and feedback message
   userInput.value = "";
   feedback.textContent = "";
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
   console.log(`MIDI Message Received: Status ${status}, Note ${note}, Velocity ${velocity}`);


   if (status === 144 && velocity > 0) { // Note On
       console.log(`Note ON: ${note}`);
       // const noteName = midiToNoteName(note);
       // midiNoteDisplay.textContent = `🎵 Note Played: ${noteName}`;
       midiNoteDisplay.textContent = `🎵 Note Played: ${note}`;
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
   } else if (status === 128 || (status === 144 && velocity === 0)) { // Note Off
       console.log(`Note OFF: ${note}`);
   }
}


document.addEventListener("DOMContentLoaded", startMIDI);


// Function to check input after pressing Enter
// THIS WILL BE OBSOLETE
// function checkInput() {
//     const userText = document.getElementById("user-input").value.trim();


//     if (userText.toLowerCase() === currentItem.toLowerCase()) {
//         feedback.textContent = "✅ Correct!";
//         feedback.style.color = "green";
//         score++;  // Increase score by 1
//         updateScore();  // Update score display
//         initializeGame();
//     } else {
//         feedback.textContent = "❌ Incorrect";
//         feedback.style.color = "red";
//     }
// }


// Run when the page loads
document.addEventListener("DOMContentLoaded", () => {
   const userInput = document.getElementById("user-input");
   const feedback = document.getElementById("feedback");
   const restartBtn = document.getElementById("restart-btn");
   const scoreDisplay = document.createElement("user-score"); // Create score display
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
   restartBtn.addEventListener("click", () => initializeGame(true));
});



