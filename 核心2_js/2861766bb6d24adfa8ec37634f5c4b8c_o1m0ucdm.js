let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取角色下的所有用户
    var req = {
      roleId: "yourIdHere",
      pageNumber: 0,
      pageSize: 10000
    };
    let roleUrl = "https://www.example.com/";
    var roleApiResponse = openLinker("POST", roleUrl, "GT879AT352", JSON.stringify(req));
    var today = new Date();
    today.setMonth(today.getMonth() - 3);
    var midsql = "select * from GT879AT352.GT879AT352.reqmid where  createTime  > '" + substring(today.toISOString(), 0, 10) + " 00:00:00' ";
    var mid = ObjectStore.queryByYonQL(midsql, "developplatform");
    var code = "'1'";
    for (var i = mid.length - 1; i >= 0; i--) {
      code = code + ",'" + mid[i].code + "'";
    }
    var x = request.userid;
    if (x) {
      //根据登录用户id
      let body = { userId: [x] };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "GT879AT352", JSON.stringify(body));
      var apiResponseJson = JSON.parse(apiResponse);
      var y = apiResponseJson.data.data[0].id;
      var sql = "select * from AXT000132.AXT000132.purchaseRequest   ";
      if (includes(roleApiResponse, x)) {
        sql = sql + " where  commitDate  > '" + substring(today.toISOString(), 0, 10) + " 00:00:00' and  ( status = '6' or  status = '2' )  and   code  not in  (" + code + " )  ";
      } else {
        sql =
          sql +
          " where  commitDate  > '" +
          substring(today.toISOString(), 0, 10) +
          " 00:00:00' and  ( reqContactsId='" +
          y +
          "'  or   defines.define37 ='" +
          y +
          "' )  and ( status = '6' or  status = '2' )" +
          " and   code  not in  (" +
          code +
          " )  ";
      }
      if (request.reqCode) {
        sql = sql + "and   ( code ='" + request.reqCode + "' or  subject like  '" + request.reqCode + "'  )";
      } else {
        sql = sql + " order by  createTime desc limit  0,50 ";
      }
      var res = ObjectStore.queryByYonQL(sql, "yonbip-cpu-sourcing");
      return { res };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });