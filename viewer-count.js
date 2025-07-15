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

// StreamElements - Récupération initiale des données
window.addEventListener('onWidgetLoad', function (obj) {
  // Récupère les données de la session
  const data = obj.detail.session.data;
  
  // Vérification des viewers dans la structure StreamElements
  if (data && data['channel-viewers'] && data['channel-viewers']['count']) {
    currentViewers = data['channel-viewers']['count'];
  } else if (data && data['viewer-count']) {
    currentViewers = data['viewer-count'];
  } else if (obj.detail.channel && obj.detail.channel.viewers) {
    currentViewers = obj.detail.channel.viewers;
  }
  
  console.log('Viewers actuels au chargement:', currentViewers);
  updateProgress();
});

// StreamElements - Mise à jour en temps réel
window.addEventListener('onEventReceived', function (obj) {
  const event = obj.detail.event;
  
  // Vérification pour mise à jour des viewers
  if (event && event.type === 'viewerCount') {
    currentViewers = event.count || event.viewers || 0;
    console.log('Mise à jour viewers:', currentViewers);
    updateProgress();
  }
});

// StreamElements - Mise à jour de session
window.addEventListener('onSessionUpdate', function (obj) {
  const data = obj.detail.session;
  
  // Mise à jour avec les données de session
  if (data && data['channel-viewers'] && data['channel-viewers']['count']) {
    currentViewers = data['channel-viewers']['count'];
  } else if (data && data['viewer-count']) {
    currentViewers = data['viewer-count'];
  } else if (data && data.channel && data.channel.viewers) {
    currentViewers = data.channel.viewers;
  }
  
  console.log('Mise à jour session - Viewers:', currentViewers);
  updateProgress();
});

// Initialisation
updateProgress();