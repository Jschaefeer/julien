import { readFile } from "node:fs/promises";
import { join } from "node:path";

function toArrayBuffer(data: Buffer): ArrayBuffer {
  return data.buffer.slice(
    data.byteOffset,
    data.byteOffset + data.byteLength,
  ) as ArrayBuffer;
}

export async function getGeistFontData() {
  try {
    const fontsDir = join(process.cwd(), "public/fonts");
    const [regular, semibold] = await Promise.all([
      readFile(join(fontsDir, "Geist-Regular.ttf")),
      readFile(join(fontsDir, "Geist-SemiBold.ttf")),
    ]);

    return {
      regular: toArrayBuffer(regular),
      semibold: toArrayBuffer(semibold),
    };
  } catch (error) {
    console.error("Failed to load Geist fonts:", error);
    return null;
  }
}
