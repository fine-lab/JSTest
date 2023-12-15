let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let strResponse = postman("get", "https://www.example.com/", JSON.stringify({}), JSON.stringify({}));
    let res = JSON.parse(strResponse);
    if (res.status == 0) {
      let data = res.data;
      let querySQL = "select id from AT1799E78C1698000A.AT1799E78C1698000A.isv_product_question where jiraCode in (";
      for (let i = 0; i < data.length; i++) {
        querySQL += "'" + data[i].jiraCode + "',";
      }
      querySQL += "'')";
      var queryRes = ObjectStore.queryByYonQL(querySQL);
      var deleteRes = ObjectStore.deleteBatch("AT1799E78C1698000A.AT1799E78C1698000A.isv_product_question", queryRes, "ybe842e4d3");
      var result = ObjectStore.insertBatch("AT1799E78C1698000A.AT1799E78C1698000A.isv_product_question", data, "ybe842e4d3");
    } else {
      throw new Error(res.msg);
    }
    return { res: result };
  }
}
exports({ entryPoint: MyAPIHandler });