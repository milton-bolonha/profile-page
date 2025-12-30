import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'content', 'settings', 'navegador.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error reading navegador.json:', error);
    res.status(500).json({ message: 'Error loading navigation config' });
  }
}
