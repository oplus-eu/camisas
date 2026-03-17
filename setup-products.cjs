const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const webshopDir = __dirname;
const publicProductsDir = path.join(webshopDir, 'public', 'products');
const dataDir = path.join(webshopDir, 'src', 'data');

if (!fs.existsSync(publicProductsDir)) {
  fs.mkdirSync(publicProductsDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const isDirectory = (source) => fs.lstatSync(source).isDirectory();
const getDirectories = (source) =>
  fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);

const sizeMap = {
  'S-4XL': ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
  'S-3XL': ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
  'S-XXL': ['S', 'M', 'L', 'XL', 'XXL'],
  'Size 16-28': ['16', '18', '20', '22', '24', '26', '28']
};

const products = [];

const dirs = getDirectories(rootDir);
dirs.forEach((dir) => {
  const folderName = path.basename(dir);
  if (folderName === 'webshop' || folderName.startsWith('.') || folderName === 'node_modules') return;

  const targetDir = path.join(publicProductsDir, folderName);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const files = fs.readdirSync(dir).filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg'));
  const images = [];

  files.forEach((file) => {
    fs.copyFileSync(path.join(dir, file), path.join(targetDir, file));
    images.push(`/products/${folderName}/${file}`);
  });

  let sizes = ['S', 'M', 'L', 'XL'];
  for (const [key, value] of Object.entries(sizeMap)) {
    if (folderName.includes(key)) {
      sizes = value;
      break;
    }
  }

  let price = 149.99;
  if (folderName.includes('Player Version')) price = 189.99;
  if (folderName.includes('Kids') || folderName.includes('Size 16-28')) price = 99.99;

  let category = 'Men';
  if (folderName.includes("Women's")) category = 'Women';
  if (folderName.includes('Kids')) category = 'Kids';

  products.push({
    id: folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: folderName,
    price: price,
    category: category,
    sizes: sizes,
    images: images
  });
});

fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(products, null, 2));
console.log('Products successfully imported and mapped!');
