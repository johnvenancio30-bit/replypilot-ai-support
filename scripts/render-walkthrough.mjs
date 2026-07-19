import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const video = resolve(process.argv[2] ?? "walkthrough-work/replypilot-actions.webm");
const narration = resolve(process.argv[3] ?? "walkthrough-work/replypilot-narration.mp3");
const output = resolve(process.argv[4] ?? "public/replypilot-walkthrough.mp4");
const poster = resolve(process.argv[5] ?? "public/replypilot-walkthrough-poster.webp");
if (!existsSync(video) || !existsSync(narration)) throw new Error("Video and narration inputs are required.");
const python = spawnSync("python", ["-c", "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"], { encoding: "utf8" });
if (python.status !== 0) throw new Error("Install imageio-ffmpeg before rendering.");
const ffmpeg = python.stdout.trim();
mkdirSync(dirname(output), { recursive: true });
const rendered = spawnSync(ffmpeg, ["-y","-hide_banner","-loglevel","warning","-i",video,"-i",narration,"-map","0:v:0","-map","1:a:0","-vf","scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p","-c:v","libx264","-preset","medium","-crf","22","-movflags","+faststart","-c:a","aac","-b:a","128k","-filter:a","loudnorm=I=-16:TP=-1.5:LRA=11","-shortest",output], { stdio: "inherit" });
if (rendered.status !== 0) process.exit(rendered.status ?? 1);
const still = spawnSync(ffmpeg, ["-y","-hide_banner","-loglevel","warning","-ss","00:00:10","-i",output,"-frames:v","1","-c:v","libwebp","-quality","84",poster], { stdio: "inherit" });
if (still.status !== 0) process.exit(still.status ?? 1);
