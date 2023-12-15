viewModel.on("customInit", function (data) {
  // 外包资源反馈单详情--页面初始化
  viewModel.on("afterLoadData", function () {
    //当前页面状态
    var currentState = viewModel.getParams().mode; //add:新增态，edit:编辑态, browse:浏览态
    if (currentState == "add") {
      //新增状态
      //主组织默认值
      let staffRes = cb.rest.invokeFunction("GT5258AT16.pubFunction.getStaffByUserId", {}, function (err, res) {}, viewModel, { async: false });
      let staff = staffRes.result;
      if (staff && staff.code === "200" && staff.data && staff.data.data && staff.data.data.length > 0) {
        let staffData = staff.data.data[0];
        viewModel.get("org_id").setValue(staffData.org_id);
        viewModel.get("org_id_name").setValue(staffData.org_id_name);
      }
    }
    if (currentState == "add" || currentState == "edit") {
      viewModel.get("button44rj").setVisible(false);
      viewModel.get("button60lj").setVisible(false);
      viewModel.get("button72li").setVisible(false);
    } else {
      viewModel.get("button44rj").setVisible(true);
      viewModel.get("button60lj").setVisible(true);
      viewModel.get("button72li").setVisible(true);
    }
  });
  //设置保存前校验
  viewModel.on("beforeSave", function (args) {
    var responseStatus = viewModel.get("responseStatus").getValue();
    var refuseReason = viewModel.get("refuseReason").getValue();
    var resonDetail = viewModel.get("resonDetail").getValue();
    debugger;
    if (responseStatus == "1") {
      cb.utils.alert("请重新选择响应状态！");
      return false;
    }
    if (responseStatus == "3") {
      if (refuseReason.length == 0) {
        cb.utils.alert("请选择放弃原因！");
        return false;
      }
      if (refuseReason.includes("5") && (resonDetail == null || resonDetail == "")) {
        cb.utils.alert("请填写其他原因！");
        return false;
      }
    }
  });
});
viewModel.get("button44rj") &&
  viewModel.get("button44rj").on("click", function (data) {
    var id = viewModel.get("id").getValue();
    var isClose = viewModel.get("isClose").getValue();
    if (isClose == "Y") {
      cb.utils.alert("该项目已终止，无法反馈！");
      return;
    }
    // 响应--单击
    cb.utils.confirm(
      "响应确认",
      function () {
        let wres = cb.rest.invokeFunction("GT5258AT16.wbzyytd.writeBackApply", { id: id, responseStatus: "2" }, function (err, res) {}, viewModel, { async: false });
        console.log(wres);
        cb.utils.alert("反馈完成");
        viewModel.execute("refresh");
      },
      function (args) {}
    );
  });
viewModel.get("button60lj") &&
  viewModel.get("button60lj").on("click", function (data) {
    var id = viewModel.get("id").getValue();
    var isClose = viewModel.get("isClose").getValue();
    var refuseReason = viewModel.get("refuseReason").getValue();
    var resonDetail = viewModel.get("resonDetail").getValue();
    if (isClose == "Y") {
      cb.utils.alert("该项目已终止，无法反馈！");
      return;
    }
    if (!refuseReason || refuseReason.length < 1 || (refuseReason.length == 1 && refuseReason.includes(""))) {
      cb.utils.alert("请先填写放弃原因！");
      return;
    }
    if (refuseReason.includes("5") && (resonDetail == null || resonDetail == "")) {
      cb.utils.alert("请填写其他原因！");
      return;
    }
    // 拒绝--单击
    cb.utils.confirm(
      "放弃确认",
      function () {
        let wres = cb.rest.invokeFunction("GT5258AT16.wbzyytd.writeBackApply", { id: id, responseStatus: "3" }, function (err, res) {}, viewModel, { async: false });
        console.log(wres);
        cb.utils.alert("反馈完成");
        viewModel.execute("refresh");
      },
      function (args) {}
    );
  });
viewModel.get("button72li") &&
  viewModel.get("button72li").on("click", function (data) {
    var id = viewModel.get("id").getValue();
    var isClose = viewModel.get("isClose").getValue();
    if (isClose == "Y") {
      cb.utils.alert("该项目已终止，无法反馈！");
      return;
    }
    // 沟通--单击
    cb.utils.confirm(
      "沟通确认",
      function () {
        let wres = cb.rest.invokeFunction("GT5258AT16.wbzyytd.writeBackApply", { id: id, responseStatus: "4" }, function (err, res) {}, viewModel, { async: false });
        console.log(wres);
        cb.utils.alert("反馈完成");
        viewModel.execute("refresh");
      },
      function (args) {}
    );
  });