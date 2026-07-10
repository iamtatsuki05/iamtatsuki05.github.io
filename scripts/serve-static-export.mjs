import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { createGzip } from 'node:zlib';

const args = new Map();

for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const root = resolve(args.get('--dir') ?? 'out');
const host = args.get('--host') ?? '127.0.0.1';
const port = Number(args.get('--port') ?? 3000);

const contentTypes = new Map([
  ['.avif', 'image/avif'],
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.md', 'text/markdown; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

// 本番 (Cloudflare Pages) はテキスト資産を圧縮配信するため、ローカル計測でも挙動を揃える
const compressibleExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.svg',
  '.txt',
  '.webmanifest',
  '.xml',
]);

function isCompressible(filePath) {
  return compressibleExtensions.has(extname(filePath).toLowerCase());
}

function acceptsGzip(request) {
  const acceptEncoding = request.headers['accept-encoding'] ?? '';
  return /(^|,)\s*gzip\s*(;|,|$)/i.test(acceptEncoding);
}

function isSafePath(filePath) {
  return filePath === root || filePath.startsWith(`${root}${sep}`);
}

function getContentType(filePath) {
  return contentTypes.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream';
}

async function resolveFile(pathname) {
  const decodedPathname = decodeURIComponent(pathname);
  const requestedPath = resolve(root, `.${decodedPathname}`);

  if (!isSafePath(requestedPath)) {
    return null;
  }

  const candidates = decodedPathname.endsWith('/')
    ? [join(requestedPath, 'index.html')]
    : [requestedPath, join(requestedPath, 'index.html')];

  for (const candidate of candidates) {
    try {
      const fileStat = await stat(candidate);

      if (fileStat.isFile()) {
        return { filePath: candidate, fileStat, statusCode: 200 };
      }
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') {
        throw error;
      }
    }
  }

  return null;
}

async function resolveNotFound() {
  const filePath = join(root, '404.html');

  try {
    const fileStat = await stat(filePath);

    if (fileStat.isFile()) {
      return { filePath, fileStat, statusCode: 404 };
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  return null;
}

function sendFile(request, response, file) {
  const useGzip = isCompressible(file.filePath) && acceptsGzip(request);
  const headers = {
    'Content-Type': getContentType(file.filePath),
    Vary: 'Accept-Encoding',
  };
  if (useGzip) {
    headers['Content-Encoding'] = 'gzip';
  } else {
    headers['Content-Length'] = file.fileStat.size;
  }
  response.writeHead(file.statusCode, headers);

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  const stream = createReadStream(file.filePath);
  const handleStreamError = (error) => {
    if (error.code !== 'EPIPE' && error.code !== 'ECONNRESET') {
      response.destroy(error);
    }
  };

  stream.on('error', handleStreamError);
  if (useGzip) {
    const gzip = createGzip();
    gzip.on('error', handleStreamError);
    stream.pipe(gzip).pipe(response);
  } else {
    stream.pipe(response);
  }
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? `${host}:${port}`}`);
    const file = (await resolveFile(url.pathname)) ?? (await resolveNotFound());

    if (file) {
      sendFile(request, response, file);
      return;
    }

    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  } catch (error) {
    console.error(error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Internal server error');
  }
});

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}`);
});
