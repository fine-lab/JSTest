let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data;
    for (let j = 0; j < Data.length; j++) {
      var id = Data[j].id;
      // 调用公共方法
      let param1 = { context: "12312" };
      let param2 = { id: id };
      let func = extrequire("PU.rule.PublicScript");
      let kpl = func.execute(param1, param2);
      let returnList = kpl.returnList.body;
      let header = { "Content-Type": "application/json;charset=UTF-8" };
      let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(returnList));
      let str = JSON.parse(strResponse);
      if (str.success != true) {
        throw new Error("调用OMS采购入库创建API失败：" + str.message);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });