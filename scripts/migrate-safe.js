const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(__dirname, '../content/posts');
const filesToProcess = [
    'ai-saas-boilerplate.md',
    'book-how-to-code-ai-saas.md',
    'book-web-development-guidance.md',
    'book-whats-wrong-developer.md',
    'cms-for-agencies.md',
    'domain-management.md',
    'entrepreneur-io-editora.md',
    'game-ondemand.md',
    'landing-page-extreme-cto.md',
    'mentoria-autossuficiencia.md',
    'mentoria-carreira-internacional.md',
    'mentoria-programacao-web-ai.md',
    'mentoria-torne-se-mentor.md',
    'mentoria-trilha-ignicao.md',
    'one-page-website.md',
    'seo-business-page.md',
    'server-maintenence.md',
    'wordpress-development.md'
];

filesToProcess.forEach(filename => {
    const filePath = path.join(postsDirectory, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${filename} (not found)`);
        return;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    if (!content) {
        console.log(`Skipping ${filename} (empty content)`);
        return;
    }

    let newContent = content;
    let technologies = new Set();
    let link = null;

    // Helper to clean and add techs
    const addTechs = (str) => {
        if (!str) return;
        str.split(',').forEach(t => {
            const clean = t.trim().replace(/\.$/, '');
            if (clean && clean !== 'N/A' && clean !== '-' && clean !== 'Sob consulta' && clean !== 'Variável') {
                technologies.add(clean);
            }
        });
    };

    const tableRegex = /\|(.*?)\|(.*?)\|/g;
    let match;
    
    // Extract data
    while ((match = tableRegex.exec(content)) !== null) {
        const label = match[1].trim();
        const value = match[2].trim();

        if (label.includes('Stack Principal') || label.includes('Tecnologias')) {
            addTechs(value);
        }
        if (label.includes('Link') || label.includes('Demo') || label.includes('URL')) {
            if (value && !value.includes('N/A') && !value.includes('Sob') && value.startsWith('http')) {
                link = value;
            }
        }
    }

    // Update frontmatter
    if (technologies.size > 0) {
        const existing = data.technologies || [];
        data.technologies = Array.from(new Set([...existing, ...technologies]));
    }
    if (link && !data.link) {
        data.link = link;
    }

    // Remove content safely
    // 1. Remove the Ficha Técnica section (Header + Table)
    newContent = newContent.replace(/##\s*Ficha Técnica([\s\S]*?)(\n---|\n#)/, '$2');
    
    // 2. Remove the specific div wrapper if it surrounds the deleted table
    // Regex for: <div class="catalog-header"> (whitespace) </div>
    // We replace the wrapper with empty string if it's empty or contains only whitespace
    newContent = newContent.replace(/<div class="catalog-header">\s*<\/div>/g, '');
    
    // 3. Fallback: If regex 1 didn't catch it (maybe end of file), try removing table explicitly
    // This removes the table block if it persists
    newContent = newContent.replace(/\|.*\|.*\|\n\|.*\|.*\|[\s\S]*?(\n\n|$)/, '\n');

    // 4. Final cleanup of <div class="catalog-header"> if it still exists with empty content
    // Careful not to remove if it has other content (though in these files it shouldn't)
    if (newContent.includes('<div class="catalog-header">')) {
         // Check if it's effectively empty now
         const divContentMatch = newContent.match(/<div class="catalog-header">([\s\S]*?)<\/div>/);
         if (divContentMatch && !divContentMatch[1].trim()) {
             newContent = newContent.replace(/<div class="catalog-header">[\s\S]*?<\/div>/, '');
         }
    }

    // Double check we didn't wipe the file
    if (newContent.length < 50) {
        console.error(`ERROR: Content for ${filename} became too short! Skipping write.`);
        return;
    }

    // Clean up excessive newlines
    newContent = newContent.replace(/\n{3,}/g, '\n\n').trim() + '\n';

    const newFileContent = matter.stringify(newContent, data);
    fs.writeFileSync(filePath, newFileContent);
    console.log(`Processed ${filename}`);
});

console.log('Migration batch complete.');
