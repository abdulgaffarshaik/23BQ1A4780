import { authenticate, setAccessToken } from './services/auth.js';
import { fetchDepots } from './services/depots.js';
import { fetchVehicles } from './services/vehicles.js';
import { solveKnapsack } from './algorithms/knapsack.js';
import env from './config/env.js';

async function scheduleVehicleMaintenance() {
  
  console.log('VEHICLE MAINTENANCE SCHEDULER');
  

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

  const depotsResult = await fetchDepots();
  if (!depotsResult.success) {
    console.error('Failed to fetch depots');
    return;
  }

  const vehiclesResult = await fetchVehicles();
  if (!vehiclesResult.success) {
    console.error('Failed to fetch vehicles');
    return;
  }

  const depots = depotsResult.data;
  const tasks = vehiclesResult.data;

  console.log('DEPOTS:');
  depots.forEach(depot => {
    console.log(`  • Depot ${depot.ID}: ${depot.MechanicHours} hours available`);
  });

  console.log('VEHICLES:');
  tasks.forEach(task => {
    console.log(`  • Task ${task.TaskID}: ${task.Duration}h duration, ${task.Impact} impact`);
  });

  console.log('SCHEDULING RESULTS:');
  depots.forEach(depot => {
    const result = solveKnapsack(depot.MechanicHours, tasks);

    console.log(`\n  DEPOT ${depot.ID}:`);
    console.log(`    Selected Tasks: ${result.selectedTasks.length}`);
    result.selectedTasks.forEach(task => {
      console.log(`      ✓ Task ${task.TaskID} (${task.Duration}h, ${task.Impact} impact)`);
    });
    console.log(`    Total Duration: ${result.totalDuration}h`);
    console.log(`    Total Impact: ${result.totalImpact}`);
    console.log(`    Remaining Capacity: ${result.remainingCapacity}h`);
  });

  console.log('Scheduling complete');
}

scheduleVehicleMaintenance().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
