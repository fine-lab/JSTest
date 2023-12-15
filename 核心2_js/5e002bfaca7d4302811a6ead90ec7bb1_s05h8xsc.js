viewModel.on("afterRule", function (args) {
  debugger;
  setDataValue(viewModel);
});
viewModel.on("afterBuildCode", function (args) {
  debugger;
  setDataValue(viewModel);
});
viewModel.on("afterProcessWorkflow", function (args) {
  debugger;
  setDataValue(viewModel);
});
viewModel.get("schemeName") &&
  viewModel.get("schemeName").on("afterReferOkClick", function (data) {
    //预算编制方案--参照弹窗确认按钮点击后
    debugger;
    setDataValue(viewModel);
  });
viewModel.get("memo") &&
  viewModel.get("memo").on("blur", function (data) {
    //备注--失去焦点的回调
    debugger;
    setDataValue(viewModel);
  });
function setDataValue(viewModel) {
  debugger;
  //获取商机的id
  let sjId = viewModel.originalParams.parentParams.id;
  //获取材料成本小计
  let clAmount = viewModel.originalParams.parentParams.billData["defines!define1"];
  //获取分包成本小计
  let fbAmount = viewModel.originalParams.parentParams.billData["defines!define2"];
  //获取其他成本小计
  let otherAmount = viewModel.originalParams.parentParams.billData["defines!define3"];
  console.log("otherAmount==========", otherAmount);
  viewModel.get("defines!define2").setValue(otherAmount, true);
  viewModel.get("defines!define3").setValue(fbAmount, true);
  viewModel.get("defines!define4").setValue(clAmount, true);
  let gridDataListTwo = viewModel.getTreeModel();
  gridDataListTwo.on("afterSetColumns", (data) => {
    let keyMap = gridDataListTwo?.get("keyMap");
    console.log("keyMap===", keyMap);
    let updateNodes = [];
    Object.keys(keyMap).forEach((rowKey) => {
      let thisNode = keyMap[rowKey];
      let aaa = thisNode["subjectCode"];
      if (thisNode["subjectCode"] == "xmclfy03") {
        thisNode["budgetMny"] = clAmount;
      } else if (thisNode["subjectCode"] == "xmfbfy03") {
        thisNode["budgetMny"] = fbAmount;
      } else if (thisNode["subjectCode"] == "xmqtfy03") {
        thisNode["budgetMny"] = otherAmount;
      }
      updateNodes.push(thisNode); //将修改后的行数据push进去
    });
    //一定要用updateNodes批量更新 要不然行多了会有性能问题
    if (updateNodes && updateNodes.length > 0) {
      gridDataListTwo.updateNodes(updateNodes);
    }
  });
}
viewModel.get("defines!define2").on("afterValueChange", function (data) {
  console.log(data.value);
  let gridDataListTwo = viewModel.getTreeModel();
  let keyMap = gridDataListTwo?.get("keyMap");
  let updateNodes = [];
  Object.keys(keyMap).forEach((rowKey) => {
    let thisNode = keyMap[rowKey];
    if (thisNode["subjectCode"] == "xmqtfy03") {
      thisNode["budgetMny"] = data.value;
    }
    updateNodes.push(thisNode); //将修改后的行数据push进去
  });
  //一定要用updateNodes批量更新  要不然行多了会有性能问题
  if (updateNodes && updateNodes.length > 0) {
    gridDataListTwo.updateNodes(updateNodes);
  }
});
viewModel.get("defines!define3").on("afterValueChange", function (data) {
  console.log(data);
  let gridDataListTwo = viewModel.getTreeModel();
  let keyMap = gridDataListTwo?.get("keyMap");
  let updateNodes = [];
  Object.keys(keyMap).forEach((rowKey) => {
    let thisNode = keyMap[rowKey];
    if (thisNode["subjectCode"] == "xmfbfy03") {
      thisNode["budgetMny"] = data.value;
    }
    updateNodes.push(thisNode); //将修改后的行数据push进去
  });
  //一定要用updateNodes批量更新  要不然行多了会有性能问题
  if (updateNodes && updateNodes.length > 0) {
    gridDataListTwo.updateNodes(updateNodes);
  }
});
viewModel.get("defines!define4").on("afterValueChange", function (data) {
  console.log(data);
  let gridDataListTwo = viewModel.getTreeModel();
  let keyMap = gridDataListTwo?.get("keyMap");
  let updateNodes = [];
  Object.keys(keyMap).forEach((rowKey) => {
    let thisNode = keyMap[rowKey];
    let aaa = thisNode["subjectCode"];
    if (thisNode["subjectCode"] == "xmclfy03") {
      thisNode["budgetMny"] = data.value;
    }
    updateNodes.push(thisNode); //将修改后的行数据push进去
  });
  //一定要用updateNodes批量更新  要不然行多了会有性能问题
  if (updateNodes && updateNodes.length > 0) {
    gridDataListTwo.updateNodes(updateNodes);
  }
});