const cvocrModule = require("captcha-cv-ocr");
var mode = "simplest";
let cvocr = new cvocrModule(mode);  // mode 表示验证码的种类
 
 
exports._runocr = async ({ that, file}) => {
  console.log(file)
  if(!that.cvocr){
    that.ocr = cvocr
  }
  await that.ocr.init(1)
  let ans = await that.ocr.recognize(file);  //支持文件地址、Base64、Buffer形式
  console.log("ans:", ans)
  // process.exit(0);
}