// Profanity word list — covers common slurs, curse words, and variations.
// Checked as whole words (word boundaries) and case-insensitive.
const BLOCKED_WORDS = [
  "fuck", "fucker", "fucking", "fucked", "fck", "fuk", "fuq",
  "shit", "shitter", "shitting", "sht",
  "ass", "asshole", "asswipe",
  "bitch", "bitches", "b1tch",
  "damn", "damnit",
  "dick", "d1ck",
  "cock", "c0ck",
  "pussy", "puss",
  "cunt",
  "bastard",
  "whore", "wh0re",
  "slut", "sl0t",
  "nigger", "nigga", "n1gger", "n1gga",
  "faggot", "fag", "f4g",
  "retard", "retarded",
  "kike",
  "spic", "sp1c",
  "chink",
  "wetback",
  "twat",
  "wank", "wanker",
  "prick",
  "douche", "douchebag",
  "motherfucker", "mofo",
  "stfu", "gtfo",
  "porn", "p0rn",
  "hentai",
  "nazi", "n4zi",
  "hitler",
];

// Build a single regex from all blocked words (word boundary match)
const PROFANITY_REGEX = new RegExp(
  "\\b(" + BLOCKED_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")\\b",
  "i"
);

// Check for leet-speak number substitutions (e.g. a->4, e->3, i->1, o->0)
function deobfuscate(text: string): string {
  return text
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b")
    .replace(/@/g, "a");
}

/**
 * Check if a display name contains profanity.
 * Returns the offending word if found, or null if clean.
 */
export function checkProfanity(name: string): string | null {
  if (!name) return null;

  const clean = name.replace(/[_\-.']/g, " ");
  const match = PROFANITY_REGEX.exec(clean);
  if (match) return match[0];

  // Check deobfuscated version
  const deob = deobfuscate(clean);
  const matchDeob = PROFANITY_REGEX.exec(deob);
  if (matchDeob) return matchDeob[0];

  return null;
}

// Blocked image hosting domains commonly used for inappropriate content
const BLOCKED_IMAGE_DOMAINS = [
  "pornhub.com",
  "xvideos.com",
  "xhamster.com",
  "redtube.com",
  "youporn.com",
  "xnxx.com",
  "chaturbate.com",
  "onlyfans.com",
  "rule34.xxx",
  "e621.net",
  "gelbooru.com",
  "nhentai.net",
  "hanime.tv",
];

/**
 * Validate an avatar URL.
 * Returns an error message if invalid, or null if OK.
 */
export function validateAvatarUrl(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    // Must be HTTPS
    if (parsed.protocol !== "https:") {
      return "Avatar URL must use HTTPS.";
    }

    // Check against blocked domains
    const hostname = parsed.hostname.toLowerCase();
    for (const blocked of BLOCKED_IMAGE_DOMAINS) {
      if (hostname === blocked || hostname.endsWith("." + blocked)) {
        return "This image source is not allowed.";
      }
    }

    return null;
  } catch {
    return "Invalid URL format.";
  }
}
