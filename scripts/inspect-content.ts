#!/usr/bin/env bun
import { getAllPosts } from '../lib/content/blog';
import { getAllPublications } from '../lib/content/publication';

const main = async () => {
  const posts = await getAllPosts();
  const pubs = await getAllPublications();
  console.log('posts', posts.length, posts.map(p=>p.slug));
  console.log('pubs', pubs.length, pubs.map(p=>p.slug));
};

main();

