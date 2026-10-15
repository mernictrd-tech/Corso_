const pixelId = import.meta.env.VITE_META_PIXEL_ID;

export const initMetaPixel = () => {
  if (!pixelId || typeof window === "undefined") return;

  // Prevent duplicate initialization
  if (window.fbq) return;

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;

    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };

    if (!f._fbq) f._fbq = n;

    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];

    t = b.createElement(e);
    t.async = true;
    t.src = v;

    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );

  window.fbq("init", pixelId);
};

export const trackMetaEvent = (eventName, parameters = {}, eventId) => {
  if (!pixelId || typeof window === "undefined" || !window.fbq) {
    return;
  }

  if (eventId) {
    window.fbq("track", eventName, parameters, {
      eventID: eventId,
    });
  } else {
    window.fbq("track", eventName, parameters);
  }
};
