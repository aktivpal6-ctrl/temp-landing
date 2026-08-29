"use client";

import { useEffect, useState } from "react";

function extractCoords(url) {
  let m = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (m) return { lat: m[1], lng: m[2] };

  m = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (m) return { lat: m[1], lng: m[2] };

  m = url.match(/[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (m) return { lat: m[1], lng: m[2] };

  m = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (m) return { lat: m[1], lng: m[2] };

  m = url.match(/!2d(-?\d+\.?\d*)!3d(-?\d+\.?\d*)/);
  if (m) return { lat: m[2], lng: m[1] };

  return null;
}

function isShortLink(url) {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "maps.app.goo.gl" ||
      hostname === "goo.gl" ||
      hostname.endsWith(".gl")
    );
  } catch {
    return false;
  }
}

function buildEmbedUrl(coords, fallbackQuery) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    const query = coords ? `${coords.lat},${coords.lng}` : fallbackQuery;
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}&zoom=${coords ? 15 : 14}`;
  }

  if (coords) {
    return `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
}

export const GoogleMapPreview = ({ location, locationLink }) => {
  const [embedUrl, setEmbedUrl] = useState(null);

  useEffect(() => {
    if (!locationLink && !location) return;

    let cancelled = false;

    async function resolve() {
      const fallbackQuery = locationLink || location;

      if (!locationLink) {
        setEmbedUrl(buildEmbedUrl(null, fallbackQuery));
        return;
      }

      const coords = extractCoords(locationLink);
      if (coords) {
        setEmbedUrl(buildEmbedUrl(coords, fallbackQuery));
        return;
      }

      if (isShortLink(locationLink)) {
        try {
          const res = await fetch(locationLink, { redirect: "follow" });
          const resolvedUrl = res.url;
          if (cancelled) return;

          const resolvedCoords = extractCoords(resolvedUrl);
          setEmbedUrl(buildEmbedUrl(resolvedCoords, fallbackQuery));
          return;
        } catch {
          if (!cancelled) setEmbedUrl(buildEmbedUrl(null, fallbackQuery));
          return;
        }
      }

      setEmbedUrl(buildEmbedUrl(null, fallbackQuery));
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, [location, locationLink]);

  if (!embedUrl) return null;

  const mapLink =
    locationLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[#0F291E]/10">
      <div className="relative">
        <iframe
          title={`Map preview for ${location}`}
          src={embedUrl}
          width="100%"
          height="200"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          aria-label={`Open ${location} in Google Maps`}
        />
      </div>
    </div>
  );
};
