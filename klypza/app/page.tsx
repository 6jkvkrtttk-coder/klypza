"use client";

import { ChangeEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";

type Mode = "video" | "image" | "animate" | "face";
type View = "create" | "projects" | "safety";
type ResultAsset = { url: string; kind: "image" | "video"; name: string; created: string; prompt: string };
type IconName = "play" | "image" | "spark" | "scan" | "grid" | "shield" | "settings" | "download" | "arrow" | "upload" | "wand" | "check" | "close" | "film";

const MODES: { id: Mode; label: string; eyebrow: string; icon: IconName }[] = [
  { id: "video", label: "Script to video", eyebrow: "Sora 2 ready", icon: "play" },
  { id: "image", label: "Image studio", eyebrow: "GPT Image ready", icon: "image" },
  { id: "animate", label: "Animate image", eyebrow: "Motion canvas", icon: "spark" },
  { id: "face", label: "Face studio", eyebrow: "Consent required", icon: "scan" },
];

const STARTERS: Record<Mode, string[]> = {
  video: [
    "A lone astronaut crosses a salt desert at blue hour, slow tracking shot, dust catching the light",
    "Macro film of ink blooming through water, luminous orange and deep cobalt, elegant camera drift",
    "A quiet mountain café during a thunderstorm, warm windows, cinematic push-in",
  ],
  image: [
    "Editorial portrait of a ceramic robot florist, soft window light, natural film grain",
    "An impossible black-glass library floating above the clouds, architectural photography",
    "Minimal product shot of translucent headphones on brushed steel, orange rim light",
  ],
  animate: [
    "Slow cinematic push-in with gentle parallax, drifting atmosphere and natural light changes",
    "Handheld documentary movement with subtle depth and a soft rack focus",
    "Elegant orbit shot, restrained motion, premium commercial finish",
  ],
  face: [
    "Blend the authorized subject naturally into the selected scene while preserving expression and lighting",
    "Create a clearly labeled fictional character performance from my authorized reference",
    "Match angle, color and grain while keeping the output visibly marked as AI-assisted",
  ],
};

const MODE_COPY: Record<Mode, { title: string; body: string; placeholder: string }> = {
  video: {
    title: "Turn a thought into motion.",
    body: "Write the scene, set the camera, and generate a downloadable concept clip. Connect an OpenAI key to switch on full Sora rendering.",
    placeholder: "Describe the scene, subject, camera movement, lighting and mood…",
  },
  image: {
    title: "Make the frame you imagined.",
    body: "Generate a polished concept image in-browser, or use the ready GPT Image connection for full model output.",
    placeholder: "Describe the subject, composition, lighting, materials and style…",
  },
  animate: {
    title: "Give a still image a pulse.",
    body: "Upload an image and turn it into a real downloadable motion clip with pan, zoom and atmospheric movement.",
    placeholder: "Describe the movement you want…",
  },
  face: {
    title: "Put an authorized face in the scene.",
    body: "Create a labeled face composition using a photo you own or have permission to use. Public-figure and celebrity cloning is blocked.",
    placeholder: "Describe how the authorized subject should appear…",
  },
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    play: <><path d="M9 7v10l8-5z"/><rect x="3" y="3" width="18" height="18" rx="4"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m3 17 5-5 4 4 2-2 7 6"/></>,
    spark: <><path d="m12 2 1.5 5.2L18 9l-4.5 1.8L12 16l-1.5-5.2L6 9l4.5-1.8z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/></>,
    scan: <><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/><circle cx="12" cy="10" r="3"/><path d="M7.5 18a5 5 0 0 1 9 0"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 15a2 2 0 0 0 .4 2l-2.4 2.4a2 2 0 0 0-2-.4 2 2 0 0 0-1 2h-4a2 2 0 0 0-1-2 2 2 0 0 0-2 .4L4.6 17a2 2 0 0 0 .4-2 2 2 0 0 0-2-1v-4a2 2 0 0 0 2-1 2 2 0 0 0-.4-2L7 4.6A2 2 0 0 0 9 5a2 2 0 0 0 1-2h4a2 2 0 0 0 1 2 2 2 0 0 0 2-.4L19.4 7a2 2 0 0 0-.4 2 2 2 0 0 0 2 1v4a2 2 0 0 0-2 1Z"/></>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v3h16v-3"/></>,
    arrow: <><path d="M5 12h14m-5-5 5 5-5 5"/></>,
    upload: <><path d="M12 16V4m0 0-4 4m4-4 4 4"/><path d="M4 15v5h16v-5"/></>,
    wand: <><path d="m15 4 5 5L9 20H4v-5z"/><path d="m14 5 5 5M6 4V2m-4 4H0m5.5 1.5L4 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    film: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4m10 0h4M3 15h4m10 0h4"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function hashText(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function aspectSize(aspect: string) {
  if (aspect === "9:16") return { width: 720, height: 1280 };
  if (aspect === "1:1") return { width: 900, height: 900 };
  return { width: 1280, height: 720 };
}

function fitCover(ctx: CanvasRenderingContext2D, media: HTMLImageElement | HTMLVideoElement, width: number, height: number, scale = 1) {
  const mw = media instanceof HTMLVideoElement ? media.videoWidth : media.naturalWidth;
  const mh = media instanceof HTMLVideoElement ? media.videoHeight : media.naturalHeight;
  const ratio = Math.max(width / mw, height / mh) * scale;
  const dw = mw * ratio;
  const dh = mh * ratio;
  ctx.drawImage(media, (width - dw) / 2, (height - dh) / 2, dw, dh);
}

function drawConcept(ctx: CanvasRenderingContext2D, width: number, height: number, prompt: string, t = 0) {
  const seed = hashText(prompt || "klypza");
  const hue = seed % 290;
  const drift = Math.sin(t * Math.PI * 2) * width * .035;
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, `hsl(${(hue + 215) % 360} 45% 7%)`);
  bg.addColorStop(.5, `hsl(${(hue + 10) % 360} 35% 13%)`);
  bg.addColorStop(1, "#080807");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * .64 + drift, height * .42, 1, width * .64 + drift, height * .42, width * .46);
  glow.addColorStop(0, `hsla(${hue} 92% 58% / .58)`);
  glow.addColorStop(.42, "rgba(255,90,31,.18)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(drift * .45, 0);
  for (let i = 0; i < 9; i++) {
    const x = ((seed >>> (i % 16)) % 1000) / 1000 * width;
    const y = ((seed * (i + 11)) % 997) / 997 * height;
    const r = height * (.03 + (i % 4) * .025);
    ctx.fillStyle = `hsla(${(hue + i * 21) % 360} 90% 65% / ${.08 + (i % 3) * .04})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(width * .52 + drift, height * .51);
  ctx.rotate(-.16 + Math.sin(t * 4) * .025);
  const slab = ctx.createLinearGradient(-width * .2, -height * .25, width * .25, height * .28);
  slab.addColorStop(0, "rgba(255,245,224,.94)");
  slab.addColorStop(.5, "rgba(245,121,61,.84)");
  slab.addColorStop(1, `hsla(${hue} 80% 42% / .48)`);
  ctx.fillStyle = slab;
  ctx.beginPath();
  ctx.roundRect(-width * .16, -height * .25, width * .32, height * .5, Math.min(width, height) * .05);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,.72)";
  ctx.beginPath(); ctx.ellipse(0, 0, width * .075, height * .16, .2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "rgba(255,255,255,.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const y = height * (.68 + i * .045) + Math.sin(t * 5 + i) * 5;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y - width * .035); ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,248,236,.84)";
  ctx.font = `${Math.max(13, Math.round(width * .014))}px ui-monospace, monospace`;
  ctx.fillText("KLYPZA / CONCEPT FRAME", width * .04, height * .93);
  ctx.fillStyle = "rgba(255,255,255,.4)";
  ctx.textAlign = "right";
  ctx.fillText("AI-ASSISTED", width * .96, height * .93);
  ctx.textAlign = "left";
}

async function recordCanvas(canvas: HTMLCanvasElement, seconds: number, render: (t: number) => void) {
  const stream = canvas.captureStream(30);
  const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_500_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = e => e.data.size && chunks.push(e.data);
  const done = new Promise<Blob>(resolve => recorder.onstop = () => resolve(new Blob(chunks, { type: mime })));
  recorder.start(250);
  const start = performance.now();
  await new Promise<void>(resolve => {
    const frame = (now: number) => {
      const elapsed = (now - start) / 1000;
      render(Math.min(1, elapsed / seconds));
      if (elapsed < seconds) requestAnimationFrame(frame); else resolve();
    };
    requestAnimationFrame(frame);
  });
  recorder.stop();
  stream.getTracks().forEach(track => track.stop());
  return done;
}

export default function Home() {
  const [view, setView] = useState<View>("create");
  const [mode, setMode] = useState<Mode>("video");
  const [prompt, setPrompt] = useState(STARTERS.video[0]);
  const [aspect, setAspect] = useState("16:9");
  const [duration, setDuration] = useState("8 sec");
  const [motion, setMotion] = useState("Cinematic");
  const [quality, setQuality] = useState("Studio");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ResultAsset | null>(null);
  const [history, setHistory] = useState<ResultAsset[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [providerLive, setProviderLive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [targetMedia, setTargetMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const [consent, setConsent] = useState(false);
  const [faceSize, setFaceSize] = useState(28);
  const [faceX, setFaceX] = useState(50);
  const [faceY, setFaceY] = useState(44);
  const [animateSource, setAnimateSource] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("/api/media/status").then(r => r.json()).then(data => setProviderLive(Boolean(data.live))).catch(() => setProviderLive(false));
    fetch("/api/credits").then(r => r.json()).then(data => setCredits(Number(data.credits))).catch(() => setCredits(null));
  }, []);

  const activeCopy = MODE_COPY[mode];
  const wordCount = useMemo(() => prompt.trim() ? prompt.trim().split(/\s+/).length : 0, [prompt]);

  function addHistory(asset: ResultAsset) {
    setResult(asset);
    setHistory(old => [asset, ...old].slice(0, 12));
  }

  function setModeFromNav(next: Mode) {
    setView("create");
    setMode(next);
    setPrompt(STARTERS[next][0]);
    setResult(null);
  }

  function uploadFile(event: ChangeEvent<HTMLInputElement>, target: "animate" | "source" | "media") {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 90 * 1024 * 1024) {
      setNotice("Keep uploads under 90 MB for reliable in-browser rendering.");
      return;
    }
    const url = URL.createObjectURL(file);
    if (target === "animate") setAnimateSource(url);
    if (target === "source") setSourceImage(url);
    if (target === "media") setTargetMedia({ url, type: file.type.startsWith("video/") ? "video" : "image" });
  }

  async function liveGenerate() {
    const response = await fetch("/api/media/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, prompt, aspect, duration, quality }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "The model could not start this render.");
    if (data.kind === "image") return { url: data.url, kind: "image" as const };
    let status = data;
    while (["queued", "in_progress"].includes(status.status)) {
      await new Promise(r => setTimeout(r, 2500));
      const poll = await fetch(`/api/media/video/${encodeURIComponent(data.id)}`);
      status = await poll.json();
      setProgress(Math.max(12, status.progress || 0));
      if (!poll.ok) throw new Error(status.error || "Video render failed.");
    }
    if (status.status !== "completed") throw new Error("Video render did not complete.");
    return { url: status.url, kind: "video" as const };
  }

  async function conceptImage() {
    const canvas = canvasRef.current!;
    const { width, height } = aspectSize(aspect);
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    drawConcept(ctx, width, height, prompt);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Image export failed")), "image/png", .96));
    return { url: URL.createObjectURL(blob), kind: "image" as const };
  }

  async function conceptVideo() {
    const canvas = canvasRef.current!;
    const size = aspectSize(aspect);
    const ratio = Math.min(1, 960 / Math.max(size.width, size.height));
    canvas.width = Math.round(size.width * ratio); canvas.height = Math.round(size.height * ratio);
    const ctx = canvas.getContext("2d")!;
    const blob = await recordCanvas(canvas, 3.6, t => {
      drawConcept(ctx, canvas.width, canvas.height, prompt, t);
      setProgress(Math.round(t * 100));
    });
    return { url: URL.createObjectURL(blob), kind: "video" as const };
  }

  async function animateUploaded() {
    if (!animateSource) throw new Error("Upload an image first.");
    const image = new Image(); image.src = animateSource; await image.decode();
    const canvas = canvasRef.current!;
    const size = aspectSize(aspect); const ratio = Math.min(1, 960 / Math.max(size.width, size.height));
    canvas.width = Math.round(size.width * ratio); canvas.height = Math.round(size.height * ratio);
    const ctx = canvas.getContext("2d")!;
    const blob = await recordCanvas(canvas, 3.6, t => {
      ctx.fillStyle = "#080807"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save(); ctx.translate(Math.sin(t * Math.PI) * 12, Math.cos(t * Math.PI) * 5); fitCover(ctx, image, canvas.width, canvas.height, 1.02 + t * .08); ctx.restore();
      const shade = ctx.createLinearGradient(0, 0, 0, canvas.height); shade.addColorStop(0, "transparent"); shade.addColorStop(1, "rgba(0,0,0,.35)"); ctx.fillStyle = shade; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.font = "13px ui-monospace, monospace"; ctx.fillText("KLYPZA / MOTION STUDY", 22, canvas.height - 24);
      setProgress(Math.round(t * 100));
    });
    return { url: URL.createObjectURL(blob), kind: "video" as const };
  }

  async function composeFace() {
    if (!sourceImage || !targetMedia) throw new Error("Upload both an authorized face and a target image or video.");
    if (!consent) throw new Error("Confirm that you have permission to use this face.");
    const face = new Image(); face.src = sourceImage; await face.decode();
    const canvas = canvasRef.current!;
    const size = aspectSize(aspect); const ratio = Math.min(1, 960 / Math.max(size.width, size.height));
    canvas.width = Math.round(size.width * ratio); canvas.height = Math.round(size.height * ratio);
    const ctx = canvas.getContext("2d")!;
    const drawFace = () => {
      const diameter = canvas.width * faceSize / 100;
      const x = canvas.width * faceX / 100; const y = canvas.height * faceY / 100;
      ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, diameter * .42, diameter * .53, 0, 0, Math.PI * 2); ctx.clip();
      const fw = face.naturalWidth, fh = face.naturalHeight, scale = Math.max(diameter / fw, diameter * 1.3 / fh);
      ctx.drawImage(face, x - fw * scale / 2, y - fh * scale / 2, fw * scale, fh * scale); ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, diameter * .42, diameter * .53, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(8,8,7,.74)"; ctx.fillRect(0, canvas.height - 42, canvas.width, 42);
      ctx.fillStyle = "#fff4df"; ctx.font = "12px ui-monospace, monospace"; ctx.fillText("AI-ASSISTED • AUTHORIZED LIKENESS", 18, canvas.height - 17);
    };
    if (targetMedia.type === "image") {
      const target = new Image(); target.src = targetMedia.url; await target.decode(); fitCover(ctx, target, canvas.width, canvas.height); drawFace();
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Export failed")), "image/png", .96));
      return { url: URL.createObjectURL(blob), kind: "image" as const };
    }
    const video = document.createElement("video"); video.src = targetMedia.url; video.muted = true; video.playsInline = true; await new Promise<void>((resolve, reject) => { video.onloadeddata = () => resolve(); video.onerror = () => reject(new Error("The video could not be read.")); });
    video.currentTime = 0; await video.play();
    const seconds = Math.min(5, video.duration || 5);
    const blob = await recordCanvas(canvas, seconds, t => { fitCover(ctx, video, canvas.width, canvas.height); drawFace(); setProgress(Math.round(t * 100)); });
    video.pause();
    return { url: URL.createObjectURL(blob), kind: "video" as const };
  }

  async function generate() {
    if (!prompt.trim()) { setNotice("Add a prompt before generating."); return; }
    setGenerating(true); setProgress(4); setNotice(null);
    const timer = window.setInterval(() => setProgress(p => Math.min(88, p + Math.max(1, Math.round((90 - p) / 9)))), 420);
    let reservedCredit = false;
    try {
      const creditResponse = await fetch("/api/credits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "consume" }) });
      const creditData = await creditResponse.json();
      if (creditResponse.status === 402) {
        setCredits(0);
        setShowReward(true);
        throw new Error("You’ve used your 10 starter credits. Watch the short sponsor message to unlock 3 more.");
      }
      if (!creditResponse.ok) throw new Error(creditData.error || "Credits are temporarily unavailable.");
      reservedCredit = true;
      setCredits(Number(creditData.credits));
      let output: { url: string; kind: "image" | "video" };
      if (mode === "animate") output = await animateUploaded();
      else if (mode === "face") output = await composeFace();
      else if (providerLive) output = await liveGenerate();
      else output = mode === "image" ? await conceptImage() : await conceptVideo();
      const asset = { ...output, name: `${mode === "image" ? "Frame" : "Clip"} ${String(history.length + 1).padStart(2, "0")}`, created: "Just now", prompt };
      addHistory(asset); setProgress(100);
    } catch (error) {
      if (reservedCredit) {
        fetch("/api/credits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "refund" }) })
          .then(r => r.json()).then(data => setCredits(Number(data.credits))).catch(() => {});
      }
      setNotice(error instanceof Error ? error.message : "Something interrupted the render.");
    } finally {
      window.clearInterval(timer); setGenerating(false);
    }
  }

  function download() {
    if (!result) return;
    const a = document.createElement("a"); a.href = result.url; a.download = `klypza-${result.name.toLowerCase().replace(/\s+/g, "-")}.${result.kind === "image" ? "png" : "webm"}`; a.click();
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("create")} aria-label="Klypza home"><span className="brand-mark"><span /></span><span>KLYPZA</span></button>
        <nav className="side-nav" aria-label="Creation tools">
          <p className="nav-label">Create</p>
          {MODES.map(item => <button key={item.id} className={`nav-item ${view === "create" && mode === item.id ? "active" : ""}`} onClick={() => setModeFromNav(item.id)}><span className="nav-icon"><Icon name={item.icon}/></span><span><b>{item.label}</b><small>{item.eyebrow}</small></span></button>)}
          <p className="nav-label library-label">Library</p>
          <button className={`nav-item ${view === "projects" ? "active" : ""}`} onClick={() => setView("projects")}><span className="nav-icon"><Icon name="grid"/></span><span><b>My projects</b><small>{history.length} local renders</small></span></button>
          <button className={`nav-item ${view === "safety" ? "active" : ""}`} onClick={() => setView("safety")}><span className="nav-icon"><Icon name="shield"/></span><span><b>Trust & safety</b><small>Likeness controls</small></span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="provider-card"><div className="provider-row"><span className={`status-dot ${providerLive ? "live" : ""}`}/><b>{providerLive ? "Live AI connected" : "Concept engine"}</b></div><p>{providerLive ? "GPT Image + Sora are ready." : "Works now in your browser. Add a model key later for photoreal AI."}</p><button onClick={() => setShowSettings(true)}>Model settings <Icon name="arrow" size={15}/></button></div>
          <p className="legal-line">Private by default · outputs labeled</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar"><div className="mobile-brand"><span className="brand-mark"><span /></span><b>KLYPZA</b></div><div className="topbar-status"><span className={`status-dot ${providerLive ? "live" : ""}`}/>{providerLive ? "AI online" : "Instant concept mode"}</div><div className="top-actions"><a className="top-link" href="/pricing">Pricing</a><a className="top-link" href="/advertise">Advertise</a><button className="credit-badge" onClick={() => setShowReward(true)}><Icon name="spark" size={14}/><b>{credits ?? "—"}</b> credits</button><button className="icon-button" onClick={() => setShowSettings(true)} aria-label="Settings"><Icon name="settings"/></button><button className="export-button" onClick={download} disabled={!result}><Icon name="download" size={16}/> Export</button></div></header>

        {view === "create" && <div className="studio-wrap">
          <section className="intro-row"><div><p className="kicker"><span>{String(MODES.findIndex(x => x.id === mode) + 1).padStart(2, "0")}</span> / {MODES.find(x => x.id === mode)?.label}</p><h1>{activeCopy.title}</h1><p>{activeCopy.body}</p></div><div className="model-pill"><Icon name={MODES.find(x => x.id === mode)?.icon || "spark"}/><span><small>Engine</small><b>{providerLive && mode === "video" ? "Sora 2" : providerLive && mode === "image" ? "GPT Image 2" : "Klypza Canvas"}</b></span></div></section>

          <section className="creator-grid">
            <div className="prompt-panel">
              {(mode === "animate" || mode === "face") && <div className={`upload-row ${mode === "face" ? "double" : ""}`}>{mode === "animate" && <UploadBox label={animateSource ? "Image ready" : "Upload a still image"} accept="image/*" done={Boolean(animateSource)} onChange={e => uploadFile(e, "animate")}/>} {mode === "face" && <><UploadBox label={sourceImage ? "Face reference ready" : "Authorized face photo"} accept="image/*" done={Boolean(sourceImage)} onChange={e => uploadFile(e, "source")}/><UploadBox label={targetMedia ? "Target media ready" : "Target image or video"} accept="image/*,video/*" done={Boolean(targetMedia)} onChange={e => uploadFile(e, "media")}/></>}</div>}
              <div className="prompt-head"><label htmlFor="prompt">Creative direction</label><span>{wordCount} words</span></div>
              <textarea id="prompt" maxLength={1200} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={activeCopy.placeholder} rows={7}/>
              <div className="prompt-footer"><button className="enhance" onClick={() => setPrompt(p => `${p.replace(/[.,]+$/, "")}, cohesive art direction, natural detail, intentional composition, refined color grade.`)}><Icon name="wand" size={15}/> Enhance prompt</button><span>{prompt.length}/1200</span></div>
              <div className="starter-block"><p>Try a direction</p><div className="prompt-chips">{STARTERS[mode].map((text, i) => <button key={text} onClick={() => setPrompt(text)}>0{i + 1} <span>{text.split(",")[0]}</span></button>)}</div></div>
              {mode === "face" && <div className="consent-box"><label><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/><span className="fake-check"><Icon name="check" size={13}/></span><span>I own this face or have the person’s explicit permission.</span></label><p>Celebrity and public-figure face cloning is not allowed. Authorized talent and your own face are supported, and every export carries an AI label.</p></div>}
            </div>

            <aside className="control-panel">
              <div className="control-heading"><span>Output controls</span><small>01—04</small></div>
              <Control label="Aspect ratio"><Segmented options={["16:9", "9:16", "1:1"]} value={aspect} onChange={setAspect}/></Control>
              {mode !== "image" && <Control label="Duration"><Segmented options={["5 sec", "8 sec", "12 sec"]} value={duration} onChange={setDuration}/></Control>}
              <Control label="Direction"><Select value={motion} onChange={setMotion} options={["Cinematic", "Editorial", "Documentary", "Experimental"]}/></Control>
              <Control label="Quality"><Segmented options={["Fast", "Studio"]} value={quality} onChange={setQuality}/></Control>
              {mode === "face" && <><Control label={`Face size · ${faceSize}%`}><input className="range" type="range" min="12" max="52" value={faceSize} onChange={e => setFaceSize(Number(e.target.value))}/></Control><div className="two-ranges"><Control label="Horizontal"><input className="range" type="range" min="15" max="85" value={faceX} onChange={e => setFaceX(Number(e.target.value))}/></Control><Control label="Vertical"><input className="range" type="range" min="15" max="80" value={faceY} onChange={e => setFaceY(Number(e.target.value))}/></Control></div></>}
              <div className="output-note"><Icon name="shield" size={16}/><p><b>Responsible output</b><br/>Private processing for local uploads. Visible AI label on face composites.</p></div>
              <button className="generate-button" disabled={generating} onClick={generate}>{generating ? <><span className="spinner"/> Rendering {progress}%</> : <><Icon name="spark" size={17}/> Generate {mode === "image" ? "image" : "clip"}<Icon name="arrow" size={17}/></>}</button>
              {generating && <div className="progress-track"><span style={{ width: `${progress}%` }}/></div>}
              {notice && <div className="notice"><Icon name="shield" size={15}/><span>{notice}</span><button onClick={() => setNotice(null)} aria-label="Dismiss"><Icon name="close" size={14}/></button></div>}
            </aside>
          </section>

          <section className={`result-stage ${result ? "has-result" : ""}`}><div className="stage-head"><span>Latest render</span>{result && <button onClick={download}><Icon name="download" size={15}/> Download</button>}</div>{!result ? <div className="empty-stage"><div className="stage-symbol"><span/><span/></div><p>Your next idea will appear here.</p><small>Generate a real PNG or WebM preview—no fake buttons.</small></div> : result.kind === "image" ? <img src={result.url} alt={result.prompt}/> : <video src={result.url} controls autoPlay loop muted playsInline/>}</section>
        </div>}

        {view === "projects" && <Projects history={history} onOpen={asset => { setResult(asset); setView("create"); }}/>} 
        {view === "safety" && <Safety/>}
        <canvas ref={canvasRef} className="hidden-canvas"/>
      </section>

      {showSettings && <SettingsModal live={providerLive} onClose={() => setShowSettings(false)}/>} 
      {showReward && <RewardModal credits={credits ?? 0} onClose={() => setShowReward(false)} onReward={next => setCredits(next)}/>} 
    </main>
  );
}

function UploadBox({ label, accept, done, onChange }: { label: string; accept: string; done: boolean; onChange: (e: ChangeEvent<HTMLInputElement>) => void }) {
  return <label className={`upload-box ${done ? "done" : ""}`}><input type="file" accept={accept} onChange={onChange}/><span className="upload-icon"><Icon name={done ? "check" : "upload"}/></span><span><b>{label}</b><small>{done ? "Click to replace" : "Click to choose a file"}</small></span></label>;
}

function Control({ label, children }: { label: string; children: ReactNode }) { return <div className="control"><label>{label}</label>{children}</div>; }

function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) { return <div className="segmented">{options.map(option => <button key={option} className={value === option ? "selected" : ""} onClick={() => onChange(option)}>{option}</button>)}</div>; }

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) { return <select value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select>; }

function Projects({ history, onOpen }: { history: ResultAsset[]; onOpen: (asset: ResultAsset) => void }) {
  return <div className="page-wrap"><p className="kicker"><span>LIB</span> / Personal workspace</p><div className="page-title-row"><div><h1>My projects</h1><p>Renders stay in this browser session unless you download them.</p></div><span className="count-badge">{history.length} renders</span></div>{history.length === 0 ? <div className="project-empty"><Icon name="grid" size={28}/><h2>No renders yet</h2><p>Open a creation tool and make your first frame or clip.</p></div> : <div className="project-grid">{history.map((asset, i) => <button key={`${asset.name}-${i}`} className="project-card" onClick={() => onOpen(asset)}><div className="project-thumb">{asset.kind === "image" ? <img src={asset.url} alt=""/> : <video src={asset.url} muted/>}<span><Icon name={asset.kind === "image" ? "image" : "film"} size={14}/>{asset.kind}</span></div><div><b>{asset.name}</b><p>{asset.prompt}</p><small>{asset.created}</small></div></button>)}</div>}</div>;
}

function Safety() {
  const rules = [
    { n: "01", title: "Permission comes first", body: "Use only your own face or one you are explicitly authorized to use. Consent cannot be assumed from a public photo." },
    { n: "02", title: "No celebrity clones", body: "Klypza blocks celebrity and public-figure face presets. Use fictional characters, licensed talent, or your own identity instead." },
    { n: "03", title: "Clear AI labeling", body: "Face compositions carry an AI-assisted label so the result is not passed off as authentic footage." },
    { n: "04", title: "Local-first uploads", body: "Concept-mode uploads are processed in your browser and are not sent to a server." },
  ];
  return <div className="page-wrap safety-page"><p className="kicker"><span>SAFE</span> / Trust standard</p><h1>Create boldly. Represent people honestly.</h1><p className="safety-lead">Klypza is designed for creative expression without impersonation. The face tool supports authorized likenesses and adds visible provenance to every export.</p><div className="safety-grid">{rules.map(r => <article key={r.n}><span>{r.n}</span><div className="safety-icon"><Icon name={r.n === "02" ? "scan" : r.n === "04" ? "settings" : "shield"}/></div><h2>{r.title}</h2><p>{r.body}</p></article>)}</div><div className="allowed-grid"><div><h3>Built for</h3><p>Self-portraits · Licensed actors · Fictional characters · Product films · Storyboards · Concept art</p></div><div><h3>Not built for</h3><p>Celebrity impersonation · Fraud · Deceptive political media · Harassment · Non-consensual intimate media</p></div></div></div>;
}

function SettingsModal({ live, onClose }: { live: boolean; onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title"><button className="modal-close" onClick={onClose}><Icon name="close"/></button><p className="kicker"><span>SYS</span> / Models</p><h2 id="settings-title">Generation engines</h2><p className="modal-lead">Klypza always has a private browser engine. A server-side OpenAI key unlocks photoreal image and Sora video generation without exposing the key to visitors.</p><div className="engine-list"><div><span className={`engine-logo ${live ? "connected" : ""}`}><Icon name="spark"/></span><span><b>OpenAI media models</b><small>GPT Image 2 · Sora 2</small></span><em>{live ? "Connected" : "Key required"}</em></div><div><span className="engine-logo connected"><Icon name="film"/></span><span><b>Klypza Canvas</b><small>PNG concepts · WebM motion · local face composition</small></span><em>Ready</em></div></div>{!live && <div className="key-help"><Icon name="shield"/><p><b>One setup step remains for cloud AI</b><br/>Add <code>OPENAI_API_KEY</code> as a secret in the site’s environment settings. Never paste the key into page code or a public form.</p></div>}<button className="modal-done" onClick={onClose}>Done</button></section></div>;
}

function RewardModal({ credits, onClose, onReward }: { credits: number; onClose: () => void; onReward: (credits: number) => void }) {
  const [phase, setPhase] = useState<"ready" | "watching" | "claiming" | "done">("ready");
  const [seconds, setSeconds] = useState(15);
  const [session, setSession] = useState<{ id: string; claimAfter: number } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (phase !== "watching" || !session) return;
    const update = () => setSeconds(Math.max(0, Math.ceil((session.claimAfter - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [phase, session]);

  async function start() {
    setMessage(null);
    const response = await fetch("/api/rewards/start", { method: "POST" });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || "The reward could not start."); return; }
    setSession({ id: data.id, claimAfter: data.claimAfter });
    setSeconds(data.seconds || 15);
    setPhase("watching");
  }

  async function claim() {
    if (!session || seconds > 0) return;
    setPhase("claiming");
    const response = await fetch("/api/rewards/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: session.id }) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || "The reward could not be claimed."); setPhase("watching"); return; }
    onReward(Number(data.credits));
    setPhase("done");
  }

  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && phase !== "claiming" && onClose()}><section className="settings-modal reward-modal" role="dialog" aria-modal="true" aria-labelledby="reward-title"><button className="modal-close" onClick={onClose}><Icon name="close"/></button><p className="kicker"><span>REWARD</span> / Credits</p><h2 id="reward-title">Keep creating.</h2><p className="modal-lead">You have {credits} credits. Watch one voluntary 15-second sponsor message to add 3 more. One generation uses one credit.</p><div className={`sponsor-stage ${phase === "watching" ? "playing" : ""}`}><span className="sponsor-tag">Sponsor preview</span><div className="sponsor-orbit"><span/><span/></div><p>KLYPZA FOUNDING PARTNER</p><h3>Your brand could fund the next idea.</h3><small>Premium rewarded placement · clearly labeled · user initiated</small>{phase === "watching" && <div className="ad-progress"><span style={{ width: `${((15 - seconds) / 15) * 100}%` }}/></div>}</div>{message && <p className="reward-error">{message}</p>}{phase === "ready" && <button className="modal-done" onClick={start}>Watch sponsor message · +3 credits</button>}{phase === "watching" && <button className="modal-done" disabled={seconds > 0} onClick={claim}>{seconds > 0 ? `Reward available in ${seconds}s` : "Claim 3 credits"}</button>}{phase === "claiming" && <button className="modal-done" disabled>Adding credits…</button>}{phase === "done" && <button className="modal-done" onClick={onClose}>3 credits added · Continue</button>}<p className="reward-policy">Rewards are optional. No forced redirects, pop-ups, or deceptive ad clicks.</p></section></div>;
}
