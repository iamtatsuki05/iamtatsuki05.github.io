import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export type LinkItem = {
  title: string;
  url: string;
  desc?: string;
  icon?: string;
  iconUrl?: string;
  category?: string;
};

export async function getLinks(): Promise<LinkItem[]> {
  const file = path.join(process.cwd(), 'data', 'links.yaml');
  const raw = await fs.readFile(file, 'utf8');
  const json = YAML.parse(raw) as LinkItem[];
  return json;
}
