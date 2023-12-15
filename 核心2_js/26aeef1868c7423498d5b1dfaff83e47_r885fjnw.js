let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //调用获取token方法  access_token
    let tokenFun = extrequire("AT164059BE09880007.frontDesignerFunction.TestApi");
    let tokenResult = tokenFun.execute();
    let access_token = tokenResult.access_token;
    //获取附件的id
    let fileId = param.data[0].file;
    //调APi接口
    let url = "https://www.example.com/" + access_token + "&id=" + fileId;
    //查询数据
    let apiResponse = postman("post", url, JSON.stringify({}), JSON.stringify({}));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });