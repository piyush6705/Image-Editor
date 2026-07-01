const filters = {
  brightness: { label: 'Brightness', value: 100, min: 0, max: 200, unit: '%' },
  contrast: { label: 'Contrast', value: 100, min: 0, max: 200, unit: '%' },
  saturation: { label: 'Saturation', value: 100, min: 0, max: 200, unit: '%' },
  exposure: { label: 'Exposure', value: 100, min: 0, max: 200, unit: '%' },
  hueRotate: { label: 'Hue Rotate', value: 0, min: 0, max: 360, unit: 'deg' },
  blur: { label: 'Blur', value: 0, min: 0, max: 20, unit: 'px' },
  grayscale: { label: 'Grayscale', value: 0, min: 0, max: 100, unit: '%' },
  sepia: { label: 'Sepia', value: 0, min: 0, max: 100, unit: '%' },
  opacity: { label: 'Opacity', value: 100, min: 0, max: 100, unit: '%' },
  invert: { label: 'Invert', value: 0, min: 0, max: 100, unit: '%' }
};


const presets = {
  original:  { brightness: 100, contrast: 100, exposure: 100, saturation: 100, hueRotate: 0,   blur: 0, grayscale: 0,  sepia: 0,  opacity: 100, invert: 0 },
  vintage:   { brightness: 110, contrast: 120, exposure: 100, saturation: 80,  hueRotate: 0,   blur: 0, grayscale: 0,  sepia: 50, opacity: 100, invert: 0 },
  cold: { brightness: 105, contrast: 100, exposure: 100, saturation: 70,  hueRotate: 180, blur: 0, grayscale: 0,  sepia: 0,  opacity: 100, invert: 0 },
  warm: { brightness: 110, contrast: 100, exposure: 100, saturation: 140, hueRotate: 0,   blur: 0, grayscale: 0,  sepia: 30, opacity: 100, invert: 0 },
  dramatic: { brightness: 80,  contrast: 150, exposure: 100, saturation: 130, hueRotate: 0,   blur: 0, grayscale: 0,  sepia: 0,  opacity: 100, invert: 0 },
  dark:{ brightness: 60,  contrast: 130, exposure: 100, saturation: 100, hueRotate: 0,   blur: 0, grayscale: 0,  sepia: 0,  opacity: 100, invert: 0 },
};


const imageCanvas = document.getElementById('image-canvas');

const ctx = imageCanvas.getContext('2d');

const imgInput = document.getElementById('image-input');

const filtersContainer = document.querySelector('.filters');

const resetBtn = document.getElementById('reset-btn');

const downloadBtn = document.getElementById('download-btn');

const placeholder = document.querySelector('.placeholder');

const presetBtns = document.querySelectorAll('.preset-btn');

let originalImage = null;


function createFilterElement(key, filter) {
  const div = document.createElement('div');
  div.classList.add('filter');
  const label = document.createElement('label');
  label.setAttribute('for', key);
  label.textContent = filter.label;
  const input = document.createElement('input');
  input.type = 'range';
  input.id = key;
  input.min = filter.min;
  input.max = filter.max;
  input.value = filter.value;

    input.addEventListener('input', (e) => {
    filters[key].value = Number(e.target.value);
    applyFilters();
  });
  div.appendChild(label);
  div.appendChild(input);
  return div;
}
Object.keys(filters).forEach((key) => {
  filtersContainer.appendChild(createFilterElement(key, filters[key]));
});


function buildFilterString() {
  
  const combinedBrightness =
    (filters.brightness.value / 100) * (filters.exposure.value / 100);
  return [
    `brightness(${combinedBrightness})`,
    `contrast(${filters.contrast.value}%)`,
    `saturate(${filters.saturation.value}%)`,
    `hue-rotate(${filters.hueRotate.value}deg)`,
    `blur(${filters.blur.value}px)`,
    `grayscale(${filters.grayscale.value}%)`,
    `sepia(${filters.sepia.value}%)`,
    `opacity(${filters.opacity.value}%)`,
    `invert(${filters.invert.value}%)`,
  ].join(' ');
}

function applyFilters() {
  if (!originalImage) return;
  ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
  ctx.filter = buildFilterString();
  ctx.drawImage(originalImage, 0, 0, imageCanvas.width, imageCanvas.height);
}


function syncSlidersToValues() {
  Object.keys(filters).forEach((key) => {
    const input = document.getElementById(key);
    if (input) input.value = filters[key].value;
  });
}

function resetFilters() {
  Object.keys(filters).forEach((key) => {
    filters[key].value = 100; 
  });
  
  filters.hueRotate.value = 0;
  filters.blur.value = 0;
  filters.grayscale.value = 0;
  filters.sepia.value = 0;
  filters.invert.value = 0;
  syncSlidersToValues();
  
  presetBtns.forEach((btn) => btn.classList.remove('active'));
  applyFilters();
}

imgInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    originalImage = img;
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    
    placeholder.style.display = 'none';
    imageCanvas.style.display = 'block';
    resetFilters();          
    URL.revokeObjectURL(img.src);
  };
});


resetBtn.addEventListener('click', () => {
  resetFilters();
});

downloadBtn.addEventListener('click', () => {
  if (!originalImage) return;
  
  applyFilters();
  const link  = document.createElement('a');
  link.download = 'edited-image.png';
  link.href  = imageCanvas.toDataURL('image/png');
  link.click();
});

presetBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const preset = presets[btn.dataset.filter];
    if (!preset) return;
    
    Object.keys(preset).forEach((key) => {
      filters[key].value = preset[key];
    });
    syncSlidersToValues();
    
    presetBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
});