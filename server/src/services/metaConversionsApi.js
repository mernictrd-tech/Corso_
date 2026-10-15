
const crypto = require("crypto");

const META_PIXEL_ID = process.env.META_PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;
const META_API_VERSION = process.env.META_API_VERSION;

const sha256 = (value) =>
  crypto.createHash("sha256").update(value, "utf8").digest("hex");

async function sendMetaEvent({
  eventName,
  eventId,
  eventTime,
  eventSourceUrl,
  userData = {},
  customData = {},
}) {
  if (!META_PIXEL_ID || !META_ACCESS_TOKEN || !META_API_VERSION) {
    console.warn("Meta CAPI is not configured.");
    return null;
  }

  const normalizedEmail = userData.email?.trim().toLowerCase();
  const normalizedPhone = userData.phone?.replace(/\D/g, "");

  const metaUserData = {
    ...(normalizedEmail ? { em: [sha256(normalizedEmail)] } : {}),
    ...(normalizedPhone ? { ph: [sha256(normalizedPhone)] } : {}),
    ...(userData.client_ip_address
      ? { client_ip_address: userData.client_ip_address }
      : {}),
    ...(userData.client_user_agent
      ? { client_user_agent: userData.client_user_agent }
      : {}),
    ...(userData.fbp ? { fbp: userData.fbp } : {}),
    ...(userData.fbc ? { fbc: userData.fbc } : {}),
  };

  const event = {
    event_name: eventName,
    event_time: eventTime || Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: eventSourceUrl || "https://skilium.in/",
    user_data: metaUserData,
    custom_data: customData,
    ...(eventId ? { event_id: eventId } : {}),
  };

  const payload = { data: [event] };

  if (META_TEST_EVENT_CODE) {
    payload.test_event_code = META_TEST_EVENT_CODE;
  }

  const url = new URL(
    `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events`
  );
  url.searchParams.set("access_token", META_ACCESS_TOKEN);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Meta CAPI error: ${JSON.stringify(result)}`);
  }

  return result;
}

module.exports = { sendMetaEvent };
