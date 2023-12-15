viewModel.get("button25gi") &&
  viewModel.get("button25gi").on("click", function (data) {
    // 返回--单击
    viewModel.communication({
      type: "modal",
      payload: {
        data: false
      }
    });
  });
viewModel.on("customInit", function (data) {
  debugger;
  let args = data.__data.params.reqData.data.row;
  viewModel.get("oldArea").setValue(args.oldArea);
  viewModel.get("projectCode").setValue(args.projectCode);
  viewModel.get("projectPrice").setValue(args.projectPrice);
  viewModel.get("custName").setValue(args.custName);
  viewModel.get("sumProgress").setValue(args.sumProgress);
  viewModel.get("receiveMoney").setValue(args.receiveMoney);
  viewModel.get("approval").setValue(args.approval);
  viewModel.get("approvalTime").setValue(args.approvalTime);
  viewModel.get("org_id_id").setValue(args.org_id_id);
  viewModel.get("projectName").setValue(args.projectName);
  viewModel.get("projectStatus").setValue(args.projectStatus);
  viewModel.get("industry").setValue(args.industry);
  viewModel.get("sumRights").setValue(args.sumRights);
  viewModel.get("sumReceiveMoney").setValue(args.sumReceiveMoney);
});