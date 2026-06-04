export type ShowcaseType = 0 | 1 | 2

export interface CropRegion {
  bgX: number
  bgY: number
  bgW: number
  finalW: number
}

export interface SliceOutput {
  subPath: string
  canvas: HTMLCanvasElement
}

export const BG_REGIONS: Record<ShowcaseType, CropRegion> = {
  0: { bgX: 494, bgY: 256, bgW: 615, finalW: 615 },
  1: { bgX: 494, bgY: 256, bgW: 630, finalW: 630 },
  2: { bgX: 489, bgY: 380, bgW: 628, finalW: 628 },
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`圖片載入失敗：${src}`))
    img.src = src
  })
}

export async function buildComposite(
  userFile: File,
  type: ShowcaseType,
  bgUrl: string | null,
): Promise<HTMLCanvasElement> {
  const region = BG_REGIONS[type]
  const objectUrl = URL.createObjectURL(userFile)
  try {
    const userImg = await loadImage(objectUrl)

    if (!userImg.naturalWidth || !userImg.naturalHeight) {
      throw new Error(`圖片尺寸無效：${userFile.name}`)
    }

    const scale = region.finalW / userImg.naturalWidth
    const scaledW = region.finalW
    const scaledH = Math.round(userImg.naturalHeight * scale)

    const canvas = document.createElement('canvas')
    canvas.width = scaledW
    canvas.height = scaledH
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, scaledW, scaledH)

    if (bgUrl) {
      const bgImg = await loadImage(bgUrl)
      const bgCropH = bgImg.naturalHeight - region.bgY
      const bgDestH = Math.round((bgCropH / region.bgW) * scaledW)
      ctx.drawImage(
        bgImg,
        region.bgX, region.bgY, region.bgW, bgCropH,
        0, 0, scaledW, Math.min(bgDestH, scaledH),
      )
    }

    ctx.drawImage(userImg, 0, 0, scaledW, scaledH)
    return canvas
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export function sliceCanvas(
  composite: HTMLCanvasElement,
  type: ShowcaseType,
  filename: string,
  trimRight = false,
): SliceOutput[] {
  function extractRegion(
    src: HTMLCanvasElement,
    sx: number, sy: number, sw: number, sh: number,
  ): HTMLCanvasElement {
    const c = document.createElement('canvas')
    c.width = sw
    c.height = sh
    c.getContext('2d')!.drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh)
    return c
  }

  const h = composite.height

  if (type === 0) {
    const left = extractRegion(composite, 0, 0, 506, h)
    const rightH = trimRight ? Math.max(0, h - 70) : h
    const right = extractRegion(composite, 515, 0, 100, rightH)
    return [
      { subPath: `left/${filename}`, canvas: left },
      { subPath: `right/${filename}`, canvas: right },
    ]
  }

  if (type === 1) {
    return [{ subPath: filename, canvas: composite }]
  }

  return Array.from({ length: 5 }, (_, i) => ({
    subPath: `${i + 1}/${filename}`,
    canvas: extractRegion(composite, i * 126, 0, 122, h),
  }))
}

function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error('toBlob failed')), type)
  })
}

export async function saveSlices(
  slices: SliceOutput[],
  dir: FileSystemDirectoryHandle,
): Promise<void> {
  for (const { subPath, canvas } of slices) {
    const parts = subPath.split('/')
    let currentDir = dir
    for (const part of parts.slice(0, -1)) {
      currentDir = await currentDir.getDirectoryHandle(part, { create: true })
    }
    const leafName = parts[parts.length - 1]!
    const fileHandle = await currentDir.getFileHandle(leafName, { create: true })
    const writable = await fileHandle.createWritable()
    const blob = await canvasToBlob(canvas)
    await writable.write(blob)
    await writable.close()
  }
}
