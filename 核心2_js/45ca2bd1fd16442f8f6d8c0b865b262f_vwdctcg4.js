let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var editObj = param.data[0];
    var res = ObjectStore.queryByYonQL("select * from GT4691AT1.GT4691AT1.MFrontSaleOrderMain where id ='" + editObj.id + "' ");
    if (res.length <= 0) {
      throw new Error("当前表单数据已被删除，请刷新重试！");
    }
    let lastDate = new Date(res[0]["pubts"]);
    var localOffset = lastDate.getTimezoneOffset() != 0 ? 480 : lastDate.getTimezoneOffset(); //获取当前时区和GMT时间（格林威治时间）的差值
    var editPubts = new Date(editObj["pubts"]).getTime() + localOffset * 60 * 1000;
    if (editPubts != lastDate.getTime()) {
      throw new Error("当前表单不是最新状态，请刷新重试！！");
    }
    let stateText = "";
    let stateCode = res[0]["verifystate"];
    switch (stateCode) {
      case 4:
        stateText = "已保存";
        break;
      case 0:
        stateText = "开立态";
        break;
      case 1:
        stateText = "审核中";
        break;
      case 2:
        stateText = "已审核";
        break;
      case 3:
        stateText = "终止态";
        break;
      case 5:
        stateText = "客服退回";
        break;
      default:
    }
    //判断当前单据状态是否 已保存状态
    let splitBillCount = 0;
    splitBillCount = res[0]["insetnew36"];
    let fdOrderSource = res[0]["fdOrderSource"];
    if (fdOrderSource === "经销商" && (stateCode === 0 || stateCode === 2)) {
      if (splitBillCount > 0) {
        throw new Error("当前拆单状态【" + res[0]["new35"] + "】,只有未拆单的单据可以撤回");
      }
      return {};
    }
    if (fdOrderSource === "客服" && stateCode === 2) {
      if (splitBillCount > 0) {
        throw new Error("当前拆单状态【" + res[0]["new35"] + "】,只有未拆单的单据可以撤回");
      }
      return {};
    }
    throw new Error("当前单据状态【" + stateText + "】,只有单据状态已审核或经销商提交的开立态的单据可以撤回");
  }
}
exports({ entryPoint: MyTrigger });