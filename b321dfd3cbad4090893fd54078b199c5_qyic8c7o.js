let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let strResponse = postman("get", "https://www.example.com/", JSON.stringify({}), JSON.stringify({}));
    let res = JSON.parse(strResponse);
    if (res.status == 0) {
      let data = res.data;
      let querySQL = "select id from AT1740D1CC0888000A.AT1740D1CC0888000A.product_question where guanjianzi in (";
      for (let i = 0; i < data.length; i++) {
        querySQL += "'" + data[i].guanjianzi + "',";
      }
      querySQL += "'')";
      var queryRes = ObjectStore.queryByYonQL(querySQL);
      var deleteRes = ObjectStore.deleteBatch("AT1740D1CC0888000A.AT1740D1CC0888000A.product_question", queryRes, "yb5ae442b8");
      var result = ObjectStore.insertBatch("AT1740D1CC0888000A.AT1740D1CC0888000A.product_question", data, "yb5ae442b8");
    } else {
      throw new Error(res.msg);
    }
    return { res: result };
  }
}
exports({ entryPoint: MyAPIHandler });