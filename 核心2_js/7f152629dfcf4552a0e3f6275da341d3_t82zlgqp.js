let billitems = [];
let billitemMeta = {};
let totalp = 0;
var stzx_Stoc = "";
var rockMetaData = {};
viewModel.get("vbillcode") &&
  viewModel.get("vbillcode").on("afterValueChange", function (data) {
    vbillcodeChange(data);
  });
viewModel.get("weigh_type") &&
  viewModel.get("weigh_type").on("afterValueChange", function (data) {
    weighChange(data);
  });
function weighChange(data) {
  if (!!data.value == false || data.value.value == 1) {
    viewModel.get("totalweight").setState("disabled", false);
  } else {
    viewModel.get("totalweight").setState("disabled", true);
  }
  viewModel.get("totalweight").setValue("");
}
function vbillcodeChange(data) {
  // 单据号--值改变后
  var vbillcode = data.value;
  if (vbillcode != null && vbillcode != "") {
    var proxy = viewModel.setProxy({
      queryData: {
        url: "/scmbc/stockzx/findXSBillByCode",
        method: "get"
      }
    });
    // 传参
    var param = {
      vbillcode: vbillcode
    };
    proxy.queryData(param, function (err, result) {
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return;
      }
      if ("edit" != data.cAction) {
        totalp = err.data.totalPackage;
        viewModel.get("total_package").setValue(totalp + 1);
        viewModel.get("current_package").setValue(totalp + 1);
      }
      var billnum = err.data.billnum;
      viewModel.get("def3").setValue(billnum);
      billitems = [...err.data.list];
      billitemMeta = {};
      for (let i = 0; i < billitems.length; i++) {
        let billitem = billitems[i];
        let lbillitemMeta = billitemMeta[billitem.productCode];
        if (!!lbillitemMeta) {
          billitemMeta[billitem.productCode][lbillitemMeta.length] = billitem;
        } else {
          billitemMeta[billitem.productCode] = [];
          billitemMeta[billitem.productCode][0] = billitem;
        }
      }
      if (!!billitems[0].headFreeItem) {
        viewModel.get("stride_over").setValue(!!billitems[0].headFreeItem.define60 ? billitems[0].headFreeItem.define60 : "");
      } else {
        viewModel.get("stride_over").setValue("");
      }
      viewModel.get("account").setValue(!!billitems[0].agentId ? billitems[0].agentId : "");
      viewModel.get("account_name").setValue(!!billitems[0].agentId_name ? billitems[0].agentId_name : "");
      viewModel.get("address").setValue(!!billitems[0].receiveAddress ? billitems[0].receiveAddress : "");
    });
  } else {
    billitems = [];
    billitemMeta = {};
    viewModel.get("stride_over").setValue("");
    viewModel.get("account").setValue("");
    viewModel.get("account_name").setValue("");
    viewModel.get("address").setValue("");
    viewModel.getGridModel().clear();
  }
}
var gridModel = viewModel.getGridModel();
var gridRowModel = gridModel.getEditRowModel();
let saveMuMeta = {};
let saveMult = -1;
let saveMultData = [];
viewModel.on("beforeSave", function (args) {
  try {
    // 保存前校验
    var pk_stordoc = viewModel.get("pk_stordoc").getValue();
    if (pk_stordoc == null || pk_stordoc == undefined) {
      cb.utils.alert("请选择仓库！");
      return false;
    }
    var xmbarcode = viewModel.get("xmbarcode").getValue();
    let data = JSON.parse(args.data.data);
    if (!!data.stock_zx_bList == false || data.stock_zx_bList.length < 1) {
      cb.utils.alert("请填写备货装箱物料信息！");
      return false;
    }
    data.account = viewModel.get("account").getValue();
    data.address = viewModel.get("address").getValue();
    if (saveMult < 0) {
      for (let i = 0; i < data.stock_zx_bList.length; i++) {
        if (data.stock_zx_bList[i].boxednum + data.stock_zx_bList[i].scannum > data.stock_zx_bList[i].nshouldnum) {
          cb.utils.alert("已装箱数量不能超出出库指示数量！", "error");
          return false;
        }
      }
    }
    if (xmbarcode == "0#" && saveMult <= 0 && data.stock_zx_bList.length > 1) {
      saveMuMeta = data;
      saveMult = 0;
      saveMultData = data.stock_zx_bList;
      data.stock_zx_bList = [];
      data.stock_zx_bList[0] = saveMultData[saveMult];
    } else {
      if (saveMult > 0) {
        data = saveMuMeta;
        data.stock_zx_bList = [];
        data.stock_zx_bList[0] = saveMultData[saveMult];
      }
    }
    //操作日期
    if ("edit" == viewModel.getParams().params.cAction) {
    } else {
      var date = new Date();
      var curDate = formatDate(date);
      data.def1 = curDate;
      data.date = formatDateTime(date);
    }
    for (let i = 0; i < data.stock_zx_bList.length; i++) {
      data.stock_zx_bList[i].boxednum = data.stock_zx_bList[i].scannum;
    }
    if (!!xmbarcode == false) {
      var proxy = viewModel.setProxy({
        queryData: {
          url: "/scmbc/stockzx/genXmbarcode",
          method: "get",
          options: {
            async: true
          }
        }
      });
      // 传参
      var param = {};
      proxy.queryData({}, function (err, result) {
        viewModel.get("xmbarcode").setValue(err.msg);
      });
      return false;
    } else {
      args.data.data = JSON.stringify(data);
    }
  } catch (e) {
    cb.utils.alert("发生异常：" + e);
    return false;
  }
});
function formatDate(date) {
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  var rq = date.getDate();
  if (rq < 10) {
    rq = "0" + rq;
  }
  return date.getFullYear() + "-" + month + "-" + rq;
}
function formatDateTime(date) {
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  var rq = date.getDate();
  if (rq < 10) {
    rq = "0" + rq;
  }
  var hour = date.getHours();
  if (hour < 10) {
    hour = "0" + hour;
  }
  var minutes = date.getMinutes(); // 分
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  var seconds = date.getSeconds();
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return date.getFullYear() + "-" + month + "-" + rq + " " + hour + ":" + minutes + ":" + seconds;
}
viewModel.on("afterEdit", function (args) {
  viewModel.get("weigh_type").setValue("1");
  weighChange({ value: { value: viewModel.get("weigh_type").getValue() } });
  vbillcodeChange({ value: viewModel.getParams().billData.vbillcode, cAction: "edit" });
  stordocRock({ value: { id: viewModel.get("pk_stordoc").getValue() } });
});
viewModel.on("beforeDelete", function (args) {
  let data = JSON.parse(args.data.data);
  if (data.def2 == "已出库") {
    cb.utils.alert("已出库数据不能删除！");
    return false;
  }
});
viewModel.on("afterDelete", function (args) {
  var vbillcode = viewModel.get("vbillcode").getValue();
  updatePackageNum(vbillcode);
});
viewModel.on("afterSave", function (args) {
  if (saveMult > -1 && saveMult + 1 < saveMultData.length) {
    saveMult++;
  } else {
    saveMult = -1;
    saveMultData = [];
    saveMuMeta = {};
  }
  if ("edit" != viewModel.getParams().params.cAction) {
    var vbillcode = viewModel.get("vbillcode").getValue();
    updatePackageNum(vbillcode);
  }
  if ((args.params.cAction == "save" && saveMult > 0) || (args.params.cAction == "saveandadd" && null == args.err)) {
    if (saveMult > 0) {
      viewModel.get("btnSaveAndAdd").fireEvent("click");
    } else {
      viewModel.get("xmbarcode").setValue("");
      viewModel.get("weigh_type").setValue("1");
      weighChange({ value: { value: "1" } });
      if (saveMult < 0 && !!viewModel.get("vbillcode").getValue()) {
        vbillcodeChange({ value: viewModel.get("vbillcode").getValue(), cAction: "add" });
      } else {
        let totalPackage = Number.parseInt(viewModel.get("total_package").getValue()) + 1;
        let currentPackage = Number.parseInt(viewModel.get("current_package").getValue()) + 1;
        viewModel.get("total_package").setValue(totalPackage);
        viewModel.get("current_package").setValue(currentPackage);
      }
      viewModel.getGridModels().forEach((gm, index) => {
        gm.clear();
      });
    }
    return false;
  }
});
function updatePackageNum(vbillcode) {
  var proxy = viewModel.setProxy({
    queryData: {
      url: "/scmbc/stockzx/updateTotalPackage",
      method: "get"
    }
  });
  // 传参
  var param = {
    vbillcode: vbillcode
  };
  proxy.queryData(param, function (err, result) {});
}
var rowIndex = -1;
viewModel.get("item91bd") &&
  viewModel.get("item91bd").on("afterValueChange", function (data) {
    if (!isNaN(parseFloat(data.value)) && isFinite(data.value)) {
      if (rowIndex > -1) {
        let lsCode = Number.parseFloat(data.value);
        let ldata = viewModel.getGridModel().getRow(rowIndex);
        if (ldata.boxednum + ldata.scannum + lsCode > ldata.nshouldnum) {
          cb.utils.alert("已装箱数量不能超出出库指示数量！", "error");
        } else {
          if (!!ldata.nnum) {
            ldata.nnum += lsCode;
          } else {
            ldata.nnum = lsCode;
          }
          if (!!ldata.scannum) {
            ldata.scannum += lsCode;
          } else {
            ldata.scannum = lsCode;
          }
          if (!!ldata.nassistnum) {
            ldata.nassistnum += lsCode;
          } else {
            ldata.nassistnum = lsCode;
          }
          gridModel.updateRow(rowIndex, ldata);
        }
      }
    } else {
      // 保存前校验
      var pk_stordoc = viewModel.get("pk_stordoc").getValue();
      if (!!pk_stordoc == false) {
        cb.utils.alert("请选择仓库！");
        return false;
      }
      // 扫码框--值改变后
      var vbarcodes = "";
      var barcodes = [];
      var cinvcode = "";
      var vbatchcode = "";
      var def3 = "";
      if (data.value.indexOf("[@]") > 0) {
        vbarcodes = data.value.substr(0, data.value.indexOf("[@]"));
        barcodes = vbarcodes.split("[#]");
        vbatchcode = barcodes[1];
      } else {
        vbarcodes = data.value;
        barcodes = vbarcodes.split(" ");
        def3 = barcodes[1];
      }
      cinvcode = barcodes[0];
      for (var i = 0; i < billitems.length; i++) {
        let rowdata = billitems[i];
        if (!!rowdata.orderDetails_productId_erpCode && rowdata.orderDetails_productId_erpCode == cinvcode) {
          cinvcode = rowdata.productCode;
          break;
        }
      }
      if (!!billitemMeta[cinvcode]) {
        if (billitemMeta[cinvcode].length > 1) {
          let dsd = [];
          for (let i = 0; i < billitemMeta[cinvcode].length; i++) {
            if (billitemMeta[cinvcode][i]) {
              dsd[i] = {
                text: billitemMeta[cinvcode][i].batchNo,
                style: {
                  margin: "8px 8px 5px 5px"
                },
                onPress: () => {
                  setBillItem(data, cinvcode, billitemMeta[cinvcode][i], def3);
                }
              };
            }
          }
          dsd[dsd.length] = {
            text: "取消",
            style: {
              margin: "8px 8px 5px 5px"
            },
            onPress: () => {}
          };
          cb.utils.confirm({
            title: "请选择物料批次", // String 或 React.Element
            message: "", // String 或 React.Element
            actions: dsd, // 按钮组, {text, onPress, style}, 值为数组。不传该参数显示默认的确定取消。传 [] 则不显示操作按钮
            okFunc: () => {
              console.log("确定回调");
            },
            cancelFunc: () => {
              console.log("取消回调");
            }
          });
        } else {
          setBillItem(data, cinvcode, billitemMeta[cinvcode][0], def3);
        }
      } else {
        cb.utils.alert("物料【" + cinvcode + "】未在销售订单内，请核实！");
      }
    }
    viewModel.get("item91bd").setValue("");
  });
