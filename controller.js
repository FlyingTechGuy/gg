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

function sendScore(newScore) {
    update(gameRef, {
        score: newScore
    });
    console.log(newScore);
}

function sendTeam(newTeam) {
    update(gameRef, {
        team: newTeam
    });
    console.log(newTeam);
}

onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.restart !== undefined && data.restart != false) {
        window.location.reload();
        update(gameRef, {
            restart: false
        });
    }
});

// document.getElementById("rightBtn").addEventListener("click", function() {
//   sendScore(9)
// });
// document.getElementById("wrongBtn").addEventListener("click", function() {
//   sendScore(1)
// });

const cardsList = [
  ["פסנתר", "חציל", "טלפון", "עננים", "גרביים", "מדבר", "מספריים", "מדוזה"],
  ["אופניים", "פיתה", "ברק", "שדכן", "קואלה", "תרמיל", "נורה", "אוקיינוס"],
  ["שעון", "מלפפון", "מטוס", "שלט", "אריה", "דבק", "שמיכה", "הר געש"],
  ["כרית", "לימון", "אוטובוס", "מחק", "פיל", "אוהל", "רדיו", "כוכב"],
  ["מברשת", "תפוח", "רכבת", "סיכה", "קוף", "פטיש", "מצלמה", "נחל"],
  ["שולחן", "בננה", "מונית", "דף", "נמר", "מפתח", "סבון", "ירח"],
  ["כיסא", "תפוז", "ספינה", "עט", "דוב", "מברג", "מגבת", "שמש"],
  ["חלון", "אפרסק", "טרקטור", "ספר", "זאב", "מסמר", "סיר", "ענן"],
  ["דלת", "ענבים", "משאית", "מחברת", "שועל", "צבת", "מחבת", "גשם"],
  ["ארון", "תות", "אופנוע", "קלמר", "ארנב", "פלייר", "כף", "שלג"],
  ["מיטה", "אבטיח", "צוללת", "סנאי", "מערוך", "מזלג", "ברד", "גלידה"],
  ["וילון", "מלון", "כדור פורח", "סרגל", "אייל", "מגרדת", "סכין", "ערפל"],
  ["שטיח", "מנגו", "אמבולנס", "מהדק", "צבי", "פומפייה", "כוס", "טל"],
  ["תמונה", "קיווי", "כבאית", "יומן", "חזיר", "מצקת", "צלחת", "קשת"],
  ["מנורה", "אננס", "קורקינט", "מעטפה", "כבשה", "קלוף", "קנקן", "רוח"],
  ["מראה", "דובדבן", "סירה", "גלויה", "עז", "פותחן", "בקבוק", "רעם"],
  ["מדף", "שזיף", "מצנח", "בול", "פרה", "משפך", "מגש", "ברק"],
  ["ספה", "רימון", "רחפת", "מפה", "סוס", "אדנית", "קערה", "חול"],
  ["כורסה", "תאנה", "טנק", "מצפן", "חמור", "מעדר", "פח", "סלע"],
  ["שרפרף", "גויאבה", "נגמ\"ש", "משקפת", "גמל", "קלשון", "מטאטא", "הר"],
  ["שידה", "פאפאיה", "דחפור", "זכוכית מגדלת", "יען", "יעה", "דלי", "גבעה"],
  ["מזנון", "קרמבולה", "מלגזה", "מיקרוסקופ", "נשר", "סולם", "חבל", "עמק"],
  ["ספריה", "ליצ'י", "מנוף", "טלסקופ", "ינשוף", "פנס", "שרשרת", "מערה"],
  ["שולחן כתיבה", "פטל", "מערבל בטון", "מחשבון", "תוכי", "סוללה", "מנעול", "אי"],
  ["שידת לילה", "אוכמניות", "קומביין", "שעון עצר", "פינגווין", "חוט", "ציר", "חוף"],
  ["ארון בגדים", "חמוציות", "מכבש", "מד חום", "דולפין", "מחט", "פטיש", "מצוק"],
  ["פינת אוכל", "דלעת", "משטרה", "מאזניים", "כריש", "סיכת ביטחון", "מסור", "שונית"],
  ["קישוא", "מונית שירות", "מטר רץ", "לוויתן", "צבע", "מברשת צבע", "תהום", "נקיק"],
  ["אי במטבח", "כרובית", "קרוואן", "פלס", "תמנון", "דבק מגע", "מקדחה", "מצוף"],
  ["דלפק", "ברוקולי", "רכבל", "מפתח שוודי", "סרטן", "איזולירבנד", "פלייר פטנט", "מעיין"],
  ["מסוק", "גזר", "חגורה", "מצית", "פאזל", "קקטוס", "מאוורר", "עוגן"],
  ["אגוז", "גרביים", "זברה", "מגרפה", "מלחייה", "כפכפים", "דגל", "חצוצרה"],
  ["גיטרה", "סרגל", "פיל", "קרש חיתוך", "מדליה", "מטף", "מצנח", "שק שינה"],
  ["אוטובוס", "אננס", "סיכה", "נחש", "כרית", "מצפן", "קולב", "משרוקית"],
  ["צוללת", "בצל", "משקפי שמש", "סוס ים", "מראה", "מגבת", "מזרן", "אוהל"],
  ["טרקטור", "שעון יד", "פטיש", "תנין", "שטיח", "קומקום", "תמונה", "חבל קפיצה"],
  ["אופנוע", "מלון", "מברג", "ינשוף", "פח אשפה", "מצוף", "משקולת", "גלשן"],
  ["כדור פורח", "לימון", "שרשרת", "צבת", "עטלף", "פנס", "סלסלה", "סנפירים"],
  ["משאית", "חליפה", "יומן", "מספריים", "קרנף", "מנורת לילה", "וילון", "משוט"],
  ["אמבולנס", "ענבים", "מחברת", "פינגווין", "פקק", "שמיכה", "בקבוק", "ספה"],
  ["מונית", "דובדבן", "סרט מדידה", "פטיש שניצל", "עציץ", "קערה", "מצקת", "כיור"],
  ["מכונית מירוץ", "מנגו", "מהדק נייר", "פומפייה", "תמנון", "צלחת", "מעטפה", "כיסא"],
  ["ספינה", "קיווי", "דבק סלוטייפ", "מקדחה", "עקרב", "מגש", "בול", "שולחן"],
  ["כבאית", "אבוקדו", "עט", "פלס", "חלזון", "סיר", "מסמר", "ארון"],
  ["קורקינט", "אגס", "מפתח", "חיפושית", "כף", "מדף", "סכין", "מיטה"],
  ["שזיף", "פנס כיס", "נמלה", "מזלג", "בורג", "סנאי", "מערוך", "צבי"],
  ["טנק", "תאנה", "עכביש", "מלקחיים", "סולם", "מפה", "חמור", "הר"],
  ["נגמ\"ש", "רימון", "בורג", "סרטן", "אדנית", "קערה", "מטאטא", "גבעה"],
  ["דחפור", "חרובים", "מברשת", "צב", "קנקן", "זכוכית מגדלת", "יעה", "דלי"],
  ["מנוף", "פטל", "דג", "ערסל", "משוט", "טלסקופ", "זברה", "מלחייה"], /* first 50 */
  ["רופא", "שוקולד", "מדרכה", "חלודה", "נמל", "שמיכה", "קרקס", "טיפוס"],
  ["כבאי", "פיצה", "מעלית", "כנף", "מחסן", "מגבת", "תיאטרון", "צלילה"],
  ["שוטר", "המבורגר", "מדרגות", "זנב", "חניה", "סבון", "קולנוע", "ריצה"],
  ["טבח", "פסטה", "מעקה", "טלפיים", "תחנה", "שמפו", "מוזיאון", "קפיצה"],
  ["נגר", "סושי", "תקרה", "קשקשים", "שוק", "מסרק", "אצטדיון", "שחייה"],
  ["צייר", "פלאפל", "רצפה", "נוצות", "נמל תעופה", "מראה", "גן חיות", "זחילה"],
  ["זמר", "חומוס", "קיר", "קרניים", "מסילה", "מברשת שיניים", "לונה פארק", "גלישה"],
  ["רקדן", "בורקס", "עמוד", "חדק", "כביש", "ספוג", "ספריה", "רכיבה"],
  ["נהג", "גלידה", "כביש", "צבתות", "צומת", "משחת שיניים", "אוניברסיטה", "טיול"],
  ["טייס", "עוגה", "גשר", "סנפיר", "רחוב", "מכונת גילוח", "בית ספר", "מחנה"],
  ["אופה", "עוגייה", "גינה", "נחיריים", "כיכר", "בושם", "מפעל", "הפלגה"],
  ["גנן", "דונאט", "חצר", "מרפק", "שדרה", "איפור", "בנק", "טיסה"],
  ["בנאי", "סלט", "מרפסת", "ברך", "סמטה", "דאודורנט", "דואר", "נסיעה"],
  ["חשמלאי", "מרק", "גג", "קרסול", "נתיב", "לק", "כנסייה", "הליכה"],
  ["שרברב", "סטייק", "מחסום", "כתף", "גדר", "פינצטה", "מסגד", "זחילה"],
  ["מכונאי", "קציצה", "שער", "צוואר", "פעמון", "מספריים", "בית כנסת", "טיפוס"],
  ["ספר", "חביתה", "פעמון", "מצח", "שלט", "פצירה", "מגדל", "גלישה"],
  ["תופרת", "גבינה", "תיבת דואר", "סנטר", "אנטנה", "קרם", "טירה", "צניחה"],
  ["סנדלר", "לחם", "פנס רחוב", "לחי", "רמזור", "ג'ל", "ארמון", "חתירה"],
  ["צלם", "אורז", "ספסל", "ריסים", "תמרור", "שפתון", "מערה", "סקי"],
  ["עורך דין", "פתיתים", "ברז", "גבות", "צינור", "מברשת", "מזרקה", "איגרוף"],
  ["מורה", "קוסקוס", "פח", "עפעף", "חוט", "מטלית", "פסל", "יוגה"],
  ["מזכירה", "טורטייה", "דשא", "חניכיים", "כבל", "מגב", "ציור", "קראטה"],
  ["מלצר", "נקניקייה", "שביל", "לשון", "תקע", "יעה", "קונצרט", "ג'ודו"],
  ["חייל", "פנקייק", "שיח", "גרון", "שקע", "דלי", "הצגה", "טניס"],
  ["מדען", "וופל", "פרח", "חזה", "סוללה", "סמרטוט", "סרט", "כדורגל"],
  ["אסטרונאוט", "טוסט", "עץ", "בטן", "מנורה", "אבקה", "תערוכה", "כדורסל"],
  ["כבאי", "מרשמלו", "עלה", "גב", "מתג", "נוזל", "הופעה", "כדורעף"],
  ["דייג", "סוכרייה", "ענף", "מותן", "נתיך", "בועות", "פסטיבל", "טניס שולחן"],
  ["חוקר", "מסטיק", "שורש", "ירך", "נברשת", "קצף", "קרקס", "באולינג"],
  ["מרגלת", "שוקו", "גזע", "שוק", "פנס", "אדים", "אולם", "ביליארד"],
  ["פיראט", "תה", "פרי", "בוהן", "נר", "אבק", "מועדון", "גולף"],
  ["קוסם", "קפה", "גרעין", "אצבע", "גפרור", "בוץ", "מסעדה", "הוקי"],
  ["ליצן", "מיץ", "קליפה", "ציפורן", "מצית", "חול", "קפה", "פוטבול"],
  ["מלך", "יין", "זרע", "פרק", "להבה", "אבן", "קניון", "בייסבול"],
  ["מלכה", "בירה", "ניצן", "וריד", "עשן", "סלע", "חנוכה", "שחמט"],
  ["נסיך", "חלב", "קוץ", "שריר", "גחלת", "עפר", "פורים", "דמקה"],
  ["נסיכה", "חמאה", "טל", "שלד", "אפר", "חצץ", "פסח", "טאקי"],
  ["מכשפה", "דבש", "ערפל", "גולגולת", "פיח", "זכוכית", "סוכות", "מונופול"],
  ["ענק", "ריבה", "מבול", "עצם", "ערפל", "מתכת", "שבועות", "קאטן"],
  ["דרקון", "שמן", "ברד", "לב", "ענן", "עץ", "עצמאות", "פאזל"],
  ["בת ים", "חומץ", "שלג", "ריאה", "רעם", "פלסטיק", "שבת", "לגו"],
  ["רובוט", "חרדל", "קרה", "קיבה", "ברק", "בד", "חתונה", "קוביה"],
  ["חייזר", "מיונז", "חום", "כבד", "רוח", "נייר", "יומולדת", "קלף"],
  ["רוח רפאים", "קטשופ", "לחות", "כליה", "סופה", "קרטון", "מסיבה", "חרוז"],
  ["ערפד", "תבלין", "יובש", "מוח", "הוריקן", "צמר", "טקס", "ציור"],
  ["איש שלג", "מלח", "צל", "דם", "טורנדו", "משי", "מצעד", "פיסול"],
  ["דחליל", "פלפל", "אור", "דמעות", "שיטפון", "עור", "שביתה", "נגינה"],
  ["בובה", "סוכר", "חושך", "זיעה", "רעידת אדמה", "נוצה", "הפגנה", "שירה"],
  ["מטרה", "קמח", "ואקום", "נשימה", "צונאמי", "קש", "בחירות", "ריקוד"]
];

