let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = new Array();
    for (var i = 0; i < request.productListArray.length; i++) {
      //预到货通知单号(ASN)
      var clientCode = request.productListArray[i];
      var clientCodeSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet where AdvanceArrivalNoticeNo='" + clientCode + "'";
      var clientCodeRes = ObjectStore.queryByYonQL(clientCodeSql, "developplatform");
      if (clientCodeRes.length != 0) {
        //获取id
        var ids = clientCodeRes[0].id;
        //获取发布时间
        var createTime = clientCodeRes[0].createTime;
      } else {
        var ids = "";
        //获取发布时间
        var createTime = "";
      }
      //删除入库单
      object.push({ id: ids, pubts: createTime });
    }
    var res = ObjectStore.deleteById("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", object, "e84ee900");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });