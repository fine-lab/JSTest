let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let warehouse = request.warehouse;
    let productId = request.productId;
    let purchaseOrg = request.purchaseOrg;
    let error_info = [];
    let errInfo = [];
    //获取仓库档案详情
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let warehouseUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/warehouse/detail?id=" + warehouse; //查询仓库档案详情
    let warehouseBody = {};
    let apiResponseWarehouse = openLinker("GET", warehouseUrl, "GZTBDM", JSON.stringify(warehouseBody));
    let warehouse_obj = JSON.parse(apiResponseWarehouse);
    let storageId = []; //存储条件ID
    let pzwhId = []; //批准文号(存的暂代存储条件)
    if (productId.length > 0) {
      for (let product = 0; product < productId.length; product++) {
        //获取商品
        let proId = productId[product];
        let proUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/product/detail?id=" + productId[product] + "&orgId=" + purchaseOrg; //查询物料档案详情
        let proBody = {};
        let apiResponseProduct = openLinker("GET", proUrl, "GZTBDM", JSON.stringify(proBody));
        let product_obj = JSON.parse(apiResponseProduct);
        //获取商品存储条件ID
        if (product_obj.data.extend_cctj != undefined) {
          storageId[product] = product_obj.data.extend_cctj;
        }
        //存储条件ID:extend_cctj;(暂用批准文号extend_pzwh 代替,后改回即可)
      }
    }
    if (typeof storageId !== "undefined") {
      //获取商品存储条件详情
      let storageArr = [];
      if (pzwhId.length > 0) {
        for (let stoC = 0; stoC < pzwhId.length; stoC++) {
          let storageUrl = apiPreAndAppCode.apiPrefix + "/x5f9yw7w/001/00001/get_storage_condy"; //+storageId;//查询商品存储条件详情
          let storageBody = { id: pzwhId[stoC] };
          let apiResponseStorage = openLinker("POST", storageUrl, "GT22176AT10", JSON.stringify(storageBody));
          let storage_obj = JSON.parse(apiResponseStorage);
          storageArr[stoC] = storage_obj.data.storageDetail.storageRes;
        }
      }
      let storageJson = JSON.stringify(storageArr);
      let storageObj = JSON.parse(storageJson);
      //验证逻辑
      let warehouseData = warehouse_obj.data; //仓库信息
      let storageData = storageObj; //商品存储条件信息
      for (let storageT = 0; storageT < storageData.length; storageT++) {
        if (warehouseData.extend_temperature_down > storageData[storageT][0].maxTemperature || warehouseData.extend_temperature_up < storageData[storageT][0].minTemperature) {
          error_info.push("仓库温度不符合该冷链药品的存储条件");
        }
        if (warehouseData.extend_humidity_up < storageData[storageT][0].minHumidity || warehouseData.extend_humidity_down > storageData[storageT][0].maxHumidity) {
          error_info.push("仓库湿度不符合该冷链药品的存储条件");
        }
      }
    }
    let count = 0;
    if (error_info.length > 0) {
      for (var err = 0; err < error_info.length; err++) {
        count += 1;
        errInfo += count + "." + error_info[err] + " \n ";
      }
    }
    return { errInfo };
  }
}
exports({ entryPoint: MyAPIHandler });