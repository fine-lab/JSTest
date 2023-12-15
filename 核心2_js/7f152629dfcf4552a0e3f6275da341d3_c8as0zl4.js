let billitems = [];
let totalp = 0;
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
      viewModel.get("account").setValue(billitems[0].agentId);
      viewModel.get("account_name").setValue(billitems[0].agentId_name);
      viewModel.get("address").setValue(billitems[0].receiveAddress);
    });
  } else {
    billitems = [];
  }
}
var gridModel = viewModel.getGridModel();
var gridRowModel = gridModel.getEditRowModel();
viewModel.on("beforeSave", function (args) {
  // 保存前校验
  var pk_stordoc = viewModel.get("pk_stordoc").getValue();
  if (pk_stordoc == null || pk_stordoc == undefined) {
    cb.utils.alert("请选择仓库！");
    return false;
  }
  let data = JSON.parse(args.data.data);
  data.account = viewModel.get("account").getValue();
  data.address = viewModel.get("address").getValue();
  //操作日期
  if ("edit" == viewModel.getParams().params.cAction) {
  } else {
    var date = new Date();
    var curDate = formatDate(date);
    data.def1 = curDate;
    data.date = formatDateTime(date);
  }
  args.data.data = JSON.stringify(data);
  var xmbarcode = viewModel.get("xmbarcode").getValue();
  if (!!xmbarcode == false) {
    var proxy = viewModel.setProxy({
      queryData: {
        url: "/scmbc/stockzx/genXmbarcode",
        method: "get"
      }
    });
    // 传参
    var param = {};
    proxy.queryData({}, function (err, result) {
      viewModel.get("xmbarcode").setValue(err.msg);
    });
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
  if ("edit" != viewModel.getParams().params.cAction) {
    var vbillcode = viewModel.get("vbillcode").getValue();
    updatePackageNum(vbillcode);
  }
  if (args.params.cAction == "saveandadd" && null == args.err) {
    viewModel.get("xmbarcode").setValue("");
    viewModel.get("weigh_type").setValue("1");
    weighChange({ value: { value: "1" } });
    if (!!viewModel.get("vbillcode").getValue()) {
      vbillcodeChange({ value: viewModel.get("vbillcode").getValue(), cAction: "add" });
    } else {
      let totalPackage = Number.parseInt(viewModel.get("total_package").getValue()) + 1;
      let currentPackage = Number.parseInt(viewModel.get("current_package").getValue()) + 1;
      viewModel.get("total_package").setValue(totalPackage);
      viewModel.get("current_package").setValue(currentPackage);
    }
    viewModel.getGridModels().forEach((gm, index) => {
      gm.deleteAllRows();
    });
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
viewModel.get("item91bd") &&
  viewModel.get("item91bd").on("afterValueChange", function (data) {
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
    var pkRack = "";
    var pkRackName = "";
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
    if (!!vbatchcode && vbatchcode.indexOf("CC") != -1) {
      pkRack = "1664482157311033402";
      pkRackName = "动态架子码";
      putModelsData(data, pkRack, pkRackName, cinvcode, vbatchcode, def3);
    } else {
      putModelsData(data, vbatchcode, pkRackName, cinvcode, vbatchcode, def3);
    }
    viewModel.get("item91bd").setValue("");
    viewModel.get("item91bd").setFocus();
  });
function putModelsData(data, pkRack, pkRackName, cinvcode, vbatchcode, def3) {
  const index = gridModel.getFocusedRowIndex() + 1;
  var gridData = null;
  if (billitems.length > 0) {
    for (var i = 0; i < billitems.length; i++) {
      let rowdata = billitems[i];
      var billcinvcode = rowdata.productCode;
      if (cinvcode == billcinvcode) {
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
          nnum: nnum,
          nassistnum: nassistnum,
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
        for (var j = 0; j < rows.length; j++) {
          var rowData = rows[j];
          if (cinvcode == rowData.cinvcode) {
            rowDataNew = rowData;
            curIndex = j;
            break;
          }
        }
        if (Object.values(rowDataNew).length > 0) {
          //如果表体已经存在该物料，则更新
          if (vbatchcode != null && vbatchcode != "") {
            rowDataNew["vbatchcode"] = vbatchcode;
          }
          if (def3 != null && def3 != "") {
            rowDataNew["def3"] = def3;
          }
          if (pkRack != null && pkRack != "") {
            rowDataNew["pk_rack"] = pkRack;
          }
          gridModel.updateRow(curIndex, rowDataNew);
        } else {
          //如果表体没有存在该物料，则新增
          var rowdatas = {
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
            nnum: gridData.qty,
            nassistnum: gridData.subQty,
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
      pk_material: materialId
    };
    proxy.queryData(param, function (err, result) {
      if (!err.success) {
        cb.utils.alert(err.msg, "error");
        return;
      }
      let boxednum = err.data;
      rowData.boxednum = boxednum;
      const index = gridModel.getFocusedRowIndex() + 1;
      gridModel.insertRow(index, rowData);
    });
  } else {
    const index = gridModel.getFocusedRowIndex() + 1;
    gridModel.insertRow(index, rowData);
  }
}
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
  var currentState = viewModel.getParams().mode;
  if (currentState == "edit" || currentState == "add") {
    let inputFlag = viewModel.get("weigh_type").getValue();
    if (inputFlag == "" || inputFlag == undefined || inputFlag == "false") {
      viewModel.get("totalweight").setValue(e.data);
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
      if (!!initParams.xmbarcode) {
        let lsCode = Number.parseInt(initParams.xmbarcode.slice(-5));
        if (!!lsCode) {
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
});