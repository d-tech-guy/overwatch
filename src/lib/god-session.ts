import { cookies } from "next/headers";

const GOD_COOKIE_NAME = "god_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 1 day

const getSecretKey = async () => {
  const secret = process.env.GOD_PASSPHRASE;
  if (!secret) throw new Error("GOD_PASSPHRASE is not defined in environment variables");
  
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
};

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(base64Url: string) {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export type GodSessionPayload = {
  role: "GOD";
  isPlatformAdmin: boolean;
  permissions: string;
  exp: number;
};

export async function createGodSession() {
  const payload: GodSessionPayload = {
    role: "GOD",
    isPlatformAdmin: true,
    permissions: "*",
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };

  const enc = new TextEncoder();
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(enc.encode(payloadStr));

  const key = await getSecretKey();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  const signatureB64 = base64UrlEncode(signature);

  const token = `${payloadB64}.${signatureB64}`;

  const cookieStore = await cookies();
  cookieStore.set(GOD_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function verifyGodSession(cookieValue?: string): Promise<GodSessionPayload | null> {
  if (!cookieValue) {
    const cookieStore = await cookies();
    cookieValue = cookieStore.get(GOD_COOKIE_NAME)?.value;
  }
  
  if (!cookieValue) return null;

  const parts = cookieValue.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signatureB64] = parts;

  try {
    const key = await getSecretKey();
    const enc = new TextEncoder();
    
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(signatureB64),
      enc.encode(payloadB64)
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlDecode(payloadB64);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadStr) as GodSessionPayload;

    if (payload.role !== "GOD") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function removeGodSession() {
  const cookieStore = await cookies();
  cookieStore.delete(GOD_COOKIE_NAME);
}
