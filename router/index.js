const course=require('course')
const st=require('st')
const path = require('path')
const route = course()
const jsonBody = require('body/json')
const mount = st({
  //la rura es relativa al directorio donde estoy, 1 mas arriba, en public
  path: path.join(__dirname,'..','public'),
  index: 'index.html',
  passthrough: true
})

route.post('/process',function(req,res){
    jsonBody(req,res,{limit: 3*1024*1024},function(err,body){
    if(err) return fail(err.res)
    console.log(body);

    res.setHeader('Content-Type','application/json')

    res.end(JSON.stringify({ok: true}))
  })
})

/*route.get('/process',function(req,res){

})*/

function onRequest(req,res){
  mount(req,res,function(err){
    if(err) return fail(err.res)  //res.end(err.message)

    route(req,res,function(err){
      if(err) return fail(err.res)

      res.statusCode=404
      res.end(`404 not found ${req.url}`)
    })


  })
}

function fail(err,res){
  res.statusCode=500
  res.setHeader('Content-Type','text/plain')
  res.end(err.message)
}

module.exports = onRequest
