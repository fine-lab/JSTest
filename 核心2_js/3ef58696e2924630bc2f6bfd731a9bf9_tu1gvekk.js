let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let receivableDatas = request.data; // 应收数据
    if (receivableDatas == null) {
      return false;
    }
    let planYear = request.planYear;
    if (planYear == null) {
      let currDate = new Date();
      planYear = currDate.getFullYear();
    }
    var execDatas = []; // 应收执行数据
    var resStr = AppContext(); // 获取当前登录用户上下文
    var res = JSON.parse(resStr); // 字符串转成JSON对象
    let tenantId = res.currentUser.tenantId;
    let orgId = res.currentUser.orgId;
    // 获取历史应收项目所属部门及负责人
    let strQuery =
      "select id, pk_sale_dept, pk_sales, pk_dept, pk_manager" +
      " from GT84651AT2.GT84651AT2.hn_pdm_project where" +
      " id in (select distinct pk_project" +
      " from GT84651AT2.GT84651AT2.pdm_contract_receipts_plan" +
      " where is_finish=false)";
    var res = ObjectStore.queryByYonQL(strQuery);
    var projMap = new Map(res);
    for (var receivableData of receivableDatas) {
      // 构造应收执行数据
      var execData = {};
      if (receivableData.is_year_target === true) {
        execData.pk_contract_receipts_plan = receivableData.id;
        execData.pk_project = receivableData.pk_project;
        execData.pk_contract = receivableData.pk_contract;
        execData.contract_no = receivableData.contract_no;
        execData.contract_code = receivableData.contract_code;
        execData.contract_name = receivableData.contract_name;
        execData.payment_cluse = receivableData.payment_cluse;
        execData.tax_rate = receivableData.pk_tax_rate;
        execData.tax_rate_value = receivableData.tax_rate;
        // 应收数据(年度目标数据) year_target_amount
        execData.pre_receivable_amount = receivableData.pre_receivable_amount;
        execData.after_receivable_amount = receivableData.year_target_amount;
        execData.plan_year = planYear;
        // 部门及人员
        let projObj = projMap.get(execData.pk_project);
        if (projObj !== null) {
          execData.pk_sale_dept = projObj.pk_sale_dept;
          execData.pk_sales = projObj.pk_sales;
          execData.pk_delivery_dept = projObj.pk_delivery_dept;
          execData.pk_manager = projObj.pk_manager;
        }
        execData.fund_type = 1; // 历史应收
        execData.is_delay = false; // 是否逾期
        execData.is_receipted = false; // 是否已回款
        execData.is_year_ensure = 1; // 年度确保 1确保，2冲刺
        execData.is_month_ensure = 2; // 月度确保 1确保，2冲刺
        execData.is_quarter_ensure = 2; // 季度确保 1确保，2冲刺
        execData.receivable_status = 0; // 回款状态 0未回款，1部分回款，2全部回款
        // 系统属性赋值
        execData.tenant_id = tenantId;
        execData.org_id = orgId;
        execDatas.push(execData);
      }
    }
    if (execDatas.length > 0) {
      var res = ObjectStore.insertBatch("GT84651AT2.GT84651AT2.hn_pdm_receipts_plan_exec", execDatas, "f5a855ce");
    }
    return { data: "success" };
  }
}
exports({ entryPoint: MyAPIHandler });