let cardsInd = Array.from({length: cardsList.length}, (_, i) => i);

function cardsShuffle() {
    for (let i = cardsInd.length-1; i > 0; i--) {
        let j = Math.floor(Math.random() * (1 + i));
        [cardsInd[i], cardsInd[j]] = [cardsInd[j], cardsInd[i]];
    }
}
cardsShuffle();

function getNextCardInd() {
    if (cardsInd.length === 0) {
        cardsInd = Array.from({length: cardsList.length}, (_, i) => i);
        cardsShuffle();
    }
    return cardsInd.pop();
}

let teamTime = 60;
let currentTeam = 1;
let teamsScore = [1,1,1,1];
let curNumberInd = 1;

function startRound() {
    curNumberInd = teamsScore[currentTeam-1];
    document.getElementById("cardTxt").innerHTML = cardsList[getNextCardInd()][(curNumberInd-1)%8];
    changeFontSize();
    if (teamsScore[currentTeam-1] != 9 && teamsScore[currentTeam-1] != 20 && teamsScore[currentTeam-1] != 31 && teamsScore[currentTeam-1] != 42) {
        document.getElementById("regButtonsBox").classList.remove("hide");
        document.getElementById("mulButtonsBox").classList.remove("show");
        document.getElementById("startSec").classList.remove("show");
        startTimer();
    } else {
        document.getElementById("regButtonsBox").classList.add("hide");
        document.getElementById("mulButtonsBox").classList.add("show");
        document.getElementById("startSec").classList.remove("show");
        startTimer();
    }
}
document.getElementById("startBtn").addEventListener("click", startRound);

