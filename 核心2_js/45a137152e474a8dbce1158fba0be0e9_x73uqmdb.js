let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request.productId == undefined) throw new Error("产品ID不能为空");
    let url = "https://www.example.com/" + request.productId;
    let body = {};
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    var res = null;
    apiResponse = JSON.parse(apiResponse);
    //将返回的结果存储进子表数据
    if (apiResponse.code == 200) {
      //获取返回的租户id列表
      var respData = apiResponse.data;
      var tenantIdALLList = [];
      for (var keys in respData) {
        if (tenantIdALLList.indexOf(respData[keys].tenantId) < 0) {
          tenantIdALLList.push(respData[keys].tenantId);
        }
      }
      //查询出租户数据,不存在的走新增逻辑
      var resData = ObjectStore.queryByYonQL("select tenantId_buy,tenantId_name from GT42337AT12.GT42337AT12.be_tenantIdinfo where be_appinfo_id='" + request.id + "'");
      var tenantIdDataList = [];
      if (resData.length > 0) {
        //说明存在数据信息
        for (var dataKey in resData) {
          var tenantIdALLListIndex = tenantIdALLList.indexOf(resData[dataKey].tenantId_buy);
          if (tenantIdALLListIndex >= 0) {
            delete tenantIdALLList[tenantIdALLListIndex];
          }
        }
      }
      var tenantInsertList = [];
      //拼装插入数据库的脚本
      var InsertSqlArr = { id: request.id, be_tenantIdinfoList: [], _status: "update" };
      for (var tenantIdDown in tenantIdALLList) {
        if (tenantIdALLList[tenantIdDown] == null || tenantIdALLList[tenantIdDown] == undefined) break;
        var singleTenantIdInsert = { tenantId_buy: tenantIdALLList[tenantIdDown], _status: "Insert", tenantId_name: "暂无", tenantId_mail: "https://www.example.com/" };
        InsertSqlArr.be_tenantIdinfoList.push(singleTenantIdInsert);
      }
      if (InsertSqlArr.be_tenantIdinfoList.length == 0) {
        throw new Error("当前已经为最新租户信息");
      }
      res = ObjectStore.updateById("GT42337AT12.GT42337AT12.be_appinfo", InsertSqlArr, "0942cfb0");
    } else {
      throw new Error("拉取租户信息失败");
    }
    return { reponse: res };
  }
}
exports({ entryPoint: MyAPIHandler });