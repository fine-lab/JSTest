let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request._orgId;
    let productConditions = request._productConditions;
    //切分物料字符串位数组
    var productArr = productConditions.replace(/'/g, "").split(",");
    var productInsertArr = [];
    var yhtuserId = JSON.parse(AppContext()).currentUser.id;
    var time = new Date().getTime();
    //查询结果
    let reqParams = { productArr: productArr, yhtuserId: yhtuserId, time: time, orgId: orgId };
    let url = "https://www.example.com/";
    let res = openLinker("POST", url, "GT2152AT10", JSON.stringify(reqParams));
    //处理返回结果
    let queryRes = JSON.parse(res).res;
    let resMap = {};
    for (let i = 0; i < queryRes.length; i++) {
      resMap[queryRes[i].baseOrg + queryRes[i].warehouse + queryRes[i].product] = queryRes[i];
    }
    return { res: resMap };
  }
}
exports({ entryPoint: MyAPIHandler });