viewModel.on("customInit", function (data) {
  // 外包预投入申请单详情--页面初始化
});
function formatDate(date) {
  var month = date.getMonth() + 1;
  return date.getFullYear() + "-" + month + "-" + date.getDate();
}
viewModel.on("afterLoadData", function () {
  setXFSF();
  //当前页面状态
  var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
  if (currentState == "add") {
    //新增状态
    viewModel.get("pre_applydate").setValue(formatDate(new Date()));
    let staffRes = cb.rest.invokeFunction("AT1601E07C17400008.befunc.getStaffByUserId", {}, function (err, res) {}, viewModel, { async: false });
    let staff = staffRes.result;
    if (staff && staff.code === "200" && staff.data && staff.data.data && staff.data.data.length > 0) {
      let staffData = staff.data.data[0];
      viewModel.get("pre_apply_org").setValue(staffData.org_id);
      viewModel.get("pre_apply_org_name").setValue(staffData.org_id_name);
      viewModel.get("pre_apply_dept").setValue(staffData.dept_id);
      viewModel.get("pre_apply_dept_name").setValue(staffData.dept_id_name);
      viewModel.get("pre_apply_psn").setValue(staffData.id);
      viewModel.get("pre_apply_psn_name").setValue(staffData.name);
      viewModel.get("pre_apply_psn_email").setValue(staffData.email);
    }
  }
  initFieldStatus();
});
viewModel.on("modeChange", function (data) {
  let verifystate = viewModel.get("verifystate").getValue();
  if (verifystate == 1) {
    viewModel.get("pre_lowrate_reason2").setDisabled(true);
    viewModel.get("pre_project_files").setState("deleteable", false);
  } else {
  }
  if (data == "edit") {
  }
});
// 监听审批动作
viewModel.on("afterWorkflowBeforeQueryAsync", function (param) {
});
// 需求组织参照过滤
viewModel.get("pre_requirements_org_name").on("beforeBrowse", function (args) {
  debugger;
  //主要代码
  var condition = {
    isExtend: true,
    simpleVOs: []
  };
  condition.simpleVOs.push({
    field: "parent",
    op: "eq",
    value1: "ab756309feca4c708af760ca14b34a91"
  });
  //设置过滤条件
});
function initFieldStatus() {
  let pre_bill_type = viewModel.get("pre_bill_type").getValue();
  if (pre_bill_type == "1") {
    //外包预投入申请
    //销售合同是否已签订
    viewModel.get("pre_contract_is_signing").setVisible(true);
    viewModel.get("pre_contract_is_signing").setState("bIsNull", false);
    //外包预投入原因
    viewModel.get("pre_invest_reason").setVisible(true);
    viewModel.get("pre_invest_reason").setState("bIsNull", false);
    //预投入供应商
    viewModel.get("pre_supplier").setVisible(true);
    viewModel.get("pre_supplier").setState("bIsNull", false);
    //预投入供应商等级
    viewModel.get("pre_supplier_level_new").setVisible(true);
    viewModel.get("pre_supplier_level_new").setState("bIsNull", false);
    //是否客户指定供应商
    viewModel.get("pre_customer_is_appoint").setVisible(true);
    //选择该供应商原因
    viewModel.get("pre_choose_reason").setVisible(true);
    viewModel.get("pre_choose_reason").setState("bIsNull", false);
    //预投入备选供应商
    viewModel.get("pre_supplier_backup").setVisible(true);
    //外包顾问预计进场时间
    viewModel.get("pre_outsource_enter_date").setVisible(true);
    viewModel.get("pre_outsource_enter_date").setState("bIsNull", false);
    //外包顾问实际进场时间
    let verifystate = viewModel.get("verifystate").getValue();
    viewModel.get("pre_consultants_actual_date").setVisible(true);
    if (verifystate == 1) {
      viewModel.get("pre_consultants_actual_date").setState("bIsNull", false);
    } else {
      viewModel.get("pre_consultants_actual_date").setState("bIsNull", true);
    }
    let pre_contract_is_signing = viewModel.get("pre_contract_is_signing").getValue();
    if (pre_contract_is_signing) {
      //销售合同编码
      viewModel.get("pre_contract_code").setVisible(true);
      viewModel.get("pre_contract_code").setState("bIsNull", false);
      //销售合同名称
      viewModel.get("pre_contract_project").setVisible(true);
      viewModel.get("pre_contract_project").setState("bIsNull", false);
      //销售合同金额
      viewModel.get("pre_contract_money").setVisible(true);
      viewModel.get("pre_contract_money").setState("bIsNull", false);
      //销售合同实际签订时间
      viewModel.get("pre_contract_date").setVisible(true);
      viewModel.get("pre_contract_date").setState("bIsNull", false);
      //销售合同预计签订时间
      viewModel.get("pre_contract_plan_date").setVisible(false);
      viewModel.get("pre_contract_plan_date").setState("bIsNull", true);
      //销售合同预计签订金额
      viewModel.get("pre_contract_plan_money").setVisible(false);
      viewModel.get("pre_contract_plan_money").setState("bIsNull", true);
      //累计已签外包合同总金额
      viewModel.get("pre_signed_outsource_mny").setVisible(true);
      viewModel.get("pre_signed_outsource_mny").setState("bIsNull", false);
      //累计已签外包额与主合同额占比
      viewModel.get("pre_signed_outsource_rate").setVisible(true);
      viewModel.get("pre_signed_outsource_rate").setState("bIsNull", false);
    } else {
      //销售合同编码
      viewModel.get("pre_contract_code").setVisible(false);
      viewModel.get("pre_contract_code").setState("bIsNull", true);
      //销售合同名称
      viewModel.get("pre_contract_project").setVisible(false);
      viewModel.get("pre_contract_project").setState("bIsNull", true);
      //销售合同金额
      viewModel.get("pre_contract_money").setVisible(false);
      viewModel.get("pre_contract_money").setState("bIsNull", true);
      //销售合同实际签订时间
      viewModel.get("pre_contract_date").setVisible(false);
      viewModel.get("pre_contract_date").setState("bIsNull", true);
      //销售合同预计签订时间
      viewModel.get("pre_contract_plan_date").setVisible(true);
      viewModel.get("pre_contract_plan_date").setState("bIsNull", false);
      //销售合同预计签订金额
      viewModel.get("pre_contract_plan_money").setVisible(true);
      viewModel.get("pre_contract_plan_money").setState("bIsNull", false);
      //累计已签外包合同总金额
      viewModel.get("pre_signed_outsource_mny").setVisible(false);
      viewModel.get("pre_signed_outsource_mny").setState("bIsNull", true);
      //累计已签外包额与主合同额占比
      viewModel.get("pre_signed_outsource_rate").setVisible(false);
      viewModel.get("pre_signed_outsource_rate").setState("bIsNull", true);
    }
  }
  if (pre_bill_type == "2") {
    //外包需求立项申请(非预投入)
    //销售合同是否已签订
    viewModel.get("pre_contract_is_signing").setVisible(false);
    viewModel.get("pre_contract_is_signing").setState("bIsNull", true);
    //外包预投入原因
    viewModel.get("pre_invest_reason").setVisible(false);
    viewModel.get("pre_invest_reason").setState("bIsNull", true);
    //预投入供应商
    viewModel.get("pre_supplier").setVisible(false);
    viewModel.get("pre_supplier").setState("bIsNull", true);
    //预投入供应商等级
    viewModel.get("pre_supplier_level_new").setVisible(false);
    viewModel.get("pre_supplier_level_new").setState("bIsNull", true);
    //是否客户指定供应商
    viewModel.get("pre_customer_is_appoint").setVisible(false);
    //选择该供应商原因
    viewModel.get("pre_choose_reason").setVisible(false);
    viewModel.get("pre_choose_reason").setState("bIsNull", true);
    //预投入备选供应商
    viewModel.get("pre_supplier_backup").setVisible(false);
    viewModel.get("pre_supplier_backup").setState("bIsNull", true);
    //外包顾问预计进场时间
    viewModel.get("pre_outsource_enter_date").setVisible(false);
    viewModel.get("pre_outsource_enter_date").setState("bIsNull", true);
    //外包顾问实际进场时间
    viewModel.get("pre_consultants_actual_date").setVisible(false);
    viewModel.get("pre_consultants_actual_date").setState("bIsNull", true);
    //销售合同编码
    viewModel.get("pre_contract_code").setVisible(true);
    viewModel.get("pre_contract_code").setState("bIsNull", false);
    //销售合同名称
    viewModel.get("pre_contract_project").setVisible(true);
    viewModel.get("pre_contract_project").setState("bIsNull", false);
    //销售合同金额
    viewModel.get("pre_contract_money").setVisible(true);
    viewModel.get("pre_contract_money").setState("bIsNull", false);
    //销售合同实际签订时间
    viewModel.get("pre_contract_date").setVisible(true);
    viewModel.get("pre_contract_date").setState("bIsNull", false);
    //销售合同预计签订时间
    viewModel.get("pre_contract_plan_date").setVisible(false);
    viewModel.get("pre_contract_plan_date").setState("bIsNull", true);
    //销售合同预计签订金额
    viewModel.get("pre_contract_plan_money").setVisible(false);
    viewModel.get("pre_contract_plan_money").setState("bIsNull", true);
    //累计已签外包合同总金额
    viewModel.get("pre_signed_outsource_mny").setVisible(true);
    viewModel.get("pre_signed_outsource_mny").setState("bIsNull", false);
    //累计已签外包额与主合同额占比
    viewModel.get("pre_signed_outsource_rate").setVisible(true);
    viewModel.get("pre_signed_outsource_rate").setState("bIsNull", false);
  }
}
function setXFSF() {
  debugger;
  let cgfs = viewModel.get("pur_purchase_type").getValue();
  let data = [];
  if (cgfs == "04" || cgfs == "单一来源") {
    data.push({ value: "01", text: "客户指定（有指定函）", nameType: "string" });
    data.push({ value: "02", text: "集团成员间业务往来", nameType: "string" });
    data.push({ value: "03", text: "合同续签", nameType: "string" });
    data.push({ value: "04", text: "战略合作/框架协议", nameType: "string" });
    data.push({ value: "05", text: "专利/行业/涉密/政府指定", nameType: "string" });
    data.push({ value: "06", text: "执行过特批", nameType: "string" });
  } else {
    data.push({ value: "07", text: "线上", nameType: "string" });
    data.push({ value: "08", text: "线下", nameType: "string" });
  }
  viewModel.get("pur_purchase_detail").setDataSource(data);
}
viewModel.get("pur_purchase_type") &&
  viewModel.get("pur_purchase_type").on("afterValueChange", function (data) {
    // 采购方式--值改变后
    debugger;
    setXFSF();
    viewModel.get("pur_purchase_detail").clear();
  });
viewModel.get("pre_bill_type") &&
  viewModel.get("pre_bill_type").on("afterValueChange", function (data) {
    let pre_bill_type = viewModel.get("pre_bill_type").getValue();
    if (pre_bill_type == "2") {
      //外包预投入申请
      viewModel.get("pre_contract_is_signing").setValue(true);
    }
    // 单据类型--值改变后
    initFieldStatus();
  });
viewModel.get("pre_contract_is_signing") &&
  viewModel.get("pre_contract_is_signing").on("afterValueChange", function (data) {
    let pre_contract_is_signing = viewModel.get("pre_contract_is_signing").getValue();
    if (pre_contract_is_signing) {
      //销售合同编码
      viewModel.get("pre_contract_code").setVisible(true);
      viewModel.get("pre_contract_code").setState("bIsNull", false);
      //销售合同名称
      viewModel.get("pre_contract_project").setVisible(true);
      viewModel.get("pre_contract_project").setState("bIsNull", false);
      //销售合同金额
      viewModel.get("pre_contract_money").setVisible(true);
      viewModel.get("pre_contract_money").setState("bIsNull", false);
      //销售合同实际签订时间
      viewModel.get("pre_contract_date").setVisible(true);
      viewModel.get("pre_contract_date").setState("bIsNull", false);
      //销售合同预计签订时间
      viewModel.get("pre_contract_plan_date").setVisible(false);
      viewModel.get("pre_contract_plan_date").setState("bIsNull", true);
      //销售合同预计签订金额
      viewModel.get("pre_contract_plan_money").setVisible(false);
      viewModel.get("pre_contract_plan_money").setState("bIsNull", true);
      //累计已签外包合同总金额
      viewModel.get("pre_signed_outsource_mny").setVisible(true);
      viewModel.get("pre_signed_outsource_mny").setState("bIsNull", false);
      //累计已签外包额与主合同额占比
      viewModel.get("pre_signed_outsource_rate").setVisible(true);
      viewModel.get("pre_signed_outsource_rate").setState("bIsNull", false);
    } else {
      //销售合同编码
      viewModel.get("pre_contract_code").setVisible(false);
      viewModel.get("pre_contract_code").setState("bIsNull", true);
      //销售合同名称
      viewModel.get("pre_contract_project").setVisible(false);
      viewModel.get("pre_contract_project").setState("bIsNull", true);
      //销售合同金额
      viewModel.get("pre_contract_money").setVisible(false);
      viewModel.get("pre_contract_money").setState("bIsNull", true);
      //销售合同实际签订时间
      viewModel.get("pre_contract_date").setVisible(false);
      viewModel.get("pre_contract_date").setState("bIsNull", true);
      //销售合同预计签订时间
      viewModel.get("pre_contract_plan_date").setVisible(true);
      viewModel.get("pre_contract_plan_date").setState("bIsNull", false);
      //销售合同预计签订金额
      viewModel.get("pre_contract_plan_money").setVisible(true);
      viewModel.get("pre_contract_plan_money").setState("bIsNull", false);
      //累计已签外包合同总金额
      viewModel.get("pre_signed_outsource_mny").setVisible(false);
      viewModel.get("pre_signed_outsource_mny").setState("bIsNull", true);
      //累计已签外包额与主合同额占比
      viewModel.get("pre_signed_outsource_rate").setVisible(false);
      viewModel.get("pre_signed_outsource_rate").setState("bIsNull", true);
    }
  });