let timer;
function startTimer() {
    timer = setInterval(function() {
        teamTime-=1;
        if (teamTime <= 0) {
            teamTime = 0;
            clearInterval(timer);
            document.getElementById("regButtonsBox").classList.add("hide");
            document.getElementById("mulButtonsBox").classList.add("show");
            // setTimeout(() => {
            //     
            // }, 2000);
        }
        document.getElementById("timerTxt").innerHTML = teamTime.toString().padStart(2, '0');
    }, 1000);
}

function moveTeam(newCurTeam) {
    teamsScore[newCurTeam-1]+=1;
    sendTeam(taemToTxt(newCurTeam));
    sendScore(teamsScore[newCurTeam-1]);
    if (teamTime == 0) {
        endRound();
    } else {
        document.getElementById("cardTxt").innerHTML = cardsList[getNextCardInd()][(curNumberInd-1)%8];
        changeFontSize();
    }
}

document.getElementById("redBtn").addEventListener("click", function() {
    moveTeam(1);
});
document.getElementById("greenBtn").addEventListener("click", function() {
    moveTeam(2);
});
document.getElementById("orangeBtn").addEventListener("click", function() {
    moveTeam(3);
});
document.getElementById("blueBtn").addEventListener("click", function() {
    moveTeam(4);
});

