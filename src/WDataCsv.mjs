import { Readable } from 'stream'
import fs from 'fs'
import csvParse from 'csv-parser'
import stripBom from 'strip-bom-stream'
import get from 'lodash-es/get.js'
import fsIsFile from 'wsemi/src/fsIsFile.mjs'
import isestr from 'wsemi/src/isestr.mjs'
import genPm from 'wsemi/src/genPm.mjs'
import ltdtkeysheads2mat from 'wsemi/src/ltdtkeysheads2mat.mjs'
import getCsvStrFromData from 'wsemi/src/getCsvStrFromData.mjs'


/**
 * 讀取CSV檔，自動清除BOM
 *
 * @param {String} fp 輸入檔案位置字串
 * @return {Promise} 回傳Promise，resolve回傳ltdt(各數據列為物件陣列)，reject回傳錯誤訊息
 * @example
 *
 * import wdc from './src/WDataCsv.mjs'
 *
 * let fp = './g-test-in.csv'
 * wdc.readCsv(fp)
 *     .then((ltdt) => {
 *         console.log(ltdt)
 *         // => [ { NAME: 'Daffy Duck', AGE: '24' }, { NAME: 'Bugs 邦妮', AGE: '22' } ]
 *     })
 *     .catch((err) => {
 *         console.log(err)
 *     })
 *
 */
async function readCsv(inp) {
    let res = []
    let pm = genPm()
    if (fsIsFile(inp)) {
        fs.createReadStream(inp)
            .pipe(stripBom())
            .pipe(csvParse())
            .on('data', (chunk) => {
                // console.log('data', chunk)
                res.push(chunk)
            })
            .on('end', () => {
                pm.resolve(res)
            })
            .on('error', (err) => {
                pm.reject(err)
            })
    }
    else if (isestr(inp)) {
        Readable.from([inp])
            .pipe(csvParse())
            .on('data', (chunk) => {
                // console.log('data', chunk)
                res.push(chunk)
            })
            .on('end', () => {
                pm.resolve(res)
            })
            .on('error', (err) => {
                pm.reject(err)
            })
    }
    else {
        return pm.reject(`inp is not a file or a string`)
    }
    return pm
}


/**
 * 輸出數據至CSV檔案
 *
 * @param {String} fp 輸入檔案位置字串
 * @param {Array} data 輸入數據陣列，為mat或ltdt格式
 * @param {Object} [opt={}] 輸入設定物件，預設{}
 * @param {String} [opt.mode='ltdt'] 輸入數據格式字串，可選ltdt或mat，預設ltdt
 * @param {Array} [opt.keys=[]] 輸入指定欲輸出鍵值陣列，預設[]
 * @param {Object} [opt.kphead={}] 輸入指定鍵值轉換物件，預設{}
 * @return {Promise} 回傳Promise，resolve回傳成功訊息，reject回傳錯誤訊息
 * @example
 *
 * import wdc from './src/WDataCsv.mjs'
 *
 * let ltdt = [{ name: '大福 Duck', value: 2.4 }, { name: 'Bugs 邦妮', value: '2.2' }]
 * let fp = './g-test-out.csv'
 * wdc.writeCsv(fp, ltdt)
 *     .then((res) => {
 *         console.log(res)
 *         // => finish
 *     })
 *     .catch((err) => {
 *         console.log(err)
 *     })
 *
 */
async function writeCsv(fp, data, opt = {}) {
    let err = null
    let mat
    let c = ''

    //mode
    let mode = get(opt, 'mode')
    if (mode !== 'ltdt' && mode !== 'mat') {
        mode = 'ltdt'
    }

    if (mode === 'mat') {

        //save
        mat = data

    }
    else if (mode === 'ltdt') {
        try {

            //save
            let ltdt = data

            //keys
            let keys = get(opt, 'keys')

            //kphead
            let kphead = get(opt, 'kphead')

            //ltdtkeysheads2mat
            mat = ltdtkeysheads2mat(ltdt, keys, kphead)

        }
        catch (e) {
            err = e.toString()
            return Promise.reject(err)
        }
    }

    //getCsvStrFromData
    try {
        c = getCsvStrFromData(mat)
    }
    catch (e) {
        err = e.toString()
        return Promise.reject(err)
    }

    //writeFileSync
    try {
        fs.writeFileSync(fp, c, 'utf8')
    }
    catch (e) {
        err = e.toString()
        return Promise.reject(err)
    }

    return 'finish'
}


/**
 * 讀寫CSV檔
 *
 * @return {Object} 回傳物件，其內有readCsv與writeCsv函式
 * @example
 *
 * import wdc from './src/WDataCsv.mjs'
 *
 * let fpIn = './g-test-in.csv'
 * wdc.readCsv(fpIn)
 *     .then((ltdtIn) => {
 *         console.log(ltdtIn)
 *         // => [ { NAME: 'Daffy Duck', AGE: '24' }, { NAME: 'Bugs 邦妮', AGE: '22' } ]
 *     })
 *     .catch((err) => {
 *         console.log(err)
 *     })
 *
 * let ltdtOut = [{ name: '大福 Duck', value: 2.4 }, { name: 'Bugs 邦妮', value: '2.2' }]
 * let fpOut = './g-test-out.csv'
 * wdc.writeCsv(fpOut, ltdtOut)
 *     .then((res) => {
 *         console.log(res)
 *         // => finish
 *     })
 *     .catch((err) => {
 *         console.log(err)
 *     })
 *
 */
let WDataCsv = {
    readCsv,
    writeCsv,
}


export default WDataCsv
