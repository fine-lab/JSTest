let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var mailReceiver = ["https://www.example.com/"];
    var channels = ["mail"];
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver,
      channels: channels,
      subject: "normal mail title",
      content: "mail content"
    };
    let data = param.data[0];
    try {
      var dd = JSON.stringify(data);
      messageInfo.content = dd;
      messageInfo.subject = "传入参数";
    } catch (e) {}
    let orderCh = param.parameters && param.parameters.orderChange && (param.parameters.orderChange || param.parameters.orderChange === "TRUE");
    //获取原币pk
    let currency = data.orderPrices.currency;
    //获取价目表
    let priceList = undefined;
    let agentFunc = extrequire("GZTBDM.backDefaultGroup.queryCust");
    let agentIds = agentFunc.execute(data.agentId);
    if (agentIds && agentIds.length > 0) {
      priceList = agentIds[0].merchantDefine_define1;
    }
    let arr = [];
    let isTJ = false; //data.headFreeItem.define1;
    let isZP = false; //data.headFreeItem.define3
    let TJ = "否"; //data.bodyFreeItem.define4
    let orderDetails = data.orderDetails;
    console.log("data.vouchdate " + data.vouchdate + " data.orderDate " + data.orderDate);
    //获取单据日期
    let vouchdate;
    if (data.vouchdate != undefined) {
      vouchdate = data.vouchdate;
    } else if (data.orderDate != undefined) {
      vouchdate = data.orderDate;
    }
    //查询参数
    let queryparam = {
      currency: currency,
      priceList: priceList,
      product: [],
      date: vouchdate
    };
    //获取物料id
    for (let i = orderDetails.length - 1; i >= 0; i--) {
      let line = orderDetails[i];
      queryparam.product.push(line.productId + "");
    }
    let func1 = extrequire("GT71806AT2.backDefaultGroup.querySaleList");
    let res = func1.execute(queryparam);
    //存放参数中的商品id,也就是表体中所有商品的id
    let paramIds = queryparam.product; //["2543368045465856","2587168729764609"]
    //存放结果中返回的商品id，也就是能取到价格下限的id
    let resultIds = []; //["2543368045465856"]
    for (let i = 0; i < res.length; i++) {
      if (typeof res[i].product == "number") {
        //查出来的数据有String类型还有number类型，number类型的ids都给加进去了，这里多写一个判断
        resultIds.push(JSON.stringify(res[i].product));
      } else {
        resultIds.push(res[i].product);
      }
    }
    //存放没有取到价格下限的商品的id
    let ids = []; //["2587168729764609"]
    for (let i = 0; i < paramIds.length; i++) {
      if (resultIds.indexOf(paramIds[i]) < 0) {
        ids.push(paramIds[i]);
      }
    }
    console.error("104");
    try {
      var dd2 = JSON.stringify(res);
      messageInfo.content = dd2 + " :orderCh:" + orderCh;
      messageInfo.subject = "传入参数";
    } catch (e) {}
    if (res && res.length > 0) {
      res.forEach((limit) => {
        for (let j = data.orderDetails.length - 1; j >= 0; j--) {
          let line = orderDetails[j];
          if (line.productId == limit.product) {
            if (!data.orderDetails[j].bodyFreeItem) {
              data.orderDetails[j].set("bodyFreeItem", {});
              data.orderDetails[j].bodyFreeItem.set("_status", "Insert");
            } else {
              data.orderDetails[j]._status != "Insert" && data.orderDetails[j].bodyFreeItem.set("_status", "Update");
            }
            data.orderDetails[j].bodyFreeItem.set("define1", limit.lowerLimit + "");
            if (data.orderDetails[j].orderProductType == "GIFT") {
              if (typeof data.orderDetails[j].bodyFreeItem != "undefined") {
                data.orderDetails[j].bodyFreeItem.set("define4", "否");
              }
              if (typeof data.orderDetails[j] != "undefined") {
              }
            } else {
              TJ = limit.lowerLimit > data.orderDetails[j].oriTaxUnitPrice ? "是" : "否";
              if (typeof data.orderDetails[j].bodyFreeItem != "undefined") {
                data.orderDetails[j].bodyFreeItem.set("define4", TJ);
              }
              if (typeof data.orderDetails[j] != "undefined") {
                data.orderDetails[j].set("bodyFreeItem!define4", TJ);
              }
            }
          }
        }
      });
      for (let j = data.orderDetails.length - 1; j >= 0; j--) {
        if (typeof data.orderDetails[j].bodyFreeItem != "undefined") {
          isTJ |= data.orderDetails[j].bodyFreeItem.define4 == "是";
        }
      }
      for (let i = data.orderDetails.length - 1; i >= 0; i--) {
        arr.push(data.orderDetails[i].orderProductType);
      }
      if (arr.indexOf("GIFT") == -1) {
        isZP = false;
      } else {
        isZP = true;
      }
      console.error("204");
      let headFreeItem = {};
      if (!data.headFreeItem) {
        headFreeItem._entityName = "voucher.order.OrderFreeDefine";
        headFreeItem._keyName = "id";
        headFreeItem._realtype = true;
        headFreeItem._status = "Insert";
        headFreeItem.id = data.id + "";
      } else {
        headFreeItem = data.headFreeItem;
        headFreeItem._keyName = "orderId";
        headFreeItem._status = "Update";
        headFreeItem.orderId = data.id;
      }
      if (data._status == "Insert") {
        headFreeItem._status = "Insert";
      }
      headFreeItem.define1 = isTJ ? "true" : "false";
      headFreeItem.define3 = isZP ? "true" : "false";
      data.set("_convert_headFreeItem", "ok");
      data.set("headFreeItem", JSON.stringify(headFreeItem));
      data.set("headFreeItem!define1", headFreeItem.define1);
      data.set("headFreeItem!define3", headFreeItem.define3);
    }
    ids.forEach((id) => {
      for (let j = data.orderDetails.length - 1; j >= 0; j--) {
        if (data.orderDetails[j].productId == id) {
          if (typeof data.orderDetails[j].bodyFreeItem != "undefined") {
            data.orderDetails[j].bodyFreeItem.set("define1", "--");
          }
        }
      }
    });
    console.error("247");
    try {
      let dd1 = JSON.stringify(data);
      messageInfo.content = dd1;
      messageInfo.subject = "处理后数据";
    } catch (e) {}
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});