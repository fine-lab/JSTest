//加载自定义样式
function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  headobj.appendChild(style);
  style.sheet.insertRule(params, 0);
}
//加载样式
loadStyle(".myhide {display:none;}");
// 库存状态:0入库未上架-分配完标签后的状态 1在库正常 2停用 3标签损坏-1删除 4拣货 5配货 6发货 7补签
function getStatusEPC(i) {
  const status_epc = ["发签", "在库正常", "停用", "标签损坏", "拣货", "配货", "发货", "补签"];
  if (status_epc.length - 1 - i < 0) return i;
  else return status_epc[i];
}
function getStatusSplit(i) {
  if (i == 0) return "否";
  else return "是";
}
//设置布局的隐藏显示
function setlayoutDisplay(cGroupCode, boolean) {
  viewModel.execute("updateViewMeta", { code: cGroupCode, visible: boolean });
}
// 加载全局配置Idx3.BaseConfig.baseConfig == 754087d70f0b45b3b6b60ebb0f899ea1
let resConfig = cb.rest.invokeFunction("Idx3.BaseConfig.baseConfig", {}, function (err, res) {}, viewModel, { async: false });
console.log("[加载全局配置]" + JSON.stringify(resConfig));
// 数据初始化
viewModel.on("customInit", function (data) {
  console.log("[customInit]");
  let { mode, billType, billNo, butReturn } = viewModel.getParams();
  console.log(butReturn === true);
  if (butReturn) {
    console.log(JSON.stringify("butReturn"));
    setlayoutDisplay("toolbar8rg", true); //底部栏显示
    viewModel.get("button21kb") && viewModel.get("button21kb").setVisible(true);
  } else {
    setlayoutDisplay("toolbar8rg", false); //底部栏显示
    viewModel.get("button21kb") && viewModel.get("button21kb").setVisible(false);
  }
  var gridModel = viewModel.get("dxq_coderfid_1630320039295975432");
  gridModel.setShowCheckbox(false); //主表去掉checkbox
  gridModel._set_data("forbiddenDblClick", true); //主表去掉双击事件
});
viewModel.on("afterMount", function (args) {
  console.log("[afterMount]" + JSON.stringify(args));
  setlayoutDisplay("toolbar8rg", true); //底部栏显示
});
// 增加默认过滤
viewModel.on("beforeSearch", function (args) {
  var reqParams = viewModel.getParams().reqParams;
  console.log(JSON.stringify(reqParams));
  args.isExtend = true;
  var commonVOs = args.params.condition.commonVOs; //通用检查查询条件
  console.log(JSON.stringify(commonVOs));
  commonVOs.push({
    itemName: "RFIDStatus",
    op: "neq",
    value1: 7
  });
  console.log(typeof reqParams.locationID);
  let myconditions = [
    {
      field: "productID",
      op: "eq",
      value1: reqParams.product_id
    },
    {
      field: "productSkuName",
      op: "eq",
      value1: reqParams.product_sku_name
    },
    {
      field: "warehouseID",
      op: "eq",
      value1: reqParams.warehouseID
    }
  ];
  if (typeof reqParams.locationID != "undefined") {
    myconditions.push({
      field: "locationID",
      op: "eq",
      value1: reqParams.locationID
    });
  }
  console.log(JSON.stringify(myconditions));
  //复杂查询
  args.params.condition.simpleVOs = [
    {
      logicOp: "and",
      conditions: myconditions
    }
  ];
});
//设置表格数据前事件 data为grid数据格式
viewModel.getGridModel().on("beforeSetDataSource", function (data) {
  data.forEach((item) => {
    item.fMoveCount = typeof item.fMoveCount == "undefined" ? 0 : item.fMoveCount;
    item.fOutCount = typeof item.fOutCount == "undefined" ? 0 : item.fOutCount;
    item.isSplit = getStatusSplit(item.isSplit);
    item.RFIDStatus = getStatusEPC(item.RFIDStatus);
  });
  //返回true为允许设置grid数据，返回false为终止设置数据
  return true;
});
let gridModel = viewModel.getGridModel();
gridModel.on("afterSetDataSource", () => {
  //获取列表所有数据
  const rows = gridModel.getRows();
  console.log(JSON.stringify(rows[0]));
  //从缓存区获取按钮
  const actions = gridModel.getCache("actions");
  if (!actions) return;
  const actionsStates = [];
  rows.forEach((data) => {
    const actionState = {};
    actions.forEach((action) => {
      //设置按钮可用不可用
      actionState[action.cItemName] = { visible: false };
    });
    actionsStates.push(actionState);
  });
  setTimeout(function () {
    gridModel.setActionsState(actionsStates);
  }, 50);
});
//关闭模态框
viewModel.get("button21kb") &&
  viewModel.get("button21kb").on("click", function (data) {
    // 返回--单击
    viewModel.communication({ type: "modal", payload: { data: false } }); //关闭模态框
  });