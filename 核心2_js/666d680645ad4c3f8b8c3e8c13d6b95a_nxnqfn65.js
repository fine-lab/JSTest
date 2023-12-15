let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.action !== "unaudit") {
      return {};
    }
    //获取前置订单应用token
    let func1 = extrequire("udinghuo.saleOrder.getFrontToken");
    let tokenRes = func1.execute(context, param);
    let access_token = tokenRes.access_token;
    let isList = context.billtype === "VoucherList";
    let datas = isList ? param.realModelData : param.data;
    let datasArray = [];
    for (var i = 0; i < datas.length; i++) {
      let order = datas[i];
      let orderHeadItem = isList ? order.headItem[0] : order.headItem;
      let define2Obj = orderHeadItem.define2;
      if (define2Obj === "科园") {
        let define21Obj = orderHeadItem.define21; //抓取状态
        let define22Obj = orderHeadItem.define22; //抓取时间
        if (define21Obj === "已抓取") {
          let status = order.verifystate;
          let orderid = order.id;
          let code = order.code;
          let resubmitCheckKey = JSON.stringify(new Date().getTime());
          let datasObj = {
            id: orderid,
            code: code,
            definesInfo: [
              {
                define21: null,
                define22: null,
                isHead: true,
                isFree: false
              }
            ]
          };
          datasArray.push(datasObj);
        }
      }
    }
    let uptObj = {
      billnum: "voucher_order",
      datas: datasArray
    };
    //没有要弃审更新的时候不做接口调用
    if (datasArray.length > 0) {
      let url = "https://www.example.com/" + access_token;
      let apiResponse = postman("POST", url, null, JSON.stringify(uptObj));
      if (JSON.parse(apiResponse).code !== "200") {
        throw new Error(JSON.stringify({ apiResponse: apiResponse }));
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });