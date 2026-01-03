const os = require("os");

function getLocalIPv4() {
  const nets = os.networkInterfaces();
  const candidates = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family !== "IPv4") continue;
      if (net.internal) continue;
      candidates.push(net.address);
    }
  }

  // Prefer common Wi-Fi/Ethernet interface ordering if present.
  const preferredOrder = ["en0", "en1", "wlan0", "eth0"];
  for (const pref of preferredOrder) {
    const list = nets[pref] || [];
    const hit = list.find((n) => n.family === "IPv4" && !n.internal);
    if (hit) return hit.address;
  }

  return candidates[0] || "127.0.0.1";
}

process.stdout.write(getLocalIPv4() + "\n");


