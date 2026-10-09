/**
 * Gera as ilustrações locais (SVG) usadas como imagens dos produtos, categorias e banners.
 *
 * Elas existem para que a loja nunca exiba imagens quebradas enquanto as fotografias
 * reais da confeitaria não forem adicionadas. Para usar fotos, coloque os arquivos em
 * `public/images/` e altere os caminhos em `src/data/products.ts`.
 *
 * Uso: npm run images
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')

const C = {
  blush: '#F8E7E9',
  rose: '#C87983',
  cream: '#FFF8F0',
  choco: '#55352F',
  white: '#FFFFFF',
}

/** Gerador pseudoaleatório determinístico para que o resultado seja estável entre execuções. */
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const r1 = (n) => Math.round(n * 10) / 10

function frontY(cx, rx, ry, cy, x) {
  const t = Math.max(-1, Math.min(1, (x - cx) / rx))
  return cy + ry * Math.sqrt(1 - t * t)
}

function layerPath(cx, rx, ry, y0, y1) {
  const l = cx - rx
  const r = cx + rx
  return `M${l},${y0} L${l},${y1} A${rx},${ry} 0 0 0 ${r},${y1} L${r},${y0} A${rx},${ry} 0 0 1 ${l},${y0} Z`
}

function crumbs(rand, cx, rx, ry, y0, y1, color, count) {
  let out = ''
  for (let i = 0; i < count; i++) {
    const x = cx - rx + 8 + rand() * (rx * 2 - 16)
    const top = frontY(cx, rx, ry, y0, x) - ry * 0.2
    const bottom = frontY(cx, rx, ry, y1, x) - 4
    if (bottom - top < 6) continue
    const y = top + rand() * (bottom - top)
    out += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(1 + rand() * 2.2)}" fill="${color}" opacity="${r1(0.25 + rand() * 0.35)}"/>`
  }
  return out
}

function dripPath(cx, rx, ry, cy, rand, maxLen) {
  const pts = []
  const drips = []
  const n = Math.round((rx * 2) / 34)
  for (let i = 0; i < n; i++) {
    drips.push({ x: cx - rx + 14 + (i + rand() * 0.6) * ((rx * 2 - 28) / n), len: 10 + rand() * maxLen, w: 9 + rand() * 6 })
  }
  for (let x = cx + rx; x >= cx - rx; x -= 2) {
    let d = 6
    for (const dr of drips) {
      const k = (x - dr.x) / dr.w
      d += dr.len * Math.exp(-k * k * k * k)
    }
    pts.push(`${r1(x)},${r1(frontY(cx, rx, ry, cy, x) + d)}`)
  }
  return `M${cx - rx},${cy} A${rx},${ry} 0 0 1 ${cx + rx},${cy} L${pts.join(' L')} Z`
}

function ringPositions(cx, cy, rx, ry, count, phase = 0) {
  const list = []
  for (let i = 0; i < count; i++) {
    const a = phase + (i / count) * Math.PI * 2
    list.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry })
  }
  return list.sort((a, b) => a.y - b.y)
}

