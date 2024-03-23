import assert from 'assert'
import fs from 'fs'
import _ from 'lodash-es'
import wdc from '../src/WDataCsv.mjs'


describe('write', function() {

    it('test write', async function() {

        let r = [{ name: '大福 Duck', value: 2.4 }, { name: 'Bugs 邦妮', value: '2.2' }]
        let fp = './g-test-out.csv'
        await wdc.writeCsv(fp, r)

        let rin = `"name","value"
"大福 Duck",2.4
"Bugs 邦妮","2.2"
`
        rin = _.trim(rin)
        rin = rin.replaceAll('\r\n', '\n')

        let rout = fs.readFileSync('g-test-out.csv', 'utf8')
        rout = _.trim(rout)
        rout = rout.replaceAll('\r\n', '\n')

        assert.strict.deepEqual(rin, rout)
    })

})