function setBillItem(data, cinvcode, billitem, def3) {
  var pk_stordoc = viewModel.get("pk_stordoc").getValue();
  var vbatchcode = billitem.batchNo;
  var pkRack = "";
  var pkRackName = "";
  if (!!vbatchcode && vbatchcode.indexOf("CC") != -1) {
    pkRack = "1664482157311033402";
    pkRackName = "动态架子码";
    putModelsData(data, pkRack, pkRackName, cinvcode, vbatchcode, def3);
  } else {
    if (!!vbatchcode) {
      if (!!rockMetaData[vbatchcode]) {
        pkRack = rockMetaData[vbatchcode].id;
        pkRackName = rockMetaData[vbatchcode].name;
      }
      putModelsData(data, pkRack, pkRackName, cinvcode, vbatchcode, def3);
    } else {
      putModelsData(data, "", "", cinvcode, vbatchcode, def3);
    }
  }
}
function putModelsData(data, pkRack, pkRackName, cinvcode, vbatchcode, def3) {
  const index = gridModel.getFocusedRowIndex() + 1;
  var gridData = null;
  let o_lkey = cinvcode + "_" + (!!vbatchcode ? vbatchcode : "");
  var date = new Date();
  let scanT = formatDateTime(date);
  if (billitems.length > 0) {
    for (var i = 0; i < billitems.length; i++) {
      let rowdata = billitems[i];
      var billcinvcode = rowdata.productCode;
      let l_lkey = billcinvcode + "_" + (!!rowdata.batchNo ? rowdata.batchNo : "");
      if (o_lkey == l_lkey) {
        gridData = rowdata;
        break;
      }
    }
    if (gridData != null) {
      var rows = gridModel.getRows();
      let nnum = gridData.qty;
      if (!!gridData.totalOutStockPriceQty) {
        nnum -= gridData.totalOutStockPriceQty;
      } else {
        gridData.totalOutStockPriceQty = 0;
      }
      let nassistnum = gridData.subQty;
      if (!!gridData.totalOutStockSubQty) {
        nassistnum -= gridData.totalOutStockSubQty;
      } else {
        gridData.totalOutStockSubQty = 0;
      }
      if (rows == 0) {
        var rowdatas = {
          scantime: scanT,
          scannum: 0,
          nshouldnum: nnum,
          vbarcode: data.value,
          pk_material: gridData.productId,
          pk_material_name: gridData.productName,
          cinvcode: cinvcode,
          cinvname: gridData.productName,
          skuid_name: gridData.skuName,
          skuid: gridData.skuId,
          skucode: gridData.skuCode,
          skuidName: gridData.skuName,
          pk_measdoc: gridData.masterUnitId,
          measdoc: gridData.qtyName,
          castunitid: gridData.iProductAuxUnitId,
          castunitname: gridData.productAuxUnitName,
          vbatchcode: vbatchcode,
          casscustid: gridData.agentId,
          casscustid_name: gridData.agentId_name,
          nnum: 0,
          nassistnum: 0,
          vchangerate: gridData.invExchRate,
          pk_rack: pkRack,
          pk_rack_name: pkRackName,
          def1: gridData.id,
          def2: gridData.orderDetailId,
          def3: def3
        };
        getOutboundNum(viewModel.get("vbillcode").getValue(), gridData.productId, rowdatas);
      } else {
        var rowDataNew = {};
        var curIndex = 0;
        o_lkey += "_" + (!!def3 ? def3 : "");
        for (var j = 0; j < rows.length; j++) {
          var rowData = rows[j];
          let l_lkey = rowData.cinvcode + "_" + (!!rowData.vbatchcode ? rowData.vbatchcode : "") + "_" + (!!rowData.def3 ? rowData.def3 : "");
          if (o_lkey == l_lkey) {
            rowDataNew = rowData;
            curIndex = j;
            break;
          }
        }
        if (Object.values(rowDataNew).length > 0) {
          //如果表体已经存在该物料，则更新
          if (!!rowDataNew["vbatchcode"] == false) {
            rowDataNew["vbatchcode"] = vbatchcode;
          }
          rowDataNew["pk_rack"] = pkRack;
          rowDataNew["pk_rack_name"] = pkRackName;
          if (!!rowDataNew["def3"] == false) {
            rowDataNew["def3"] = def3;
          }
          gridModel.updateRow(curIndex, rowDataNew);
          rowIndex = curIndex;
        } else {
          //如果表体没有存在该物料，则新增
          var rowdatas = {
            scantime: scanT,
            scannum: 0,
            nshouldnum: nnum,
            vbarcode: data.value,
            pk_material: gridData.productId,
            pk_material_name: gridData.productName,
            cinvcode: cinvcode,
            cinvname: gridData.productName,
            skuid_name: gridData.skuName,
            skuid: gridData.skuId,
            skucode: gridData.skuCode,
            skuidName: gridData.skuName,
            pk_measdoc: gridData.masterUnitId,
            measdoc: gridData.qtyName,
            castunitid: gridData.iProductAuxUnitId,
            castunitname: gridData.productAuxUnitName,
            vbatchcode: vbatchcode,
            casscustid: gridData.agentId,
            casscustid_name: gridData.agentId_name,
            nnum: 0,
            nassistnum: 0,
            vchangerate: gridData.invExchRate,
            pk_rack: pkRack,
            pk_rack_name: pkRackName,
            def1: gridData.id,
            def2: gridData.orderDetailId,
            def3: def3
          };
          getOutboundNum(viewModel.get("vbillcode").getValue(), gridData.productId, rowdatas);
        }
      }
    } else {
      cb.utils.alert("物料【" + cinvcode + "】未在销售订单内，请核实！");
    }
  }
}
function getOutboundNum(billNo, materialId, rowData) {
  if (!!billNo) {
    var proxy = viewModel.setProxy({
      queryData: {
        url: "/scmbc/stockzx/getOutboundNum",
        method: "get"
      }
    });
    // 传参
    var param = {
      billCode: billNo,
      pk_material: materialId,
      batchNo: !!rowData.vbatchcode ? rowData.vbatchcode : ""
    };
    proxy.queryData(param, function (err, result) {
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return;
      }
      let boxednum = 0;
      if (!!err.data) {
        boxednum = err.data;
      }
      if (boxednum >= rowData.nshouldnum) {
        cb.utils.alert("此物料已完成装箱！");
        return;
      }
      rowData.boxednum = boxednum;
      const index = gridModel.getFocusedRowIndex() + 1;
      gridModel.insertRow(index, rowData);
      rowIndex = index;
    });
  } else {
    const index = gridModel.getFocusedRowIndex() + 1;
    gridModel.insertRow(index, rowData);
    rowIndex = index;
  }
}
viewModel.on("afterDeleteRow", function (args) {
  rowIndex = -1;
});
let url = "ws://127.0.0.1:12345/ws/ep/123";
let ws = new WebSocket(url);
// 连接成功后的回调函数
ws.onopen = function (params) {
  console.log("客户端连接成功");
  ws.send("hello");
};
// 从服务器接收到信息时的回调函数
ws.onmessage = function (e) {
  console.log("收到服务器响应" + e.data);
  let weighType = viewModel.get("weigh_type").getValue();
  if (!!weighType && (weighType == 2 || weighType == "2")) {
    var currentState = viewModel.getParams().mode;
    if (currentState == "edit" || currentState == "add") {
      let inputFlag = viewModel.get("weigh_type").getValue();
      if (!!inputFlag || inputFlag == true || inputFlag != "false") {
        viewModel.get("totalweight").setValue(e.data);
      }
    }
  }
};
// 连接关闭后的回调函数
ws.onclose = function (evt) {
  console.log("关闭客户端连接");
};
// 连接失败后的回调函数
ws.onerror = function (evt) {
  console.log("连接失败了");
};
viewModel.on("customInit", function (data) {
  // 备货装箱详情--页面初始化
  if ("add" == viewModel.getParams().params.cAction) {
    // 备货装箱详情--页面初始化
    let btnParams = viewModel.getParams().params;
    if (btnParams != null && btnParams != undefined && btnParams["cItemName"] == "button28xg") {
      const initParams = Object.assign({}, btnParams["params"]);
      initParams.id = "";
      initParams.pubts = "";
      initParams.def1 = "";
      initParams.def2 = "";
      initParams.def3 = "";
      initParams.def4 = "";
      initParams.def5 = "";
      initParams.salesout_code = "";
      initParams.account = "";
      initParams.address = "";
      initParams.date = "";
      initParams.stride_over = "";
      if (!!initParams.xmbarcode) {
        let pValue = initParams.xmbarcode.slice(-5);
        if (!isNaN(parseInt(pValue)) && isFinite(pValue)) {
          let lsCode = Number.parseInt(pValue);
          lsCode += 1;
          initParams.xmbarcode = initParams.xmbarcode.slice(0, -5) + (lsCode + "").padStart(5, "0");
        } else {
          initParams.xmbarcode = initParams.xmbarcode + "1".padStart(5, "0");
        }
      }
      viewModel.getParams()["billData"] = initParams;
      if (!!initParams.vbillcode) {
        vbillcodeChange({ value: initParams.vbillcode });
      } else {
        if (initParams.current_package > 0) {
          initParams.current_package += 1;
        }
        if (initParams.total_package > 0) {
          initParams.total_package += 1;
        }
      }
    }
  } else if ("edit" == viewModel.getParams().params.cAction) {
    viewModel.get("vbillcode").setState("disabled", true);
    if (!!viewModel.getParams().billData.vbillcode) {
      vbillcodeChange({ value: viewModel.getParams().billData.vbillcode, cAction: "edit" });
    }
  }
});
// 监听页面渲染完成事件
viewModel.on("afterLoadData", function () {
  if ("edit" == viewModel.getParams().params.cAction) {
    viewModel.get("vbillcode").setState("disabled", true);
  }
  if ("edit" == viewModel.getParams().params.cAction || "add" == viewModel.getParams().params.cAction) {
    weighChange({ value: { value: viewModel.get("weigh_type").getValue() } });
    stordocRock({ value: { id: viewModel.get("pk_stordoc").getValue() } });
  }
});
viewModel.get("pk_stordoc_name") &&
  viewModel.get("pk_stordoc_name").on("afterValueChange", function (data) {
    stordocRock(data);
  });
function stordocRock(data) {
  // 仓库--值改变后
  if (data.value.id != stzx_Stoc) {
    var proxy = viewModel.setProxy({
      queryData: {
        url: "/scmbc/stockzx/getRack",
        method: "get"
      }
    });
    // 传参
    var param = {
      stock: data.value.id
    };
    proxy.queryData(param, function (err, result) {
      if (!!result && result.status != 200) {
        cb.utils.alert(result.error, "error");
        return false;
      }
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return false;
      }
      if (!!err.data) {
        genRockMetaData(err.data);
      } else {
        rockMetaData = {};
      }
    });
  }
}
function genRockMetaData(rockTrees) {
  for (var i = 0; i < rockTrees.length; i++) {
    let rockData = rockTrees[i];
    rockMetaData[rockData.code] = { id: rockData.id, name: rockData.name, code: rockData.code };
    if (!!rockData.children) {
      genRockMetaData(rockData.children);
    }
  }
}