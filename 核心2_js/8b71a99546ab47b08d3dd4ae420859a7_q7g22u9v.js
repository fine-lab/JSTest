let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let a = data.agentId;
    let Details = data.orderDetails;
    //我写的
    let trackingMode = data.headFreeItem.define8;
    if (trackingMode == "客户") {
      for (let i = 0; i < Details.length; i++) {
        let Detail = Details[i];
        let isreserve = Detail.isreserve;
        if (isreserve == true) {
          Detail.set("reserveidDemandtype", "2");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });