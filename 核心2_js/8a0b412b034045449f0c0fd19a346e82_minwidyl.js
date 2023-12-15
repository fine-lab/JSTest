var access_token = "";
var lastGetDate = undefined;
var currentStock = [];
var stocks_temp = [];
var wareList = [];
viewModel.get("button59ld") &&
  viewModel.get("button59ld").on("click", function (data) {
    // 最优投产--单击
    // 最优投料--单击
    console.log("最优投料--单击-button59ld");
    //判断单据状态，非开立不允许执行
    var status = viewModel.get("status");
    console.log("单据状态:" + status.getValue());
    var statusVal = status.getValue();
    if (statusVal != 0) {
      cb.utils.alert("非开立不允许执行");
      return;
    }
    //显示材料按钮
    var btnShowMaterial = document.getElementById("po_production_order|btnShowMaterial");
    var span = btnShowMaterial.getElementsByTagName("span")[0];
    if (span.innerText == "显示材料") {
      btnShowMaterial.click();
    }
    //判断是否已最优投产
    //获取材料信息表中的数据
    var gridModel = viewModel.get("orderMaterial");
    var rows = gridModel.getRows();
    console.log("材料信息:\r\n" + JSON.stringify(rows));
    if (rows == null || rows.length == 0) {
      cb.utils.alert("产品没有子件,请维护物料清单");
      return;
    }
    //依据组织ID查询所有现存量
    var currentStockObj = queryCurrentStockBy(rows[0]);
    if (currentStockObj == null) {
      cb.utils.alert("查询现存量失败，请重试");
      return;
    }
    currentStock = currentStockObj.data;
    var wareListObj = queryWareByOrg(rows[0].orgId);
    if (wareListObj == null) {
      cb.utils.alert("查询仓库信息失败，请重试");
      return;
    }
    wareList = wareListObj.data.recordList;
    var bOptinal = judgeOptinal(rows);
    //是否重新计算
    if (bOptinal == false) {
      var btnEdit = document.getElementById("po_production_order|btnEdit");
      btnEdit.click();
      //同步
      var returnPromise = new cb.promise();
      cb.utils.confirm(
        "不是最优投产,是否计算?",
        function () {
          //开启一次loading
          cb.utils.loadingControl.start();
          //获取单据状态
          var currentState = viewModel.getParams().mode;
          if (currentState == "edit") {
            //子件刷新按钮
            //生效，有可能出现异步现象
            var button59ui = viewModel.get("button59ld");
            button59ui.handleCalc = true;
            callHandleCalc();
          }
          //关闭一次loading
          cb.utils.loadingControl.end();
          return returnPromise.resolve();
        },
        function (args) {
          //取消按钮事件
          var btnAbandon = document.getElementById("po_production_order|btnAbandon");
          if (btnAbandon != null && btnAbandon != undefined) {
            btnAbandon.click();
          }
          return returnPromise.reject();
        }
      );
    } else {
      cb.utils.alert("当前投料已是最优投产.");
    }
  });
