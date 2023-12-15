let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //判断mode状态 requestData 中的 status为insert
    //根据参数调用第三方接口
    let apiResponse = postman(
      "get",
      "https://www.example.com/",
      null,
      null
    );
    //处理返回结果 如果失败则提示失败信息
    throw new Error(JSON.stringify(param));
    return { apiResponse: 123 };
  }
}
exports({ entryPoint: MyTrigger });