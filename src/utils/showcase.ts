import {match} from "ts-pattern";
import type {Rect} from ".";

export interface Showcase {
  images: File[]
  kind: ShowcaseKind
  trimmed: boolean
}

export enum ShowcaseKind {
  Artwork = 'artwork',
  Featured = 'featured',
  Workshop = 'workshop',
}

export interface ShowcaseRegion extends Rect {
  kind?: string
}

export namespace Showcase {
  export function create(showcase?: Partial<Showcase>): Showcase {
    return {
      images: [],
      kind: ShowcaseKind.Artwork,
      trimmed: true,
      ...showcase,
    }
  }
  export function backgroundRegion(self: Showcase, height?: number): Rect {
    const h = height ?? 600
    return match(self.kind)
      .with(ShowcaseKind.Artwork, () => ({x: 494, y: 256, w: 615, h: h - 256}))
      .with(ShowcaseKind.Featured, () => ({x: 494, y: 256, w: 630, h: h - 256}))
      .with(ShowcaseKind.Workshop, () => ({x: 489, y: 380, w: 628, h: h - 380}))
      .exhaustive()
  }
  export function regions(self: Showcase, height: number): ShowcaseRegion[] {
    const trimmed = self.trimmed ? 70 : 0
    return match(self.kind)
      .with(ShowcaseKind.Artwork, () => [
        {x: 0, y: 0, w: 506, h: height, kind: 'main'},
        {x: 515, y: 0, w: 100, h: height - trimmed, kind: 'side'},
      ])
      .with(ShowcaseKind.Featured, () => [
        {x: 0, y: 0, w: 630, h: height},
      ])
      .with(ShowcaseKind.Workshop, () => Array.from({length: 5}, (_, i) => ({
        x: i * 126, y: 0, w: 122, h: height, kind: (i + 1).toString(),
      })))
      .exhaustive()
  }
  export async function readHeight(self: Showcase): Promise<number> {
    if (!self.images[0]) return 600
    const image = await createImageBitmap(self.images[0])
    const height = image.height / image.width
    image.close()
    return match(self.kind)
      .with(ShowcaseKind.Artwork, () => height * 615)
      .with(ShowcaseKind.Featured, () => height * 630)
      .with(ShowcaseKind.Workshop, () => height * 628)
      .exhaustive()
  }
}

