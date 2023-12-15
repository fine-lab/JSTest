let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    //获取客户id
    let agentId = data.agentId;
    if (agentId) {
      let s2 = "select * from aa.merchant.MerchantDefine where id =" + agentId;
      var res2 = ObjectStore.queryByYonQL(s2);
      if (res2 && res2.length > 0) {
        //获取单据日期
        let vouchdate;
        if (!isNaN(data.vouchdate)) {
          vouchdate = new Date(data.vouchdate + 8 * 60 * 60 * 1000); //2022-07-30T00:00:00.000Z
          vouchdate = JSON.stringify(vouchdate);
          vouchdate = vouchdate.substring(1, vouchdate.indexOf("T"));
        }
        //获取合同签署日期
        let signDate = res2[0].define2; //data.headFreeItem.define5
        if (!(typeof signDate == "undefined")) {
          signDate = Date.parse(signDate);
          signDate = new Date(signDate + 8 * 60 * 60 * 1000);
          signDate = JSON.stringify(signDate);
          signDate = signDate.substring(1, signDate.indexOf("T"));
        } else {
          signDate = null;
        }
        //获取合同失效日期            //data.headFreeItem.define4
        let expiryDate = res2[0].define3;
        if (!(typeof expiryDate == "undefined")) {
          expiryDate = Date.parse(expiryDate);
          expiryDate = new Date(expiryDate + 8 * 60 * 60 * 1000); //2024-12-30T08:00:00.000Z
          expiryDate = JSON.stringify(expiryDate);
          expiryDate = expiryDate.substring(1, expiryDate.indexOf("T"));
        } else {
          expiryDate = null;
        }
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
        headFreeItem.define5 = signDate;
        headFreeItem.define4 = expiryDate;
        param.data[0].set("_convert_headFreeItem", "ok");
        param.data[0].set("headFreeItem", JSON.stringify(headFreeItem));
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });