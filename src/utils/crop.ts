import {save, Semaphore, type Rect} from "."
import {Profile} from "./profile"
import {Showcase} from "./showcase"

export async function crop(dir: FileSystemDirectoryHandle, profile: Profile, showcase: Showcase) {

  const height = await Showcase.readHeight(showcase)
  const regions = Showcase.regions(showcase, height)
  const backgroundRegion = Showcase.backgroundRegion(showcase, height)
  const background = await createBackgroundOverlay(profile, backgroundRegion)
  const canvasArray = regions.map(region => [new Semaphore(1), new OffscreenCanvas(region.w, region.h)] as const)

  const results = showcase.images.map(async file => {
    let image = await createBitmap(file, backgroundRegion)
    if (background) image = background(image)

    const results = await Promise.all(regions.map(async (region, i) => {
      const [sema, ocanvas] = canvasArray[i]!
      await sema.acquire()
      const clipped = await createImageBitmap(image, region.x, region.y, region.w, region.h)
      ocanvas.getContext('bitmaprenderer')!.transferFromImageBitmap(clipped)
      const blob = await ocanvas.convertToBlob({type: 'image/png'});
      const path = (region.kind && `${region.kind}/`) + file.name
      sema.release()
      await save(dir, path, blob, showcase.kind)
    }))

    image.close()
    return results
  })

  // waiting for all images
  await Promise.all(results)
}

async function createBitmap(file: File, size: Rect): Promise<ImageBitmap> {
  const temp = await createImageBitmap(file) // TODO: Handle error
  const height = Math.round((temp.height / temp.width) * size.w)
  const resized = await createImageBitmap(temp, {
    resizeWidth: size.w,
    resizeHeight: height,
    resizeQuality: "high",
  })
  temp.close()
  return resized
}

async function createBackgroundOverlay(profile: Profile, region: Rect): Promise<undefined | ((bitmap: ImageBitmap) => ImageBitmap)> {
  const background = await Profile.background(profile, region)
  if (!background) return

  const canvas = new OffscreenCanvas(region.w, Math.max(region.h, 1080))
  const ctx = canvas.getContext("2d")!
  return (bitmap) => {
    ctx.drawImage(background, 0, 0)
    ctx.drawImage(bitmap, 0, 0)
    return canvas.transferToImageBitmap()
  }
}
