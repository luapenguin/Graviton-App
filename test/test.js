/**
 * @desc Basic testing
 */

const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') 
const path = require('path')
const fs = require('fs')

const DataFolderDir = path.join(path.join(__dirname, '..'), '.graviton')

describe('Opening Graviton ', function () {
  this.timeout(25000)
  this.beforeAll(function () {
    this.app = new Application({
      path: electronPath,
      args: ['.']
    })
    return this.app.start()
  })
  it('Window opened', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
    })
  })
  it('.graviton is created', function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
    return fs.existsSync(DataFolderDir)
  })
})