import { guides, guideList } from './src/lib/data/guides.js';

console.log('Testing Guide Data Layer:');
console.log('Number of guides:', Object.keys(guides).length);
console.log('List length:', guideList.length);

const skinPrep = guides['skin-prep-before-makeup'];
if (skinPrep) {
  console.log('Skin Prep Guide Found:', skinPrep.title);
  console.log('Slug:', skinPrep.slug);
  console.log('Hero:', skinPrep.hero_image);
} else {
  console.error('Skin Prep Guide NOT FOUND in guides object!');
}

console.log('Data layer check complete.');
