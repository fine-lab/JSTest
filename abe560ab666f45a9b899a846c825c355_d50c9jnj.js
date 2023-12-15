let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(param) {
    let insertMap = param;
    // 拿到所有需要写入key
    let insertMapKey = Object.keys(insertMap);
    let mainDemands = [];
    let itemCodes = [];
    // 遍历需求预测key
    for (var i = 0; i < insertMapKey.length; i++) {
      let key = insertMapKey[i];
      // 判断该key是否已在数据库内,若在库内则不再插入
      let detailKeys = key.split("#");
      var oldKeyObject = {
        issueDate: detailKeys[0],
        lineId: detailKeys[1]
      };
      var oldKeyRes = ObjectStore.selectByMap("AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast", oldKeyObject);
      if (oldKeyRes.length > 0) {
        continue;
      }
      let mainDemand = {};
      let dtailDemands = [];
      // 获取子表集合
      let mapArray = insertMap[key];
      mapArray.forEach((item, index) => {
        if (index == 0) {
          itemCodes.push(item.itemCode);
          mainDemand = {
            lineId: item.headId,
            issueDate: item.issueDate,
            supplierCode: item.odmSupplierCode,
            supplierName: item.supplierName,
            partSort: item.partSort,
            bizModel: "",
            regionType: "国内",
            itemCode: item.itemCode,
            itemDesc: item.itemDesc,
            suppItemDesc: "",
            buyerName: item.buyerName,
            level: item.level,
            poQtyOnRoad: item.poQtyOnRoad,
            organizationId: item.organizationId,
            odmSupplierCode: item.odmSupplierCode,
            odmSupplierName: item.odmSupplierName,
            supplierModel: item.supplierModel,
            calcModeFlag: item.calcModeFlag,
            remark: item.remark,
            huaweiInventory: item.huaweiInventory,
            goodsArrivalQty: item.goodsArrivalQty,
            moq: item.moq,
            mpq: item.mpq,
            errorDesc: "",
            dataStatus: "1"
          };
        }
        let detailDemand = {
          dataType: item.dataType == "101" ? "1" : item.dataType == "100" ? "2" : 0
        };
        // 第一周数据为1-7天之和
        let week1 = 0;
        // 第二周数据为8-14天之和
        let week2 = 0;
        // 第三周数据为15-21天之和
        let week3 = 0;
        for (var i = 1; i <= 21; i++) {
          let dayKey = "day" + i;
          detailDemand[dayKey] = item[dayKey];
          if (i >= 1 && i <= 7) {
            week1 = week1 + item[dayKey];
          } else if (i >= 8 && i <= 14) {
            week2 = week2 + item[dayKey];
          } else if (i >= 15 && i <= 21) {
            week3 = week3 + item[dayKey];
          }
        }
        detailDemand.week1 = week1;
        detailDemand.week2 = week2;
        detailDemand.week3 = week3;
        for (var i = 4; i <= 52; i++) {
          let weekKey = "week" + i;
          detailDemand[weekKey] = item[weekKey];
        }
        dtailDemands.push(detailDemand);
      });
      mainDemand.demandForecastDetailList = dtailDemands;
      mainDemands.push(mainDemand);
    }
    // 写入SSHL物料编码 和 物料分类
    let productFunc = extrequire("AT173E4CEE16E80007.xqycxr.getProuductInfo");
    let productInfoMap = productFunc.execute(
      {},
      {
        itemCodes: itemCodes
      }
    );
    mainDemands.forEach((item) => {
      let product = productInfoMap[item.itemCode];
      if (product) {
        item.suppItemCode = product.code;
        item.suppItemDesc = product.name;
        item.sServiceType = product.manageClassDesc;
      } else {
        item.errorDesc = item.errorDesc + "获取不到物料编码，数据异常;";
      }
    });
    let logObjDetail = {};
    try {
      // 日志对象构造
      logObjDetail = {
        methodName: "insertLocalDemandForecast",
        url: "AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast",
        requestParams: JSON.stringify(mainDemands),
        requestTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
        operationType: "insert"
      };
      // 调用实体操作，对实体进行插入
      var res = ObjectStore.insertBatch("AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast", mainDemands, "ybe05ef960");
      logObjDetail.respTime = new Date().format("yyyy-MM-dd hh:mm:ss");
      logObjDetail.respResult = JSON.stringify(res);
    } catch (error) {
      throw new Error(error);
    } finally {
      try {
        ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObjDetail, "yb6b993e05");
      } catch (e) {
        // 日志写入报错，不做任何处理
        console.log("insertLocalDemandForecast接口日志写入异常");
      }
    }
    return res;
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
exports({
  entryPoint: MyTrigger
});