function queryCurrentStockBy(args) {
  if (access_token == "" || lastGetDate == undefined || lastGetDate.getTime() + 7200 * 1000 < new Date().getTime()) {
    var tokenjson = cb.rest.invokeFunction("PO.h20221112.GetToken", {}, function (err, res) {}, viewModel, { async: false });
    console.log("token接口返回消息:" + JSON.stringify(tokenjson));
    access_token = tokenjson.result.access_token;
    lastGetDate = new Date();
  }
  let product_id = args.productId;
  let org_id = args.orgId;
  var param = {
    product_id: product_id,
    org_id: org_id,
    access_token: access_token
  };
  console.log("现存量查询参数:" + JSON.stringify(param));
  try {
    var json = cb.rest.invokeFunction("PO.h20221112.GetCurrentStock", param, function (err, res) {}, viewModel, { async: false });
    return JSON.parse(json.result.strResponse);
  } catch (ex) {
    return null;
  }
}
function getStockBy(productId) {
  var rs = [];
  for (var i = 0; i < currentStock.length; i++) {
    if (currentStock[i].product == productId) {
      rs.push(currentStock[i]);
    }
  }
  return rs;
}
function queryWare(args) {
  if (access_token == "" || lastGetDate == undefined || lastGetDate.getTime() + 7200 * 1000 < new Date().getTime()) {
    var tokenjson = cb.rest.invokeFunction("PO.h20221112.GetToken", {}, function (err, res) {}, viewModel, { async: false });
    console.log("token接口返回消息:" + JSON.stringify(tokenjson));
    access_token = tokenjson.result.access_token;
    lastGetDate = new Date();
  }
  let warehouseId = args.warehouse;
  var param = {
    warehouseId: warehouseId,
    access_token: access_token
  };
  console.log("查询仓库参数:" + JSON.stringify(param));
  var json = cb.rest.invokeFunction("PO.h20221112.GetWare", param, function (err, res) {}, viewModel, { async: false });
  console.log("查询仓库结果:" + json.result.strResponse);
  return JSON.parse(json.result.strResponse);
}
function queryWareByOrg(orgid) {
  if (access_token == "" || lastGetDate == undefined || lastGetDate.getTime() + 7200 * 1000 < new Date().getTime()) {
    var tokenjson = cb.rest.invokeFunction("PO.h20221112.GetToken", {}, function (err, res) {}, viewModel, { async: false });
    console.log("token接口返回消息:" + JSON.stringify(tokenjson));
    access_token = tokenjson.result.access_token;
    lastGetDate = new Date();
  }
  var param = {
    org: orgid,
    access_token: access_token
  };
  console.log("查询仓库参数:" + JSON.stringify(param));
  try {
    var json = cb.rest.invokeFunction("PO.h20221112.GetWareList", param, function (err, res) {}, viewModel, { async: false });
    console.log("查询仓库结果:" + json.result.strResponse);
    return JSON.parse(json.result.strResponse);
  } catch (ex) {
    return null;
  }
}
function querySKUContents(skucode) {
  if (access_token == "" || lastGetDate == undefined || lastGetDate.getTime() + 7200 * 1000 < new Date().getTime()) {
    var tokenjson = cb.rest.invokeFunction("PO.h20221112.GetToken", {}, function (err, res) {}, viewModel, { async: false });
    console.log("token接口返回消息:" + JSON.stringify(tokenjson));
    access_token = tokenjson.result.access_token;
    lastGetDate = new Date();
  }
  var param = {
    skucode: skucode,
    access_token: access_token
  };
  console.log("查询SKU含量参数:" + JSON.stringify(param));
  try {
    var json = cb.rest.invokeFunction("PO.h20221112.GetSKUContents", param, function (err, res) {}, viewModel, { async: false });
    console.log("查询仓库结果:" + json.result.strResponse);
    var rs = JSON.parse(json.result.strResponse);
    var contents = null;
    if (rs.code == 200) {
      if (rs.data.recordCount == 1) {
        contents = rs.data.recordList[0].specs;
        if (contents != null && contents.length > 0 && contents.includes("含量")) {
          contents = contents.replace("含量:", "");
          contents = contents.replace(";", "");
        } else {
          contents = 1;
        }
      }
    }
    return contents;
  } catch (ex) {
    console.log("querySKUContents中的错误信息:" + ex);
    return 1;
  }
}
function getArrayContainEleIndex(json, ele) {
  var rowIndex = -1;
  for (var i = 0; i < json.length; i++) {
    var row = json[i];
    if (row.productId == ele.productId && row.skuId == ele.skuId && row.warehouseId == ele.warehouseId) {
      rowIndex = i;
      break;
    }
  }
  return rowIndex;
}
function judgeOptinal(rows) {
  var bOptinal = true;
  var s = "";
  var s1 = "";
  //材料id集合
  var materials = [];
  // 依据子件id、bomid、mainUnit和仓库id 合并子件明细数据
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var material = {};
    material.orgId = row.orgId;
    //产品id
    material.productId = row.productId;
    material.bomId = row.bomId;
    //子件id
    material.materialId = row.materialId;
    material.skuId = row.skuId;
    //主计量ID
    material.mainUnit = row.mainUnit;
    //仓库id
    material.warehouseId = row.warehouseId;
    //齐套件不处理
    if (row.isWholeSet == true) {
      continue;
    }
    //如果未选择sku或仓库,则不是最优
    if (row.skuId == null || row.skuId == undefined || material.warehouseId == null || material.warehouseId == undefined) {
      bOptinal = false;
    }
    var rowIndex = getArrayContainEleIndex(materials, material);
    if (rowIndex > -1) {
      materials[rowIndex].recipientQuantity += row.recipientQuantity;
    } else {
      material.recipientQuantity = row.recipientQuantity;
      materials.push(material);
    }
  }
  console.log("材料信息排序前数据:" + JSON.stringify(materials));
  //按规则排序
  materials.sort(sortBy);
  //排序后数据添加分组行号
  var str = "",
    str1 = "";
  var groupIndex = 0;
  for (var i = 0; i < materials.length; i++) {
    var material = materials[i];
    str1 = material.productId + material.bomId;
    if (str != str1) {
      groupIndex = 0;
      str = str1;
    } else {
      groupIndex = groupIndex + 1;
    }
    material.groupIndex = groupIndex;
  }
  console.log("材料主要数据排序后结果:" + JSON.stringify(materials));
  //遍历子件，查询现存量，并判断
  var stocks = undefined;
  var stockdata = [];
  for (var i = 0; i < materials.length; i++) {
    var material = materials[i];
    //相同物料仅仅分组序号为0时查询
    if (material.groupIndex == 0) {
      stockdata = getStockBy(material.productId);
      if (stockdata != null) {
        stockdata.sort(sortForStockBy);
        console.log("第【" + (i + 1) + "】行现存量:" + JSON.stringify(stockdata));
        var data_temp = {};
        data_temp.productId = material.productId;
        data_temp.data = stockdata;
        stocks_temp.push(data_temp);
      } else {
        bOptinal = false;
      }
    } else {
      stockdata = getCurrentStock(material.productId);
    }
    //比较子件目前使用数量与库存的数量
    if (stockdata != null && material.groupIndex < stockdata.length) {
      var row = stockdata[material.groupIndex];
      if (material.warehouseId == row.warehouse && material.skuId == row.productsku && material.recipientQuantity > row.availableqty) {
        bOptinal = false;
      }
    } else {
      bOptinal = false;
    }
  }
  return bOptinal;
}
function sortForStockBy(a, b) {
  //产品对比
  return a.availableqty - b.availableqty;
}
function sortBy(a, b) {
  //产品对比
  if (a.productId == b.productId) {
    if (a.skuId == b.skuId) {
      return a.recipientQuantity - b.recipientQuantity;
    } else {
      return (a.skuId + "").localeCompare(b.skuId + "");
    }
  } else {
    return (a.productId + "").localeCompare(b.productId + "");
  }
}
function reviseRow(row, rowIndex) {
  row._id = "youridHere" + rowIndex;
}
function handleCalc() {
  //重新计算最优投产
  //获取【材料信息】表格的数据
  var gridModel = viewModel.get("orderMaterial");
  rows = gridModel.getRows();
  //打印数据
  console.log("材料信息:" + JSON.stringify(rows));
  var bFlag = true;
  var msg = "";
  //行号集合
  //遍历数据，生产最优投产数据,如果出现现存量不足，则提示
  var rowIndex = 0;
  //结果数据结合
  var desRows = [];
  //需要处理的数据
  var calcRows = [];
  //拆分数据
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    //仅仅处理非齐套的数据,齐套数据直接加载原有数
    if (row.isWholeSet == true) {
      desRows.push(row);
    } else {
      calcRows.push(row);
    }
  }
  //合并数量
  var calcRows02 = [];
  var productIds = "";
  var recipientQuantity = 0;
  for (var i = 0; i < calcRows.length; i++) {
    var row = calcRows[i];
    var recipientQuantity = 0;
    for (var j = 0; j < calcRows.length; j++) {
      var row02 = calcRows[j];
      if (row.productId == row02.productId) {
        recipientQuantity = recipientQuantity + row02.recipientQuantity;
      }
      if (row.bomMaterialId == null || row.bomMaterialId == "") {
        row.bomMaterialId = row02.bomMaterialId;
      }
    }
    if (productIds.indexOf(row.productId + ",") < 0) {
      calcRows02.push(row);
      //收集产品子件ID
      productIds += row.productId + ",";
    }
  }
  console.log("开始处理需要进行最优处理的子件");
  for (var i = 0; i < calcRows02.length; i++) {
    //获取行数据
    var row = calcRows02[i];
    //总投料量数量
    var recipientQuantity = row.recipientQuantity;
    var stockRows = getCurrentStock(row.productId);
    if (stockRows == null || stockRows == undefined) {
      console.log("组织【" + row.orgId + "】物料【" + row.productId + "】无现存量数据");
      bFlag = false;
      continue;
    }
    if (bFlag) {
      //拆分
      for (var j = 0; j < stockRows.length; j++) {
        var stockRow = stockRows[j];
        if (recipientQuantity <= 0) {
          break;
        }
        rowIndex = rowIndex + 1;
        //查询仓库信息
        var ware = getWare(stockRow.warehouse);
        if (ware == null) {
          continue;
        }
        var warename = ware.name;
        var warecode = ware.code;
        var newRow = JSON.parse(JSON.stringify(row));
        reviseRow(newRow, rowIndex);
        newRow.lineNo = rowIndex * 10;
        newRow.warehouseName = warename;
        newRow.warehouseCode = warecode;
        newRow.warehouseId = stockRow.warehouse;
        newRow.skuId = stockRow.productsku;
        newRow.skuCode = stockRow.productsku_code;
        newRow.skuName = stockRow.productsku_name;
        debugger;
        var contents = querySKUContents(newRow.skuCode);
        var changeRate = parseFloat(contents);
        //设置含量
        newRow.free1 = changeRate;
        if (stockRow.availableqty > recipientQuantity) {
          //应领数量
          newRow.recipientQuantity = recipientQuantity;
          //领料件数
          newRow.auxiliaryRecipientQuantity = Math.round((recipientQuantity / changeRate) * 10000) / 10000.0;
          //应领件数(BOM单位)
          newRow.bomAuxiliaryRecipientQty = recipientQuantity;
          recipientQuantity = 0;
        } else {
          newRow.recipientQuantity = stockRow.availableqty;
          newRow.auxiliaryRecipientQuantity = Math.round((stockRow.availableqty / changeRate) * 10000) / 10000.0;
          //应领件数(BOM单位)
          newRow.bomAuxiliaryRecipientQty = stockRow.availableqty;
          recipientQuantity = recipientQuantity - stockRow.availableqty;
          //由于YS中保存材料信息验证，相同材料的bomId、bomMaterialId 字段只允许一行有值，故清除其他行的该字段的只
          delete newRow["bomMaterialId"];
        }
        if (newRow.recipientQuantity > 0) {
          desRows.push(newRow);
        }
      }
      if (recipientQuantity > 0) {
        bFlag = false;
        msg += "第【" + (i + 1) + "】行可用来不足\r\n";
      }
    }
  }
  if (bFlag) {
    console.log("最优投产结果:" + JSON.stringify(desRows));
    //删除原数据
    gridModel.deleteAllRows();
    //加载数据
    for (var i = 0; i < desRows.length; i++) {
      gridModel.appendRow(desRows[i]);
    }
    //保存数据
    var btnSave = document.getElementById("po_production_order|btnSave");
    if (btnSave != null && btnSave != undefined) {
      btnSave.click();
    }
  } else {
    var returnPromise2 = new cb.promise();
    cb.utils.confirm(
      "现存量不足,是否保存最优计算结果?\r\n" + msg,
      function () {
        console.log("最优投产结果:" + JSON.stringify(desRows));
        //依据行号删除原数据
        gridModel.deleteAllRows();
        //加载数据
        for (var i = 0; i < desRows.length; i++) {
          gridModel.appendRow(desRows[i]);
        }
        var btnSave = document.getElementById("po_production_order|btnSave");
        if (btnSave != null && btnSave != undefined) {
          btnSave.click();
        }
        return returnPromise2.resolve();
      },
      function (args) {
        //获取取消按钮,并调用取消按钮事件:测试成功
        var btnAbandon = document.getElementById("po_production_order|btnAbandon");
        if (btnAbandon != null && btnAbandon != undefined) {
          btnAbandon.click();
        }
        return returnPromise2.reject();
      }
    );
  }
}
function callHandleCalc() {
  // 订单状态--值改变后
  var button59ui = viewModel.get("button59ld");
  var b = button59ui.handleCalc;
  var mode = viewModel.getParams().mode;
  //当是编辑态，且是最优计算时
  if (b && mode == "edit") {
    handleCalc();
    button59ui.handleCalc = false;
  }
}
function getCurrentStock(productId) {
  if (stocks_temp == undefined || stocks_temp.length == 0) {
    return null;
  }
  var rs = null;
  for (var i = 0; i < stocks_temp.length; i++) {
    var stockRow = stocks_temp[i];
    if (stockRow.productId == productId) {
      rs = stockRow.data;
      break;
    }
  }
  return rs;
}
function getWare(warehouseId) {
  if (wareList == undefined || wareList.length == 0) {
    return null;
  }
  var rs = null;
  for (var i = 0; i < wareList.length; i++) {
    var ware = wareList[i];
    if (ware.warehouseId == warehouseId || ware.id == warehouseId) {
      rs = ware;
      break;
    }
  }
  return rs;
}