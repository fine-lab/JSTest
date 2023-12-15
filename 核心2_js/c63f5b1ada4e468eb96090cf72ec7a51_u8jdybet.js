//详情列表条件过滤
function invokeFunc(funcName, ayc = false) {
  var d = cb.rest.invokeFunction(
    funcName,
    {},
    function (err, res) {
      alert(funcName + "调用错误:" + res);
    },
    viewModel,
    { async: ayc }
  );
  console.log("invokeFunc=-------------------------");
  console.log(d);
  return d.result.result;
}
var reSetDataSource = 0;
viewModel.on("beforeSearch", function (args) {
});
viewModel.on("customInit", function (data) {
  console.log("customInit----------------------");
  console.log(data);
});
viewModel.on("afterLoadMeta", function (data) {
  console.log("afterLoadMeta----------------------");
  console.log(data);
});
viewModel.on("afterLoadData", function (data) {
  console.log("afterLoadData ----------------------");
  console.log(data);
});
viewModel.on("beforeGridLoad", function (data) {
  console.log("beforeGridLoad ----------------------");
  console.log(data);
});
viewModel.on("afterMount", function (data) {
  console.log("afterMount----------------------");
  console.log(data);
  viewModel.getGridModel().setState("dataSourceMode", "local");
});
viewModel.get("button24ej") &&
  viewModel.get("button24ej").on("click", function (data) {
    // 跳转详情--单击
    let data1 = {
      billtype: "Voucher", // 单据类型
      billno: "67eb925b", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "edit", // (卡片页面区分编辑态edit、新增态add、)
        id: "youridHere" //TODO:填写详情id
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
viewModel.get("button38bb") &&
  viewModel.get("button38bb").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("button38hf") &&
  viewModel.get("button38hf").on("click", function (data) {
    // 隐藏按钮--单击
    console.log("隐藏表格按钮!");
  });
viewModel.on("customInit", function (data) {
  // 客户档案管理--页面初始化
});
viewModel.get("merchant_1638244073239216129") &&
  viewModel.get("merchant_1638244073239216129").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    console.log("beforeSetDataSource-----------");
    console.log(data);
    var gmData = invokeFunc("AT16AFB85C09A00002.API.getData");
    viewModel.get("item126bg").setValue(gmData.length);
    gmData.forEach((it) => {
      data.push(it);
    });
  });
viewModel.get("merchant_1638244073239216129") &&
  viewModel.get("merchant_1638244073239216129").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    console.log("afterSetDataSource-----------");
    let result = invokeFunc("AT16AFB85C09A00002.API.getOrg");
    let ke = JSON.parse(result).data[cb.context.getUserId()].deptName;
    if (ke == "数据课") {
      //不是数据课隐藏编辑按钮
      const rows = this.getRows();
      const actions = this.getCache("actions"); //从缓存区获取按钮
      if (!actions) return;
      const actionsStates = [];
      rows.forEach((data) => {
        const actionState = {};
        actions.forEach((action) => {
          //设置按钮可用不可用
          actionState[action.cItemName] = { visible: true };
          if (action.cItemName == "btnEdit" || action.cItemName == "btnDelete") {
            actionState[action.cItemName] = { visible: false };
          }
        });
        actionsStates.push(actionState);
      });
      setTimeout(() => {
        this.setActionsState(actionsStates);
      }, 50);
    }
  });
viewModel.get("button65mg") &&
  viewModel.get("button65mg").on("click", function (data) {
    // 按钮--单击
    let result = invokeFunc("AT16AFB85C09A00002.API.deleteData");
    alert(result);
  });