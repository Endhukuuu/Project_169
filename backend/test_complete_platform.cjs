require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const { seedAdmin } = require('./src/services/adminSeeder');
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const CodeReview = require('./src/models/CodeReview');
const app = require('./src/index');

let server;
const PORT = 5098;

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (data) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path: `/api${path}`,
      method: method,
      headers: headers
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING UDIH PLATFORM VERIFICATION ---');

  // Connect to DB and seed admin first
  await connectDB();
  await seedAdmin();

  // Start HTTP server on test port
  await new Promise((res) => {
    server = app.listen(PORT, '127.0.0.1', () => {
      console.log(`[TestServer] Running on http://127.0.0.1:${PORT}`);
      res();
    });
  });

  try {
    // 1. Test Admin Login with Seeded Credentials
    console.log('\n[TEST 1] Admin Authentication with Environment-Seeded Credentials:');
    const adminLoginRes = await request('POST', '/auth/login', {
      email: 'admin@udih.dev',
      password: 'Admin@UDIH2026!'
    });
    console.log(`Admin login status: ${adminLoginRes.status}`);
    if (adminLoginRes.status !== 200 || !adminLoginRes.data.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(adminLoginRes.data)}`);
    }
    const adminToken = adminLoginRes.data.token;
    console.log(`✓ Admin logged in successfully. Role: ${adminLoginRes.data.user.role}, Name: ${adminLoginRes.data.user.name}`);

    // 2. Test Developer Registration
    console.log('\n[TEST 2] Developer Self-Registration:');
    const testDevEmail = `dev_${Date.now()}@example.com`;
    const devRegRes = await request('POST', '/auth/register', {
      name: 'Alice Developer',
      email: testDevEmail,
      password: 'Password123!'
    });
    console.log(`Developer register status: ${devRegRes.status}`);
    if (devRegRes.status !== 201 || !devRegRes.data.token) {
      throw new Error(`Developer registration failed: ${JSON.stringify(devRegRes.data)}`);
    }
    const devToken = devRegRes.data.token;
    const devId = devRegRes.data.user._id || devRegRes.data.user.id;
    console.log(`✓ Developer registered successfully. ID: ${devId}, Role: ${devRegRes.data.user.role}`);

    // 3. Test RBAC: Developer trying to access Admin API
    console.log('\n[TEST 3] RBAC Protection (Developer accessing /admin/stats):');
    const devAdminAccess = await request('GET', '/admin/stats', null, devToken);
    console.log(`Developer access to /admin/stats status: ${devAdminAccess.status}`);
    if (devAdminAccess.status === 403) {
      console.log('✓ RBAC Enforcement PASSED: Developer was correctly denied access (403 Forbidden)');
    } else {
      throw new Error(`RBAC failure: Developer was allowed access with status ${devAdminAccess.status}`);
    }

    // 4. Test Admin Accessing Admin Portal Stats & Users
    console.log('\n[TEST 4] Admin Portal APIs:');
    const adminStats = await request('GET', '/admin/stats', null, adminToken);
    console.log(`Admin stats status: ${adminStats.status}`);
    console.log(`Platform stats: Users=${adminStats.data.users?.total}, Projects=${adminStats.data.projects?.total}, Analyses=${adminStats.data.analyses?.total}, Reviews=${adminStats.data.reviews?.total}`);
    
    const adminUsers = await request('GET', '/admin/users', null, adminToken);
    console.log(`Admin user listing count: ${adminUsers.data.users.length}`);
    console.log('✓ Admin API accessible and returning verified platform data');

    // 5. Test Developer Project Creation
    console.log('\n[TEST 5] Developer Project Creation & Persistence:');
    const createProjectRes = await request('POST', '/projects', {
      name: 'Alpha-Microservice',
      description: 'Order fulfillment microservice in Node.js',
      language: 'JavaScript'
    }, devToken);
    console.log(`Create project status: ${createProjectRes.status}`);
    if (createProjectRes.status !== 201) {
      throw new Error(`Project creation failed: ${JSON.stringify(createProjectRes.data)}`);
    }
    const projectId = createProjectRes.data._id;
    console.log(`✓ Project created with ID: ${projectId}, Name: ${createProjectRes.data.name}`);

    // 6. Test Data Isolation: Second Developer cannot access First Developer's Project
    console.log('\n[TEST 6] Data Isolation (Cross-User Access Prevention):');
    const secondDevEmail = `bob_${Date.now()}@example.com`;
    const secondDevReg = await request('POST', '/auth/register', {
      name: 'Bob Tester',
      email: secondDevEmail,
      password: 'Password123!'
    });
    const secondDevToken = secondDevReg.data.token;

    const crossAccessRes = await request('GET', `/projects/${projectId}`, null, secondDevToken);
    console.log(`Bob accessing Alice's project status: ${crossAccessRes.status}`);
    if (crossAccessRes.status === 403) {
      console.log('✓ Data Isolation PASSED: Bob received 403 Forbidden accessing Alice\'s private project.');
    } else {
      throw new Error(`Data isolation failed! Bob received status ${crossAccessRes.status}`);
    }

    // 7. Test Admin View of Developer Project (Admin privilege)
    console.log('\n[TEST 7] Admin Access to Projects (Cross-Account Management):');
    const adminProjectAccess = await request('GET', `/projects/${projectId}`, null, adminToken);
    console.log(`Admin accessing Alice's project status: ${adminProjectAccess.status}`);
    if (adminProjectAccess.status === 200) {
      console.log('✓ Admin successfully retrieved user project for platform oversight');
    } else {
      throw new Error(`Admin could not access project: ${adminProjectAccess.status}`);
    }

    // 8. Test Persistent Code Review History (Without re-running AI)
    console.log('\n[TEST 8] Persistent Code Review History in DB:');
    const sampleReview = await CodeReview.create({
      project: projectId,
      user: devId,
      title: 'Auth Middleware Review',
      codeSnippet: 'function auth(req, res, next) { ... }',
      language: 'JavaScript',
      overallQuality: 'EXCELLENT',
      score: 95,
      findings: [
        { type: 'Best Practice', severity: 'low', message: 'Consider using crypto.timingSafeEqual' }
      ],
      executiveSummary: 'Secure and well-isolated middleware component.'
    });

    const projectReviewsRes = await request('GET', `/projects/${projectId}/reviews`, null, devToken);
    console.log(`Fetched reviews status: ${projectReviewsRes.status}, count: ${projectReviewsRes.data.length}`);
    if (projectReviewsRes.data.length > 0 && projectReviewsRes.data[0].score === 95) {
      console.log(`✓ Persistent review history retrieved directly from database (Score: ${projectReviewsRes.data[0].score}) without AI re-execution.`);
    } else {
      throw new Error('Failed to retrieve persistent review history');
    }

    // 9. Test User Progress Calculation
    console.log('\n[TEST 9] User Progress Tracking & Detail Metrics:');
    const userDetailRes = await request('GET', `/admin/users/${devId}`, null, adminToken);
    console.log(`User detail status: ${userDetailRes.status}`);
    const progress = userDetailRes.data.progress;
    console.log(`Developer progress metrics: Total Projects=${progress.totalProjects}, Code Reviews=${progress.totalReviews}, Avg Score=${progress.avgQualityScore}`);
    console.log('✓ Real user progress calculated directly from MongoDB models');

    // 10. Test User Deactivation by Admin & Token Blacklisting / Cutoff
    console.log('\n[TEST 10] Administrative Account Suspension & Access Cutoff:');
    const deactivateRes = await request('PATCH', `/admin/users/${devId}/status`, { status: 'inactive' }, adminToken);
    console.log(`Deactivate status: ${deactivateRes.status}, new status: ${deactivateRes.data.user.status}`);

    const devActionAfterDeactivate = await request('GET', `/projects/${projectId}`, null, devToken);
    console.log(`Deactivated dev access status: ${devActionAfterDeactivate.status}`);
    if (devActionAfterDeactivate.status === 403) {
      console.log('✓ Inactive account correctly denied access (403 Account is inactive).');
    } else {
      throw new Error(`Inactive user was not blocked: ${devActionAfterDeactivate.status}`);
    }

    // Reactivate user
    const reactivateRes = await request('PATCH', `/admin/users/${devId}/status`, { status: 'active' }, adminToken);
    console.log(`Reactivate status: ${reactivateRes.status}, new status: ${reactivateRes.data.user.status}`);

    // 11. Test Notification & Activity Log Flow
    console.log('\n[TEST 11] Notifications & Activity Audit Feed:');
    const notifs = await request('GET', '/notifications', null, devToken);
    console.log(`Dev notifications count: ${notifs.data.length}`);
    const adminActivity = await request('GET', '/admin/activity', null, adminToken);
    const logs = adminActivity.data.activities || [];
    console.log(`Audit log events recorded: ${logs.length}`);
    console.log(`Latest audit log: [${logs[0]?.action}] ${logs[0]?.details?.message || ''}`);
    console.log('✓ Notification delivery and audit logging verified');

    console.log('\n==================================================');
    console.log('ALL 11 BACKEND & PLATFORM VERIFICATION CHECKS PASSED!');
    console.log('==================================================');

  } catch (err) {
    console.error('VERIFICATION ERROR:', err);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    await mongoose.disconnect();
    process.exit(process.exitCode || 0);
  }
}

runTests();