const toppings = {
  brigadeiro(x, y, rand, color = '#3b201b') {
    let s = `<circle cx="${r1(x)}" cy="${r1(y - 12)}" r="22" fill="#000" opacity="0.12"/><circle cx="${r1(x)}" cy="${r1(y - 16)}" r="21" fill="${color}"/>`
    for (let i = 0; i < 14; i++) {
      const a = rand() * Math.PI * 2
      const d = rand() * 17
      s += `<rect x="${r1(x + Math.cos(a) * d)}" y="${r1(y - 16 + Math.sin(a) * d)}" width="5" height="2" rx="1" fill="${color === '#3b201b' ? '#1f100d' : '#e9d6bb'}" transform="rotate(${Math.round(rand() * 180)} ${r1(x + Math.cos(a) * d)} ${r1(y - 16 + Math.sin(a) * d)})"/>`
    }
    s += `<ellipse cx="${r1(x - 7)}" cy="${r1(y - 25)}" rx="7" ry="4" fill="#fff" opacity="0.22"/>`
    return s
  },
  strawberry(x, y) {
    return `<g transform="translate(${r1(x)} ${r1(y - 22)})">
<path d="M0,26 C-16,16 -20,0 -14,-8 C-8,-14 8,-14 14,-8 C20,0 16,16 0,26 Z" fill="#d23c4b"/>
<path d="M0,26 C-6,18 -9,6 -8,-6 C-3,-10 4,-10 9,-7 C12,4 8,16 0,26 Z" fill="#e65766" opacity="0.6"/>
<g fill="#ffe3a6"><circle cx="-7" cy="2" r="1.2"/><circle cx="6" cy="0" r="1.2"/><circle cx="-2" cy="10" r="1.2"/><circle cx="5" cy="12" r="1.2"/><circle cx="-6" cy="-5" r="1.2"/><circle cx="1" cy="-4" r="1.2"/></g>
<path d="M-12,-9 C-6,-16 -2,-12 0,-16 C2,-12 6,-16 12,-9 C6,-8 2,-10 0,-7 C-2,-10 -6,-8 -12,-9 Z" fill="#4f8a4a"/></g>`
  },
  rosette(x, y, color = C.cream, shade = '#ecd9c6') {
    return `<g transform="translate(${r1(x)} ${r1(y - 12)})">
<circle r="17" fill="${shade}"/><circle r="14" cx="-1" cy="-2" fill="${color}"/>
<path d="M-9,-2 C-8,-10 4,-12 8,-4 C11,3 2,9 -3,5 C-7,2 -4,-5 2,-3" fill="none" stroke="${shade}" stroke-width="2.2" stroke-linecap="round"/></g>`
  },
  shaving(x, y, rand) {
    const a = Math.round(rand() * 180)
    return `<path d="M${r1(x - 10)},${r1(y - 6)} q10,-9 20,0" fill="none" stroke="#2c1713" stroke-width="5" stroke-linecap="round" transform="rotate(${a} ${r1(x)} ${r1(y - 6)})"/><path d="M${r1(x - 8)},${r1(y - 7)} q8,-7 16,0" fill="none" stroke="#6b4239" stroke-width="1.6" stroke-linecap="round" transform="rotate(${a} ${r1(x)} ${r1(y - 6)})"/>`
  },
  flower(x, y, color = C.rose) {
    let petals = ''
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * 360
      petals += `<ellipse cx="0" cy="-8" rx="6" ry="9" fill="${color}" transform="rotate(${a})"/>`
    }
    return `<g transform="translate(${r1(x)} ${r1(y - 12)})">${petals}<circle r="4.5" fill="#f3d27a"/></g>`
  },
}

function sprinkleSurface(rand, cx, rx, ry, cy, count, colors, sizeMin = 1.2, sizeMax = 2.6) {
  let s = ''
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand()) * 0.92
    const x = cx + Math.cos(a) * rx * d
    const y = cy + Math.sin(a) * ry * d
    const col = colors[Math.floor(rand() * colors.length)]
    s += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(sizeMin + rand() * (sizeMax - sizeMin))}" ry="${r1(sizeMin * 0.7)}" fill="${col}" transform="rotate(${Math.round(rand() * 180)} ${r1(x)} ${r1(y)})"/>`
  }
  return s
}

/**
 * Desenha um andar de bolo.
 * `layers` vai de baixo para cima; usado no estilo "naked" (camadas aparentes).
 */
function tier(o) {
  const { cx, top, height, rx, ry, rand } = o
  const bottom = top + height
  let s = ''
  if (o.style === 'naked') {
    const total = o.layers.reduce((a, l) => a + l.h, 0)
    let y = bottom
    for (const layer of o.layers) {
      const h = (layer.h / total) * height
      const y0 = y - h
      s += `<path d="${layerPath(cx, rx, ry, r1(y0), r1(y))}" fill="${layer.color}"/>`
      if (layer.crumbs) s += crumbs(rand, cx, rx, ry, y0, y, layer.crumbs, Math.round(rx * 0.35))
      if (layer.dots) s += crumbs(rand, cx, rx, ry, y0, y, layer.dots, Math.round(rx * 0.12))
      y = y0
    }
  } else {
    s += `<path d="${layerPath(cx, rx, ry, top, bottom)}" fill="${o.body}"/>`
    if (o.bodyShade) {
      s += `<path d="${layerPath(cx, rx, ry, top, bottom)}" fill="url(#shade)" opacity="0.6"/>`
    }
    if (o.band) {
      s += `<path d="${layerPath(cx, rx, ry, bottom - 18, bottom)}" fill="${o.band}"/>`
    }
  }
  // superfície
  s += `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="${o.topColor}"/>`
  if (o.drip) s += `<path d="${dripPath(cx, rx, ry, top, rand, o.dripLen ?? 46)}" fill="${o.drip}"/>`
  if (o.dripGloss) s += `<path d="M${cx - rx * 0.7},${top - ry * 0.35} q${rx * 0.5},${-ry * 0.45} ${rx * 0.9},${-ry * 0.2}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.22"/>`
  if (o.surface) s += o.surface({ cx, cy: top, rx, ry })
  if (o.ring) {
    for (const p of ringPositions(cx, top, rx * 0.78, ry * 0.7, o.ring.count, o.ring.phase ?? 0.3)) s += o.ring.draw(p.x, p.y)
  }
  if (o.center) s += o.center({ cx, cy: top })
  return s
}

