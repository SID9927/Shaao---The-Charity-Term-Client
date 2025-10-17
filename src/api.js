const BASE = import.meta.env.VITE_API_BASE

export async function getNextAck() {
  const res = await fetch(`${BASE}/entries/next-ack`)
  if (!res.ok) throw new Error('Failed to get next ack')
  return res.json()
}

export async function createEntry(payload) {
  const res = await fetch(`${BASE}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed')
  return data
}

export async function sendEmail({ toMail, subject, messageBody }) {
  const res = await fetch(`${BASE}/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toMail, subject, messageBody }),
  });

  if (!res.ok) {
    throw new Error("Failed to send email");
  }

  return await res.json();
}


export async function fetchEntriesApi() {
  try {
    const res = await fetch(`${BASE}/admin/entries`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching entries:", err);
    throw err;
  }
}