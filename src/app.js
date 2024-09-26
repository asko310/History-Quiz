// Importam functiile de care avem nevoie din firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Configuratia firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMyuZNp5BJzFLb4KLEdojCJu5pTypgzu0",
  authDomain: "live-quiz-3821c.firebaseapp.com",
  projectId: "live-quiz-3821c",
  storageBucket: "live-quiz-3821c.appspot.com",
  messagingSenderId: "887366464770",
  appId: "1:887366464770:web:14ace4d2878220afd5be1b",
  measurementId: "G-PWC5CVKJZ7"
};

// Initializam firebase si analytics
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//firestore
const db = getFirestore(app);

// Query elemente
const answerInput = document.querySelector('.live_input');
const submitAnswer = document.querySelector('.live_btns button');
const answerList = document.querySelector('.answer_list');
let hasSubmitted = false; // Permitem doar un submit

// Functie ca sa adaugam un element pe lista
function addListItem(answerText) {
  const li = document.createElement('li');
  li.textContent = answerText;
  answerList.appendChild(li);
}

// Functie ca sa dam load la raspunsuri din firestore
async function loadAnswers() {
  try {
    // Query Firestore to get answers ordered by their timestamp
    const q = query(collection(db, 'answers'), orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    
    // Add each answer to the answer list in the UI
    querySnapshot.forEach((doc) => {
      addListItem(doc.data().answer);
    });
  } catch (error) {
    console.error('Error loading answers:', error);
  }
}

// Function to submit an answer to Firestore
submitAnswer.addEventListener('click', async function () {
  if (hasSubmitted) {
    alert('You have already submitted an answer.');
    return;
  }

  const answerText = answerInput.value.trim();

  if (answerText) {
    try {
      // Add the answer to Firestore
      await addDoc(collection(db, 'answers'), {
        answer: answerText,
        timestamp: new Date() // You can also use FieldValue.serverTimestamp() for server time
      });
      
      // Add the answer to the list in the DOM
      addListItem(answerText);

      // Disable input and submit button after submitting
      answerInput.disabled = true;
      submitAnswer.disabled = true;
      hasSubmitted = true;
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  }
});

// Load answers when the page is loaded
window.addEventListener('load', loadAnswers);
//////////////////////
// Function to replace input field with submitted text
// Function to replace input field with submitted text






