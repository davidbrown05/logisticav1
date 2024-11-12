// generateTree.js
import fs from 'fs';
import path from 'path';

function generateTree(dirPath = ".", level = 0) {
    const items = fs.readdirSync(dirPath);
    let tree = "";
    const indent = "  ".repeat(level);

    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        tree += `${indent}- ${item}\n`;

        if (isDirectory) {
            tree += generateTree(itemPath, level + 1);
        }
    }

    return tree;
}

const tree = generateTree();
fs.writeFileSync("estructura_proyecto.txt", tree);
console.log("Estructura del proyecto generada en 'estructura_proyecto.txt'");
