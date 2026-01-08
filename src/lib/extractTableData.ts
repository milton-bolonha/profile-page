/**
 * Extracts technical specifications table from markdown content
 * Looks for "Ficha Técnica" table and returns structured data
 */

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface ExtractedData {
  specs: TechnicalSpec[];
  contentWithoutTable: string;
}

export function extractTableData(markdownContent: string): ExtractedData {
  const specs: TechnicalSpec[] = [];
  
  // Find the "Ficha Técnica" section
  // Find the "Ficha Técnica" section, possibly inside a div
  // Matches: ## Ficha Técnica ... until next header, horizontal rule, or closing div
  const fichaTecnicaRegex = /(?:<div[^>]*>\s*)?##\s*Ficha Técnica([\s\S]*?)(?=\n##|\n---|(?:\n\s*<\/div>)|\n\s*$)/i;
  const match = markdownContent.match(fichaTecnicaRegex);
  
  if (!match) {
    return {
      specs: [],
      contentWithoutTable: markdownContent
    };
  }

  const tableSection = match[1];
  
  // Extract table rows (format: | **Label** | Value |)
  const rowRegex = /\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\s*\|/g;
  let rowMatch;
  
  while ((rowMatch = rowRegex.exec(tableSection)) !== null) {
    const label = rowMatch[1].trim();
    const value = rowMatch[2].trim();
    
    // Skip header separator rows
    if (!label.includes('---') && !value.includes('---')) {
      specs.push({ label, value });
    }
  }

  // Remove the entire Ficha Técnica section from content
  const contentWithoutTable = markdownContent.replace(fichaTecnicaRegex, '').trim();

  return {
    specs,
    contentWithoutTable
  };
}

/**
 * Get a specific spec value by label
 */
export function getSpecValue(specs: TechnicalSpec[], label: string): string | undefined {
  const spec = specs.find(s => s.label.toLowerCase() === label.toLowerCase());
  return spec?.value;
}

/**
 * Check if content has a technical specs table
 */
export function hasTechnicalSpecs(markdownContent: string): boolean {
  return /##\s*Ficha Técnica/i.test(markdownContent);
}
