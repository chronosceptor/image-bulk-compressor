# image-bulk-compressor

A CLI tool for batch image compression and conversion. Drop images into `./input`, run the tool, and get optimized images in `./output` — with folder structure preserved.

## Features

- Converts to **JPG**, **PNG**, and/or **WebP**
- Configurable quality and max dimensions
- Preserves original folder structure
- Auto-corrects image rotation via EXIF data
- Resizes without upscaling
- Processes images in parallel

## Requirements

- Node.js >= 14

## Installation

```bash
git clone https://github.com/Chronosceptor/image-bulk-compressor.git
cd image-bulk-compressor
npm install
```

## Usage

1. Place your images inside the `./input` folder (subdirectories are supported).
2. Run the tool:

```bash
node index.js
```

3. Follow the interactive prompts. Press `Enter` to use the defaults.
4. Find the results in the `./output` folder.

## Configuration

When prompted, you can customize:

| Option     | Default      | Description                          |
|------------|--------------|--------------------------------------|
| Format(s)  | `webp`       | Output format: `jpg`, `png`, `webp`  |
| Quality    | `75`         | Compression quality (1–100)          |
| Max width  | `2560`       | Maximum output width in pixels       |
| Max height | `2560`       | Maximum output height in pixels      |

## Supported Input Formats

`jpg` / `jpeg`, `png`, `webp`

## Project Structure

```
image-bulk-compressor/
├── input/        # Place source images here
├── output/       # Compressed images are saved here
├── index.js      # Main script
└── package.json
```

## Dependencies

| Package    | Purpose                              |
|------------|--------------------------------------|
| `sharp`    | High-performance image processing    |
| `globby`   | File discovery with glob patterns    |
| `inquirer` | Interactive CLI prompts              |

## License

ISC
