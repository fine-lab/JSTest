let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let expensebillbs = pdata.PayBillb; //费用分摊
    for (var i in expensebillbs) {
      let idx = parseInt(i) + 1;
      let billbs = expensebillbs[i];
      let pk_busimemo_name = billbs.expenseitem_name; //费用项目名称
      let pk_busimemo = billbs.expenseitem; //费用项目
      let itemFee = billbs.item329qg; //费用类别
      let pk_project_name = billbs.project_name;
      if (pk_busimemo_name == undefined || pk_busimemo_name == null || pk_busimemo_name == "") {
        continue;
      }
      if (!pk_project_name || pk_project_name == "") {
        //项目
        if (!itemFee) {
          if (
            includes(pk_busimemo_name, "研发") ||
            includes(pk_busimemo_name, "安装运输和调试费用") ||
            includes(pk_busimemo_name, "燃料动力费用") ||
            includes(pk_busimemo_name, "知识产权申请和维护费用")
          ) {
            throw new Error("费用分摊第" + idx + "行数据研发类费用，项目必填，否则无法保存!");
          }
        } else {
          if (includes(itemFee, "研发")) {
            throw new Error("费用分摊第" + idx + "行数据研发类费用，项目必填，否则无法保存!");
          }
        }
      }
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });