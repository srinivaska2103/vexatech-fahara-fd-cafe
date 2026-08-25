const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('.');
let replaced = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace all relative imports that go up and then into our root folders
  content = content.replace(/from '(\.\.\/)+components\//g, "from '@/components/");
  content = content.replace(/from '(\.\.\/)+store\//g, "from '@/store/");
  content = content.replace(/from '(\.\.\/)+utils\//g, "from '@/utils/");
  content = content.replace(/from '(\.\.\/)+hooks\//g, "from '@/hooks/");
  content = content.replace(/from '(\.\.\/)+services\//g, "from '@/services/");
  content = content.replace(/from '(\.\.\/)+ui\//g, "from '@/components/ui/");
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    replaced++;
    console.log('Fixed', file);
  }
});

console.log('Fixed files:', replaced);
