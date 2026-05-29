const fs = require('fs');
const path = require('path');

function processMarkdown() {
  const sourceFile = 'how cbse rewrote rules to favor coempt eduteck.md';
  const targetFile = 'src/pages/index.md';

  if (!fs.existsSync(sourceFile)) {
    console.error(`Source markdown file "${sourceFile}" not found!`);
    return;
  }

  let content = fs.readFileSync(sourceFile, 'utf8');

  // 1. Process Obsidian image tags: ![[Pasted image 20260529120029.png]] -> ![Pasted image 20260529120029](/coempt/attachments/Pasted%20image%2020260529120029.png)
  content = content.replace(/!\[\[(Pasted image (.*?))\.png\]\]/g, (match, p1, p2) => {
    const filename = p1 + '.png';
    const encodedFilename = encodeURIComponent(filename);
    return `![${p1}](/coempt/attachments/${encodedFilename})`;
  });

  // 2. Wrap '# end' section in details/summary dropdown
  if (content.includes('# end')) {
    // Find where '# end' starts
    const endHeaderIndex = content.indexOf('# end');
    
    // Find the end of that line
    const endOfLineIndex = content.indexOf('\n', endHeaderIndex);
    
    // Find where '# References' starts after '# end'
    const referencesIndex = content.indexOf('# References', endHeaderIndex);

    if (referencesIndex !== -1) {
      const beforeEnd = content.substring(0, endHeaderIndex);
      const endContent = content.substring(endOfLineIndex + 1, referencesIndex);
      const afterReferences = content.substring(referencesIndex);

      content = beforeEnd + 
        `<details>\n<summary>end</summary>\n<div class="end-content-block">\n\n` + 
        endContent.trim() + 
        `\n\n</div>\n</details>\n\n` + 
        afterReferences;
    }
  }

  // 3. Append docs-tree iframe under References
  const refString = 'All the Files Related to Tenders are attached in docs/';
  if (content.includes(refString)) {
    const refIndex = content.indexOf(refString);
    const beforeRef = content.substring(0, refIndex + refString.length);
    const afterRef = content.substring(refIndex + refString.length);

    // Make sure we don't duplicate the iframe
    if (!content.includes('src="/docs-tree"')) {
      content = beforeRef + 
        `\n\n<iframe src="/docs-tree" style="width: 100%; height: 500px; border: 1px solid var(--border-color); border-radius: 0.5rem; margin-top: 1.5rem; background-color: var(--bg-bg);"></iframe>` + 
        afterRef;
    }
  }

  // 4. Prepend frontmatter
  const frontmatter = `---
layout: ../layouts/Layout.astro
title: how cbse rewrote rules to favor coempt eduteck
---

`;

  fs.writeFileSync(targetFile, frontmatter + content, 'utf8');
  console.log(`Successfully compiled "${sourceFile}" into "${targetFile}"!`);
}

processMarkdown();
