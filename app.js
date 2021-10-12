let express = require('./lib/express')
let path = require('path')
let bodyParser = require('body-parser')
let urlEncodeParser = bodyParser.urlencoded({extended: false})
let mimeType = require('./lib/mime')

let app = express()

app.use(urlEncodeParser)//对请求体进行解析
app.use(mimeType) //提前判断 并且设置content-type
app.set('views', path.join(__dirname, 'views')) //制定模版字符串的 文件夹

//找到静态文件中是否匹配当前路由，如果匹配直接返回，如果不匹配则运行下一步
app.use(express.static(path.join(__dirname, 'static')))

app.use('/hello', function (req, res) {
    res.writeHead('200')
    res.end('hello')
})

app.use('/about', function(req, res){

    res.render('about.html', {
        title: '饥人谷直播14班开班了',
        teacher: '若愚',
        date: '7月中旬',
        intro: 'http://jirengu.com'
    })
})

module.exports = app