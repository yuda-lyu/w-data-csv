import assert from 'assert'
import fs from 'fs'
import wdc from '../src/WDataCsv.mjs'


describe('readLarge', function() {

    let fp = './g-test-in-large.csv'
    let n = 100000 //10萬row × ~1610 bytes/row ≈ 161 MB
    let big = 'x'.repeat(800)

    before(async function() {
        this.timeout(600000)
        //用writeCsv產生測試大檔, 供readCsv讀回驗證
        let mat = [['id', 'a', 'b']]
        for (let i = 0; i < n; i++) {
            mat.push([i, big, big])
        }
        await wdc.writeCsv(fp, mat, { mode: 'mat' })
    })

    after(function() {
        //測試後自動刪除產生的大檔
        if (fs.existsSync(fp)) {
            fs.unlinkSync(fp)
        }
    })

    it('test read large', async function() {
        this.timeout(600000)

        let res = await wdc.readCsv(fp)

        //row數正確
        assert.strict.equal(res.length, n)

        //第一筆內容
        assert.strict.equal(res[0].id, '0')
        assert.strict.equal(res[0].a.length, 800)
        assert.strict.equal(res[0].b.length, 800)

        //最後一筆內容
        let last = res[res.length - 1]
        assert.strict.equal(last.id, String(n - 1))
        assert.strict.equal(last.a.length, 800)
        assert.strict.equal(last.b.length, 800)

    })

})
