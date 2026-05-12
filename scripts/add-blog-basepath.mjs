// Prefix root-relative src/href/srcset URLs in public HTML files with /blog
// so they resolve under the Next.js basePath.
// Skips: protocol-absolute (http://, //), already-prefixed (/blog), anchors (#), data:, mailto:, tel:
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

const PUBLIC_DIR = new URL('../public/', import.meta.url).pathname;

function shouldPrefix(url) {
  if (!url.startsWith('/')) return false;
  if (url.startsWith('//')) return false;
  if (url.startsWith('/blog/') || url === '/blog') return false;
  return true;
}

function rewrite(html) {
  // src="/foo" or href="/foo"
  let out = html.replace(/(\s(?:src|href)=)"(\/[^"]*)"/g, (m, attr, path) => {
    if (!shouldPrefix(path)) return m;
    return `${attr}"/blog${path}"`;
  });
  out = out.replace(/(\s(?:src|href)=)'(\/[^']*)'/g, (m, attr, path) => {
    if (!shouldPrefix(path)) return m;
    return `${attr}'/blog${path}'`;
  });
  // srcset values: each candidate may have a URL
  out = out.replace(/(\ssrcset=)"([^"]*)"/g, (m, attr, val) => {
    const next = val
      .split(',')
      .map((p) => p.trim())
      .map((p) => {
        const parts = p.split(/\s+/);
        if (parts[0] && shouldPrefix(parts[0])) parts[0] = '/blog' + parts[0];
        return parts.join(' ');
      })
      .join(', ');
    return `${attr}"${next}"`;
  });
  return out;
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (!/\.html?$/i.test(name)) continue;
    const before = readFileSync(p, 'utf8');
    const after = rewrite(before);
    if (after !== before) {
      writeFileSync(p, after);
      console.log('updated', p.slice(PUBLIC_DIR.length));
    }
  }
}

walk(PUBLIC_DIR);
