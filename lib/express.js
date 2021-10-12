let url = require('url')
let fs = require('fs')
let path = require('path')
let ejs = require('ejs')

function express() {
    const tasks = []

    let app = (req, res) => { //app
        addQuery(req, res) //解析路由中的参数
        addRender(req, res, app)//找到模版引擎 替换其中的字段并返回
        let i = 0
        const next = () => {
            let task = tasks[i++]
            if (!task) {
                return
            }
            if (task.routePath === null ||
                url.parse(req.url, true).pathname === task.routePath
            ) {
                task.middleWare(req, res, next)
            } else {
                next()
            }
        }
        next()
    }
    app.data = {}
    app.get = (key) => {
        return app.data[key]
    }
    app.set = (key, value) => {
        app.data[key] = value
    }
    app.use = (routePath, middleWare) => {
        if (typeof routePath === 'function') {
            middleWare = routePath
            routePath = null
        }
        tasks.push({
            routePath: routePath,
            middleWare: middleWare
        })

    }
    function addQuery(req, res){
        let pathObj = url.parse(req.url, true)
        req.query = pathObj.query
    }

    function addRender(req,res,app) {
        res.render = function(tplPath,data){
            let fullpath = path.join(app.get('views'),tplPath)
            ejs.renderFile(fullpath,data,{},function (err,str){
                if(err){
                    res.writeHead(503,'System error')
                    res.end()
                }else {
                    res.setHeader('content-type', 'text/html')
                    res.writeHead(200, 'Ok')
                    res.write(str)
                    res.end()
                }
            })
        }

    }
    return app
}

express.static = function(staticPath){
    return function(req, res, next){
        let pathObj = url.parse(req.url, true)
        let filePath = path.resolve(staticPath, pathObj.pathname.substr(1))
        console.log('filePath')
        console.log(filePath)
        fs.readFile(filePath,'binary', function(err, content){
            if(err){
                next()
            }else {
                res.writeHead(200, 'Ok')
                res.write(content, 'binary')
                res.end()
            }
        })
    }
}
module.exports = express