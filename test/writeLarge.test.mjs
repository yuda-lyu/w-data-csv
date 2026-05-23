import assert from 'assert'
import fs from 'fs'
import wdc from '../src/WDataCsv.mjs'


describe('writeLarge', function() {

    let fp = './g-test-out-large.csv'

    after(function() {
        //測試後自動刪除產生的大檔
        if (fs.existsSync(fp)) {
            fs.unlinkSync(fp)
        }
    })

    it('test write large (> 512 MB, exceeds V8 MAX_STRING_LENGTH)', async function() {
        this.timeout(600000)

        //共用同一個大字串reference, 源端mat記憶體只~30 MB,
        //stream write過程才把各row escape展開為~1600 bytes寫入磁碟
        let big = 'x'.repeat(800)

        //mat mode: 跳過ltdt→mat轉換, 直接以二維陣列輸入
        let mat = [['id', 'a', 'b']]
        let n = 400000 //40萬row × ~1610 bytes/row ≈ 644 MB > 512 MB (V8 MAX_STRING_LENGTH)
        for (let i = 0; i < n; i++) {
            mat.push([i, big, big])
        }

        let res = await wdc.writeCsv(fp, mat, { mode: 'mat' })
        assert.strict.equal(res, 'finish')

        //驗證檔案大小 > 512 MB, 證明串流寫入成功繞過V8單字串上限
        let stat = fs.statSync(fp)
        assert.strict.equal(stat.size > 512 * 1024 * 1024, true)

    })

})
