let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    let configFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let config = configFunc.execute();
    let X_HW_ID = config.BASE.X_HW_ID;
    let X_HW_APPKEY = config.BASE.X_HW_APPKEY;
    let SUPPLIER_CODE = config.BASE.SUPPLIER_CODE;
    let FACTORY_CODE = config.BASE.FACTORY_CODE;
    let CUSTOMER_CODE = config.BASE.CUSTOMER_CODE;
    let IMPORT_INVENTORY_API_URL = config.BASE.URL + config.API_URL.IMPORT_INVENTORY;
    let APPEND_INVENTORY_API_URL = config.BASE.URL + config.API_URL.APPEND_INVENTORY;
    let CAPACITY_INVENTORY_API_URL = config.BASE.URL + "/api/service/esupplier/saveSupplierProductReply/1.0.0";
    let data = context;
    let needPushDataMap = {};
    let retData = {};
    data &&
      data.map((item) => {
        let factoryInventoryList = [];
        let temp = {
          //供应商工厂代码
          vendorFactoryCode: FACTORY_CODE,
          //取SSHL物料编码在物料档案的"虚编码"
          vendorItemCode: item.itemCode,
          //客户代码
          customerCode: CUSTOMER_CODE,
          //库存
          goodQuantity: item.stock,
          //入库时间 可以为空, yyyy-MM-dd格式
          stockTime: substring(item.createTime, 0, 10),
          //可为空 待检库存
          inspectQty: item.currenProcessQty
        };
        factoryInventoryList.push(temp);
        let responseJson;
        if (factoryInventoryList && factoryInventoryList.length > 0) {
          let body = { factoryInventoryList: factoryInventoryList };
          let header = {
            "X-HW-ID": X_HW_ID,
            "X-HW-APPKEY": X_HW_APPKEY,
            "Content-Type": "application/json"
          };
          let startDate = new Date();
          let strResponse = postman("post", APPEND_INVENTORY_API_URL, JSON.stringify(header), JSON.stringify(body));
          if (strResponse) {
            responseJson = JSON.parse(strResponse);
            if (responseJson) {
              //根据接口请求结果构建返回信息
              retData = {
                success: responseJson.success,
                message: responseJson.errorMessage || responseJson.message || "",
                body: JSON.stringify(body)
              };
            }
          }
          let endDate = new Date();
          try {
            let logInfoData = {
              methodName: "库存数据上载",
              requestParams: JSON.stringify(body),
              requestTime: startDate.format("yyyy-MM-dd hh:mm:ss"),
              respResult: strResponse,
              respTime: endDate.format("yyyy-MM-dd hh:mm:ss"),
              errorMsg: responseJson.errorMessage || "",
              url: APPEND_INVENTORY_API_URL
            };
            var res = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logInfoData, "yb6b993e05List");
          } catch (e) {
            throw new Error(e);
          }
        }
      });
    let capacityList = [];
    data &&
      data.map((item) => {
        let capacityTemp = {
          // 组织id
          organizationId: "yourIdHere",
          // 物料编码
          itemCode: item.itemCode,
          // 供应商编码
          supplierCode: SUPPLIER_CODE,
          odmSupplierCode: "99999999",
          // 当天已产出数量
          outputtedOfDay: item.outputtedOfDay || "",
          // 当天在制数量
          manufacturingQuantityOfDay: item.manufacturingQuantityOfDay || "",
          // 库存(在ERP中没有账的库存(整柜及在制下层库存))
          inventory: item.inventory || "",
          // 当月实际产能
          actualCapacityOfMonth: item.actualCapacityOfMonth || "",
          // 货期
          leadTime: item.leadTime || "",
          // 生产直通率
          outputRolledYield: item.outputRolledYield || "",
          // 生产周期
          productionPeriod: item.productionPeriod || ""
        };
        capacityList.push(capacityTemp);
      });
    let capacityBody = capacityList;
    let capacityHeader = {
      "X-HW-ID": X_HW_ID,
      "X-HW-APPKEY": X_HW_APPKEY,
      "Content-Type": "application/json"
    };
    let capacityStartDate = new Date();
    let capacityStrResponse = postman("post", CAPACITY_INVENTORY_API_URL, JSON.stringify(capacityHeader), JSON.stringify(capacityBody));
    let capacityResponseJson = JSON.parse(capacityStrResponse);
    // 根据接口请求结果构建返回信息
    let capacityEndDate = new Date();
    try {
      let capacityLogInfoData = {
        methodName: "capacityDataLoad",
        requestParams: JSON.stringify(capacityBody),
        requestTime: capacityStartDate.format("yyyy-MM-dd hh:mm:ss"),
        respResult: capacityStrResponse,
        respTime: capacityEndDate.format("yyyy-MM-dd hh:mm:ss"),
        errorMsg: capacityResponseJson.returnMessage || "",
        url: CAPACITY_INVENTORY_API_URL
      };
      var res = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", capacityLogInfoData, "yb6b993e05List");
    } catch (e) {
    }
    //根据接口请求结果构建返回信息
    retData = {
      success: capacityResponseJson.returnCode == 200,
      message: capacityResponseJson.returnMessage || "",
      body: JSON.stringify(capacityBody)
    };
    return retData;
  }
}
Date.prototype.format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours() + 8, //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  // 根据y的长度来截取年
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  }
  return fmt;
};
exports({ entryPoint: MyTrigger });