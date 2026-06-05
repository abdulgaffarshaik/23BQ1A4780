import { authenticate, setAccessToken } from './services/auth.js';
import { fetchNotifications } from './services/notifications.js';
import { buildPriorityInbox, groupByType } from './algorithms/priorityInbox.js';
import env from './config/env.js';

async function processNotifications() {
  
  console.log('CAMPUS NOTIFICATION SYSTEM');
 

  const authResult = await authenticate({
    email: env.EMAIL,
    name: env.NAME,
    rollNo: env.ROLL_NO,
    accessCode: env.ACCESS_CODE,
    clientID: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET
  });

  if (!authResult.success) {
    console.error('Authentication failed');
    return;
  }

  setAccessToken(authResult.data.access_token);

  const notificationsResult = await fetchNotifications();
  if (!notificationsResult.success) {
    console.error('Failed to fetch notifications');
    return;
  }

  const notifications = notificationsResult.data;
  const priorityInbox = buildPriorityInbox(notifications);
  const grouped = groupByType(notifications);

  console.log('NOTIFICATION STATISTICS:');
  console.log(`  Total Notifications: ${notifications.length}`);
  console.log(`  Placements: ${grouped['Placement'].length}`);
  console.log(`  Results: ${grouped['Result'].length}`);
  console.log(`  Events: ${grouped['Event'].length}`);

  console.log('TOP 10 NOTIFICATIONS:');
  priorityInbox.forEach((notif, index) => {
    const priority = notif.priorityScore >= 300 ? 'HIGH' : notif.priorityScore >= 100 ? 'MEDIUM' : 'LOW';
    console.log(`  ${index + 1}. [${notif.Type}] ${notif.Message}`);
    console.log(`     Priority: ${priority} (Score: ${notif.priorityScore})`);
  });

  console.log('Notification processing complete');
}

processNotifications().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
