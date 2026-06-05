import type {Rect} from ".";

export interface Profile {
  background: string | null
  animatedBackground?: {webm: string; mp4: string}
}

export namespace Profile {
  export function create(defaults?: Partial<Profile>): Profile {
    return {
      background: null,
      ...defaults,
    }
  }

  export async function background(self: Profile, rect: Rect): Promise<ImageBitmap | undefined> {
    if (!self.background) return
    const image = await fetch(self.background!)
    return await createImageBitmap(await image.blob(), rect.x, rect.y, rect.w, rect.h)
  }
}

