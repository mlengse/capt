const Modules = require('./modules')

const app = new Modules()

;(async() =>{
  try{
    await app.initBrowser({
      imagePath: app.path.join(__dirname, 'images')
    })

    await app.runScript()
  }catch(e){
    console.error(e)
  }
})()