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
//如果是新增态 默认这个预算方案
if (viewModel.getParams().mode == "add") {
  viewModel.get("schemeId").setValue("1809026747616198663", true);
  viewModel.get("schemeName").setValue("分包服务类项目预算方案", true);
}
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
function isInteger(obj) {
  return Math.floor(obj) === obj;
}
function toInteger(floatNum) {
  if (isNaN(floatNum)) {
    return false;
  }
  floatNum = parseFloat(floatNum);
  var ret = { times: 1, num: 0 };
  if (isInteger(floatNum)) {
    ret.num = floatNum;
    return ret;
  }
  var strfi = floatNum + "";
  var dotPos = strfi.indexOf(".");
  var len = strfi.substr(dotPos + 1).length;
  var times = Math.pow(10, len);
  var intNum = parseInt((floatNum * times).toFixed(2), 10);
  ret.times = times;
  ret.num = intNum;
  return ret;
}
function operation(a, b, op) {
  a = a == null ? 0 : a.toString().trim();
  b = b == null ? 0 : b.toString().trim();
  var o1 = toInteger(a);
  var o2 = toInteger(b);
  var n1 = o1.num;
  var n2 = o2.num;
  var t1 = o1.times;
  var t2 = o2.times;
  var max = t1 > t2 ? t1 : t2;
  var result = null;
  switch (op) {
    case "add":
      if (t1 === t2) {
        // 两个小数位数相同
        result = n1 + n2;
      } else if (t1 > t2) {
        result = n1 + n2 * (t1 / t2);
      } else {
        result = n1 * (t2 / t1) + n2;
      }
      return result / max;
    case "subtract":
      if (t1 === t2) {
        result = n1 - n2;
      } else if (t1 > t2) {
        result = n1 - n2 * (t1 / t2);
      } else {
        result = n1 * (t2 / t1) - n2;
      }
      return result / max;
    case "multiply":
      result = (n1 * n2) / (t1 * t2);
      return result;
    case "divide":
      result = (n1 / n2) * (t2 / t1);
      return result;
  }
}
// 加减乘除的四个接口
function add(a, b) {
  return operation(a, b, "add");
}
function subtract(a, b) {
  return operation(a, b, "subtract");
}
function multiply(a, b) {
  return operation(a, b, "multiply");
}
function divide(a, b) {
  return operation(a, b, "divide");
}
function setDataValue(viewModel) {
  //获取商机的id
  let sjId = viewModel.originalParams.parentParams.id;
  //获取材料成本小计
  let clAmount = viewModel.originalParams.parentParams.billData["defines!define1"];
  //获取分包成本小计
  let fbAmount = viewModel.originalParams.parentParams.billData["defines!define2"];
  //获取其他成本小计
  let otherAmount = viewModel.originalParams.parentParams.billData["defines!define3"];
  if (clAmount == null || clAmount == undefined || clAmount == "") {
    clAmount = 0;
  }
  if (fbAmount == null || fbAmount == undefined || fbAmount == "") {
    fbAmount = 0;
  }
  if (otherAmount == null || otherAmount == undefined || otherAmount == "") {
    otherAmount = 0;
  }
  let budgetMny = add(add(otherAmount, fbAmount), clAmount);
  console.log("otherAmount==========", budgetMny);
  viewModel.get("budgetMny").setValue(budgetMny, true);
  viewModel.get("defines!define2").setValue(otherAmount, true);
  viewModel.get("defines!define3").setValue(fbAmount, true);
  viewModel.get("defines!define4").setValue(clAmount, true);
  let gridDataListTwo = viewModel.getTreeModel();
  let keyMap = gridDataListTwo?.get("keyMap");
  console.log("keyMap===", keyMap);
  let updateNodes = [];
  Object.keys(keyMap).forEach((rowKey) => {
    let thisNode = keyMap[rowKey];
    if (thisNode["subjectCode"] == "XMCLFY001") {
      thisNode["budgetMny"] = clAmount;
    } else if (thisNode["subjectCode"] == "XMFBFY001") {
      thisNode["budgetMny"] = fbAmount;
    } else if (thisNode["subjectCode"] == "XMQTFY001") {
      thisNode["budgetMny"] = otherAmount;
    }
    updateNodes.push(thisNode); //将修改后的行数据push进去
  });
  //一定要用updateNodes批量更新  要不然行多了会有性能问题
  if (updateNodes && updateNodes.length > 0) {
    gridDataListTwo.updateNodes(updateNodes);
  }
}
viewModel.get("defines!define2").on("afterValueChange", function (data) {
  console.log(data.value);
  let gridDataListTwo = viewModel.getTreeModel();
  let keyMap = gridDataListTwo?.get("keyMap");
  let updateNodes = [];
  Object.keys(keyMap).forEach((rowKey) => {
    let thisNode = keyMap[rowKey];
    if (thisNode["subjectCode"] == "XMQTFY001") {
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
    if (thisNode["subjectCode"] == "XMFBFY001") {
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
    if (thisNode["subjectCode"] == "XMCLFY001") {
      thisNode["budgetMny"] = data.value;
    }
    updateNodes.push(thisNode); //将修改后的行数据push进去
  });
  //一定要用updateNodes批量更新  要不然行多了会有性能问题
  if (updateNodes && updateNodes.length > 0) {
    gridDataListTwo.updateNodes(updateNodes);
  }
});