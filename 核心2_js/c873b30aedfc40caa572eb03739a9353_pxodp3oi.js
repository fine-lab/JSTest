let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let expensebillbs = pdata.expapportions; //费用分摊
    let vdef2 = pdata.vdef2;
    if (vdef2 != undefined && vdef2 != null && vdef2 != "" && vdef2 != 0) {
      throw new Error("佣金费用代扣税差额 不为0，无法保存!");
    }
    let vdef3 = pdata.vdef3;
    if (vdef3 != undefined && vdef3 != null && vdef3 != "" && vdef3 != 0) {
      throw new Error("报销及分摊合计差额 不为0，无法保存!");
    }
    let vdef4 = pdata.vdef4;
    if (vdef4 != undefined && vdef4 != null && vdef4 != "" && vdef4 != 0) {
      throw new Error("报销及分摊合计差额 不为0，无法保存!");
    }
    for (var i in expensebillbs) {
      let idx = parseInt(i) + 1;
      let billbs = expensebillbs[i];
      let pk_busimemo_name = billbs.pk_busimemo_name; //费用项目名称
      let pk_busimemo = billbs.pk_busimemo; //费用项目
      let itemFee = billbs.item2625pf; //费用类别
      if (!itemFee) {
        //差旅报销
        itemFee = billbs.item1441og;
      }
      let pk_project_name = billbs.pk_project_name;
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