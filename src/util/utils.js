const crypto = require('crypto')
const path = require("path");
const util = require("util");
const fs = require('fs');
const leven = require('leven')


const CACHE_DIR = 'cache'

module.exports = {
  getFilePath(site_name, type, name) {
    switch (type) {
      case "indexPage":
        return util.format('%s/%s/%s', CACHE_DIR, this.md5(site_name), name)
        break
      case "img":
        return util.format('%s/%s/%s', CACHE_DIR, this.md5(site_name) + '/img', name)
        break
    }
  },
  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  writeFile(file, content) {
    this.ensureDirectoryExistence(file)
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    }
    fs.writeFileSync(file, content)
    console.info('success to create file' + file)
  },

  readFile(file) {
    if (fs.existsSync(file)) {
      return fs.readFileSync(file)
    }
  },
  ensureDirectoryExistence(filePath) {
    let dirName = path.dirname(filePath);
    if (fs.existsSync(dirName)) {
      return true;
    }
    this.ensureDirectoryExistence(dirName);
    fs.mkdirSync(dirName);
  },

  md5(content) {
    if(!content) return
    const md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
  },
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  isEmpty(value) {
    return (Array.isArray(value) && value.length === 0)
      || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0)
      || value === null || value === undefined
  },
  getRatioNode(file1, file2) {
    let sum = file1.length + file2.length;
    return (sum - leven(file1, file2)) / sum
  },
  checkUrl(url) {
    if (!url) return
    const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    let result = url.match(regex)
    if (result && result.length > 0) {
      return result[0]
    } else if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
      return this.checkUrl('http://' + url)
    }
    return null
  },
  ignoreAndCheckUrl(url) {
    if (!url) return
    const reList = [
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.zhihu\.com/g,
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.itunes\.com/g,
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.apple\.com/g
    ]
    for (let re of reList) {
      if (url.match(re)) return null
    }
    return this.checkUrl(url)
  },
  getStringByteLength(str) {
    return Buffer.byteLength(str, 'utf8')
  },
  limitByteOfString(str, length) {
    let buffer = new Buffer(str)
    buffer = buffer.slice(0, length)
    str = buffer.toString()
    return str.substr(0,str.length-1)
  },
  currentTimestamp() {
    return Math.floor(new Date().getTime()/1000)
  }
}