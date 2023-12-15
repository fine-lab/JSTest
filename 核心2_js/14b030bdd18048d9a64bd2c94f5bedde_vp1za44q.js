viewModel.get("button24cf") &&
  viewModel.get("button24cf").on("click", function (data) {
    debugger;
    // 下推请购单
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const datum = gridModel.getSelectedRows();
    if (datum.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    for (var i = 0; i < datum.length; i++) {
      var result = datum[i];
      var ids = result.id;
      var pduan = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.selstatusupdate", { idss: ids }, function (err, res) {}, viewModel, { async: false });
      var allZT = pduan.result != undefined ? pduan.result.zt : undefined;
      if (allZT == "1") {
        cb.utils.alert(" --" + ids + "已经下推到采购单,请勿再推 -- ");
      } else {
        var ReturnValue = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.PushPurchase", { id: ids }, function (err, res) {}, viewModel, { async: false });
        var codess = ReturnValue.result.clAll != undefined ? ReturnValue.result.clAll.code : undefined;
        if (codess == "200") {
          cb.utils.alert(" --" + ids + " 推送请购单成功 -- ");
          var ReturnValueTwo = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.statusupdate", { idss: ids }, function (err, res) {}, viewModel, { async: false });
        } else {
          cb.utils.alert(" -- 推送数据到请购单推送失败 -- ");
          return;
        }
      }
    }
  });
viewModel.get("button23td") &&
  viewModel.get("button23td").on("click", function (data) {
    // 下推按钮--单击
    debugger;
    // 下推请购单
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const datum = gridModel.getSelectedRows();
    if (datum.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    for (var i = 0; i < datum.length; i++) {
      var result = datum[i];
      var ids = result.id;
      var pduan = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.selstatusupdate", { idss: ids }, function (err, res) {}, viewModel, { async: false });
      var allZT = pduan.result != undefined ? pduan.result.zt : undefined;
      if (allZT == "1") {
        cb.utils.alert(" --" + ids + "已经下推到采购单,请勿再推 -- ");
      } else {
        var ReturnValue = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.PushPurchase", { id: ids }, function (err, res) {}, viewModel, { async: false });
        var codess = ReturnValue.result.clAll != undefined ? ReturnValue.result.clAll.code : undefined;
        if (codess == "200") {
          cb.utils.alert(" --" + ids + " 推送请购单成功 -- ");
          var ReturnValueTwo = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.statusupdate", { idss: ids }, function (err, res) {}, viewModel, { async: false });
        } else {
          cb.utils.alert(" -- 推送数据到请购单推送失败 -- ");
          return;
        }
      }
    }
  });
viewModel.get("button28mh") &&
  viewModel.get("button28mh").on("click", function (data) {
    // 按钮--单击
    // 下推按钮--单击
    debugger;
    // 下推请购单
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const datum = gridModel.getSelectedRows();
    if (datum.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    for (var i = 0; i < datum.length; i++) {
      var result = datum[i];
      var ids = result.id;
      var pduan = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.selstatusupdate", { idss: ids }, function (err, res) {}, viewModel, { async: false });
      var allZT = pduan.result != undefined ? pduan.result.zt : undefined;
      if (allZT == "1") {
        cb.utils.alert(" --" + ids + "已经下推到采购单,请勿再推 -- ");
      } else {
        var ReturnValue = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.PushPurchase", { id: ids }, function (err, res) {}, viewModel, { async: false });
        var codess = ReturnValue.result.clAll != undefined ? ReturnValue.result.clAll.code : undefined;
        if (codess == "200") {
          cb.utils.alert(" --" + ids + " 推送请购单成功 -- ");
          var ReturnValueTwo = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.statusupdate", { idss: ids }, function (err, res) {}, viewModel, { async: false });
        } else {
          cb.utils.alert(" -- 推送数据到请购单推送失败 -- ");
          return;
        }
      }
    }
  });