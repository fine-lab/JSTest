let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询YS客户退款数据
    function getTime(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
      var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
      var todayDate = year + "-" + month + "-" + day + " " + "00:00:00";
      return todayDate;
    }
    let beginTime = getTime(new Date());
    let endTime = getTime(new Date(new Date().setDate(new Date().getDate() - 1)));
    let body = {
      pageIndex: "1",
      pageSize: "100",
      auditstatus: "1",
      simpleVOs: [
        {
          logicOp: "and",
          conditions: [
            {
              field: "auditTime",
              op: "between",
              value1: endTime,
              value2: beginTime
            }
          ]
        }
      ]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT11961AT39", JSON.stringify(body));
    throw new Error(apiResponse);
    return {};
  }
}
exports({ entryPoint: MyTrigger });