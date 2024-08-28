import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOvLWIu-qW-rWaLaMkD6jcoPVLsQ7QNno",
  authDomain: "sem-app-24845.firebaseapp.com",
  databaseURL: "https://sem-app-24845-default-rtdb.firebaseio.com",
  projectId: "sem-app-24845",
  storageBucket: "sem-app-24845.appspot.com",
  messagingSenderId: "195194423097",
  appId: "1:195194423097:web:897df03687d4f591adcae8",
  measurementId: "G-VVLS5DBTN3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();

document
  .getElementById("tributeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById("usernameInput");
    const photoInput = document.getElementById("photoInput");
    const messageInput = document.getElementById("messageInput");

    const reader = new FileReader();
    reader.onload = function (e) {
      const tribute = {
        username: usernameInput.value,
        photo: e.target.result,
        message: messageInput.value,
        timestamp: new Date().toLocaleString(), // timestamp
      };

      // addTributeToPage(tribute);
      saveTribute(tribute);

      usernameInput.value = "";
      photoInput.value = "";
      messageInput.value = "";
    };

    reader.readAsDataURL(photoInput.files[0]);
  });

function addTributeToPage(tribute) {
  const container = document.getElementById("tributesContainer");
  const tributeElement = document.createElement("div");
  tributeElement.className = "tribute";
  tributeElement.innerHTML = `
        <p><strong>${tribute.username}</strong> <em>${tribute.timestamp}</em></p>
        <img id="tributePhoto" src="${tribute.photo}" alt="Tribute Photo">
        <p>${tribute.message}</p>
    `;
  container.appendChild(tributeElement);
}

async function saveTribute(tribute) {
  const tributesRef = ref(db, "tributes");
  await push(tributesRef, tribute);
}

async function loadTributes() {
  const tributesRef = ref(db, "tributes");
  onValue(tributesRef, (snapshot) => {
    const tributes = snapshot.val();
    const container = document.getElementById("tributesContainer");
    container.innerHTML = ""; // Clear existing tributes

    if (tributes) {
      const reversedTributes = Object.values(tributes).reverse();
      reversedTributes.forEach(addTributeToPage);
    }
  });
}

// Load tributes when the page loads
window.onload = loadTributes;
