let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = { appkey: "yourkeyHere", appsecret: "yoursecretHere" }; //在API受权处 添加Appkey、appSecret ；
    let body = {};
    let url = "https://www.example.com/"; //打开调用的API  点击API测试  文档 中的有URL链接地址；
    let apiResponse = ublinker("GET", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });