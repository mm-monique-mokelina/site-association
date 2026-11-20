import type { Member } from "@/lib/auth";

const W = 1012; // format carte bancaire (85,6 × 54 mm) à ~300 dpi
const H = 638;

async function loadBitmap(url: string): Promise<ImageBitmap | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await createImageBitmap(await r.blob());
  } catch {
    return null;
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawFlag(ctx: CanvasRenderingContext2D, country: "FR" | "CD", x: number, y: number, w: number, h: number) {
  ctx.save();
  roundRect(ctx, x, y, w, h, 6);
  ctx.clip();
  if (country === "FR") {
    ctx.fillStyle = "#002395"; ctx.fillRect(x, y, w / 3, h);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(x + w / 3, y, w / 3, h);
    ctx.fillStyle = "#ED2939"; ctx.fillRect(x + (2 * w) / 3, y, w / 3, h);
  } else {
    const sx = w / 800, sy = h / 600;
    ctx.fillStyle = "#007fff"; ctx.fillRect(x, y, w, h);
    const poly = (pts: number[][], color: string) => {
      ctx.fillStyle = color; ctx.beginPath();
      pts.forEach(([px = 0, py = 0], i) => (i ? ctx.lineTo(x + px * sx, y + py * sy) : ctx.moveTo(x + px * sx, y + py * sy)));
      ctx.closePath(); ctx.fill();
    };
    poly([[0, 450], [600, 0], [800, 0], [800, 150], [200, 600], [0, 600]], "#f7d618");
    poly([[0, 480], [640, 0], [800, 0], [800, 120], [160, 600], [0, 600]], "#ce1021");
    const cx = 136 * sx, cy = 140 * sy, R = 80 * sx, r = 32 * sx;
    ctx.fillStyle = "#f7d618"; ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? r : R;
      const px = x + cx + Math.cos(a) * rad, py = y + cy + Math.sin(a) * rad;
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 2; roundRect(ctx, x, y, w, h, 6); ctx.stroke();
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxW: number, size: number, family: string, weight = "600") {
  let s = size;
  do { ctx.font = `${weight} ${s}px ${family}`; s -= 2; } while (ctx.measureText(text).width > maxW && s > 18);
}

export function categoryLabel(m: Member) {
  return m.founder ? (m.category === "effectif" ? "Membre fondateur · effectif" : "Membre fondateur") : m.category === "effectif" ? "Membre effectif" : "Membre sympathisant";
}

/** Dessine la carte de membre et renvoie une image PNG. */
export async function renderMemberCard(member: Member, photoUrl: string | null): Promise<Blob> {
  await Promise.all([
    document.fonts.load('600 40px "Fraunces"'),
    document.fonts.load('400 24px "Source Sans 3"'),
    document.fonts.load('600 24px "Source Sans 3"'),
  ]).catch(() => undefined);
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");

  ctx.save(); roundRect(ctx, 0, 0, W, H, 36); ctx.clip();
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#3a0f4f"); g.addColorStop(0.55, "#4B1663"); g.addColorStop(1, "#6b2389");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.08; ctx.fillStyle = "#D4A024";
  ctx.beginPath(); ctx.arc(W - 120, H - 60, 260, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
  const band = ["#E0287D", "#D4A024", "#2B7BC0", "#F2B705"];
  band.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect((i * W) / 4, H - 18, W / 4 + 1, 18); });

  const [logo, photo] = await Promise.all([loadBitmap("/logo.webp"), photoUrl ? loadBitmap(photoUrl) : Promise.resolve(null)]);
  if (logo) { const lh = 120, lw = (logo.width / logo.height) * lh; ctx.drawImage(logo, 40, 30, lw, lh); }
  ctx.fillStyle = "#FBF7F0"; ctx.font = '600 40px "Fraunces", Georgia, serif';
  ctx.fillText("M.M Monique Mokelina", 180, 82);
  ctx.fillStyle = "#E9C46A"; ctx.font = '600 22px "Source Sans 3", sans-serif';
  ctx.fillText(`CARTE DE MEMBRE ${new Date().getFullYear()}`, 182, 120);
  drawFlag(ctx, member.country, W - 40 - 96, 46, 96, 64);

  const px = 48, py = 190, pw = 250, ph = 310;
  ctx.save(); roundRect(ctx, px, py, pw, ph, 18); ctx.clip();
  if (photo) {
    const scale = Math.max(pw / photo.width, ph / photo.height);
    const dw = photo.width * scale, dh = photo.height * scale;
    ctx.drawImage(photo, px + (pw - dw) / 2, py + (ph - dh) / 2, dw, dh);
  } else {
    ctx.fillStyle = "rgba(251,247,240,0.15)"; ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = "#E9C46A"; ctx.font = '600 96px "Fraunces", Georgia, serif'; ctx.textAlign = "center";
    ctx.fillText(`${member.first_name.charAt(0)}${member.last_name.charAt(0)}`.toUpperCase(), px + pw / 2, py + ph / 2 + 34);
    ctx.textAlign = "left";
  }
  ctx.restore();
  ctx.strokeStyle = "#D4A024"; ctx.lineWidth = 5; roundRect(ctx, px, py, pw, ph, 18); ctx.stroke();

  const tx = 340, maxW = W - tx - 48;
  ctx.fillStyle = "#FBF7F0";
  fitText(ctx, member.first_name, maxW, 54, '"Fraunces", Georgia, serif');
  ctx.fillText(member.first_name, tx, 268);
  fitText(ctx, member.last_name.toUpperCase(), maxW, 54, '"Fraunces", Georgia, serif');
  ctx.fillText(member.last_name.toUpperCase(), tx, 330);
  ctx.fillStyle = "#E9C46A"; ctx.font = '600 28px "Source Sans 3", sans-serif';
  ctx.fillText(categoryLabel(member), tx, 392);
  ctx.fillStyle = "rgba(251,247,240,0.85)"; ctx.font = '400 26px "Source Sans 3", sans-serif';
  ctx.fillText(member.country === "CD" ? "Congo (RDC)" : "France", tx, 436);
  ctx.font = 'italic 400 24px "Fraunces", Georgia, serif'; ctx.fillStyle = "rgba(251,247,240,0.75)";
  ctx.fillText("« Ensemble pour un avenir meilleur »", tx, 520);
  ctx.restore();

  return await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("Image impossible"))), "image/png"));
}

export function downloadCard(blob: Blob, member: Member) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `carte-membre-${member.last_name}-${member.first_name}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-") + ".png";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export function printCard(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<!doctype html><title>Carte de membre</title><style>@page{size:A4;margin:15mm}body{margin:0}img{width:85.6mm;height:54mm;border-radius:3mm;outline:0.2mm dashed #999;outline-offset:1mm}</style><img src="${url}" onload="setTimeout(()=>{window.print()},300)">`);
  w.document.close();
}
