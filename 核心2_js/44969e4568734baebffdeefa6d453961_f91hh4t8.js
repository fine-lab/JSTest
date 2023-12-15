let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var param = {
      id: "youridHere"
    };
    const code = request.data[0].id;
    //实体查询 '1621926951320027145'
    var res = ObjectStore.queryByYonQL("select * from aa.merchant.AgentInvoice where merchantId =" + code, "productcenter");
    var rest = ObjectStore.queryByYonQL("select * from aa.merchant.Contacter  where isDefault=Y and merchantId =" + code, "productcenter");
    return { rest, res };
  }
}
exports({ entryPoint: MyAPIHandler });