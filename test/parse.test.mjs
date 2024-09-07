import fs from 'fs'
import assert from 'assert'
import wdc from '../src/WDataCsv.mjs'


describe('parse', function() {

    it('test parse', async function() {
        let fp = './g-test-in.csv'
        let c = fs.readFileSync(fp, 'utf8')
        let rin = await wdc.parseCsv(c)
        let rout = [{ NAME: 'Daffy Duck', AGE: '24' }, { NAME: 'Bugs 邦妮', AGE: '22' }]
        assert.strict.deepEqual(rin, rout)
    })

})
