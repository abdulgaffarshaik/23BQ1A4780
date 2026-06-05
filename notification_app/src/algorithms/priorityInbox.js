import { NOTIFICATION_TYPES, PRIORITY_WEIGHTS } from '../utils/constants.js';

function calculateRecencyScore(timestamp, allNotifications) {
  const notificationTime = new Date(timestamp).getTime();
  const now = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000;

  const age = now - notificationTime;
  const recencyRatio = Math.max(0, 1 - age / maxAge);
  const recencyScore = Math.round(recencyRatio * 99);

  return recencyScore;
}

function calculatePriorityScore(notification, allNotifications) {
  const typeWeight = PRIORITY_WEIGHTS[notification.Type] || 0;
  const recencyScore = calculateRecencyScore(notification.Timestamp, allNotifications);

  const score = typeWeight * 100 + recencyScore;
  return score;
}

export function buildPriorityInbox(notifications) {
  const scoredNotifications = notifications.map(notification => ({
    ...notification,
    priorityScore: calculatePriorityScore(notification, notifications)
  }));

  const sorted = scoredNotifications.sort(
    (a, b) => b.priorityScore - a.priorityScore
  );

  return sorted.slice(0, 10);
}

export function groupByType(notifications) {
  const grouped = {
    [NOTIFICATION_TYPES.PLACEMENT]: [],
    [NOTIFICATION_TYPES.RESULT]: [],
    [NOTIFICATION_TYPES.EVENT]: []
  };

  notifications.forEach(notification => {
    if (grouped[notification.Type]) {
      grouped[notification.Type].push(notification);
    }
  });

  return grouped;
}

export function getHighPriority(notifications) {
  const priorityInbox = buildPriorityInbox(notifications);
  
  return priorityInbox.filter(notif => {
    const typeWeight = PRIORITY_WEIGHTS[notif.Type] || 0;
    return typeWeight >= 2;
  });
}
