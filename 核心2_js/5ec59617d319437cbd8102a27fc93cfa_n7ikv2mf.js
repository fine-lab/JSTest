viewModel.on("customInit", function (data) {
  // 伙伴增量业务销售备案详情--页面初始化
  function formatDate(date) {
    var month = date.getMonth() + 1;
    return date.getFullYear() + "-" + month + "-" + date.getDate();
  }
  viewModel.on("afterLoadData", function () {
    //当前页面状态
    var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
    if (currentState == "add") {
      //新增状态
      viewModel.get("makeDate").setValue(formatDate(new Date()));
      //主组织默认值
      let staffRes = cb.rest.invokeFunction("GT5258AT16.pubFunction.getStaffByUserId", {}, function (err, res) {}, viewModel, { async: false });
      let staff = staffRes.result;
      if (staff && staff.code === "200" && staff.data && staff.data.data && staff.data.data.length > 0) {
        let staffData = staff.data.data[0];
        viewModel.get("org_id").setValue(staffData.org_id);
        viewModel.get("org_id_name").setValue(staffData.org_id_name);
        viewModel.get("orgName").setValue(staffData.org_id_name);
        viewModel.get("linkMan").setValue(staffData.id);
        viewModel.get("linkMan_name").setValue(staffData.name);
        if (staffData.mobile) {
          viewModel.get("mobile").setValue(staffData.mobile.split("-")[1]);
        }
      }
    }
  });
});