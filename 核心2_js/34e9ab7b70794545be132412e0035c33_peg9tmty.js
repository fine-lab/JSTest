let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 产品编码
    var code = request.code;
    // 生产批号
    var number = request.number;
    let ContentType = "text/plain;charset=UTF-8";
    let header = { "Content-Type": ContentType };
    let body = {
      sku: code,
      batch_nbr: number
    };
    //查询内容
    //实体查询
    var res = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.upsInventory", body);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });