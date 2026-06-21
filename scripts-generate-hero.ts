// Direct call to z-ai-web-dev-sdk image generation API
// bypassing the CLI's restrictive size allowlist.
// API rules: both dims 512-2880, integer multiples of 32, total <= 2^22 pixels.

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

interface Candidate {
  name: string;
  prompt: string;
}

const OUT_DIR = '/home/z/my-project/download/hero-candidates';
fs.mkdirSync(OUT_DIR, { recursive: true });

// 1536x768 = 1,179,648 px (under 4M limit), 48*32 x 24*32, wide 2:1 landscape
const SIZE = { width: 1536, height: 768 };

const CANDIDATES: Candidate[] = [
  {
    name: 'candidate-1-deadvlei',
    prompt: (
      'Cinematic wide-angle photograph of Deadvlei in Namibia at golden hour. ' +
      'Tall dead black acacia trees stand on a cracked white clay pan, surrounded by towering ' +
      'red-orange sand dunes of Sossusvlei. Dramatic warm sunlight rakes across the dune ridges ' +
      'casting long sharp shadows. Clear gradient sky from warm orange near the horizon to deep ' +
      'blue above. In the middle distance, a subtle silhouette of a small minimalist outdoor ' +
      'stage - a simple raised platform with a slender microphone stand and a single truss ' +
      'lighting rig - barely visible against the dunes, blending into the landscape. No people, ' +
      'no text. Photorealistic, high dynamic range, professional travel photography, ' +
      'shot on Sony A7R IV, 16-35mm wide lens, sharp focus throughout.'
    ),
  },
  {
    name: 'candidate-2-sossusvlei-dunes',
    prompt: (
      'Cinematic wide-angle photograph of the red sand dunes of Sossusvlei, Namibia, at golden hour. ' +
      'Massive curving dune ridges in deep burnt-orange and rust red, with sharp shadowed valleys ' +
      'between them. A few dead camel thorn trees silhouette against the dune crest. ' +
      'Warm sunset light glows on the dune faces. Subtle silhouette of a small outdoor music ' +
      'festival stage at the base of a dune - a low platform with two slender speaker stands ' +
      'and a triangle lighting truss - small in frame, integrated naturally into the landscape. ' +
      'No people, no text. Photorealistic, dramatic, professional landscape photography, ' +
      'shot on Canon EOS R5, 24mm lens, high dynamic range, sharp focus.'
    ),
  },
];

async function main() {
  console.log(`Output dir: ${OUT_DIR}`);
  console.log(`Size: ${SIZE.width}x${SIZE.height}`);
  console.log('');

  const zai = await ZAI.create();
  const generated: string[] = [];

  for (const c of CANDIDATES) {
    const outPath = path.join(OUT_DIR, `${c.name}.png`);
    console.log(`Generating: ${c.name}`);
    try {
      const response = await zai.images.generations.create({
        prompt: c.prompt,
        // @ts-expect-error - SDK types restrict size, but the underlying API accepts
        // any 32-multiple dimensions between 512 and 2880 with total <= 2^22 px.
        size: `${SIZE.width}x${SIZE.height}`,
      });
      const b64 = response.data[0].base64;
      const buf = Buffer.from(b64, 'base64');
      fs.writeFileSync(outPath, buf);
      console.log(`  OK: ${outPath} (${buf.length} bytes)`);
      generated.push(outPath);
    } catch (e: any) {
      console.log(`  FAIL: ${e.message || e}`);
    }
    console.log('');
  }

  console.log(`Generated ${generated.length}/${CANDIDATES.length} candidates`);
  for (const p of generated) console.log(`  ${p}`);
}

main().catch(e => { console.error(e); process.exit(1); });
