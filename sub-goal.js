const SUB_GOAL_AMOUNT = 100;
let currentSubs = 0;

function updateProgress() {
  const percent = Math.min(1, currentSubs / SUB_GOAL_AMOUNT);
  const circle = document.getElementById("progress-ring-sub");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percent * circumference;
  circle.style.strokeDashoffset = offset;

  document.getElementById('goal-label-sub').innerHTML =
    `Sub Goal<br>${currentSubs} / ${SUB_GOAL_AMOUNT}`;
}

// Pour StreamElements, les données de subs viennent directement des événements
// Cette fonction est gardée pour une future intégration API si nécessaire
function initializeSubs() {
  // Les subs seront mis à jour via onWidgetLoad et onEventReceived
  console.log('Widget initialisé - en attente des données StreamElements');
}

window.addEventListener('onEventReceived', function (obj) {
  const event = obj.detail.event;
  if (event && (event.type === 'subscriber' || event.type === 'gift')) {
    currentSubs += 1;
    updateProgress();
  }
});

// Ajout du listener pour récupérer les données initiales depuis StreamElements
window.addEventListener('onWidgetLoad', function (obj) {
  const data = obj.detail.session.data;
  const fieldData = obj.detail.fieldData;
  
  // Récupération du nombre de subs actuel
  if (data && data["subscriber-session"] && data["subscriber-session"]["count"]) {
    currentSubs = data["subscriber-session"]["count"];
  }
  
  updateProgress();
  console.log('Subs actuels:', currentSubs);
});

// Initialisation
updateProgress();
initializeSubs();