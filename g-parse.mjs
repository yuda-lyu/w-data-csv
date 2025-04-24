import fs from 'fs'
import wdc from './src/WDataCsv.mjs'


let fp = './g-test-in.csv'

let c = fs.readFileSync(fp, 'utf8')

await wdc.parseCsv(c)
    .then((ltdt) => {
        console.log(ltdt)
        // => [ { NAME: 'Daffy Duck', AGE: '24' }, { NAME: 'Bugs 邦妮', AGE: '22' } ]
    })
    .catch((err) => {
        console.log(err)
    })


//node g-parse.mjs
