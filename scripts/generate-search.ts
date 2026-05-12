import { generateSearchIndex } from '../src/lib/generate-search-index';

generateSearchIndex().then(() => {
  console.log('Search index generated.');
});
