// server/api/upload-exp-data.ts
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { defineEventHandler, readBody } from 'h3';

// Helper function to save JSON data
async function saveJson(fileName: string, data: any) {
  const filePath = resolve('data', `${fileName}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper function to save CSV data
async function saveCsv(fileName: string, data: any) {
  const filePath = resolve('data', `${fileName}.csv`);
  await fs.writeFile(filePath, data, 'utf-8');
}

export default defineEventHandler(async (event) => {
  // Read the body of the request
  const body = await readBody(event);

  // Expecting a structure like { file_name: 'example', exp_data: {...}, type: 'json' or 'csv' }
  const { file_name, exp_data, type } = body;

  if (!file_name || !exp_data || !type) {
    return { success: false, message: 'Missing required fields: file_name, exp_data, or type.' };
  }

  // Ensure the data directory exists
  const dataDir = resolve('data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    return { success: false, message: 'Failed to create data directory.' };
  }

  try {
    if (type === 'json') {
      await saveJson(file_name, exp_data);
    } else if (type === 'csv') {
      await saveCsv(file_name, exp_data);
    } else {
      return { success: false, message: 'Unsupported file type. Use "json" or "csv".' };
    }

    return { success: true, message: `${file_name}.${type} saved successfully.` };
  } catch (error:any) {
    return { success: false, message: `Failed to save file: ${error.message}` };
  }
});
