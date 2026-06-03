export const handle: (callback: PagesFunction<Env>) => PagesFunction<Env> = (callback) => {
  return async (context) => {
    try {
      return await callback(context);
    } catch (e) {
      if (e instanceof Response) return e; // already a response, just return it
      panic(e instanceof Error ? e.message : "Unknown error", 500);
    }
  }
}

export function panic(msg: string, code: number): never {
  throw Response.json({error: msg}, {status: code});
}

export async function cache<T>(category: string, url: string, ttl: number): Promise<[T | null, (response: T) => Promise<T>]> {
  const cache = await caches.open(`steam:${category}`);
  const cached = (await cache.match(url))?.json<T>();

  return [
    await cached ?? null,
    async (data: T) => {
      await cache.put(url, new Response(JSON.stringify(data), {
        headers: {"Cache-Control": `max-age=${ttl}`},
      }));
      return data;
    }
  ] as const
}

