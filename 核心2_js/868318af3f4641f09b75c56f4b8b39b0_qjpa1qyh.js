let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var bommingchen = request.bommingchen;
    var orgid = request.orgid;
    var shangpinfenlei = request.shangpinfenlei;
    var xinghao = request.pingtai_name;
    var token = "";
    let func1 = extrequire("GT46349AT1.backDefaultGroup.gettoken");
    let res = func1.execute(request);
    token = res.access_token;
    //查询物料编码是否存在
    let base_path1 = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body1 = {
      pageIndex: "1",
      pageSize: "10",
      code: bommingchen
    };
    //请求数据
    let apiResponse1 = postman("post", base_path1 + "?access_token=" + token, JSON.stringify(header), JSON.stringify(body1));
    var apiResponsejaon1 = JSON.parse(apiResponse1);
    var queryCode1 = apiResponsejaon1.code;
    if (queryCode1 !== "200") {
      throw new Error("查询物料错误" + apiResponsejaon1.message);
    } else {
      var recordCount = apiResponsejaon1.data.recordCount;
      if (recordCount !== 0) {
      }
    }
    let base_path = "https://www.example.com/";
    var body = {
      data: {
        code: bommingchen,
        name: bommingchen,
        orgId: orgid,
        manageClass_Code: "XSCP",
        productClass: shangpinfenlei,
        realProductAttribute: 1,
        unitUseType: "2",
        unit_Code: "TAI",
        model: {
          zh_CN: xinghao
        },
        detail: {
          businessAttribute: "3,7",
          //仓库
          deliveryWarehouse: "2481041156004608",
          purchaseUnit_Code: "TAI",
          purchasePriceUnit_Code: "TAI",
          stockUnit_Code: "TAI",
          batchUnit_Code: "TAI",
          batchPriceUnit_Code: "TAI",
          onlineUnit_Code: "TAI",
          offlineUnit_Code: "TAI",
          requireUnit_Code: "TAI",
          produceUnit_Code: "TAI",
          isSerialNoManage: true
        },
        autoGenerateRangeData_: true, //按分级管控自动分配物料 非必传
        _status: "Insert"
      }
    };
    //使用公共函数--------------end
    //请求数据
    let apiResponse = postman("post", base_path + "?access_token=" + token, JSON.stringify(header), JSON.stringify(body));
    var apiResponsejaon = JSON.parse(apiResponse);
    var queryCode = apiResponsejaon.code;
    if (queryCode !== "200") {
      throw new Error("生成物料错误" + apiResponsejaon.message);
    }
    var materialnew = apiResponsejaon.data.id;
    var materialcode = apiResponsejaon.data.code;
    var defaultSKUId = apiResponsejaon.data.defaultSKUId;
    return { materialnew: materialnew, materialcode: materialcode, request: request, defaultSKUId: defaultSKUId };
  }
}
exports({ entryPoint: MyAPIHandler });