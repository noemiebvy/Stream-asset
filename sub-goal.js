let SUB_GOAL_AMOUNT = 100;
const GOAL_INCREMENT = 20; // Augmente de 20 à chaque fois que le goal est atteint
let currentSubs = 0;

function updateProgress() {
  // Auto-increase du goal si on l'a dépassé
  while (currentSubs >= SUB_GOAL_AMOUNT) {
    SUB_GOAL_AMOUNT += GOAL_INCREMENT;
  }
  
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
  
  console.log('Event reçu:', listener, event);
  
  // Vérification du type d'événement
  if (listener === 'subscriber-latest' || 
      (event && event.type === 'subscriber') ||
      (event && event.type === 'gift' && event.gifted) ||
      (event && event.type === 'subgift')) {
    
    // Pour les gift subs, on ne traite que l'événement principal, pas les individuels
    if (event.bulkGifted && !event.isCommunityGift) {
      // C'est un gift sub individuel dans un bulk, on l'ignore pour éviter de compter deux fois
      return;
    }
    
    // Incrémentation du compteur
    if (event.amount && event.amount > 1) {
      currentSubs += event.amount; // Pour les gift subs multiples
      console.log(`Bulk gift subs! +${event.amount} Total:`, currentSubs);
    } else {
      currentSubs += 1; // Pour un sub normal ou gift sub unique
      console.log('Nouveau sub! Total:', currentSubs);
    }
    
    updateProgress();
  }
});

// StreamElements - Mise à jour de session
window.addEventListener('onSessionUpdate', function (obj) {
  const data = obj.detail.session;
  
  // Mise à jour avec les données de session
  // On utilise le total au lieu de la session pour éviter le reset
  if (data['subscriber-total'] && data['subscriber-total']['count']) {
    currentSubs = data['subscriber-total']['count'];
    console.log('Mise à jour session - Subs total:', currentSubs);
    updateProgress();
  } else if (data['subscriber-month'] && data['subscriber-month']['count']) {
    // Fallback sur le compteur mensuel si le total n'est pas disponible
    currentSubs = data['subscriber-month']['count'];
    console.log('Mise à jour session - Subs mois:', currentSubs);
    updateProgress();
  }
});

// Initialisation
updateProgress();