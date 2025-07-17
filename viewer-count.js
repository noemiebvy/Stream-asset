const VIEWER_GOAL = 75;
let currentViewers = 0;

function updateProgress() {
  const percent = Math.min(1, currentViewers / VIEWER_GOAL);
  const circle = document.getElementById("progress-ring");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percent * circumference;
  circle.style.strokeDashoffset = offset;

  document.getElementById('goal-label').innerHTML =
    `VIEWERS<br>${currentViewers} / ${VIEWER_GOAL}`;
}

// Fonction pour récupérer les viewers via l'API StreamElements
function fetchViewers() {
  // Utilise l'API StreamElements pour récupérer les données de viewers
  fetch('https://api.streamelements.com/kappa/v2/chatstats/noemiee/stats')
    .then(response => response.json())
    .then(data => {
      if (data && data.viewers) {
        currentViewers = data.viewers;
        console.log('Viewers récupérés via API:', currentViewers);
        updateProgress();
      }
    })
    .catch(error => console.error('Erreur API viewers:', error));
}

// StreamElements - Récupération initiale des données
window.addEventListener('onWidgetLoad', function (obj) {
  console.log('Widget chargé, objet reçu:', obj);
  
  // Récupère les viewers depuis l'objet channel
  if (obj.detail && obj.detail.channel) {
    currentViewers = obj.detail.channel.viewers || 0;
    console.log('Viewers depuis channel:', currentViewers);
  }
  
  // Fallback: récupération via API
  if (currentViewers === 0) {
    fetchViewers();
  } else {
    updateProgress();
  }
});

// StreamElements - Mise à jour en temps réel
window.addEventListener('onEventReceived', function (obj) {
  const event = obj.detail.event;
  
  // Les viewers ne sont pas mis à jour via onEventReceived normalement
  // Mais on peut rafraîchir périodiquement
  console.log('Événement reçu:', event);
});

// StreamElements - Mise à jour de session
window.addEventListener('onSessionUpdate', function (obj) {
  console.log('Session mise à jour:', obj);
  
  // Récupération des viewers depuis les données de session
  if (obj.detail && obj.detail.channel) {
    currentViewers = obj.detail.channel.viewers || 0;
    console.log('Viewers depuis session update:', currentViewers);
    updateProgress();
  }
});

// Mise à jour périodique des viewers (toutes les 30 secondes)
setInterval(() => {
  fetchViewers();
}, 30000);

// Initialisation
updateProgress();