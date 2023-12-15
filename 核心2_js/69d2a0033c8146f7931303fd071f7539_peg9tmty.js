let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica where productInformation_id = '" + id + "'";
    var registResult = ObjectStore.queryByYonQL(sql, "developplatform");
    if (registResult.length == 0) {
      return {};
    } else if (registResult.length == 1) {
      return registResult[0];
    } else {
      //正序
      var dataContent = ReverseRankingDate(registResult, "product_certificate_date");
      return dataContent[dataContent.length - 1];
      //封装的日期排序方法
      function ReverseRankingDate(data, p) {
        for (var i = 0; i < data.length - 1; i++) {
          for (var j = 0; j < data.length - 1 - i; j++) {
            if (Date.parse(data[j][p]) > Date.parse(data[j + 1][p])) {
              var temp = data[j];
              data[j] = data[j + 1];
              data[j + 1] = temp;
            }
          }
        }
        return data;
      }
      throw new Error(JSON.stringify(dataContent[dataContent.length - 1]));
      return dataContent[dataContent.length - 1];
    }
  }
}
exports({ entryPoint: MyAPIHandler });