const params = viewModel.getParams();
viewModel.on("afterLoadData", function (args) {
  let perData = params.perData[0];
  console.log(JSON.stringify(perData));
  viewModel.get("accentity_name").setValue("高尓夫尊（北京）科技有限公司"); //会计主体
  viewModel.get("accentity").setValue("2704297801996032"); // 会计主体id
  viewModel.get("description").setValue(perData.remark); //  备注
  viewModel.get("customer_name").setValue(perData.client_name); //客户名称
  viewModel.get("customer").setValue(perData.client); //客户id
  viewModel.get("headfree!define4").setValue(perData.bank); //付款银行
  viewModel.get("headfree!define3").setValue(perData.account); //收款银行
  viewModel.get("oriSum").setValue(perData.amount); //付款金额
  viewModel.get("natSum").setValue(perData.amount); //本币金额
  viewModel.get("balance").setValue(perData.amount); //余额
  viewModel.get("headfree!define2").setValue("门店会员卡"); //付款内容
  viewModel.get("enterprisebankaccount_code").setValue(perData.code); //付款银行账户编码
  viewModel.get("enterprisebankaccount_name").setValue("企业银行"); //付款银行账户
  viewModel.get("enterprisebankaccount").setValue("1529985857730117646"); //付款银行账户id
  viewModel.get("headItem!define4_name").setValue("保证金"); //付款内容凭证11
  viewModel.get("headItem!define4").setValue("1638425630111432711"); //付款内容凭证id
  viewModel.get("dept_name").setValue("财务部"); //部门
  viewModel.get("operator_name").setValue("姜留刚"); //业务员
  viewModel.get("operator").setValue("2707390514188544"); //业务员id
  let gridModel = viewModel.get("PayBillb");
  let iCurRows = gridModel.getRows();
  if (iCurRows.length > 0) {
    let rowArr = new Array();
    for (let i = 0; i <= iCurRows.length; i++) {
      rowArr.push(i);
    }
    gridModel.deleteRows(rowArr);
  }
  let rowItem = {
    quickType_name: "预收款",
    quickType: "2703355119081067",
    oriSum: perData.amount,
    natSum: perData.amount,
    dept_name: "财务部"
  };
  gridModel.insertRow(1, rowItem);
});