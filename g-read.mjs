import wdc from './src/WDataCsv.mjs'


let fp = './g-test-in.csv'
wdc.readCsv(fp)
    .then((ltdt) => {
        console.log(ltdt)
        // => [ { NAME: 'Daffy Duck', AGE: '24' }, { NAME: 'Bugs 邦妮', AGE: '22' } ]
    })
    .catch((err) => {
        console.log(err)
    })


//node --experimental-modules --es-module-specifier-resolution=node g-read.mjs
