import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const cwd = process.cwd();

const files = readdirSync(resolve(cwd, 'dist'));
const UserScriptHeader = readFileSync(resolve(cwd, 'src/UserScriptHeader.txt'), 'utf8');

files.forEach((fileName) => {
	const filePath = resolve(cwd, 'dist', fileName);
	const content = readFileSync(filePath, 'utf8');
	writeFileSync(filePath, `${UserScriptHeader}\n${content}`);
});
