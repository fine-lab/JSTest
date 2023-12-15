let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var stockOrgId = request.stockOrgId;
    var stockId = request.stockId;
    var qty = Number(request.qty);
    var receiveaddress = request.receiveaddress;
    var receiveId = request.receiveId;
    var agentId = request.agentId;
    //查询运费计算模板下该组织仓库对应的主表主键
    var sql = "select id from GT18216AT3.GT18216AT3.freightTemplate where stockorg = '" + stockOrgId + "' and warehouse='" + stockId + "'";
    var queryid = ObjectStore.queryByYonQL(sql);
    var id = queryid[0].id;
    //判断id是否存在
    //该主键对应的表体行
    let func1 = extrequire("GT18216AT3.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var deptId = request;
    var requrl = "https://www.example.com/" + token + "&id=" + agentId;
    var strResponse = postman("GET", requrl, null);
    var responseObj = JSON.parse(strResponse);
    var deptDetail;
    if ("200" == responseObj.code) {
      deptDetail = responseObj.data;
    }
    var regionCode = "";
    var addressarr = deptDetail.merchantAddressInfos;
    if (addressarr.length > 0) {
      addressarr.forEach((data) => {
        if (data.id == receiveId) {
          regionCode = data.regionCode;
        }
      });
    }
    let base_path2 = "https://www.example.com/";
    var hmd_contenttype2 = "application/json;charset=UTF-8";
    let header2 = {
      "Content-Type": hmd_contenttype2
    };
    var simple2 = {
      code: regionCode
    };
    var body2 = {
      pageIndex: "1",
      pageSize: "10",
      simple: simple2
    };
    //请求数据
    let apiResponse = postman("post", base_path2.concat("?access_token=" + token), JSON.stringify(header2), JSON.stringify(body2));
    var obj = JSON.parse(apiResponse);
    var data = obj.data;
    var recordList = data.recordList;
    var path = recordList[0].path; //"2177117994820096|2177117994820097|2177117994820098|"
    var str = path.substring(0, path.length - 1); //去除字符串末尾“|”
    var pathres = str.split("|");
    var rstc = "";
    if (pathres.length == 1) {
      //配送范围维护到省
      var sqlp = "select * from GT18216AT3.GT18216AT3.freightTempdetail where freightTempdetailFk = '" + id + "' and province = '" + pathres[0] + "'";
      rstc = ObjectStore.queryByYonQL(sqlp);
    } else if (pathres.length == 2) {
      //配送范围维护到市
      var sqlc = "select * from GT18216AT3.GT18216AT3.freightTempdetail where freightTempdetailFk = '" + id + "' and city = '" + pathres[1] + "'";
      rstc = ObjectStore.queryByYonQL(sqlc);
    } else if (pathres.length == 3) {
      //配送范围维护到区
      var sqla = "select * from GT18216AT3.GT18216AT3.freightTempdetail where freightTempdetailFk = '" + id + "' and area = '" + pathres[2] + "'";
      var rstc = ObjectStore.queryByYonQL(sqla);
    }
    var price = "";
    for (let i = 0; i < rstc.length; i++) {
      let str = rstc[i].quantity;
      let qj = str.split("-");
      let a = Number(qj[0]);
      let b = Number(qj[1]);
      if (qty > a && qty < b) {
        price = rstc[i].price;
      }
    }
    return { price: price };
  }
}
exports({ entryPoint: MyAPIHandler });