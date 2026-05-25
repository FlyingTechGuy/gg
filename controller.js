// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import { getDatabase, ref, get, onValue, update } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

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


let currentRoomId = null;
let roomId = '', roomRef = '';

window.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    roomId = urlParams.get('room');
    if (!roomId) {
        console.log("שגיאה: הגעת למסך הקלפים ללא קוד חדר!");
        document.getElementById("roomErrSecFull").classList.remove("hide");
        return;
    }
    roomRef = ref(db, `game_session/${roomId}`);
    try {
        const snapshot = await get(roomRef);
        if (snapshot.exists()) {
            currentRoomId = roomId;
            console.log("התחברת בהצלחה לחדר הפעיל:", roomId);
            document.getElementById("roomErrSecFull").classList.add("hide");
            update(roomRef, {
                status: "Connected"
            });
        } else {
            console.log("אופס! החדר הזה אינו קיים או שהמשחק כבר הסתיים על ידי הלוח הראשי.");
            document.getElementById("roomErrSecFull").classList.remove("hide");
        }
    } catch (error) {
        console.error("שגיאה בבדיקת החדר:", error);
        console.log("שגיאה בתקשורת עם השרת. נסה שוב.");
        document.getElementById("roomErrSecFull").classList.remove("hide");
    }

    if (roomRef != '') {
        onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.restart !== undefined && data.restart != false) {
                window.location.reload();
                update(roomRef, {
                    restart: false
                });
            }
        });

        let groupNum = 0;
        onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.groups !== undefined && data.groups !== 0) {
                document.getElementById("startSecFull").classList.add("hide");
                groupNum = data.groups;
                update(roomRef, {
                    groups: 0
                });
                switch (groupNum) {
                    case 2:
                        document.getElementById("orangeBtn").classList.add("disabled");
                        document.getElementById("blueBtn").classList.add("disabled");
                        break;
                    case 3:
                        document.getElementById("blueBtn").classList.add("disabled");
                        break;
                    default:
                        break;
                }
            }
        });
    }
});

  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

const gameRef = ref(db, 'game_session');

function sendScore(newScore) {
    update(roomRef, {
        score: newScore
    });
    console.log(newScore);
}

