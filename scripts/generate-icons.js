const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(__dirname, '../public');
const iconsDir = path.join(publicDir, 'icons');

async function generateIcons() {
  try {
    await fs.mkdir(iconsDir, { recursive: true });
    
    // Check if source icon exists
    const sourceIcon = path.join(publicDir, 'icon.png');
    try {
      await fs.access(sourceIcon);
    } catch {
      console.warn('Warning: No icon.png found in public folder.');
      console.warn('Please add a 512x512 PNG icon to public/icon.png');
      return;
    }

    console.log('Generating PWA icons...');
    
    for (const size of sizes) {
      await sharp(sourceIcon)
        .resize(size, size)
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
      console.log(`✓ Generated ${size}x${size} icon`);
    }

    // Generate splash screens
    const splashSizes = [
      { width: 640, height: 1136, name: 'splash-640x1136' },
      { width: 750, height: 1334, name: 'splash-750x1334' },
      { width: 828, height: 1792, name: 'splash-828x1792' },
      { width: 1125, height: 2436, name: 'splash-1125x2436' },
      { width: 1242, height: 2688, name: 'splash-1242x2688' },
      { width: 1536, height: 2048, name: 'splash-1536x2048' },
    ];

    for (const splash of splashSizes) {
      await sharp(sourceIcon)
        .resize(splash.width, splash.height, {
          fit: 'contain',
          background: { r: 26, g: 86, b: 219, alpha: 1 } // Theme color
        })
        .png()
        .toFile(path.join(iconsDir, `${splash.name}.png`));
      console.log(`✓ Generated ${splash.name} splash screen`);
    }

    console.log('✅ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
