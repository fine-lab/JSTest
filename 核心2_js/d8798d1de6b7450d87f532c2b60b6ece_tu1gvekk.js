let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let backObj = param.data[0];
    if (backObj != null) {
      let orgId = backObj.org_id;
      let projectPk = backObj.pk_project;
      let contractPk = backObj.pk_contract;
      let aimDate = backObj.aim_back_date;
      let aimPreAmount = backObj.aim_back_amount_pre;
      let aimAfterAmount = backObj.aim_back_amount_after;
      let backDate = backObj.act_receipted_date; // 实际回款日期
      // 实际回款金额
      let backAmountAfter = backObj.act_after_receipted_amount;
      // 实际回款金额
      let backAmountPre = backObj.act_pre_receipted_amount;
      let taxValue = backObj.tax_rate_value;
      if (taxValue == null) {
        taxValue = 0.0;
      }
      let planExecId = backObj.id;
      if (projectPk == null || contractPk == null || orgId == null) {
        throw new Error("项目、合同、组织数据有问题，请检查！");
      }
      if (backDate == null || backAmountPre == null) {
        throw new Error("回款数据有问题，请检查！");
      }
      var object = {
        pk_project: projectPk,
        pk_contract: contractPk,
        aim_back_date: aimDate,
        aim_back_amount_pre: aimPreAmount,
        aim_back_amount_after: aimAfterAmount,
        tax_rate: taxValue,
        back_date: backDate,
        back_amount: backAmountAfter,
        back_amount_pre: backAmountPre,
        hn_pdm_receipts_plan_exec_id: planExecId,
        org_id: orgId,
        tenant_id: tenantId
      };
      try {
        var res = ObjectStore.insert("GT84651AT2.GT84651AT2.hn_pdm_receivable_back_info", object);
      } catch (err) {
        throw new Error("保存失败，" + err);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });