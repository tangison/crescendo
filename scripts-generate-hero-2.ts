// Generate 1 more hero candidate with a more subtle music element
// (Candidate 2 was good but had rows of chairs - making it more tourism than music-store)

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const OUT_DIR = '/home/z/my-project/download/hero-candidates';
fs.mkdirSync(OUT_DIR, { recursive: true });

const CANDIDATES = [
  {
    name: 'candidate-3-deadvlei-stage-silhouette',
    prompt: (
      'Cinematic wide-angle photograph of Deadvlei, Namibia, at golden hour. ' +
      'The cracked white clay pan fills the foreground, with three tall dead black acacia trees ' +
      'silhouetted against towering burnt-orange sand dunes. Long raking shadows from the low sun. ' +
      'Clear gradient sky from amber near horizon to deep cobalt blue above. ' +
      'On the right side of the pan, far in the distance and very small in the frame, ' +
      'a single slender microphone stand silhouette stands alone - just a thin vertical line ' +
      'with a small round capsule at the top - barely noticeable, like a solitary monument. ' +
      'No stage, no chairs, no people, no text, no other equipment. ' +
      'Photorealistic, professional landscape photography, ' +
      'shot on Sony A7R IV, 24mm lens, high dynamic range, sharp focus throughout.'
    ),
  },
  {
    name: 'candidate-4-dunes-truss-silhouette',
    prompt: (
      'Cinematic wide-angle photograph of the Sossusvlei dunes in Namibia at sunset. ' +
      'Massive curving dune ridges in deep rust-red and burnt-orange, with sharp shadowed valleys. ' +
      'A single dead camel thorn tree silhouettes against the dune crest on the left. ' +
      'The sun is low on the horizon, glowing warm gold. ' +
      'On the far right horizon, very small and subtle, a simple triangular lighting truss ' +
      'silhouette stands on a dune ridge - just a thin triangle of metal poles, ' +
      'like a tiny geometric mark against the sky, easy to miss. ' +
      'No people, no chairs, no text, no other stage equipment. ' +
      'Photorealistic, dramatic, professional landscape photography, ' +
      'shot on Canon EOS R5, 16mm wide lens, high dynamic range, sharp focus throughout.'
    ),
  },
];

async function main() {
  const zai = await ZAI.create();
  for (const c of CANDIDATES) {
    const outPath = `${OUT_DIR}/${c.name}.png`;
    console.log(`Generating: ${c.name}`);
    try {
      const response = await zai.images.generations.create({
        prompt: c.prompt,
        // @ts-expect-error - SDK types restrict size
        size: '1536x768',
      });
      const buf = Buffer.from(response.data[0].base64, 'base64');
      fs.writeFileSync(outPath, buf);
      console.log(`  OK: ${outPath} (${buf.length} bytes)`);
    } catch (e: any) {
      console.log(`  FAIL: ${e.message || e}`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });
