import { program } from 'commander';
import { readFile } from 'fs/promises';
import { Product } from '../types';
import path from 'path';
var Table = require('easy-table')

const { Index  } = require("flexsearch");
import chalk from 'chalk';

const options = {
    charset: "latin:extra",
    preset: 'match',
    tokenize: 'strict',
    cache: false
}
const index = new Index(options);

async function run() {
    program
        .name("bg-crawler")
        .option('-q, --query <search query>')
        .option('-t, --top <number>', "number of items to show", "5");

    program.parse();

    const options = program.opts();
    const query = options.query;

    const dataPaths: string[] = ["../data/cartaProducts.json",
        "../data/omensProducts.json",
        "../data/ozoneFamilyProducts.json",
        "../data/ozoneFunProducts.json",
        "../data/ozoneStrategyProducts.json",
        "../data/svarogProducts.json"]

    let allProducts : Product[] = [];

    for (const dataPath of dataPaths) {
        const fileContents = await readFile(path.resolve(__dirname, dataPath), { encoding: 'utf-8' })
        var products : Product[] = JSON.parse(fileContents).products;
        products.forEach(p => {
            p.storeName = dataPath;
        })
        allProducts = allProducts.concat(products);
    }

    for(let i= 0;i < allProducts.length;i++) {
        index.add(i, allProducts[i].name)
    }

    const resultIndices : number[] = index.search(query, Number(options.top));

    var t = new Table();


    for(const idx of resultIndices) {
        const product = allProducts[idx];
        t.cell('store', product.storeName)
        t.cell('name', product.name)
        t.cell('price', product.price + " €")
        t.cell('available', (product.available ? '✅' : '❌'))
        t.newRow();
    }
    console.log(t.toString())
}


run();
