let url = require('url')
let mime = require('mime-types')

function Mime(req, res, next){
    let pathObj = url.parse(req.url, true)
    let mimeType = mime.lookup(pathObj.pathname)
    //根据文件后缀判断 返回的content-type 的类型
    res.setHeader('content-type', mimeType)
    next()
}

module.exports = Mime