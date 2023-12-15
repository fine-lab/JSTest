let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    for (var i = 0; i < request.productListArray.length; i++) {
      //委托方企业编码
      var clientCode = request.productListArray[i];
      var clientCodeSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation where clientCode='" + clientCode + "'";
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
      //删除产品信息
      var object = { id: ids, pubts: createTime };
      var res = ObjectStore.deleteById("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", object, "d3e1247e");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });