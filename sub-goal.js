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

// StreamElements - Récupération initiale des données
window.addEventListener('onWidgetLoad', function (obj) {
  // Récupère les données de la session
  const data = obj.detail.session.data;
  
  // Différentes façons de récupérer le nombre de subs selon la config StreamElements
  if (data['subscriber-session'] && data['subscriber-session']['count']) {
    currentSubs = data['subscriber-session']['count'];
  } else if (data['subscriber-total'] && data['subscriber-total']['count']) {
    currentSubs = data['subscriber-total']['count'];
  } else if (data['subscriber-month'] && data['subscriber-month']['count']) {
    currentSubs = data['subscriber-month']['count'];
  }
  
  console.log('Subs actuels au chargement:', currentSubs);
  updateProgress();
});

// StreamElements - Mise à jour en temps réel
window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const event = obj.detail.event;
  
  // Vérification du type d'événement
  if (listener === 'subscriber-latest' || 
      (event && event.type === 'subscriber') ||
      (event && event.type === 'gift' && event.gifted)) {
    
    // Incrémentation du compteur
    if (event.amount) {
      currentSubs += event.amount; // Pour les gift subs multiples
    } else {
      currentSubs += 1; // Pour un sub normal
    }
    
    console.log('Nouveau sub! Total:', currentSubs);
    updateProgress();
  }
});

// StreamElements - Mise à jour de session
window.addEventListener('onSessionUpdate', function (obj) {
  const data = obj.detail.session;
  
  // Mise à jour avec les données de session
  if (data['subscriber-session'] && data['subscriber-session']['count']) {
    currentSubs = data['subscriber-session']['count'];
    console.log('Mise à jour session - Subs:', currentSubs);
    updateProgress();
  }
});

// Initialisation
updateProgress();