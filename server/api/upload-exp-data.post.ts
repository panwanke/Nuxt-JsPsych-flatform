// server/api/upload-exp-data.ts
// import { defineEventHandler, readBody, createError } from 'h3';
import { promises as fs } from 'fs';
import { resolve } from 'path';

export default defineEventHandler(async (event) => {

  try {
    // 读取请求体中的JSON数据
    const data = await readBody(event);
    // console.log('upload data',data)

    // 检查是否为JSON数据
    if (!data || typeof data !== 'object') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid JSON data' });
    }

    const file_name = data.file_name;
    // 将JSON数据转换为字符串
    const exp_data = JSON.stringify(data.exp_data, null, 2);

    // 指定保存文件的路径
    const filePath = resolve('data', `${file_name}.json`);
    // console.log('filePath',filePath)

    // 将数据写入文件
    await fs.writeFile(filePath, exp_data, 'utf8');

    // 返回成功响应
    return { 
      statusCode: 201,
      message: 'User data uploaded successfully' 
    };
  } catch (error) {
    // 处理错误情况
    console.error('Error uploading user data:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
