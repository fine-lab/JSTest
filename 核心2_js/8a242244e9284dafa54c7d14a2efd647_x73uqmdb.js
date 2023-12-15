let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //发送待办消息
    //接收者 康旺 焦国进（3faab080-30ce-4c9a-a239-3a185ae9a2c2） 倪帅臣 胡敏敏
    //应用构建 倪帅臣 胡敏敏
    var receiverBuilder = ["0f059088-9c92-4769-a3e7-8f1a341cc3df", "7f8d88ab-1bfa-4183-be47-28abbf803c0f"];
    //税务云 康旺 焦国进（3faab080-30ce-4c9a-a239-3a185ae9a2c2）
    var receiverTax = ["40b6b763-31af-46b3-b4b3-c62296914c6d", "3faab080-30ce-4c9a-a239-3a185ae9a2c2"];
    //接口  倪帅臣 焦国进（3faab080-30ce-4c9a-a239-3a185ae9a2c2）
    var receiverInter = ["0f059088-9c92-4769-a3e7-8f1a341cc3df", "3faab080-30ce-4c9a-a239-3a185ae9a2c2", "40b6b763-31af-46b3-b4b3-c62296914c6d"];
    var channels = ["uspace"];
    //主题
    var type = request.type == "1" ? "接口" : request.type == "2" ? "应用构建" : "税务云";
    var receiver = request.type == "1" ? receiverInter : request.type == "2" ? receiverBuilder : receiverTax;
    var title = type + "问题";
    var content = "你有一条" + type + "问题待处理; 问题编号：" + request.code;
    var webUrl = "https://www.example.com/";
    var mUrl = "https://yonbuilder.diwork.com/portal-mobile/#/?appCode=GT51140AT18&code=${esncode}";
    var body = {
      mUrl: mUrl,
      yyUserIds: receiver,
      webUrl: webUrl,
      appId: "0",
      businessKey: request.code,
      typeName: "测试",
      tenantId: "yourIdHere",
      title: title,
      content: content
    };
    var url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT51140AT18", JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });