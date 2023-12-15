let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    for (var i = 0; i < request.productListArray.length; i++) {
      //获取产品编码+委托方企业编码
      var code = request.productListArray[i][0];
      var Entrusting_enterprise_code = request.productListArray[i][1];
      //通过产品信息和委托方企业编码查询产品信息id和发布时间
      //查询委托方信息
      var clientCodeSql =
        "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where product_coding='" + code + "'and Entrusting_enterprise_code = '" + Entrusting_enterprise_code + "'";
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
      var res = ObjectStore.deleteById("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", object, "3f0c64e9");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });