import wdc from './src/WDataCsv.mjs'


let ltdt = [{ name: '大福 Duck', value: 2.4 }, { name: 'Bugs 邦妮', value: '2.2' }]
let fp = './g-test-out.csv'
wdc.writeCsv(fp, ltdt)
    .then((res) => {
        console.log(res)
        // => finish
    })
    .catch((err) => {
        console.log(err)
    })


//node --experimental-modules --es-module-specifier-resolution=node g-write.mjs