document.getElementById("wrongBtnMul").addEventListener("click", function() {
    teamsScore[currentTeam-1]-=1;
    if (teamsScore[currentTeam-1] < 1) {
        teamsScore[currentTeam-1] = 1;
    }
    sendTeam(taemToTxt(currentTeam));
    sendScore(teamsScore[currentTeam-1]);
    if (teamTime == 0) {
        endRound();
    } else {
        document.getElementById("cardTxt").innerHTML = cardsList[getNextCardInd()][(curNumberInd-1)%8];
        changeFontSize();
    }
});

function endRound() {
    document.getElementById("regButtonsBox").classList.add("hide");
    document.getElementById("mulButtonsBox").classList.add("show");
    document.getElementById("startSec").classList.add("show");
    teamTime = 60;
    document.getElementById("timerTxt").innerHTML = teamTime;
    currentTeam += 1;
    if (currentTeam >= 5) {currentTeam = 1};
    switch (currentTeam) {
        case 1:
            document.getElementById("teamCircle").style.backgroundColor = "#e31919";
            break;
        case 2:
            document.getElementById("teamCircle").style.backgroundColor = "#099d09";
            break;
        case 3:
            document.getElementById("teamCircle").style.backgroundColor = "#efa206";
            break;
        case 4:
            document.getElementById("teamCircle").style.backgroundColor = "#1616d2";
            break;
        default:
            document.getElementById("teamCircle").style.backgroundColor = "#000";
            break;
    }
}

