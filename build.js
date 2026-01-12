const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const yaml = require('js-yaml');

// Configure Nunjucks
nunjucks.configure(path.join(__dirname, 'src', 'templates'), {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true
});

function build() {
  console.log('Building site...');

  // Read YAML data
  const yamlPath = path.join(__dirname, 'run_plan.yml');
  const planData = yaml.load(fs.readFileSync(yamlPath, 'utf-8'));

  // Read Hyrox station data
  const hyroxPath = path.join(__dirname, 'hyrox_plan.yml');
  const hyroxData = yaml.load(fs.readFileSync(hyroxPath, 'utf-8'));

  // Read Strength plan data
  const strengthPath = path.join(__dirname, 'strength_plan.yml');
  const strengthData = yaml.load(fs.readFileSync(strengthPath, 'utf-8'));

  // Read CSS
  const cssPath = path.join(__dirname, 'src', 'styles', 'styles.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Render template
  const html = nunjucks.render('index.njk', {
    plan: planData,
    hyrox: hyroxData,
    strength: strengthData,
    css: css,
    buildTime: new Date().toISOString()
  });

  // Ensure dist directory exists
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write output
  fs.writeFileSync(path.join(distDir, 'index.html'), html);
  console.log('Build complete! dist/index.html');
}

// Watch mode
if (process.argv.includes('--watch')) {
  const chokidar = require('chokidar');

  console.log('Watching for changes...');

  chokidar.watch([
    path.join(__dirname, 'run_plan.yml'),
    path.join(__dirname, 'hyrox_plan.yml'),
    path.join(__dirname, 'strength_plan.yml'),
    path.join(__dirname, 'src', '**/*')
  ]).on('change', (filepath) => {
    console.log(`Changed: ${path.basename(filepath)}`);
    build();
  });

  build();
} else {
  build();
}
