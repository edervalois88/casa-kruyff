import sharp from "sharp";

const IVORY = [0xf4, 0xf0, 0xe6];

async function run() {
  const { data, info } = await sharp("public/brand/wordmark.png")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    data[i] = IVORY[0];
    data[i + 1] = IVORY[1];
    data[i + 2] = IVORY[2];
    // alpha (data[i+3]) untouched
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toFile("public/brand/wordmark-ivory.png");

  console.log("wordmark-ivory.png recolored", info.width, info.height);
}

run();
