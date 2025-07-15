const VIEWER_GOAL = 75;
let currentViewers = 0;

function updateProgress() {
  const percent = Math.min(1, currentViewers / VIEWER_GOAL);
  const circle = document.getElementById("progress-ring");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDashoffset = circumference - percent * circumference;

  document.getElementById("goal-label").innerHTML =
    `VIEWERS COUNT<br>${currentViewers} / ${VIEWER_GOAL}`;
}

function getViewers(session) {
  if (!session) return 0;
  
  if (session.viewers) {
    if (typeof session.viewers === "number") return session.viewers;
    if (session.viewers.twitch) return session.viewers.twitch;
    if (session.viewers.current) return session.viewers.current;
  }
  if (session.channel && session.channel.viewers) return session.channel.viewers;
  return 0;
}

window.addEventListener("onWidgetLoad", function(obj) {
  const session = obj.detail.session;
  currentViewers = getViewers(session);
  updateProgress();
  console.log("WidgetLoad – viewers:", currentViewers);
});

window.addEventListener("onSessionUpdate", function(obj) {
  const session = obj.detail.session;
  currentViewers = getViewers(session);
  updateProgress();
  console.log("SessionUpdate – viewers:", currentViewers);
});

updateProgress();