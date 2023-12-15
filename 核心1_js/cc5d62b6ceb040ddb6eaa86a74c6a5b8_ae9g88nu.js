// 发货单生单列表--页面初始化
viewModel.on("customInit", function (data) {
  let extendGspTypeBool = (extendGspType) => {
    if (extendGspType === true || extendGspType == "true" || extendGspType == "1") {
      return true;
    } else {
      return false;
    }
  };
  // 发货单生单列表--页面初始化
  viewModel.on("afterMount", function () {
    //出库按钮添加点击前事件
    viewModel.on("beforeBatchpush", function (a, b, c) {
      let rows = viewModel.getGridModel().getSelectedRows();
      let rowGspSet = new Set();
      for (let i = 0; i < rows.length; i++) {
        if (extendGspTypeBool(rows[i].extendGspType)) {
          rowGspSet.add("1");
        } else {
          rowGspSet.add("2");
        }
      }
      if (rowGspSet.size > 1) {
        cb.utils.alert("GSP和非GSP发货单不允许同时出库", "error");
        return false;
      }
      if (rowGspSet.has("1") && rows.length > 1) {
        cb.utils.alert("GSP发货单不允许批次拉取", "error");
        return false;
      }
      //判断GSP单据是否符合拉单条件
      if (rowGspSet.has("1")) {
        let selectedRecord = viewModel.getGridModel().getSelectedRows()[0];
        let id = selectedRecord.id;
        let code = selectedRecord.code;
        //检查累计复核数量是否等于发货数量，如果不等于则下推出库报错，提示需要进行出库复核。
        let returnPromise = new cb.promise();
        cb.rest.invokeFunction("SCMSA.deliveryBackFuncion.pushCheck", { id: id, code: code, type: 1 }, function (err, res) {
          if (err) {
            cb.utils.alert("系统错误,请联系管理员！", "error");
            console.error(err.message);
            returnPromise.reject();
          } else if (res.errInfo && res.errInfo.length > 0) {
            cb.utils.alert(res.errInfo, "error");
            returnPromise.reject();
          } else {
            returnPromise.resolve();
          }
        });
        return returnPromise;
      } else {
        return true;
      }
    });
  });
});