function sendTeam(newTeam) {
    update(roomRef, {
        team: newTeam
    });
    console.log(newTeam);
}

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
  ["כרית", "לימון", "קוביה הונגרית", "מחק", "פיל", "אוהל", "רדיו", "כוכב"],
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
  ["ספריה", "ליצ'י", "מסך", "טלסקופ", "ינשוף", "פנס", "שרשרת", "מערה"],
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
  ["ספינת מסע", "קיווי", "דבק סלוטייפ", "מקדחה", "עקרב", "מגש", "בול", "שולחן"],
  ["כבאית", "אבוקדו", "עט", "פלס", "חלזון", "סיר", "מסמר", "ארון"],
  ["קורקינט חשמלי", "אגס", "מפתח", "חיפושית", "כף", "מדף", "סכין", "מיטה"],
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
  ["מטרה", "קמח", "ואקום", "נשימה", "צונאמי", "קש", "בחירות", "ריקוד"], /* first 100 */
  ["צינור", "סקרנות", "לחישה", "מרפאה", "גומי", "טיפוס", "מפרץ", "חתימה"],
  ["אנוכיות", "מקלדת", "נחשול", "מסגרת", "מצגת", "דייסה", "כפפה", "יבשת"],
  ["סנאי", "מנהרה", "קטיפה", "חמצן", "מרתף", "זכוכית", "התעטשות", "משוט"],
  ["נשיקה", "גיר", "רכבל", "נשף", "בוץ", "מצפן", "אלבום", "כרטיס"],
  ["חיוך", "קפיץ", "מדליה", "ספה", "בוטן", "שלולית", "אנטנה", "גבינה"],
  ["מצחוק", "ברק", "סולם", "חבית", "ערסל", "מטרונום", "דבש", "שמיכה"],
  ["קונכייה", "חלודה", "קביים", "מזרן", "נרקיס", "פינצטה", "מפתן", "גרעין"],
  ["אצבעון", "מזרקה", "סביבון", "נמשים", "קרוסלה", "מצית", "טלסקופ", "סילון"],
  ["רעשן", "חצובה", "קטיפה", "מגלשה", "צבת", "נול", "עפיפון", "קלמר"],
  ["שבשבת", "חליל", "מצילה", "קרקס", "נבט", "קיסם", "סנפיר", "בועה"],
  ["מנהרת", "זחל", "גחלילית", "מפרש", "חוגה", "אונייה", "דלפק", "מצנפת"],
  ["קוקייה", "חציל", "מגבת", "צמר", "קינמון", "מרקם", "גלימה", "חיוג"],
  ["סליל", "מוסך", "מדרכה", "פנס", "שיקוי", "גביש", "מצנח", "קשת"],
  ["מכתש", "דיונה", "מחסן", "נמל", "טיפה", "להבה", "ענף", "מבצר"],
  ["שרשרת", "קטר", "תחנה", "עוגן", "משקפת", "כוכב", "מפה", "זנב"],
  ["שריון", "קרן", "טלפיים", "נוצה", "קשקש", "כנף", "מקור", "חדק"],
  ["פרסה", "אוכף", "מושכות", "רסן", "חריץ", "נקיק", "צוק", "תהום"],
  ["אפיק", "יובל", "נחל", "ביצה", "אגם", "פסגה", "בקעה", "מישור"],
  ["רמה", "מדרון", "טרסה", "שונית", "אי", "חצי אי", "מיצר", "לגונה"],
  ["גייזר", "לבה", "אפר", "סלע", "חצץ", "חול", "חרס", "בוץ"],
  ["זכוכית", "מתכת", "פלסטיק", "עץ", "בטון", "שיש", "גבס", "אספלט"],
  ["רעפים", "צינור", "מרזב", "ארובה", "חלון", "תריס", "דלת", "מנעול"],
  ["ידית", "מפתן", "מסדרון", "תקרה", "קיר", "רצפה", "מדרגה", "מעקה"],
  ["מעלית", "מחסום", "גדר", "שער", "פעמון", "שלט", "תיבה", "עמוד"],
  ["פנס", "ספסל", "מדרכה", "כביש", "צומת", "כיכר", "שדרה", "סימטה"],
  ["נתיב", "שוליים", "תמרור", "רמזור", "גשר", "מנהרה", "מעבר", "מדרגות"],
  ["דרגנוע", "תחנה", "רציף", "כרטיס", "קרון", "קטר", "פסים", "מחסום"],
  ["מטוס קרב", "מסלול", "נמל", "מגדל", "מכ\"ם", "כנף", "מנוע", "זנב"],
  ["תא", "מושב", "חגורה", "חלון", "גלגל", "בלם", "דוושה", "הגה"],
  ["צופר", "מראה", "פנס", "מגב", "מנוע", "מצבר", "רדיאטור", "מפלט"],
  ["צמיג", "ג'נט", "שלדה", "מתלה", "הילוכים", "מצמד", "בוכנה", "שסתום"],
  ["מצת", "מזרק", "משאבה", "צינור", "מיכל", "פקק", "ידית", "ציר"],
  ["בריח", "צילינדר", "מפתח", "מנעול", "שרשרת", "וו", "טבעת", "מסמר"],
  ["בורג", "אום", "דיסקית", "שייבה", "פין", "ציר", "קפיץ", "גלגל שיניים"],
  ["רצועה", "שרשרת", "גלגלת", "מנוף", "בוכנה", "שסתום", "מדחס", "טורבינה"],
  ["גנרטור", "מנוע", "מצבר", "לוח", "מפסק", "שקע", "תקע", "חוט"],
  ["כבל", "בידוד", "מוליך", "נגד", "קבל", "סליל", "שנאי", "נורה"],
  ["מנורה", "אהיל", "בית נורה", "מפסק", "דימר", "חיישן", "סוללה", "מטען"],
  ["מסך", "מקלדת", "עכבר", "לוח מחיק", "מעבד", "זיכרון", "דיסק", "כרטיס"],
  ["מדפסת", "סורק", "רמקול", "אוזניות", "מיקרופון", "מצלמה", "עדשה", "פלאש"],
  ["חצובה", "תיק", "סוללה", "כרטיס", "כבל", "מתאם", "שלט", "סוללה"],
  ["שעון", "מחוג", "ספרה", "מתנה", "רצועה", "סוגר", "קפיץ", "סוללה"],
  ["טבעת", "יהלום", "זהב", "כסף", "תליון", "שרשרת", "צמיד", "עגיל"],
  ["סיכה", "חרוז", "אבזם", "כפתור", "רוכסן", "כיס", "צווארון", "שרוול"],
  ["מכפלת", "תפר", "חוט", "מחט", "סיכה", "מספריים", "סרט", "כרית"],
  ["בד", "צמר", "משי", "כותנה", "פשתן", "עור", "ניילון", "פוליאסטר"],
  ["מגבת", "סדין", "ציפית", "שמיכה", "כרית", "מזרן", "מיטה", "ארון"],
  ["שידה", "מדף", "שולחן", "כיסא", "שרפרף", "ספה", "כורסה", "הדום"],
  ["שטיח", "וילון", "תמונה", "פסל", "עציץ", "אגרטל", "פרח", "נורת לבה"],
  ["מראה", "שעון", "לוח גיר", "מפה", "נר", "פמוט", "קטורת", "מניפה"], /* first 150 */
  ["חרטה", "צנרת", "עיטוש", "מוסך", "נאמנות", "סנפיר", "תסרוקת", "מצבה"],
  ["שריקה", "בוטן", "כליה", "מרזב", "קנאה", "דחפור", "מפרק", "גומי"],
  ["לעיסה", "ארובה", "לבלב", "מפתח", "גאווה", "מנוף", "ציפורן", "פלסטיק"],
  ["בליעה", "קיר", "קיבה", "בריח", "פחד", "מכבש", "ריסים", "זכוכית"],
  ["נשימה", "תקרה", "כבד", "ציר", "אומץ", "מלגזה", "גבה", "מתכת"],
  ["שיעול", "רצפה", "מעי", "חור", "עצב", "מחרשה", "עפעף", "עץ"],
  ["צחוק", "פינה", "ריאה", "בור", "שמחה", "מזרעה", "סנטר", "בטון"],
  ["בכי", "חלון", "לב", "סדק", "רוגע", "קומביין", "לחי", "שיש"],
  ["צעקה", "דלת", "וריד", "חריץ", "לחץ", "משאית", "רקה", "גבס"],
  ["דיבור", "מדרגה", "עורק", "נקב", "כעס", "מנוף", "עורף", "אספלט"],
  ["שתיקה", "מעקה", "גיד", "חריץ", "עלבון", "ישראל", "גרון", "רעפים"],
  ["קריאה", "עמוד", "שריר", "חתך", "תקווה", "אופנוע", "חזה", "צינור"],
  ["כתיבה", "תקע", "עצם", "שקע", "ייאוש", "אופניים חשמליים", "בטן", "מרזב"],
  ["ציור", "שקע", "גולגולת", "בליטה", "הפתעה", "טישו", "מותן", "ארובה"],
  ["פיסול", "חוט", "שלד", "גבשושית", "שעמום", "רכבת", "ירך", "חלון"],
  ["נגינה", "נורה", "לשון", "חספוס", "סקרנות", "מטוס כיבוי", "ברך", "תריס"],
  ["שירה", "סוללה", "חניכיים", "רכות", "דאגה", "דג זהב", "קרסול", "דלת"],
  ["ריקוד", "מתג", "שן", "קושי", "חמלה", "צוללת", "בוהן", "מנעול"],
  ["ריצה", "לוח", "חיך", "יובש", "עקשנות", "מסוק", "אצבע", "ידית"],
  ["הליכה", "מסך", "גרון", "לחות", "ותרנות", "סירה", "יד", "מפתן"],
  ["קפיצה", "מקלדת", "ושט", "חום", "צניעות", "רחפת", "מרפק", "מסדרון"],
  ["זחילה", "עכבר", "קנה", "קור", "חוצפה", "דאון", "כתף", "תקרה"],
  ["טיפוס", "רמקול", "ריאה", "רעש", "נימוס", "מצנח", "צוואר", "קיר"],
  ["גלישה", "מצלמה", "סרעפת", "שקט", "יושר", "כדור פורח", "מצח", "רצפה"],
  ["שחייה", "מדפסת", "כבד", "אור", "שקר", "רחפן", "סנטר", "מדרגה"],
  ["צלילה", "סורק", "טחול", "חושך", "אמת", "מעבורת", "לחי", "מעקה"],
  ["חתירה", "כבל", "כליה", "צל", "חובה", "חללית", "רקה", "עמוד"],
  ["רכיבה", "שקע", "מעי", "הד", "זכות", "לוויין", "עורף", "תקע"],
  ["טיסה", "תקע", "שלפוחית", "ריח", "חופש", "טיל", "גרון", "שקע"],
  ["נהיגה", "מפסק", "רחם", "טעם", "חוק", "רובוט", "חזה", "חוט"],
  ["בישול", "נתיך", "שחלה", "מגע", "משפט", "מחשב", "בטן", "נורה"],
  ["אפייה", "זרם", "אשך", "צליל", "צדק", "טלפון", "מותן", "סוללה"],
  ["טיגון", "מתח", "ערמונית", "תנועה", "פשע", "רדיו", "ירך", "מתג"],
  ["חיתוך", "התנגדות", "בלוטה", "עצירה", "עונש", "טלוויזיה", "ברך", "לוח"],
  ["קילוף", "קצר", "דם", "מהירות", "פרס", "מקרר", "קרסול", "מסך"],
  ["ערבוב", "בידוד", "פלזמה", "מרחק", "ניצחון", "תנור", "בוהן", "מקלדת"],
  ["תיבול", "הארקה", "לימפה", "גובה", "הפסד", "מיקרוגל", "אצבע", "עכבר"],
  ["מליחה", "קרינה", "הורמון", "עומק", "תיקו", "מדיח", "יד", "רמקול"],
  ["המתקה", "מגנט", "אנזים", "רוחב", "תחרות", "מכונה", "מרפק", "מצלמה"],
  ["הקצפה", "חשמל", "תא", "אורך", "אימון", "מייבש", "כתף", "מדפסת"],
  ["לישה", "אנרגיה", "גרעין", "שטח", "משחק", "מגהץ", "צוואר", "סורק"],
  ["התפחה", "כוח", "ציטופלזמה", "נפח", "חוק", "שואב", "מצח", "כבל"],
  ["שטיפה", "מסה", "ממברנה", "צפיפות", "כלל", "מאוורר", "סנטר", "שקע"],
  ["ניגוב", "משקל", "כרומוזום", "לחץ", "מנהג", "מזגן", "לחי", "תקע"],
  ["טאטוא", "לחץ", "גן", "טמפרטורה", "מסורת", "קומקום", "רקה", "מפסק"],
  ["קרצוף", "טמפרטורה", "דנ\"א", "לחות", "טקס", "מצנם", "עורף", "נתיך"],
  ["צביעה", "מהירות", "חלבון", "קרינה", "אירוע", "בלנדר", "גרון", "זרם"],
  ["תיקון", "תאוצה", "סוכר", "זרם", "חגיגה", "מעבד", "חזה", "מתח"],
  ["בנייה", "חיכוך", "שומן", "מתח", "מועד", "מסחטה", "בטן", "התנגדות"],
  ["הריסה", "גרביטציה", "ויטמין", "תדר", "זמן", "טוסטר", "מותן", "קצר"]
];

