viewModel.getGridModel("expensebillbs").on("afterInsertRow", function (data) {
  var tplid = viewModel.originalViewMeta.view.iTplId;
  if (tplid && (tplid == "1556866675283853315" || tplid == "1523265969300439040")) {
    let value = viewModel.get("pk_handlepsn").getValue();
    let param = {
      def1: value
    };
    cb.rest.invokeFunction("RBSM.backDesignerFunction.findLimit", param, function (err, res) {
      if (res && res.res && res.res.length > 0) {
        viewModel.get("expensebilluserdefs!define2").setValue(res.res[0].Def5);
      } else {
        cb.utils.alert("没有查询到审批通过的话费限额申请，请先进行话费限额申请");
      }
    });
  }
});
viewModel.getGridModel("expensebillbs").on("afterInsertRows", function (data) {
  var tplid = viewModel.originalViewMeta.view.iTplId;
  if (tplid && (tplid == "1556866675283853315" || tplid == "1523265969300439040")) {
    let value = viewModel.get("pk_handlepsn").getValue();
    let param = {
      def1: value
    };
    cb.rest.invokeFunction("RBSM.backDesignerFunction.findLimit", param, function (err, res) {
      if (res && res.res && res.res.length > 0) {
        viewModel.get("expensebilluserdefs!define2").setValue(res.res[0].Def5);
      } else {
        cb.utils.alert("没有查询到审批通过的话费限额申请，请先进行话费限额申请");
      }
    });
  }
});
viewModel.get("pk_handlepsn_name").on("afterValueChange", function (data) {
  // 报销人--值改变后
  var tplid = viewModel.originalViewMeta.view.iTplId;
  if (tplid && (tplid == "1556866675283853315" || tplid == "1523265969300439040")) {
    if (data.value) {
      let param = {
        def1: data.value.id
      };
      cb.rest.invokeFunction("RBSM.backDesignerFunction.findLimit", param, function (err, res) {
        if (res && res.res && res.res.length > 0) {
          viewModel.get("expensebilluserdefs!define2").setValue(res.res[0].Def5);
        } else {
          cb.utils.alert("没有查询到审批通过的话费限额申请，请先进行话费限额申请");
        }
      });
    } else {
      viewModel.get("expensebilluserdefs!define2").setValue("");
    }
  }
});
viewModel.on("beforeSave", function (data) {
  var tplid = viewModel.originalViewMeta.view.iTplId;
  if (tplid && (tplid == "1556866675283853315" || tplid == "1523265969300439040")) {
    let value = viewModel.get("expensebilluserdefs!define2").getValue();
    if (!value || value == "" || value == null) {
      cb.utils.alert("没有查询到审批通过的话费限额申请，请先进行话费限额申请");
      return false;
    }
  }
});