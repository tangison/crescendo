// Generate 1 final hero candidate where the music element is more central
// but still subtle / integrated.

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const OUT_DIR = '/home/z/my-project/download/hero-candidates';
fs.mkdirSync(OUT_DIR, { recursive: true });

const CANDIDATES = [
  {
    name: 'candidate-5-dunes-festival-stage',
    prompt: (
      'Cinematic wide-angle photograph at golden hour in the Namibian desert. ' +
      'Vast red-orange sand dunes of Sossusvlei fill the background, with smooth curving ridges ' +
      'and deep shadowed valleys. A single dead camel thorn tree silhouettes against the dune on the left. ' +
      'In the mid-ground, centered but small in the frame, a simple wooden festival stage ' +
      'stands on the sand - a low rectangular platform with a slender black lighting truss ' +
      'behind it holding two small speakers and a few warm stage lights. ' +
      'No people, no chairs, no text, no other equipment. ' +
      'The stage is integrated naturally into the desert scene, ' +
      'like a lone music venue in the wilderness. ' +
      'Warm amber sunset light, long shadows, dramatic sky. ' +
      'Photorealistic, professional travel + music festival photography, ' +
      'shot on Canon EOS R5, 24mm lens, high dynamic range, sharp focus.'
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
        // @ts-expect-error
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
