let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT31971AT37.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    //应收事项列表查询
    var reqOarListUrl = "https://www.example.com/" + token;
    //收款单列表查询
    var reqReceivebillUrl = "https://www.example.com/" + token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    var ybresults = request.data;
    ybresults.forEach((ybresult) => {
      //获取日结单号
      let orderNo = ybresult.code;
      //拼接查询条件
      let query = {
        orderno: orderNo,
        pageIndex: "0",
        pageSize: "100"
      };
      //根据日结单号查询应收事项列表
      let oraList = postman("Post", reqOarListUrl, JSON.stringify(header), JSON.stringify(query));
      let oraListJsonData = JSON.parse(oraList).data;
      //应收事项的数量
      let oraCount = oraListJsonData.recordCount;
      //根据日结单号查询收款单列表
      let receiveList = postman("Post", reqReceivebillUrl, JSON.stringify(header), JSON.stringify(query));
      let receiveListJsonData = JSON.parse(receiveList).data;
      //收款单的数量
      let receiveCount = receiveListJsonData.recordCount;
      //两个列表的数据都为0时才可以传财务，否则抛异常
      if (oraCount != 0 || receiveCount != 0) {
        throw Error("存在已传财务的日结单,请重新选择");
      }
    });
    return { message: "00" };
  }
}
exports({ entryPoint: MyAPIHandler });