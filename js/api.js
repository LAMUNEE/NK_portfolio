
const API_URL = "/api/meter-usage";

// API Hinghoihome Functions


async function fetchUsage(mac, lower, upper) {
  const response = await fetch("/api/meter-usage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // ไม่ต้องส่ง x-api-key แล้ว server จัดการให้
    },
    body: JSON.stringify({
      meter_mac_address: mac,
      lower_timestamptz: lower,
      upper_timestamptz: upper,
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    console.log('Error response:', body);
    console.log('code:', body.code);
    console.log('message:', body.message);
    throw new Error(`${body.code}: ${body.message}`);
  }

  return {
    lower_kwh: body.lower.unit_kwh,
    lower_time: body.lower.timestamptz,
    upper_kwh: body.upper.unit_kwh,
    upper_time: body.upper.timestamptz,
    used_kwh: parseFloat((body.upper.unit_kwh - body.lower.unit_kwh).toFixed(3)),
    raw: body
  };
}

async function runAPI() {
  const mac   = document.getElementById('meterId').value.trim();
  const lower = document.getElementById('lowerTs').value.trim();
  const upper = document.getElementById('upperTs').value.trim();
  const statusBar   = document.getElementById('statusBar');
  const responseArea = document.getElementById('responseArea');

  if (!mac) {
    statusBar.innerHTML = '<span class="status-badge status-err">⚠ กรุณาใส่ MAC Address</span>';
    return;
  }

  statusBar.innerHTML = '<span class="status-badge status-wait">⏳ กำลังส่ง Request...</span>';
  responseArea.textContent = '// กำลังเชื่อมต่อ API จริง...';

  const t0 = Date.now();

  try {
    const data = await fetchUsage(mac, lower, upper);
    const ms = Date.now() - t0;

    statusBar.innerHTML = `<span class="status-badge status-200">200 OK</span><span style="font-size:12px;color:var(--muted)"> · ${ms}ms</span>`;

    responseArea.textContent = JSON.stringify({
      lower: { unit_kwh: data.lower_kwh, timestamptz: data.lower_time },
      upper: { unit_kwh: data.upper_kwh, timestamptz: data.upper_time },
      _summary: {
        meter_mac_address: mac,
        lower_timestamptz: lower,
        upper_timestamptz: upper,
        used_kwh: data.used_kwh,
        note: `การใช้งาน = ${data.upper_kwh} - ${data.lower_kwh} = ${data.used_kwh} kWh`
      }
    }, null, 2);

  } catch (err) {
    const ms = Date.now() - t0;
    statusBar.innerHTML = `<span class="status-badge status-err">Error · ${ms}ms</span>`;
    responseArea.textContent = `// เกิดข้อผิดพลาด:\n${err.message}\n\n// อาจเกิดจาก CORS policy บน browser\n// แนะนำให้ทดสอบผ่าน Node.js หรือ Postman แทน`;
  }
}


