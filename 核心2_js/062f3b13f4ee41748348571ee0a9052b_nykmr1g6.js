let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let err_infor = [];
    let curPlanId = request.curPlanId;
    let materialId = request.productId; //物料ID
    let planNumber = request.planNumber; //计划数量
    let warehouse = request.warehouse; //仓库ID
    let batchNo = request.batchNo; //批次号
    let planDate = request.planDate; //计划日期
    let curingtypeId = request.curingtypeId; //养护类别
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    if (typeof curPlanId != "undefined" && typeof materialId != "undefined" && typeof warehouse != "undefined" && typeof batchNo != "undefined") {
      for (var cur = 0; cur < curPlanId.length; cur++) {
        let num = curPlanId[cur]; //仓库现存量查询
        let url = apiPreAndAppCode.apiPrefix + "/yonbip/scm/stock/QueryCurrentStocksByCondition";
        let body = { product: materialId[num], warehouse: warehouse[num], batchno: batchNo[num] }; //
        let apiResponse = openLinker("POST", url, apiPreAndAppCode.appCode, JSON.stringify(body));
        let data;
        if (typeof apiResponse == "string") {
          apiResponse = JSON.parse(apiResponse);
          data = apiResponse.data;
        } else if (typeof apiResponse == "Object") {
          data = apiResponse.data;
        }
        if (typeof curingtypeId != "undefined") {
          //查询养护类别
          var curingtypeObject = { id: curingtypeId }; //
          var curingtypeRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_curingtypesv2", curingtypeObject);
          //查询在库养护记录
          var object = { material_code: materialId[cur], warehouse: warehouse[cur], picihao: batchNo[cur] }; //,picihao:batchNo
          var res = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_warehousede", object);
          if (res.length > 0) {
            for (let j = 0; j < res.length; j++) {
              let pData = new Date(planDate); //养护计划生成时间
              let wData = new Date(res[j].Date); //在库养护时间
              let days = (wData - pData) / (1000 * 60 * 60 * 24);
              let cycle = Math.round(curingtypeRes.curingCycle); //养护周期
              if (pData <= wData && days < cycle - 5) {
                err_infor.push("第" + (cur + 1) + "个商品已经进行过在库养护,且未到下次养护时间,无需再次生成");
              }
            }
          }
        }
        if (typeof data != "undefined" && data != null) {
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (planNumber > data[i].currentqty) {
                err_infor.push("第" + (cur + 1) + "个商品库存不足,保存失败");
              }
            }
          }
        } else {
          err_infor.push("第" + (cur + 1) + "个商品没有库存,保存失败");
        }
      }
    }
    if (err_infor.length > 0) {
      for (let err = 0; err < err_infor.length; err++) {
        err_infor[err] = err_infor[err] + " \n ";
      }
    }
    return { err_infor };
  }
}
exports({ entryPoint: MyAPIHandler });