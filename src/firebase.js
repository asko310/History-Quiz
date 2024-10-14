// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAMyuZNp5BJzFLb4KLEdojCJu5pTypgzu0",
    authDomain: "live-quiz-3821c.firebaseapp.com",
    projectId: "live-quiz-3821c",
    storageBucket: "live-quiz-3821c.appspot.com",
    messagingSenderId: "887366464770",
    appId: "1:887366464770:web:14ace4d2878220afd5be1b",
    measurementId: "G-PWC5CVKJZ7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
