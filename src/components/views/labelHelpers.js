export function getPlayerLabel(p) {
  if (!p) return "Unknown";
  // common top-level fields
  if (p.full_name) return p.full_name;
  if (p.preferred_name)
    return p.preferred_name + (p.last_name ? ` ${p.last_name}` : "");
  if (p.name) return p.name;
  if (p.first_name || p.last_name)
    return `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim();

  // nested shapes
  if (p.player && (p.player.full_name || p.player.name))
    return p.player.full_name ?? p.player.name;

  // team-based label fallback
  if (p.team && (p.team.market || p.team.name || p.team.abbr))
    return `${p.team.market ?? ""} ${p.team.name ?? p.team.abbr ?? ""}`.trim();

  return "Unknown";
}
