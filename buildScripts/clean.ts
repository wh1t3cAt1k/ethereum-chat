import * as fs from 'fs';
import * as path from 'path';

fs.rmdirSync(path.resolve(__dirname, '..', 'ethereum', 'build'), { recursive: true });
