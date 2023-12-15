viewModel.on("afterLoadData", (args) => {
  let userId = cb.context.getUserId();
  let tenantId = cb.context.getTenantId();
  let result = cb.rest.invokeFunction("AT186845D616E80006.backDesignerFunction.getStaffInfo", { userId: userId, tenantId: tenantId }, function (err, res) {}, viewModel, { async: false });
  if (result && result.result) {
    let staffId = result.result.staffId;
    cb.utils.triggerReferBrowse(viewModel.get("cehuaren_name"), [{ field: "id", op: "eq", value1: staffId }]);
  } else {
    cb.utils.alert("获取员工信息失败或者当前用户为绑定员工身份", "error");
  }
});
viewModel.get("button33xh") &&
  viewModel.get("button33xh").on("click", function (data) {
    //任务详情--单击
    let sourcechild_idt = data.id4ActionAuth; //"1810031821756825603";
    let result = cb.rest.invokeFunction("AT186845D616E80006.backDesignerFunction.getTargetId", { sId: sourcechild_idt }, function (err, res) {}, viewModel, { async: false });
    let targetId = result.result.res[0].id;
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "Voucher", //voucherList 单据类型
        billno: "xsrwzx666", //单据编号
        params: {
          mode: "edit", //编辑状态
          readOnly: true, //只读
          id: targetId //"1810032843927060488" //目标单据id
        }
      },
      viewModel
    );
  });