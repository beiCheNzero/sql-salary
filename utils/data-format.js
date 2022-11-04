const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
// 解析
const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(customParseFormat)
dayjs.extend(utc)

const DATA_TIME_FORMAR = 'YYYY/MM/DD HH:mm:ss'

// utc格式转换
function formatUtcString(utcString, format = DATA_TIME_FORMAR) {
  if (utcString) {
    return dayjs.utc(utcString).utcOffset(8).format(format)
  }
  return ''
}
// 时间戳格式转换
function formatTimeStamp(timeString, format = DATA_TIME_FORMAR) {
  if (timeString) {
    return dayjs(timeString).format(format)
  }
  return ''
}

module.exports = {
  formatUtcString,
  formatTimeStamp
}
