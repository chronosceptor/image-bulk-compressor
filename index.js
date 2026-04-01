import { globby } from "globby";
import sharp from "sharp";
import fs from "fs";
import inquirer from "inquirer";

const DEFAULTS = {
    formats: ["webp"],
    quality: 75,
    maxWidth: 2560,
    maxHeight: 2560,
};

const promptConfig = async () => {
    const { useDefaults } = await inquirer.prompt([
        {
            type: "confirm",
            name: "useDefaults",
            message: `Use defaults? (formats: ${DEFAULTS.formats.join(", ").toUpperCase()}, quality: ${DEFAULTS.quality}, max size: ${DEFAULTS.maxWidth}x${DEFAULTS.maxHeight})`,
            default: true,
        },
    ]);

    if (useDefaults) return DEFAULTS;

    return inquirer.prompt([
        {
            type: "checkbox",
            name: "formats",
            message: "Output format(s):",
            choices: [
                { name: "JPG", value: "jpg", checked: true },
                { name: "PNG", value: "png" },
                { name: "WebP", value: "webp" },
            ],
            validate: (v) => v.length > 0 || "Select at least one format",
        },
        {
            type: "number",
            name: "quality",
            message: "Quality (1-100):",
            default: DEFAULTS.quality,
            validate: (v) => (v >= 1 && v <= 100) || "Enter a value between 1 and 100",
        },
        {
            type: "number",
            name: "maxWidth",
            message: "Max width (px):",
            default: DEFAULTS.maxWidth,
        },
        {
            type: "number",
            name: "maxHeight",
            message: "Max height (px):",
            default: DEFAULTS.maxHeight,
        },
    ]);
};

const getFiles = () =>
    globby("./input", {
        expandDirectories: { extensions: ["jpg", "jpeg", "png", "webp"] },
    });

const compressImage = async (file, format, { quality, maxWidth, maxHeight }) => {
    const parts = file.split("/");
    const filename = parts.pop();
    const name = filename.substring(0, filename.lastIndexOf("."));
    const dir = parts.slice(1).join("/");
    const outDir = `./output/${dir}`;

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    await sharp(file)
        .rotate()
        .resize(maxWidth, maxHeight, { fit: "inside", withoutEnlargement: true })
        .jpeg({ progressive: true, quality, mozjpeg: true, force: false })
        .png({ quality, compressionLevel: 9, force: false })
        .webp({ quality, force: false })
        .toFile(`${outDir}/${name}.${format}`);

    return `${name}.${format}`;
};

const run = async () => {
    const config = await promptConfig();
    const files = await getFiles();

    if (!files.length) {
        console.log("No images found in ./input");
        return;
    }

    console.log(`\nProcessing ${files.length} image(s)...\n`);

    await Promise.all(
        files.flatMap((file) =>
            config.formats.map(async (format) => {
                const name = await compressImage(file, format, config);
                console.log(`optimized: ${name} ✅`);
            })
        )
    );

    console.log("\ncomplete 🏁");
};

run();
