let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "200"; //接口返回状态码
    var msg; //接口返回状态信息
    var sql;
    var dt; //sql查询返回的对象
    let domainkey = "yourkeyHere";
    try {
      let body = "";
      let url = "";
      let uri = "";
      let productId = request.productId;
      let customerClass = "";
      let customerID = request.customerID;
      let date = request.date;
      //获取客户分类信息
      url = "https://www.example.com/" + customerID + "";
      uri = "AT163BD39E08680003";
      let apiResCusClass = JSON.parse(openLinker("GET", url, uri, ""));
      if (apiResCusClass.code != 200) {
        throw new Error("获取客户分类" + JSON.stringify(apiResCusClass));
      }
      customerClass = apiResCusClass.data.customerClass;
      msg = "0";
      if (productId != undefined && productId != "undefined") {
        sql = "SELECT cankaojia FROM AT163BD39E08680003.AT163BD39E08680003.kehucankaojia where shangpinbianma=  '" + productId + "'";
        dt = ObjectStore.queryByYonQL(sql, domainkey);
        if (dt.length != 0) {
          msg = dt[0].cankaojia;
        }
      }
      if (productId != undefined && customerClass != undefined && productId != "undefined" && customerClass != "undefined") {
        sql = "SELECT cankaojia FROM AT163BD39E08680003.AT163BD39E08680003.kehucankaojia where shangpinbianma=  '" + productId + "' and kehufenleibianma='" + customerClass + "'";
        dt = ObjectStore.queryByYonQL(sql, domainkey);
        if (dt.length != 0) {
          msg = dt[0].cankaojia;
        }
      }
      if (productId != undefined && customerID != undefined && productId != "undefined" && customerID != "undefined") {
        sql = "SELECT cankaojia FROM AT163BD39E08680003.AT163BD39E08680003.kehucankaojia where shangpinbianma=  '" + productId + "' and kehubianma='" + customerID + "'";
        dt = ObjectStore.queryByYonQL(sql, domainkey);
        if (dt.length != 0) {
          msg = dt[0].cankaojia;
        }
      }
      if (productId != undefined && productId != "undefined" && date != undefined && date != "undefined") {
        sql =
          "SELECT cuxiaojia FROM AT163BD39E08680003.AT163BD39E08680003.kehucankaojia where shangpinbianma=  '" +
          productId +
          "' and cuxiaokaishiriqi<='" +
          date +
          "' and cuxiaojieshuriqi>='" +
          date +
          "'";
        dt = ObjectStore.queryByYonQL(sql, domainkey);
        if (dt.length != 0) {
          msg = dt[0].cuxiaojia;
        }
      }
    } catch (e) {
      code = "999";
      msg = "参考价获取" + e.toString();
    } finally {
      var res = {
        code: code,
        msg: msg
      };
      return {
        res
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});