function stand(cx, y, rx) {
  return `<ellipse cx="${cx}" cy="${y + 120}" rx="${rx * 0.9}" ry="16" fill="${C.choco}" opacity="0.10"/>
<path d="M${cx - 34},${y + 14} L${cx - 22},${y + 100} L${cx - 78},${y + 116} L${cx + 78},${y + 116} L${cx + 22},${y + 100} L${cx + 34},${y + 14} Z" fill="#f1e2d9"/>
<ellipse cx="${cx}" cy="${y + 116}" rx="78" ry="10" fill="#e6d3c8"/>
<ellipse cx="${cx}" cy="${y + 6}" rx="${rx}" ry="${rx * 0.16}" fill="#e9d8ce"/>
<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${rx * 0.16}" fill="${C.white}"/>`
}

function defs(bgA, bgB) {
  return `<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bgA}"/><stop offset="1" stop-color="${bgB}"/></linearGradient>
<linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.18"/><stop offset="0.35" stop-color="#000" stop-opacity="0"/><stop offset="0.75" stop-color="#fff" stop-opacity="0.08"/><stop offset="1" stop-color="#000" stop-opacity="0.2"/></linearGradient>
</defs>`
}

function scene({ w = 800, h = 1000, bg, arch = true, body, title }) {
  const archFill = bg[2] ?? C.white
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}">
<title>${title}</title>
${defs(bg[0], bg[1])}
<rect width="${w}" height="${h}" fill="url(#bg)"/>
${arch ? `<path d="M${w * 0.14},${h} L${w * 0.14},${h * 0.42} A${w * 0.36},${w * 0.36} 0 0 1 ${w * 0.86},${h * 0.42} L${w * 0.86},${h} Z" fill="${archFill}" opacity="0.55"/>` : ''}
${body}
</svg>
`
}

function singleCake(seed, cakeOpts, title, bg) {
  const rand = rng(seed)
  const cx = 400
  const rx = 210
  const ry = 50
  const top = 470
  const height = cakeOpts.height ?? 260
  const body = stand(cx, top + height + 18, 285) + tier({ cx, top, height, rx, ry, rand, ...cakeOpts(rand) })
  return scene({ bg, body, title })
}

// Cada fábrica recebe o RNG para que coberturas e confeitos sejam determinísticos.
const cakes = {
  'bolo-de-brigadeiro': {
    title: 'Ilustração de bolo de brigadeiro com confeitos de chocolate',
    bg: [C.blush, '#f3d9dc'],
    opts: (rand) => ({
      style: 'frosted',
      body: '#4a2a24',
      bodyShade: true,
      topColor: '#3f231e',
      surface: ({ cx, cy, rx, ry }) => sprinkleSurface(rand, cx, rx, ry, cy, 140, ['#2a1511', '#6d463c']),
      ring: { count: 9, draw: (x, y) => toppings.brigadeiro(x, y, rand) },
      center: ({ cx, cy }) => toppings.brigadeiro(cx, cy + 6, rand),
    }),
  },
  'bolo-de-ninho-com-morango': {
    title: 'Ilustração de bolo de leite Ninho com morangos',
    bg: [C.cream, '#f7e3e3'],
    opts: () => ({
      style: 'naked',
      layers: [
        { color: '#f2dcb8', h: 3, crumbs: '#c9a676' },
        { color: '#fffaf3', h: 1.4, dots: '#d9475a' },
        { color: '#f2dcb8', h: 3, crumbs: '#c9a676' },
        { color: '#fffaf3', h: 1.4, dots: '#d9475a' },
        { color: '#f2dcb8', h: 3, crumbs: '#c9a676' },
      ],
      topColor: '#fffdf9',
      ring: { count: 8, draw: (x, y) => toppings.strawberry(x, y) },
      center: ({ cx, cy }) => toppings.rosette(cx, cy + 8),
    }),
  },
  'bolo-red-velvet': {
    title: 'Ilustração de bolo red velvet com recheio de cream cheese',
    bg: [C.cream, '#f6e6e0'],
    opts: (rand) => ({
      style: 'naked',
      layers: [
        { color: '#a12a3c', h: 3, crumbs: '#6e1424' },
        { color: '#fbf3ea', h: 1.3 },
        { color: '#a12a3c', h: 3, crumbs: '#6e1424' },
        { color: '#fbf3ea', h: 1.3 },
        { color: '#a12a3c', h: 3, crumbs: '#6e1424' },
      ],
      topColor: '#fbf3ea',
      surface: ({ cx, cy, rx, ry }) => sprinkleSurface(rand, cx, rx * 0.45, ry * 0.45, cy, 60, ['#a12a3c', '#7d1b2c'], 1.8, 3.4),
      ring: { count: 10, draw: (x, y) => toppings.rosette(x, y, '#fffaf4', '#ead9c9') },
    }),
  },
  'bolo-de-chocolate-belga': {
    title: 'Ilustração de bolo de chocolate belga com ganache e raspas',
    bg: ['#f6e1e3', C.blush],
    opts: (rand) => ({
      style: 'frosted',
      body: '#3a1f1a',
      bodyShade: true,
      band: '#2c1713',
      topColor: '#2c1713',
      drip: '#24120e',
      dripLen: 60,
      dripGloss: true,
      surface: ({ cx, cy }) => {
        let s = ''
        for (const p of ringPositions(cx, cy, 70, 16, 12, 0.1)) s += toppings.shaving(p.x, p.y + 6, rand)
        return s
      },
      ring: { count: 7, draw: (x, y) => toppings.rosette(x, y, '#5a352d', '#3a1f1a') },
    }),
  },
  'bolo-de-cenoura-com-brigadeiro': {
    title: 'Ilustração de bolo de cenoura com cobertura de brigadeiro',
    bg: [C.cream, '#f8ebdd'],
    height: 220,
    opts: (rand) => ({
      style: 'frosted',
      body: '#e39a43',
      bodyShade: true,
      topColor: '#3f231e',
      drip: '#3f231e',
      dripLen: 70,
      dripGloss: true,
      surface: ({ cx, cy, rx, ry }) => sprinkleSurface(rand, cx, rx, ry, cy, 220, ['#24120e', '#6d463c', '#1a0c09']),
    }),
  },
  'bolo-de-prestigio': {
    title: 'Ilustração de bolo de prestígio com coco e chocolate',
    bg: [C.blush, '#f5e2e0'],
    opts: (rand) => ({
      style: 'naked',
      layers: [
        { color: '#4a2a24', h: 3, crumbs: '#2a1511' },
        { color: '#fffaf2', h: 1.6, crumbs: '#e9dccb' },
        { color: '#4a2a24', h: 3, crumbs: '#2a1511' },
        { color: '#fffaf2', h: 1.6, crumbs: '#e9dccb' },
        { color: '#4a2a24', h: 3, crumbs: '#2a1511' },
      ],
      topColor: '#3f231e',
      drip: '#3f231e',
      dripLen: 34,
      dripGloss: true,
      surface: ({ cx, cy, rx, ry }) => sprinkleSurface(rand, cx, rx, ry, cy, 260, ['#ffffff', '#f6efe4'], 2, 4.5),
    }),
  },
  'bolo-de-dois-amores': {
    title: 'Ilustração de bolo dois amores com brigadeiro branco e preto',
    bg: ['#f7e4e6', C.cream],
    opts: (rand) => ({
      style: 'naked',
      layers: [
        { color: '#5a352d', h: 3, crumbs: '#2a1511' },
        { color: '#f7ecd9', h: 1.4 },
        { color: '#5a352d', h: 3, crumbs: '#2a1511' },
        { color: '#3a1f1a', h: 1.4 },
        { color: '#5a352d', h: 3, crumbs: '#2a1511' },
      ],
      topColor: '#f7ecd9',
      ring: {
        count: 10,
        draw: (() => {
          let i = 0
          return (x, y) => toppings.brigadeiro(x, y, rand, i++ % 2 === 0 ? '#3b201b' : '#f3e4cc')
        })(),
      },
    }),
  },
}

function customCake() {
  const rand = rng(77)
  const cx = 400
  let body = stand(cx, 838, 270)
  body += tier({
    cx, top: 640, height: 190, rx: 200, ry: 46, rand,
    style: 'frosted', body: '#f6dadd', bodyShade: true, topColor: '#f8e3e5', band: '#eec6cb',
    ring: { count: 9, draw: (x, y) => toppings.flower(x, y, rand() > 0.5 ? C.rose : '#e8a9b1') },
  })
  body += tier({
    cx, top: 470, height: 170, rx: 135, ry: 32, rand,
    style: 'frosted', body: C.white, bodyShade: true, topColor: '#fffaf6', band: '#f3e4dc',
    ring: { count: 6, draw: (x, y) => toppings.rosette(x, y, '#fff6f2', '#efd9d4') },
    center: ({ cy }) =>
      `<g transform="translate(${cx} ${cy - 30})"><path d="M0,22 L0,-4" stroke="${C.choco}" stroke-width="2.5"/><path d="M0,-6 C-14,-24 -34,-8 0,16 C34,-8 14,-24 0,-6 Z" fill="${C.rose}"/></g>`,
  })
  // pérolas decorativas
  for (let i = 0; i < 18; i++) {
    const x = cx - 192 + i * 22.6
    body += `<circle cx="${r1(x)}" cy="${r1(frontY(cx, 200, 46, 822, x))}" r="5" fill="#fff" stroke="#efd9d4"/>`
  }
  return scene({ bg: [C.blush, '#f2d4d8', C.cream], body, title: 'Ilustração de bolo personalizado de dois andares com flores' })
}

function hero() {
  const rand = rng(11)
  let body = ''
  // bolo à esquerda (menor, ao fundo)
  body += stand(330, 820, 220)
  body += tier({
    cx: 330, top: 600, height: 200, rx: 165, ry: 40, rand,
    style: 'naked',
    layers: [
      { color: '#f2dcb8', h: 3, crumbs: '#c9a676' },
      { color: '#fffaf3', h: 1.4, dots: '#d9475a' },
      { color: '#f2dcb8', h: 3, crumbs: '#c9a676' },
      { color: '#fffaf3', h: 1.4, dots: '#d9475a' },
      { color: '#f2dcb8', h: 3, crumbs: '#c9a676' },
    ],
    topColor: '#fffdf9',
    ring: { count: 7, draw: (x, y) => toppings.strawberry(x, y) },
  })
  // bolo principal
  body += stand(820, 880, 300)
  body += tier({
    cx: 820, top: 560, height: 290, rx: 225, ry: 54, rand,
    style: 'frosted', body: '#4a2a24', bodyShade: true, topColor: '#3f231e', drip: '#2c1713', dripLen: 58, dripGloss: true,
    surface: ({ cx, cy, rx, ry }) => sprinkleSurface(rand, cx, rx, ry, cy, 120, ['#2a1511', '#6d463c']),
    ring: { count: 10, draw: (x, y) => toppings.brigadeiro(x, y, rand) },
    center: ({ cx, cy }) => toppings.strawberry(cx, cy + 8),
  })
  // pétalas soltas
  for (let i = 0; i < 9; i++) {
    const x = 120 + rand() * 960
    const y = 120 + rand() * 300
    body += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="9" ry="5" fill="${C.rose}" opacity="${r1(0.25 + rand() * 0.35)}" transform="rotate(${Math.round(rand() * 180)} ${r1(x)} ${r1(y)})"/>`
  }
  return scene({ w: 1200, h: 1000, bg: [C.blush, '#f3d6da', C.cream], body, arch: true, title: 'Ilustração de dois bolos artesanais sobre boleiras' })
}

