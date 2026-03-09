import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

// ---------------- FIREBASE CONFIG ----------------
// Get this from Firebase Console > Project Settings > Your Apps
const firebaseConfig = {
 
  apiKey: "AIzaSyCJoYTRhnfxTybH29dMcJ2jUom0zai1MQI",
  authDomain: "air-pollution-monitoring-32442.firebaseapp.com",
  projectId: "air-pollution-monitoring-32442",
  storageBucket: "air-pollution-monitoring-32442.firebasestorage.app",
  messagingSenderId: "32538469816",
  appId: "1:32538469816:web:8de41f01a6ab64b6dadb4d",
  measurementId: "G-PPTS9L9KNG"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const mq2El = document.getElementById("mq2");
const mq6El = document.getElementById("mq6");
const mq135El = document.getElementById("mq135");
const zoneEl = document.getElementById("zone");
const summaryEl = document.getElementById("summary");

function getZone(data) {
  const mq2 = Number(data.mq2 || 0);
  const mq6 = Number(data.mq6 || 0);
  const mq135 = Number(data.mq135 || 0);

  if (mq2 > 1500 || mq6 > 1500 || mq135 > 1200) return "RED";
  if (mq2 > 900 || mq6 > 900 || mq135 > 700) return "YELLOW";
  return "GREEN";
}

function updateUI(data) {
  temperatureEl.textContent = `${data.temperature ?? "--"} °C`;
  humidityEl.textContent = `${data.humidity ?? "--"} %`;
  mq2El.textContent = data.mq2 ?? "--";
  mq6El.textContent = data.mq6 ?? "--";
  mq135El.textContent = data.mq135 ?? "--";

  const zone = getZone(data);
  zoneEl.textContent = zone;

  summaryEl.innerHTML = `
    <strong>Current Zone:</strong> ${zone}<br>
    <strong>Temperature:</strong> ${data.temperature ?? "--"} °C<br>
    <strong>Humidity:</strong> ${data.humidity ?? "--"} %<br>
    <strong>MQ2:</strong> ${data.mq2 ?? "--"}<br>
    <strong>MQ6:</strong> ${data.mq6 ?? "--"}<br>
    <strong>MQ135:</strong> ${data.mq135 ?? "--"}<br>
    <strong>Device millis:</strong> ${data.millis ?? "--"}
  `;
}

const latestRef = ref(db, "airmonitor/latest");

onValue(latestRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    updateUI(data);
  } else {
    summaryEl.textContent = "No data available yet.";
  }
});