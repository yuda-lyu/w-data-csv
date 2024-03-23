import assert from 'assert'
import wdc from '../src/WDataCsv.mjs'


describe('read', function() {

    it('test read', async function() {
        let fp = './g-test-in.csv'
        let rin = await wdc.readCsv(fp)
        let rout = [{ NAME: 'Daffy Duck', AGE: '24' }, { NAME: 'Bugs 邦妮', AGE: '22' }]
        assert.strict.deepEqual(rin, rout)
    })

})
