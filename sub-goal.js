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

async function fetchCurrentSubs() {
  try {
    const response = await fetch('https://api.streamelements.com/kappa/v2/channels/noemiee/subscribers');
    const data = await response.json();
    currentSubs = data.count || 0;
    updateProgress();
  } catch (error) {
    console.error('Erreur lors de la récupération des subs:', error);
  }
}

window.addEventListener('onEventReceived', function (obj) {
  const event = obj.detail.event;
  if (event && (event.type === 'subscriber' || event.type === 'gift')) {
    currentSubs += 1;
    updateProgress();
  }
});

updateProgress();
fetchCurrentSubs();
setInterval(fetchCurrentSubs, 30000);