viewModel.on("customInit", function (data) {
  // 删除行前修改重复行号
  viewModel.getGridModel().on("afterDeleteRows", function (rows) {});
  viewModel.getGridModel().on("beforeInsertRow", function (data) {});
  viewModel.getGridModel().on("afterInsertRow", function (data) {});
  viewModel.on("afterDelete", function (args) {});
  // 审核后
  viewModel.on("beforeWorkflow", function (args) {
  });
  viewModel.on("afterSave", function (args) {});
  // 获取记录主表
  function getMaintable(id) {
    var promise = new cb.promise();
    var table = "GT3AT33.GT3AT33.test_HistoryUserRole";
    var conditions = { id };
    cb.rest.invokeFunction("GT34544AT7.common.selectSqlByMapX", { table, conditions }, function (err, res) {
      if (res) {
        promise.resolve(res);
      } else {
        promise.reject(err);
      }
    });
    return promise;
  }
  // 获取记录子表
  function getChildtable(id) {
    var promise = new cb.promise();
    var table = "GT3AT33.GT3AT33.test_HistoryOrg_UserRole";
    var conditions = { id };
    cb.rest.invokeFunction("GT34544AT7.common.selectSqlByMapX", { table, conditions }, function (err, res) {
      if (res) {
        promise.resolve(res);
      } else {
        promise.reject(err);
      }
    });
    return promise;
  }
  cb.rest.invokeFunction("GT3AT33.utils.isGXY", {}, function (err, res) {
    if (!cb.utils.isEmpty(err)) {
      viewModel.get("item1004cc").setValue(false);
    } else {
      viewModel.get("item1004cc").setValue(res.res);
    }
  });
});
viewModel.get("button19yi") &&
  viewModel.get("button19yi").on("click", function (data) {
    // 保存--单击
    var btn = viewModel.get("btnSave");
    btn.execute("click");
  });
viewModel.get("button27lb") &&
  viewModel.get("button27lb").on("click", function (data) {
    // 刷新--单击
    viewModel.execute("refresh");
  });