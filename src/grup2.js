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


function replaceInputWithText(inputId, submitButtonId, text) {
    const inputElement = document.getElementById(inputId);
    const submitButton = document.getElementById(submitButtonId);
  
    // Create a new span to hold the submitted text
    const paragraph = document.createElement('p'); // Create a paragraph element
    paragraph.textContent = text; // Set the text content
    paragraph.className = 'submitted-answer'; // Add class for styling
    
    // Replace the input field and button with the submitted text
    inputElement.replaceWith(paragraph);
    submitButton.remove();
  }
  
  
  // Function to submit text answers to Firestore
  async function submitAnswerToFirestore(inputId, submitButtonId, collectionName) {
    const answerInput = document.getElementById(inputId);
    const answerText = answerInput.value.trim();
  
    if (answerText) {
      try {
        // Add the answer to Firestore in the specified collection
        await addDoc(collection(db, collectionName), {
          answer: answerText,
          timestamp: new Date(),
          inputId: inputId // Store the input ID to associate with the answer
        });
  
        // Replace the input field with the submitted text
        replaceInputWithText(inputId, submitButtonId, answerText);
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    }
  }
  
  // Function to submit image to Firestore
  document.getElementById('submitImage').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageInput');
    const imageFile = imageInput.files[0];
  
    if (imageFile) {
      try {
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/${imageFile.name}`);
  
        // Upload the image
        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef);
  
        // Add the image URL to Firestore
        await addDoc(collection(db, 'otherAnswers'), {
          imageUrl: downloadURL,
          timestamp: new Date()
        });
  
        // Display the image
        displayImage(downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  });
  
  // Function to display the image
  function displayImage(imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = "Uploaded Image";
    img.style.width = "200px"; // Set your desired width
    img.style.height = "auto";  // Maintain aspect ratio
    document.body.appendChild(img); // Append to the body or a specific container
  }
  
  // Event listeners for the five input fields, storing the data in 'otherAnswers' collection
 
  document.getElementById('submit6').addEventListener('click', () => submitAnswerToFirestore('input6', 'submit6', 'otherAnswers'));
  document.getElementById('submit7').addEventListener('click', () => submitAnswerToFirestore('input7', 'submit7', 'otherAnswers'));
  document.getElementById('submit8').addEventListener('click', () => submitAnswerToFirestore('input8', 'submit8', 'otherAnswers'));
  document.getElementById('submit9').addEventListener('click', () => submitAnswerToFirestore('input9', 'submit9', 'otherAnswers'));
  document.getElementById('submit10').addEventListener('click', () => submitAnswerToFirestore('input10', 'submit10', 'otherAnswers'));
  
  // Function to load previous answers from Firestore
  async function loadPreviousAnswers(collectionName) {
    const q = query(collection(db, collectionName), orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
  
    // Iterate over the previous answers and replace the input fields
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const answerText = data.answer;
      const imageUrl = data.imageUrl;
      const inputId = data.inputId; // Get the stored input ID
  
      // Replace input field with the answer text if the input exists
      const inputElement = document.getElementById(inputId);
      if (inputElement && answerText) {
        const submitButtonId = `submit${inputId.replace('input', '')}`; // Get the corresponding submit button ID
        replaceInputWithText(inputId, submitButtonId, answerText);
      }
  
      // Display the image if it exists
      if (imageUrl) {
        displayImage(imageUrl);
      }
    });
  }
  
  // Call this function when the page loads
  window.addEventListener('load', () => {
    loadPreviousAnswers('otherAnswers');
  });