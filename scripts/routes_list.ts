// scripts/show-routes.ts
import app from '../src/server';
import listEndpoints from 'express-list-endpoints';

const routes = listEndpoints(app);

if (routes.length === 0) {
  console.log('❌ No routes found. Check if routes are mounted correctly.');
} else {
  console.log('📋 List of Routes:\n');
  for (const route of routes) {
    console.log(`${route.methods.join(', ').padEnd(10)} ${route.path}`);
  }
}
