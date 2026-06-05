import {ShowcaseKind} from "./showcase"

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export async function save(dir: FileSystemDirectoryHandle, path: string, blob: Blob, kind: ShowcaseKind) {
  const [currentDir, filename] = await createDirectory(dir, path)
  const fileHandle = await currentDir.getFileHandle(filename, {create: true})
  if (kind === ShowcaseKind.Workshop) {
    const mainChunk = blob.slice(0, blob.size - 1);
    const flagChunk = new Uint8Array([0x21]);
    blob = new Blob([mainChunk, flagChunk], { type: blob.type });
  }
  const writable = await fileHandle.createWritable()
  await blob.stream().pipeTo(writable); 
}

async function createDirectory(dir: FileSystemDirectoryHandle, path: string): Promise<[FileSystemDirectoryHandle, string]> {
  const parts = path.split('/')
  const filename = parts.pop()!
  for (const part of parts) {
    dir = await dir.getDirectoryHandle(part, {create: true})
  }
  return [dir, filename]
}

export class Semaphore {
  currentPermits: number
  queue: ((_: null) => void)[] = []
  constructor(readonly maxPermits: number) {
    this.currentPermits = maxPermits;
  }

  // Acquire a permit. If none are available, wait.
  async acquire() {
    if (this.currentPermits > 0) {
      this.currentPermits--;
      return;
    }

    // Wait for a slot to free up
    return new Promise((resolve) => {
      this.queue.push(resolve);
    });
  }

  // Release a permit and alert the next waiting task
  release() {
    this.currentPermits++;
    if (this.queue.length > 0 && this.currentPermits > 0) {
      this.currentPermits--;
      this.queue.shift()!(null);
    }
  }
}

