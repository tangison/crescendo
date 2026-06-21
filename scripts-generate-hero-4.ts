// Generate 2 hero candidates with foreground-instrument approach.
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const OUT_DIR = '/home/z/my-project/download/hero-candidates';
fs.mkdirSync(OUT_DIR, { recursive: true });

const CANDIDATES = [
  {
    name: 'candidate-6-foreground-guitar-dunes',
    prompt: (
      'Cinematic wide-angle photograph at golden hour in the Namibian desert. ' +
      'Massive red-orange sand dunes of Sossusvlei fill the background with smooth curving ridges and deep shadowed valleys. ' +
      'In the foreground, sharply in focus, the silhouette of an electric guitar leans against a single dead camel thorn tree ' +
      '- the guitar is dark, backlit, clearly readable as an electric guitar with its body, neck, headstock, and tuning pegs visible. ' +
      'The tree is bare and skeletal. Warm amber sunset light glows behind them, rim-lighting the guitar and tree. ' +
      'Long shadows stretch across the sand. Clear gradient sky from amber to deep blue. ' +
      'No people, no text, no other instruments or stage equipment. ' +
      'Photorealistic, dramatic, professional advertising photography, ' +
      'shot on Canon EOS R5, 35mm lens, shallow depth of field on the guitar, sharp focus throughout.'
    ),
  },
  {
    name: 'candidate-7-foreground-mic-dunes',
    prompt: (
      'Cinematic wide-angle photograph at golden hour in the Namibian desert. ' +
      'Massive burnt-orange sand dunes of Sossusvlei fill the background. ' +
      'A few dead camel thorn trees silhouette against the dune crest on the left. ' +
      'In the foreground, sharply in focus, a single vintage-style vocal microphone stands on a slim mic stand ' +
      '- the mic is dark chrome with a classic rounded grille, clearly readable as a microphone. ' +
      'It stands alone in the sand, backlit by the warm amber sunset. ' +
      'Long shadows stretch across the dunes. ' +
      'No people, no text, no stage, no other equipment, no speakers, no chairs. ' +
      'Photorealistic, dramatic, professional advertising photography, ' +
      'shot on Sony A7R IV, 50mm lens, shallow depth of field on the microphone.'
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
        // @ts-expect-error - SDK types restrict size, API accepts 32-multiples
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
