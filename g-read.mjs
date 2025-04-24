import fs from 'fs'
import wdc from './src/WDataCsv.mjs'


let fp = './g-test-in.csv'

await wdc.readCsv(fp)
    .then((ltdt) => {
        console.log(ltdt)
        // => [ { NAME: 'Daffy Duck', AGE: '24' }, { NAME: 'Bugs 邦妮', AGE: '22' } ]
    })
    .catch((err) => {
        console.log(err)
    })


//node g-read.mjs