function occasion(seed, bg, fn, title) {
  const rand = rng(seed)
  return scene({ w: 800, h: 600, arch: false, bg, title, body: fn(rand) })
}

const occasions = {
  aniversario: () =>
    occasion(5, [C.blush, '#f1d1d6'], (rand) => {
      let s = stand(400, 500, 220)
      s += tier({
        cx: 400, top: 300, height: 180, rx: 160, ry: 38, rand,
        style: 'frosted', body: '#fdf3f4', bodyShade: true, topColor: '#fff8f9',
        surface: ({ cx, cy, rx, ry }) => sprinkleSurface(rand, cx, rx, ry, cy, 90, [C.rose, '#f3d27a', '#8fc1d4', '#b7d8a8']),
      })
      for (const x of [350, 400, 450]) {
        s += `<rect x="${x - 4}" y="${x === 400 ? 236 : 246}" width="8" height="54" rx="3" fill="${C.rose}"/><path d="M${x},${x === 400 ? 214 : 224} c-8,10 -6,20 0,22 c6,-2 8,-12 0,-22 Z" fill="#f3b34c"/>`
      }
      return s
    }, 'Ilustração de bolo de aniversário com velas'),
  casamento: () =>
    occasion(6, [C.cream, '#f4e7dc'], (rand) => {
      let s = stand(400, 540, 200)
      s += tier({ cx: 400, top: 410, height: 120, rx: 150, ry: 34, rand, style: 'frosted', body: C.white, bodyShade: true, topColor: '#fffaf6', band: '#f3e4dc' })
      s += tier({ cx: 400, top: 300, height: 110, rx: 110, ry: 26, rand, style: 'frosted', body: C.white, bodyShade: true, topColor: '#fffaf6', band: '#f3e4dc' })
      s += tier({
        cx: 400, top: 200, height: 100, rx: 72, ry: 18, rand, style: 'frosted', body: C.white, bodyShade: true, topColor: '#fffaf6',
        ring: { count: 4, draw: (x, y) => toppings.flower(x, y, '#e8a9b1') },
      })
      return s
    }, 'Ilustração de bolo de três andares para casamento'),
  'cha-de-bebe': () =>
    occasion(7, ['#f3f0f6', C.blush], (rand) => {
      let s = stand(400, 500, 220)
      s += tier({
        cx: 400, top: 310, height: 170, rx: 160, ry: 38, rand, style: 'frosted', body: '#e9f1f6', bodyShade: true, topColor: '#f4f8fb',
        ring: { count: 8, draw: (x, y) => toppings.rosette(x, y, '#f8e7e9', '#ecd0d4') },
      })
      return s
    }, 'Ilustração de bolo delicado em tons pastel para chá de bebê'),
  'datas-especiais': () =>
    occasion(8, ['#f6e1e3', '#efd2d6'], (rand) => {
      let s = stand(400, 500, 220)
      s += tier({
        cx: 400, top: 300, height: 180, rx: 160, ry: 38, rand, style: 'frosted', body: '#3a1f1a', bodyShade: true, topColor: '#2c1713', drip: '#24120e', dripLen: 40, dripGloss: true,
        ring: { count: 7, draw: (x, y) => toppings.strawberry(x, y) },
      })
      return s
    }, 'Ilustração de bolo de chocolate com morangos para datas especiais'),
}

function placeholder() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img" aria-label="Imagem indisponível">
<rect width="800" height="1000" fill="${C.blush}"/>
<g fill="none" stroke="${C.rose}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="0.7">
<path d="M260,620 L260,520 A140,32 0 0 1 540,520 L540,620 A140,32 0 0 1 260,620 Z"/>
<path d="M260,520 A140,32 0 0 0 540,520"/>
<path d="M400,488 L400,440"/><path d="M400,430 c-10,-14 -10,-26 0,-34 c10,8 10,20 0,34 Z"/>
</g></svg>
`
}

function write(rel, content) {
  const file = join(OUT, rel)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
  console.log('✓', rel, `${(content.length / 1024).toFixed(1)} kB`)
}

for (const [slug, c] of Object.entries(cakes)) {
  const opts = (rand) => c.opts(rand)
  opts.height = c.height
  write(`products/${slug}.svg`, singleCake(slug.length * 97, opts, c.title, c.bg))
}
write('products/bolo-personalizado.svg', customCake())
write('hero.svg', hero())
for (const [slug, fn] of Object.entries(occasions)) write(`occasions/${slug}.svg`, fn())
write('placeholder.svg', placeholder())
