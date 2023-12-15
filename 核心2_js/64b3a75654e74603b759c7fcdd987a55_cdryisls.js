let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 保存前查询现存量，并赋值到自定义字段
    let datas = param.data[0];
    let orderDetails = datas.orderDetails;
    for (var j = 0; j < orderDetails.length; j++) {
      if (orderDetails[j].currentqty != undefined) {
        let number = orderDetails[j].currentqty;
        param.data[0].orderDetails[j].orderDetailDefineCharacter.set("attrext20", number);
      }
    }
    return { param };
  }
}
exports({ entryPoint: MyTrigger });