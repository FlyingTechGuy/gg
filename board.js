// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
  
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALwServrhQRUQZ-ph0CMPU6C2v5gRJieA",
  authDomain: "guess-game-e5e79.firebaseapp.com",
  databaseURL: "https://guess-game-e5e79-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "guess-game-e5e79",
  storageBucket: "guess-game-e5e79.firebasestorage.app",
  messagingSenderId: "451983593354",
  appId: "1:451983593354:web:6afa3aedb44aff32ccc273",
  measurementId: "G-XVHJQ0ZR3M"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

const gameRef = ref(db, 'game_session');

update(gameRef, {
    score: 0,
    team: "player-red"
});

onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.score !== undefined && data.team !== undefined) {
        console.log("הניקוד התעדכן ל:", data.score, "עבור הקבוצה:", data.team);

        // כאן אנחנו קוראים לפונקציה שכתבנו קודם כדי להזיז את החייל!
        movePlayer(data.team, data.score-1, 0); // Steps => 'player-red'
    }
});

function sendRestart() {
    update(gameRef, {
        restart: true
    });
}

document.getElementById("restartBtn").addEventListener("click", function() {
    window.location.reload();
    sendRestart();
});

const board = document.getElementById('boardStation');
const stations = [];
const rows = 6;      // מספר שורות
const cols = 8;      // מספר עמודות בכל שורה
const spacingX = 100; // מרחק אופקי בין עיגולים
const spacingY = 100; // מרחק אנכי בין שורות

// פונקציה ליצירת הלוח
function createBoard() {
    let count = 0;
    let top = 0, bottom = rows - 1;
    let left = 0, right = cols - 1;

    // אנחנו ממשיכים כל עוד לא סגרנו את כל הריבועים
    while (top <= bottom && left <= right) {

        // 1. הולכים שמאלה -> ימינה (על השורה העליונה)
        for (let i = left; i <= right; i++) {
            addStation(top, i, count++);
        }
        top++; // סיימנו את השורה העליונה, הגבול העליון יורד
      
        // 2. הולכים למעלה -> למטה (על העמודה הימנית)
        for (let i = top; i <= bottom; i++) {
            addStation(i, right, count++);
        }
        right--; // סיימנו את העמודה הימנית, הגבול הימני זז שמאלה
      
        // 3. הולכים מימין -> משמאל (על השורה התחתונה)
        if (top <= bottom) {
            for (let i = right; i >= left; i--) {
                addStation(bottom, i, count++);
            }
            bottom--; // סיימנו את התחתונה, הגבול התחתון עולה
        }
      
        // 4. הולכים מלמטה -> למעלה (על העמודה השמאלית)
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                addStation(i, left, count++);
            }
            left++; // סיימנו את השמאלית, הגבול השמאלי זז ימינה
        }
    }
}

function addStation(row, col, index) {
    const station = document.createElement('div');
    station.className = 'station';
    if (index == 9 || index == 20 || index == 31 || index == 42) {
      station.className = "station stationInvert";
    }
    
    // מספר מ-1 עד 8
    station.innerText = (index % 8) + 1;
    
    // חישוב מיקום פיזי
    const xPos = col * spacingX + 40;
    const yPos = row * spacingY + 40;
    
    station.style.left = xPos + 'px';
    station.style.top = yPos + 'px';
    
    board.appendChild(station);
    stations.push({ x: xPos, y: yPos });
}

// פונקציה להזזת חייל לציון מסוים
function movePlayer(playerId, score) {
    const piece = document.getElementById(playerId);
    // אם הציון גבוה ממספר התחנות, נעצור בתחנה האחרונה
    if (score < 0) {score = 0}
    const targetIndex = Math.min(score, stations.length - 1);
    const targetPos = stations[targetIndex];

    // הזזה עם היסט קטן כדי שהחיילים לא יסתירו אחד את השני לגמרי
    // const offset = playerId === 'player-red' ? 0 : 10;
    let pieceX, pieceY;
    switch (playerId) {
      case 'player-red':
        pieceX = 22;
        pieceY = -22;
        break;
      case 'player-blue':
        pieceX = 22;
        pieceY = 22;
        break;
      case 'player-green':
        pieceX = -22;
        pieceY = -22;
        break;
      case 'player-orange':
        pieceX = -22;
        pieceY = 22;
        break;
    }
    // piece.style.left = (targetPos.x + 10 + offset) + 'px';
    // piece.style.top = (targetPos.y + 10 + offset) + 'px';
    piece.style.left = (targetPos.x + 16 + pieceX) + 'px';
    piece.style.top = (targetPos.y + 16 + pieceY) + 'px';
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function movePlayerSteps(playerId, score, curentScore) {
  for (let i = curentScore; i <= score; i++) {
    movePlayer(playerId, i);
    await sleep(1000);
  }
}

function drawPath() {
    const svg = document.getElementById('path-svg');
    let pathData = "M " + (stations[0].x + 30) + " " + (stations[0].y + 30); // נקודת התחלה (מרכז העיגול הראשון)

    for (let i = 1; i < stations.length; i++) {
        pathData += " L " + (stations[i].x + 30) + " " + (stations[i].y + 30); // קו לתחנה הבאה
    }
  
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", pathData);
    pathElement.setAttribute("id", "main-path");
    svg.appendChild(pathElement);
}

// קרא לפונקציה הזו מיד אחרי createBoard()
createBoard();
drawPath();

// אתחול הלוח
createBoard();

// הדמיה של תחילת המשחק (החיילים מתחילים בתחנה 0)
movePlayer('player-red', 0);
movePlayer('player-blue', 0);
movePlayer('player-green', 0);
movePlayer('player-orange', 0);

// setTimeout(function() {
//   movePlayerSteps("player-green", 24, 0);
// }, 2000);
// setTimeout(function() {
//   movePlayerSteps("player-orange", 8, 0);
// }, 3000);

/* כאן בהמשך תוסיף את הקוד של Firebase:
   onValue(gameRef, (snapshot) => {
       const data = snapshot.val();
       movePlayer('player-red', data.scoreA);
       movePlayer('player-blue', data.scoreB);
   });
*/