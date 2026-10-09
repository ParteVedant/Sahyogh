const http = require("http");

const TARGET_HOST = "localhost";
const TARGET_PORT = 5000;
const TOTAL_REQUESTS = 200; // 200 requests stress run
const CONCURRENCY = 20; // 20 parallel concurrent workers

const ENDPOINTS = [
  { path: "/api/v1/health", method: "GET", role: "CONSUMER" },
  { path: "/api/v1/requests", method: "GET", role: "COOPERATIVE_ADMIN" },
  { path: "/api/v1/admin/dashboard-stats", method: "GET", role: "COOPERATIVE_ADMIN" },
  { path: "/api/v1/requests/REQ-1042/candidates", method: "POST", role: "COOPERATIVE_ADMIN" },
  { path: "/api/v1/worker/jobs", method: "GET", role: "WORKER" },
];

let completedRequests = 0;
let successCount = 0;
let errorCount = 0;
const latencies = [];

function sendRequest(endpointConfig) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const options = {
      hostname: TARGET_HOST,
      port: TARGET_PORT,
      path: endpointConfig.path,
      method: endpointConfig.method,
      headers: {
        "Content-Type": "application/json",
        "x-user-role": endpointConfig.role,
        "x-user-id": "stress-test-user",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        const latency = Date.now() - startTime;
        latencies.push(latency);
        completedRequests++;
        if (res.statusCode >= 200 && res.statusCode < 400) {
          successCount++;
        } else {
          errorCount++;
        }
        resolve();
      });
    });

    req.on("error", (err) => {
      const latency = Date.now() - startTime;
      latencies.push(latency);
      completedRequests++;
      errorCount++;
      resolve();
    });

    if (endpointConfig.method === "POST") {
      req.write(JSON.stringify({ dummy: true }));
    }
    req.end();
  });
}

async function runStressTest() {
  console.log("=================================================");
  console.log("🔥 SAHYOG BACKEND REST API STRESS TEST RUNNER 🔥");
  console.log("=================================================");
  console.log(`Target: http://${TARGET_HOST}:${TARGET_PORT}`);
  console.log(`Total Requests: ${TOTAL_REQUESTS}`);
  console.log(`Concurrent Batch Size: ${CONCURRENCY}`);
  console.log("-------------------------------------------------");

  const overallStartTime = Date.now();

  for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENCY) {
    const batch = [];
    for (let j = 0; j < CONCURRENCY && i + j < TOTAL_REQUESTS; j++) {
      const endpoint = ENDPOINTS[(i + j) % ENDPOINTS.length];
      batch.push(sendRequest(endpoint));
    }
    await Promise.all(batch);
  }

  const totalTimeMs = Date.now() - overallStartTime;
  const totalSec = totalTimeMs / 1000;
  const rps = (completedRequests / totalSec).toFixed(2);

  latencies.sort((a, b) => a - b);
  const minLatency = latencies[0] || 0;
  const maxLatency = latencies[latencies.length - 1] || 0;
  const avgLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length || 0).toFixed(2);
  const p50 = latencies[Math.floor(latencies.length * 0.50)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;

  console.log("\n📊 STRESS TEST PERFORMANCE REPORT:");
  console.log("-------------------------------------------------");
  console.log(`✅ Total Completed Requests : ${completedRequests}`);
  console.log(`🟢 Successful (HTTP 2xx)    : ${successCount}`);
  console.log(`🔴 Failed / Errors          : ${errorCount}`);
  console.log(`⚡ Execution Total Time     : ${totalSec.toFixed(2)} seconds`);
  console.log(`🚀 Throughput (RPS)          : ${rps} req/sec`);
  console.log("-------------------------------------------------");
  console.log("⏱️ LATENCY METRICS:");
  console.log(`   - Min Latency            : ${minLatency} ms`);
  console.log(`   - Average Latency        : ${avgLatency} ms`);
  console.log(`   - Median (p50) Latency    : ${p50} ms`);
  console.log(`   - 95th Percentile (p95)  : ${p95} ms`);
  console.log(`   - 99th Percentile (p99)  : ${p99} ms`);
  console.log(`   - Max Latency            : ${maxLatency} ms`);
  console.log("=================================================");

  if (errorCount === 0 && rps > 50) {
    console.log("🎉 RESULT: STRESS TEST PASSED WITH 100% SUCCESS RATE!");
  } else if (errorCount === 0) {
    console.log("✅ RESULT: STRESS TEST PASSED SUCCESSFULLY!");
  } else {
    console.log("⚠️ RESULT: STRESS TEST COMPLETED WITH SOME ERRORS.");
  }
}

runStressTest();
