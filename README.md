# w-data-csv
A tool for csv data.

![language](https://img.shields.io/badge/language-JavaScript-orange.svg) 
[![npm version](http://img.shields.io/npm/v/w-data-csv.svg?style=flat)](https://npmjs.org/package/w-data-csv) 
[![license](https://img.shields.io/npm/l/w-data-csv.svg?style=flat)](https://npmjs.org/package/w-data-csv) 
[![npm download](https://img.shields.io/npm/dt/w-data-csv.svg)](https://npmjs.org/package/w-data-csv) 
[![npm download](https://img.shields.io/npm/dm/w-data-csv.svg)](https://npmjs.org/package/w-data-csv) 
[![jsdelivr download](https://img.shields.io/jsdelivr/npm/hm/w-data-csv.svg)](https://www.jsdelivr.com/package/npm/w-data-csv)

## Documentation
To view documentation or get support, visit [docs](https://yuda-lyu.github.io/w-data-csv/global.html).

## Installation
### Using npm(ES6 module):
```alias
npm i w-data-csv
```

#### Example for read:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-data-csv/blob/master/g-read.mjs)]
```alias
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

```

#### Example for write:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-data-csv/blob/master/g-write.mjs)]
```alias
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

```
