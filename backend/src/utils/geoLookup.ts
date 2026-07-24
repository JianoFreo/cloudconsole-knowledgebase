// backend/src/utils/geoLookup.ts
import axios from "axios";

export interface GeoInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  postal: string;
  timezone: string;
  isp: string;
  latitude: number | null;
  longitude: number | null;
}

export async function lookupGeo(ip: string): Promise<GeoInfo> {
  // Loopback/local addresses won't resolve to real geo data - ipapi.co
  // will error or return junk for these, so short-circuit locally.
  if (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.")
  ) {
    return {
      ip,
      country: "Local/Dev",
      region: "",
      city: "",
      postal: "",
      timezone: "",
      isp: "",
      latitude: null,
      longitude: null,
    };
  }

  try {
    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`);
    return {
      ip,
      country: data.country_name ?? "",
      region: data.region ?? "",
      city: data.city ?? "",
      postal: data.postal ?? "",
      timezone: data.timezone ?? "",
      isp: data.org ?? "",
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
    };
  } catch (error) {
    console.error("Geo lookup failed:", error);
    return {
      ip,
      country: "",
      region: "",
      city: "",
      postal: "",
      timezone: "",
      isp: "",
      latitude: null,
      longitude: null,
    };
  }
}
