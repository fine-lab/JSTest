let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let currency = data.orderPrices.currency;
    //获取priceList
    let cust_url = "https://www.example.com/" + data.agentId_code;
    let priceList = undefined;
    let custdata = openLinker("GET", cust_url, "SCMSA", JSON.stringify({}));
    custdata = JSON.parse(custdata);
    if (custdata && custdata.data && custdata.data.merchantDefine) {
      priceList = custdata.data.merchantDefine.define2;
    }
    let isTJ = false; //data.headFreeItem.define1;
    let orderDetails = data.orderDetails;
    let vouchdate;
    if (!isNaN(data.vouchdate)) {
      vouchdate = new Date(data.vouchdate + 8 * 60 * 60 * 1000);
      vouchdate = JSON.stringify(vouchdate);
      vouchdate = vouchdate.substring(1, vouchdate.indexOf("T"));
    } else {
      vouchdate = data.orderDate;
    }
    let queryparam = {
      currency: currency,
      priceList: priceList,
      product: [],
      date: vouchdate
    };
    for (let i = orderDetails.length - 1; i >= 0; i--) {
      let line = orderDetails[i];
      queryparam.product.push(line.productId + "");
    }
    let query =
      "select lowerLimit,product from GT65915AT5.GT65915AT5.salePriceLine where salePrice_id in (select id from GT65915AT5.GT65915AT5.salePrice where verifystate=2 and currency=" +
      queryparam.currency +
      ") and product in (" +
      queryparam.product +
      ") and priceList='" +
      queryparam.priceList +
      "' and startDate < '" +
      queryparam.date +
      "' and endDate > '" +
      queryparam.date +
      "'";
    let limitRep = ObjectStore.queryByYonQL(query, "developplatform");
    if (limitRep && limitRep.length > 0) {
      limitRep.forEach((limit) => {
        for (let i = data.orderDetails.length - 1; i >= 0; i--) {
          let line = orderDetails[i];
          if (line.productId == limit.product) {
            if (!data.orderDetails[i].bodyFreeItem) {
              data.orderDetails[i].set("bodyFreeItem", {});
              data.orderDetails[i].bodyFreeItem.set("_entityName", "voucher.order.OrderDetailFreeDefine");
              data.orderDetails[i].bodyFreeItem.set("_keyName", "id");
              data.orderDetails[i].bodyFreeItem.set("_realtype", true);
              data.orderDetails[i].bodyFreeItem.set("_status", "Insert");
              data.orderDetails[i].bodyFreeItem.set("id", data.orderDetails[i].id + "");
            } else {
              data.orderDetails[i].bodyFreeItem.set("_status", "Update");
            }
            data.orderDetails[i]._status == "Insert" && data.orderDetails[i].bodyFreeItem.set("_status", "Insert");
            data.orderDetails[i].bodyFreeItem.set("define1", limit.lowerLimit + "");
            isTJ |= limit.lowerLimit > data.orderDetails[i].oriTaxUnitPrice;
          }
        }
      });
      let headFreeItem = {};
      if (!param.data[0].headFreeItem) {
        headFreeItem._entityName = "voucher.order.OrderFreeDefine";
        headFreeItem._keyName = "id";
        headFreeItem._realtype = true;
        headFreeItem._status = "Insert";
        headFreeItem.id = data.id + "";
      } else {
        headFreeItem = param.data[0].headFreeItem;
        headFreeItem._keyName = "orderId";
        headFreeItem._status = "Update";
        headFreeItem.orderId = data.id;
      }
      if (data._status == "Insert") {
        headFreeItem._status = "Insert";
      }
      headFreeItem.define1 = isTJ ? "true" : "false";
      param.data[0].set("_convert_headFreeItem", "ok");
      param.data[0].set("headFreeItem", JSON.stringify(headFreeItem));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });