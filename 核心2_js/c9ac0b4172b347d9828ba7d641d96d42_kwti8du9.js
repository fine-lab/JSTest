let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    if (data.orgId == "2522102344422656" || data.orgId == "2390178757465088") {
      let func5 = extrequire("PO.backDesignerFunction.getProductData");
      let res5 = func5.execute(null, data.id);
      let jsonData = res5.jsonData.data;
      if ((data.orgId == "2522102344422656" && (jsonData.transTypeCode == "CCP01" || jsonData.transTypeCode == "CCP05")) || data.orgId == "2390178757465088") {
        if (jsonData.transTypeCode != "CCP02" && jsonData.transTypeCode != "CCP03" && (jsonData.transTypeCode == "CCP01" || jsonData.transTypeCode == "CCP05") && jsonData.transTypeCode != "CCP04") {
          // 接口查询返回的data数据
          let jsonDataStr = JSON.stringify(jsonData);
          jsonDataStr = replace(jsonDataStr, "orderAttrextItem!", "orderAttrextItem");
          jsonData = JSON.parse(jsonDataStr);
          let orderProduct = jsonData.orderProduct[0];
          let productCode = orderProduct.productCode;
          //获取供应商批次
          orderProduct = JSON.stringify(orderProduct);
          let strstrarrivalOrder = replace(orderProduct, "orderProductUserdefItem!", "orderProductUserdefItem");
          orderProduct = JSON.parse(strstrarrivalOrder);
          let gyspc = orderProduct.orderProductUserdefItemdefine4 == undefined ? "-" : orderProduct.orderProductUserdefItemdefine4;
          let func3 = extrequire("GT101792AT1.common.getDate");
          let res3 = func3.execute(null);
          let lineGroupCode = "";
          if (orderProduct.orderProcess[0].workCenterCode != null) {
            lineGroupCode = orderProduct.orderProcess[0].workCenterCode;
          } else {
            throw new Error("工作中心编码为空");
          }
          let warehouseId = "";
          let customerId = "";
          if (jsonData.orgId == "2522102344422656") {
            //依安工厂
            warehouseId = "yourIdHere";
            customerId = "yourIdHere";
          } else if (jsonData.orgId == "2390178757465088") {
            //克东
            warehouseId = "yourIdHere";
            customerId = "yourIdHere";
          }
          let workTeamCode = jsonData.orderAttrextItemdefine1 == "白班" ? "1" : "2";
          let biz_content = {
            code: jsonData.code, //工单号（生产工单号）
            factoryCode: warehouseId, //data.orgCode,  //工厂代码（工厂代码，如：依安工厂代码）
            lineGroupCode: lineGroupCode, //生产线代码
            productCode: productCode, //产品代码（生产的成品/半成品代码）
            planQty: orderProduct.quantity, //计划数（计划生产数量）(int类型)
            batchCode: gyspc, //批号（可以先传个固定值，比如“-”）
            workTeamCode: workTeamCode,
            packDate: orderProduct.produceDate, //生产日期，格式:yyyy-MM-dd
            validDate: orderProduct.expirationDate,
            processRouteCode: jsonData.orderAttrextItemdefine5 //工艺路线代码
          };
          // 请求参数
          let method = "lineGroupWorkTask";
          let requestParam = {
            method: method,
            biz_content: biz_content
          };
          let func1 = extrequire("GT101792AT1.common.sendYS");
          let res = func1.execute(null, requestParam);
          let ysContent = res.ysContent;
          if (ysContent.code != "0") {
            throw new Error("Ys生产订单推送易溯生产订单异常" + JSON.stringify(ysContent.errMsg));
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });