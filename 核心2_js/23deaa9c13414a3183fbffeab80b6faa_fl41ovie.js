viewModel.on("customInit", function (data) {
  // 合同起草详情--页面初始化
  viewModel.on("beforeSave", function (args) {
    let rows = viewModel.get("htxdfxxList").getData();
    let xiangduifangshuxing = "",
      _status = "";
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].xiangduifangshuxing != null && rows[i].xiangduifangshuxing == "1" && rows[i]._status != "Delete") {
        xiangduifangshuxing = "1";
      }
    }
    if (xiangduifangshuxing == "1") {
      return true;
    } else {
      cb.utils.alert("相对方必须有一个是内部单位！", "error");
      return false;
    }
  });
});
viewModel.get("button55od") &&
  viewModel.get("button55od").on("click", function (data) {
    // 暂存--单击
  });
viewModel.get("button56tf") &&
  viewModel.get("button56tf").on("click", function (data) {
    // 提交--单击
  });
viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    // 保存--单击
  });
//子表默认两行
viewModel.on("afterLoadData", function (data) {
  debugger;
  if (viewModel.getParams().mode == "add") {
    var girdModel = viewModel.getGridModel("htxdfxxList");
    girdModel.appendRow({});
    girdModel.appendRow({});
  }
  cb.rest.invokeFunction("GT1577AT358.api.getUserOrg", {}, function (err, res) {
    debugger;
    var dept1 = res.dept[0].b_id;
    var dept2 = res.dept[0].b_name;
    if (viewModel.get("hetongchengbanbumen_name").getValue() == undefined) {
      viewModel.get("hetongchengbanbumen_name").setValue(dept2);
      viewModel.get("hetongchengbanbumen").setValue(dept1);
    }
    var userid = res.userid;
    var username = res.username;
    if (viewModel.get("jingbanren_name").getValue() == undefined) {
      viewModel.get("jingbanren_name").setValue(username);
      viewModel.get("jingbanren").setValue(userid);
    }
  });
});