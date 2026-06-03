import {cache, handle, panic} from "./utils";

const TTL_PROFILE = 60 * 60; // 1 hour
export const onRequest: PagesFunction<Env> = handle(async (context) => {
  const {searchParams} = new URL(context.request.url);
  const name = searchParams.get("name");
  let id = searchParams.get("id")!;

  const [hasName, hasId] = [name !== null, id !== null];
  if (hasName === hasId) panic("Provide either name or id", 400);

  let url: string;
  if (hasName) {
    if (!/^[a-zA-Z0-9_-]{2,32}$/.test(name!)) // 2 ~ 32 chars, letters, digits, underscores, hyphens
      panic("Invalid name format", 400);

    url = `https://steamcommunity.com/id/${encodeURIComponent(name!)}`;
  } else {
    if (!/^7656119\d{10}$/.test(id)) // SteamID64 format: 7656119 followed by 10 digits
      panic("Invalid Steam ID format", 400);

    url = `https://steamcommunity.com/profiles/${id}`;
  }

  const profile = await resolveProfile(url);
  return Response.json(profile);
});

interface Profile {
  background: string | null;
  animatedBackground?: { webm: string; mp4: string };
}
async function resolveProfile(url: string): Promise<Profile> {
  const [cached, $] = await cache<Profile>("profile", url, TTL_PROFILE);
  if (cached) return cached;

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" },
  });
  if (!response.ok) panic("Steam error", 502);
  const html = await response.text();

  // Animated background: <div class="profile_animated_background"><video poster="..."><source src="...webm"><source src="...mp4">
  const animatedMatch = html.match(/<div class="profile_animated_background">\s*<video[^>]*poster="([^"]+)"[^>]*>[\s\S]*?<source src="([^"]+\.webm)"[^>]*>[\s\S]*?<source src="([^"]+\.mp4)"[^>]*>/);
  if (animatedMatch) {
    return await $({ background: animatedMatch[1], animatedBackground: { webm: animatedMatch[2], mp4: animatedMatch[3] } });
  }

  // Static background: has_profile_background ... style="background-image: url( '...' );"
  const staticMatch = html.match(/has_profile_background[^"]*"[^>]*style="background-image:\s*url\(\s*'([^']+)'\s*\)/);
  if (staticMatch) {
    return await $({ background: staticMatch[1] });
  }

  return await $({ background: null });
}
