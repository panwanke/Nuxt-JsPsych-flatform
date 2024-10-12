// server/api/upload-exp-data.ts
import { promises as fs, existsSync, mkdirSync } from 'fs';
import { resolve, parse } from 'path';
import { defineEventHandler, readBody } from 'h3';

// Helper function to save JSON data
async function saveJson(fileName: string, data: any) {
  const filePath = resolve('data', `${fileName}.json`);
  console.log('save to ',filePath)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper function to save CSV data
async function saveCsv(fileName: string, data: any) {
  const filePath = resolve('data', `${fileName}.csv`);
  console.log('save to ',filePath)
  await fs.writeFile(filePath, data, 'utf-8');
}

export default defineEventHandler(async (event) => {
  // Read the body of the request
  const body = await readBody(event);

  // Expecting a structure like { file_name: 'example', exp_data: {...}, type: 'json' or 'csv' }
  const { file_name, exp_data, type } = body;

  if (!file_name || !exp_data || !type) {
    return { error: true, message: 'Missing required fields: file_name, exp_data, or type.'};
  }

  // Ensure the data directory exists
  // 获取 filename 的母文件夹(如果有的话)，然后和前面拼接上 'data'
  const parts = parse(file_name);
  const dataDirPath = resolve('data', parts.dir ? parts.dir : '.');
  try {
    if (!existsSync(dataDirPath)) {
      mkdirSync(dataDirPath, { recursive: true });
      console.log(`Directory created at ${dataDirPath}`);
    }
  } catch (error) {
    return { error: true, message: 'Failed to create data directory.' };
  }

  try {
    if (type === 'json') {
      await saveJson(file_name, exp_data);
    } else if (type === 'csv') {
      await saveCsv(file_name, exp_data);
    } else {
      return { error: true, message: 'Unsupported file type. Use "json" or "csv".' };
    }

    return { error: false, message: `${file_name}.${type} saved errorfully.` };
  } catch (error:any) {
    return { error: true, message: `Failed to save file: ${error.message}` };
  }
});
