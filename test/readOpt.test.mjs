import fs from 'fs'
import assert from 'assert'
import wdc from '../src/WDataCsv.mjs'


//監測站原始CSV之結構: 前12列為儀器metadata, 第13列為#標記, 第14列為欄位名稱, 第15列起為量測數據
//另含短列, 空白列與長列, 用於驗證mat模式反映各列實際欄數
let csvSite = [
    '1,v22.08.22,,,,,',
    '2025ST1,,,,,,',
    '1000,1000,,,,,',
    'Chiayi,,,,,,',
    '1,,,,,,',
    '1,,,,,,',
    '1,,,,,,',
    '0.408,0,Piezo1,kg/cm2,,,',
    '0.408,0,Piezo2,kg/cm2,,,',
    '0.408,0,EXT,kg/cm2,,,',
    '0.408,0,5V,kg/cm2,,,',
    'x,,,,,,',
    '#,,,,,,',
    'X(gal),Y(gal),Z(gal),Piezo1,Piezo2,EXT,5V',
    '0.214,0.143,-0.158,1.187,2.642,2.356,4.928',
    '0.1,0.2,0.3',
    '',
    '"a,b",c,d,e,f,g,h,i',
].join('\r\n')


describe('readOpt', function() {

    it('test opt undefined, 回歸至無opt之行為', async function() {
        let rout = [{ NAME: 'Daffy Duck', AGE: '24' }, { NAME: 'Bugs 邦妮', AGE: '22' }]

        let rRead = await wdc.readCsv('./g-test-in.csv')
        assert.strict.deepEqual(rRead, rout)

        let c = fs.readFileSync('./g-test-in.csv', 'utf8')
        let rParse = await wdc.parseCsv(c)
        assert.strict.deepEqual(rParse, rout)
    })

    it('test mode mat with skipLines, 跳過儀器metadata後自欄位名稱列起回傳二維陣列', async function() {
        let fp = './g-test-site.csv'
        fs.writeFileSync(fp, csvSite, 'utf8')

        let mat = await wdc.readCsv(fp, { mode: 'mat', skipLines: 13 })

        //第1列為欄位名稱
        assert.strict.deepEqual(mat[0], ['X(gal)', 'Y(gal)', 'Z(gal)', 'Piezo1', 'Piezo2', 'EXT', '5V'])

        //第2列為7欄量測數據
        assert.strict.deepEqual(mat[1], ['0.214', '0.143', '-0.158', '1.187', '2.642', '2.356', '4.928'])

        //短列保留其實際欄數, 不補空
        assert.strict.deepEqual(mat[2], ['0.1', '0.2', '0.3'])

        //空白列為空陣列
        assert.strict.deepEqual(mat[3], [])

        //長列保留其實際欄數不截斷, 且引號內之逗號不被視為分隔字元
        assert.strict.deepEqual(mat[4], ['a,b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'])

        //各列皆為陣列, 無_N溢出鍵
        assert.strict.deepEqual(mat.length, 5)
        assert.strict.deepEqual(mat.every((v) => Array.isArray(v)), true)

        fs.unlinkSync(fp)
    })

    it('test headers true, 視為未給而非產生_N溢出鍵之壞數據', async function() {
        let r = await wdc.parseCsv('a,b\n1,2', { headers: true })
        assert.strict.deepEqual(r, [{ a: '1', b: '2' }])
    })

    it('test mode mat with headers, headers固定為false故給陣列時不生_N溢出鍵', async function() {
        let r = await wdc.parseCsv('1,2,3,4,5', { mode: 'mat', headers: ['h0', 'h1', 'h2'] })
        assert.strict.deepEqual(r, [['1', '2', '3', '4', '5']])
    })

    it('test mode ltdt with headers, 給陣列代表無標頭列故第1列為數據', async function() {
        let r = await wdc.parseCsv('a,b\n1,2', { headers: ['h0', 'h1'] })
        assert.strict.deepEqual(r, [{ h0: 'a', h1: 'b' }, { h0: '1', h1: '2' }])
    })

    it('test raw and outputByteOffset, 不透傳以維持字串契約與回傳形狀', async function() {
        let rRaw = await wdc.parseCsv('a,b\n1,2', { mode: 'mat', raw: true })
        assert.strict.deepEqual(typeof rRaw[0][0], 'string')

        let rOff = await wdc.parseCsv('a,b\n1,2', { mode: 'mat', outputByteOffset: true })
        assert.strict.deepEqual(rOff[0], ['a', 'b'])
    })

    it('test skipComments with skipLines, 註解列不計入行號故兩者併用時計數基準位移', async function() {
        let c = 'm1,m2\nm3,m4\nm5,m6\n#,x\nA,B\n1,2'

        let r1 = await wdc.parseCsv(c, { mode: 'mat', skipLines: 4 })
        assert.strict.deepEqual(r1, [['A', 'B'], ['1', '2']])

        let r2 = await wdc.parseCsv(c, { mode: 'mat', skipLines: 4, skipComments: true })
        assert.strict.deepEqual(r2, [['1', '2']])
    })

    it('test bom, parseCsv與readCsv對含BOM內容之結果一致', async function() {
        let c = '﻿NAME,AGE\r\nDaffy Duck,24\r\n'
        let fp = './g-test-bom.csv'
        fs.writeFileSync(fp, c, 'utf8')

        let rParse = await wdc.parseCsv(c)
        let rRead = await wdc.readCsv(fp)

        assert.strict.deepEqual(rParse, rRead)
        assert.strict.deepEqual(rParse, [{ NAME: 'Daffy Duck', AGE: '24' }])

        fs.unlinkSync(fp)
    })

    it('test error, stream錯誤轉為reject且不拋出未捕獲例外', async function() {
        let err = null
        await wdc.readCsv('./g-test-in.csv', { maxRowBytes: 1 })
            .catch((e) => {
                err = e
            })
        assert.strict.deepEqual(err !== null, true)
    })

    it('test reject payload, 檢核失敗時仍reject字串', async function() {
        let e1 = null
        await wdc.parseCsv('')
            .catch((e) => {
                e1 = e
            })
        assert.strict.deepEqual(e1, 'inp is not an effective string')

        let e2 = null
        await wdc.readCsv('./no-such-file.csv')
            .catch((e) => {
                e2 = e
            })
        assert.strict.deepEqual(e2, 'fp[./no-such-file.csv] is not exist')
    })

})