function taemToTxt(num) {
    let taemTxt = "";
    switch (num) {
        case 1:
            taemTxt = "player-red";
            break;
        case 2:
            taemTxt = "player-green";
            break;
        case 3:
            taemTxt = "player-orange";
            break;
        case 4:
            taemTxt = "player-blue";
            break;
        default:
            taemTxt = "player-red";
            break;
    }
    return taemTxt;
}

document.getElementById("rightBtn").addEventListener("click", function() {
    teamsScore[currentTeam-1]+=1;
    sendTeam(taemToTxt(currentTeam));
    sendScore(teamsScore[currentTeam-1]);
    document.getElementById("cardTxt").innerHTML = cardsList[getNextCardInd()][(curNumberInd-1)%8];
    changeFontSize();
});

document.getElementById("wrongBtn").addEventListener("click", function() {
    teamsScore[currentTeam-1]-=1;
    if (teamsScore[currentTeam-1] < 1) {
        teamsScore[currentTeam-1] = 1;
    }
    sendTeam(taemToTxt(currentTeam));
    sendScore(teamsScore[currentTeam-1]);
    document.getElementById("cardTxt").innerHTML = cardsList[getNextCardInd()][(curNumberInd-1)%8];
    changeFontSize();
});

const cardTxt = document.getElementById("cardTxt");
const changeFontSize = () => {
    const charCount = cardTxt.innerHTML.length;

    let newSize = 100 / (charCount * 0.5);

    if (newSize > 20) newSize = 20;
    if (newSize < 5) newSize = 5;

    cardTxt.style.fontSize = `${newSize}cqi`;
};

cardTxt.addEventListener("input", changeFontSize);
window.addEventListener("resize", changeFontSize);
changeFontSize();