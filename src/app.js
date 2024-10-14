// Import functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMyuZNp5BJzFLb4KLEdojCJu5pTypgzu0",
  authDomain: "live-quiz-3821c.firebaseapp.com",
  projectId: "live-quiz-3821c",
  storageBucket: "live-quiz-3821c.appspot.com",
  messagingSenderId: "887366464770",
  appId: "1:887366464770:web:14ace4d2878220afd5be1b",
  measurementId: "G-PWC5CVKJZ7"
};

// Initialize Firebase and analytics
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firestore
const db = getFirestore(app);

// Query elements
const answerInput = document.querySelector('.live_input');
const submitAnswer = document.querySelector('.live_btns button');
const answerList = document.querySelector('.answer_list');
let hasSubmitted = false; // Allow only one submit

// Function to add an item to the list
function addListItem(answerText, username) {
  const li = document.createElement('li');
  li.textContent = `${username}: ${answerText}`; // Display username alongside the answer
  answerList.appendChild(li);
}

// Function to load answers from Firestore
async function loadAnswers() {
  try {
    // Query Firestore to get answers ordered by their timestamp
    const q = query(collection(db, 'answers'), orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    
    // Add each answer and username to the answer list in the UI
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      addListItem(data.answer, data.username); // Include username when adding to list
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
  const username = localStorage.getItem('username'); // Get the username from local storage

  if (answerText && username) {
    try {
      // Add the answer and username to Firestore
      await addDoc(collection(db, 'answers'), {
        answer: answerText,
        username: username, // Save the username with the answer
        timestamp: new Date() // You can also use FieldValue.serverTimestamp() for server time
      });
      
      // Add the answer to the list in the DOM
      addListItem(answerText, username); // Include username when adding to the list

      // Disable input and submit button after submitting
      answerInput.disabled = true;
      submitAnswer.disabled = true;
      hasSubmitted = true;
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  } else {
    alert('Please provide an answer and make sure you are logged in.');
  }
});

// Load answers when the page is loaded
window.addEventListener('load', loadAnswers);
