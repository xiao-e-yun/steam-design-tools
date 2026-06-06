import {ShowcaseKind} from "./showcase"

export interface Rect {
  x: number
  y: number
  w: number
  h: number
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

export class FileSystem {
  constructor(readonly dir: FileSystemDirectoryHandle) {}

  readonly MAX_CONCURRENT_WRITES = 16

  private writeSemaphore = new Semaphore(this.MAX_CONCURRENT_WRITES)
  async save(path: string, blob: Blob, kind: ShowcaseKind) {

    if (kind === ShowcaseKind.Workshop) 
      blob = blob.slice(0, blob.size - 1);

    await this.writeSemaphore.acquire();
    // create directories as needed
    const [currentDir, filename] = await this.createDirectory(path)

    // create file and write blob to it
    const fileHandle = await currentDir.getFileHandle(filename, {create: true})
    const writable = await fileHandle.createWritable()
    await blob.stream().pipeTo(writable, { preventClose: true })

    if (kind === ShowcaseKind.Workshop) 
      writable.write(new Uint8Array([0x21]))

    writable.close()
    this.writeSemaphore.release();
  }

  private createdDirs = new Map<string, Promise<FileSystemDirectoryHandle>>()
  async createDirectory(path: string): Promise<[FileSystemDirectoryHandle, string]> {
    const parts = path.split('/')
    const filename = parts.pop()!

    const dirPath = parts.join('/')
    const created = this.createdDirs.get(dirPath)
    if (created) return [await created, filename]

    const handle = (async () => {
      let dir = this.dir
      for (const part of parts)
        dir = await dir.getDirectoryHandle(part, {create: true})
      return dir
    })()

    this.createdDirs.set(dirPath, handle)
    return [await handle, filename]
  }
}

