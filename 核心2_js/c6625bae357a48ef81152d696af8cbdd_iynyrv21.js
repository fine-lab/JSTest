let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //形态转换后反写形态转换单号到销售出库订单
    let func = extrequire("ST.backDefaultGroup.getToken");
    let resToken = func.execute();
    let token = resToken.access_token;
    //获取销售出库
    let xsckId = request.xsckId;
    let getxsckDetail = "https://www.example.com/" + token + "&id=" + xsckId;
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    //销售出库修改形态转换单号
    let rst = "";
    let xsckDetailResponse = postman("GET", getxsckDetail, JSON.stringify(header), null);
    let xsckResponseobj = JSON.parse(xsckDetailResponse);
    if ("200" == xsckResponseobj.code) {
      let data = xsckResponseobj.data;
      return { data };
    }
  }
}
exports({ entryPoint: MyAPIHandler });