let cardsInd = Array.from({length: cardsList.length}, (_, i) => i);

function cardsShuffle() {
    for (let i = cardsInd.length-1; i > 0; i--) {
        let j = Math.floor(Math.random() * (1 + i));
        [cardsInd[i], cardsInd[j]] = [cardsInd[j], cardsInd[i]];
    }
}
cardsShuffle();

let lastWord = "";
function getNextCardInd() {
    update(roomRef, {
        last: lastWord
    });
    if (cardsInd.length === 0) {
        cardsInd = Array.from({length: cardsList.length}, (_, i) => i);
        cardsShuffle();
    }
    let lastCardInd = cardsInd.pop();
    lastWord = cardsList[lastCardInd][(curNumberInd-1)%8];
    return lastCardInd;
}

let teamTime = 60;
let currentTeam = 1;
let teamsScore = [1,1,1,1];
let curNumberInd = 1;

function startRound() {
    curNumberInd = teamsScore[currentTeam-1];
    document.getElementById("cardTxt").innerHTML = cardsList[getNextCardInd()][(curNumberInd-1)%8];
    changeFontSize();
    if (teamsScore[currentTeam-1] != 10 && teamsScore[currentTeam-1] != 21 && teamsScore[currentTeam-1] != 32 && teamsScore[currentTeam-1] != 43) {
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
    update(roomRef, {
        timer: true
    });
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
            // setTimeout(() => {}, 2000);
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
        update(roomRef, {
            last: lastWord
        });
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
        update(roomRef, {
            last: lastWord
        });
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
    if (groupNum == 4) {
        if (currentTeam >= 5) {currentTeam = 1};
    } else if (groupNum == 3) {
        if (currentTeam >= 4) {currentTeam = 1};
    } else if (groupNum == 2) {
        if (currentTeam >= 3) {currentTeam = 1};
    }
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
    update(roomRef, {
        newRound: true
    });
}

function taemToTxt(num) {
    let teamTxt = "";
    switch (num) {
        case 1:
            teamTxt = "player-red";
            break;
        case 2:
            teamTxt = "player-green";
            break;
        case 3:
            teamTxt = "player-orange";
            break;
        case 4:
            teamTxt = "player-blue";
            break;
        default:
            teamTxt = "player-red";
            break;
    }
    return teamTxt;
}

let teamTxtHeb = "";
let teamTxtColor = "#4f4f4f";
function winning() {
    switch (currentTeam) {
        case 1:
            teamTxtHeb = "האדומה";
            teamTxtColor = "#e31919";
            break;
        case 2:
            teamTxtHeb = "הירוקה";
            teamTxtColor = "#099d09";
            break;
        case 3:
            teamTxtHeb = "הכתומה";
            teamTxtColor = "#efa206";
            break;
        case 4:
            teamTxtHeb = "הכחולה";
            teamTxtColor = "#1616d2";
            break;
        default:
            teamTxtHeb = "האדומה";
            teamTxtColor = "#e31919";
            break;
    }
    update(roomRef, {
        win: teamTxtHeb,
        col: teamTxtColor
    });
}

document.getElementById("rightBtn").addEventListener("click", function() {
    teamsScore[currentTeam-1]+=1;
    if (teamsScore[currentTeam-1] >= 49) {
        winning();
        document.getElementById("winningMessageColor").innerHTML = teamTxtHeb;
        document.getElementById("winningMessageColor").style.color = teamTxtColor;
        document.getElementById("endSec").classList.add("show");
    } else {
        sendTeam(taemToTxt(currentTeam));
        sendScore(teamsScore[currentTeam-1]);
        document.getElementById("cardTxt").innerHTML = cardsList[getNextCardInd()][(curNumberInd-1)%8];
        changeFontSize();
    }
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