let udiSourceBillSon = viewModel.get("udiSourceBillSonList");
let udiSourceBill = viewModel.get("udiSourceBillConfigEntityList");
let UDIInfoList = viewModel.get("UDIInfoList");
udiSourceBillSon.setState("fixedHeight", 280);
UDIInfoList.setState("fixedHeight", 280);
let invokeFunction1 = function (id, data, callback, options) {
  var proxy = cb.rest.DynamicProxy.create({
    doProxy: {
      url: "/web/function/invoke/" + id,
      method: "POST",
      options: options
    }
  });
  proxy.doProxy(data, callback);
};
let selectRow = {};
viewModel.on("customInit", function (data) {
});
viewModel.on("afterLoadData", function () {
  //用于列表页面，初始化一些操作可以在这里实现，需要操作模型的，需要在此钩子函数执行
  viewModel.get("isSourceOrder").setValue(1);
  viewModel.get("operation").setValue(1);
  viewModel.get("item97de").setValue(0);
  viewModel.get("button1rj").setVisible(true); //绑定按钮
  viewModel.get("button10ug").setVisible(false); //批量导入按钮
  viewModel.get("button4te").setVisible(false); //下推按钮
});
viewModel.get("billType").on("afterValueChange", function (data) {
  getBillList();
  let billType = viewModel.get("billType").getValue();
  let operation = viewModel.get("operation").getValue();
  if (operation == 1 && (billType == "yonbip_scm_purinrecord_list" || billType == "yonbip_scm_othinrecord_list")) {
    viewModel.get("button10ug").setVisible(true);
  } else {
    viewModel.get("button10ug").setVisible(false);
  }
});
viewModel.get("endDate").on("afterValueChange", function (data) {
  getBillList();
});
viewModel.get("startDate").on("beforeValueChange", function (data) {
  if (data.value == null || data.value == undefined || data.value == "") {
    cb.utils.alert("单据开始时间不能为空", "error");
    return false;
  }
});
viewModel.get("startDate").on("afterValueChange", function (data) {
  getBillList();
});
viewModel.get("item23ne") &&
  viewModel.get("item23ne").on("blur", function (data) {
    let udiValue = viewModel.get("item23ne").getValue();
    if (udiValue == null || udiValue === "" || typeof udiValue == "undefined") {
      return;
    }
    udiValue = udiValue.trim();
    viewModel.get("item23ne").setValue();
    let isSourceOrder = viewModel.get("isSourceOrder").getValue();
    let param = {};
    if (isSourceOrder != 0) {
      let billType = viewModel.get("billType").getValue();
      if (billType == null || billType === "" || typeof billType == "undefined" || selectRow == null || JSON.stringify(selectRow) == "{}") {
        cb.utils.alert("请选择来源单据！", "error");
        return;
      }
      param.billType = billType;
    }
    let isStartPg = viewModel.get("item97de").getValue();
    param.isSourceOrder = isSourceOrder;
    param.udi = udiValue;
    param.isStartPg = isStartPg;
    let operation = viewModel.get("operation").getValue();
    let billType = viewModel.get("billType").getValue();
    param.billType = billType;
    param.orderInfo = viewModel.get("udiSourceBillSonList").getData();
    loadUdiInfo(param);
  });
viewModel.get("udiSourceBillConfigEntityList") &&
  viewModel.get("udiSourceBillConfigEntityList").on("afterSelect", function (data) {
    // 表格1--选择后
    let row = viewModel.get("udiSourceBillConfigEntityList").getRow(data[data.length - 1]);
    if (row.id != selectRow.id) {
      viewModel.get("UDIInfoList").clear();
      viewModel.get("udiSourceBillSonList").clear();
      selectRow = row;
      let operation = viewModel.get("operation").getValue();
      getSourceOrders(row.mainId);
    }
  });
viewModel.get("UDIInfoList") &&
  viewModel.get("UDIInfoList").on("afterSelect", function (data) {
    // 表格1--选择后
  });
viewModel.get("button1rj") &&
  viewModel.get("button1rj").on("click", function (data) {
    // 绑定--单击
    let udiList = viewModel.get("UDIInfoList").getRows();
    if (udiList == null || udiList.length == 0) {
      cb.utils.alert("请解析UDI信息后再进行绑定！", "error");
      return;
    }
    let param = {};
    let bingdingStr = "yonbip_scm_purinrecord_list;yonbip_scm_storeprorecord_list;yonbip_scm_salesout_list;";
    let billType = viewModel.get("billType").getValue();
    let isSourceOrder = viewModel.get("isSourceOrder").getValue();
    let operation = viewModel.get("operation").getValue();
    if (operation == 1) {
      //绑定
      param.isSourceOrder = isSourceOrder;
      param.udiList = udiList;
      param.orderInfo = selectRow;
      param.billType = billType;
      param.operation = operation;
      bindingUDI(param);
    }
  });
viewModel.get("button10ug") &&
  viewModel.get("button10ug").on("click", function (data) {
    // 绑定--单击
    let orderDetailList = viewModel.get("udiSourceBillSonList").getSelectedRows();
    if (orderDetailList == null || orderDetailList.length == 0) {
      cb.utils.alert("请选择要绑定的单据明细！", "error");
      return;
    }
    viewModel.un("back");
    let billType = viewModel.get("billType").getValue();
    let billData = {
      billtype: "VoucherList",
      billno: "udibatchbinding",
      params: {
        mode: "browse",
        orderDetailList: orderDetailList,
        billType: billType,
        domainKey: "yourKeyHere"
      }
    };
    cb.loader.runCommandLine("bill", billData, viewModel);
  });
viewModel.get("baseOrg_name") &&
  viewModel.get("baseOrg_name").on("afterValueChange", function (data) {
    // 库存组织--值改变后
    getBillList();
  });
viewModel.get("isSourceOrder") &&
  viewModel.get("isSourceOrder").on("afterValueChange", function (data) {
    // 是否有源单--值改变后
    viewModel.get("UDIInfoList").clear();
    viewModel.get("operation").setValue(1);
    viewModel.get("billType").setValue("");
    viewModel.get("button1rj").setVisible(true); //绑定按钮
    viewModel.get("button4te").setVisible(false); //下推按钮
    viewModel.get("udiSourceBillSonList").clear();
    viewModel.get("udiSourceBillConfigEntityList").clear();
    viewModel.get("billType").setDisabled(false);
    selectRow = {};
  });
viewModel.get("operation") &&
  viewModel.get("operation").on("afterValueChange", function (data) {
    // 操作类型--值改变后
    let operation = viewModel.get("operation").getValue();
    viewModel.get("button10ug").setVisible(false); //批量导入
    if (operation == 2) {
      //入库操作限制单据类型为采购到货
      viewModel.get("billType").setValue("yonbip_scm_arrivalorder_list");
      viewModel.get("billType").setDisabled(true);
      viewModel.get("button1rj").setVisible(false); //绑定按钮
      viewModel.get("button4te").setVisible(true); //下推按钮
      getBillList();
    } else if (operation == 3) {
      //出库操作限制单据类型为销售发货
      viewModel.get("billType").setValue("yonbip_sd_voucherdelivery_list");
      viewModel.get("billType").setDisabled(true);
      viewModel.get("button1rj").setVisible(false); //绑定按钮
      viewModel.get("button4te").setVisible(true); //下推按钮
      getBillList();
    } else if (operation == 5) {
      viewModel.get("billType").setValue("dbdd");
      viewModel.get("billType").setDisabled(true);
      viewModel.get("button1rj").setVisible(false); //绑定按钮
      viewModel.get("button4te").setVisible(true); //下推按钮
      getBillList();
    } else if (operation == 6) {
      viewModel.get("billType").setValue("dcck");
      viewModel.get("billType").setDisabled(true);
      viewModel.get("button1rj").setVisible(false); //绑定按钮
      viewModel.get("button4te").setVisible(true); //下推按钮
      getBillList();
    } else {
      viewModel.get("UDIInfoList").clear();
      viewModel.get("udiSourceBillSonList").clear();
      viewModel.get("udiSourceBillConfigEntityList").clear();
      viewModel.get("billType").setValue("");
      viewModel.get("billType").setDisabled(false);
      viewModel.get("button1rj").setVisible(true); //绑定按钮
      viewModel.get("button4te").setVisible(false); //下推按钮
    }
  });
viewModel.get("button4te") &&
  viewModel.get("button4te").on("click", function (data) {
    // 下推--单击
    viewModel.un("back");
    let operation = viewModel.get("operation").getValue();
    let udiList = viewModel.get("UDIInfoList").getRows();
    if (udiList == null || udiList.length == 0) {
      cb.utils.alert("请解析UDI信息后再进行下推！", "error");
      return;
    }
    let sonList = viewModel.get("udiSourceBillSonList").getData();
    if (sonList == null || sonList.length == 0) {
      cb.utils.alert("请选择来源单据！", "error");
      return;
    }
    //循环校验解析的UDI数量是否和物料数量相同
    for (let i = 0; i < sonList.length; i++) {
      let materialInfo = sonList[i];
      let udiNum = 0;
      for (let j = 0; j < udiList.length; j++) {
        if (materialInfo.materialId == udiList[j].material) {
          udiNum = udiNum + udiList[j].parsingNum * 1;
          udiList.splice(j, 1); //匹配过的UDI删除
          j--;
        }
      }
      if (udiNum != materialInfo.materialNum) {
        cb.utils.alert("物料" + materialInfo.materialName + "扫码解析数量不等于物料数量", "error");
        return;
      }
    }
    let param = {};
    param.orderInfo = selectRow;
    let billType = viewModel.get("billType").getValue();
    let isSourceOrder = viewModel.get("isSourceOrder").getValue();
    param.isSourceOrder = isSourceOrder;
    param.operation = operation;
    param.udiList = viewModel.get("UDIInfoList").getRows();
    param.billType = billType;
    if (operation == 2) {
      let billno = "pu_arrivalorder";
      var params = {
        billtype: "Voucher",
        billno: billno,
        domainKey: "upu",
        params: {
          mode: "edit",
          id: selectRow.mainId,
          title: "采购到货"
        }
      };
      udiScanRecord(param);
      cb.loader.runCommandLine("bill", params, viewModel);
    } else if (operation == 3) {
      let billno = "voucher_delivery";
      var params = {
        billtype: "Voucher",
        billno: billno,
        domainKey: "yourKeyHere",
        params: {
          readOnly: "true",
          mode: "browse",
          id: selectRow.mainId,
          title: "销售发货"
        }
      };
      udiScanRecord(param);
      cb.loader.runCommandLine("bill", params, viewModel);
    } else if (operation == 5) {
      let billno = "st_transferapply";
      var params = {
        billtype: "Voucher",
        billno: billno,
        domainKey: "yourKeyHere",
        params: {
          readOnly: "true",
          mode: "browse",
          id: selectRow.mainId,
          title: "调拨订单"
        }
      };
      udiScanRecord(param);
      cb.loader.runCommandLine("bill", params, viewModel);
    } else if (operation == 6) {
      let billno = "st_storeout";
      var params = {
        billtype: "Voucher",
        billno: billno,
        domainKey: "yourKeyHere",
        params: {
          readOnly: "true",
          mode: "browse",
          id: selectRow.mainId,
          title: "调出出库"
        }
      };
      udiScanRecord(param);
      cb.loader.runCommandLine("bill", params, viewModel);
    } else {
      cb.utils.alert("单据不能下推", "error");
    }
  });
function loadChildList(mainId) {
  //选中左边单据后加载右边列表
  getSourceOrders(mainId);
}
function udiScanRecord(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.bindingUDI", params, function (err, res) {
      if (typeof res != "undefined") {
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function bindingUDI(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.bindingUDI", params, function (err, res) {
      if (typeof res != "undefined") {
        cb.utils.alert("绑定成功！");
        viewModel.get("UDIInfoList").clear();
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function loadUdiInfo(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("I0P_UDI.publicFunction.checkUdiInfo", params, function (err, res) {
      if (typeof res != "undefined") {
        let result = res.result;
        let UDIInfoList = viewModel.get("UDIInfoList").getData();
        if (UDIInfoList != null && UDIInfoList.length != 0) {
          for (let i = 0; i < UDIInfoList.length; i++) {
            if (UDIInfoList[i].UDI == result[0].UDI) {
              //相同UDI累加解析数量
              cb.utils.alert("已存在相同UDI，请勿重复解析", "error");
              return;
            }
          }
        }
        viewModel.get("UDIInfoList").appendRow(result[0]);
      } else if (typeof err != "undefined") {
        cb.utils.alert(err, "error");
      }
    });
  });
}
function getBillList() {
  let billurl = viewModel.get("billType").getValue();
  if (billurl != "" && billurl != null) {
    invokeFunction1(
      "I0P_UDI.publicFunction.getSourceOrder",
      {
        url: billurl,
        startDate: viewModel.get("startDate").getValue(),
        endDate: viewModel.get("endDate").getValue(),
        baseOrgId: viewModel.get("baseOrg").getValue()
      },
      function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
        } else {
          let gridModel = viewModel.get("udiSourceBillConfigEntityList");
          let apiResponse = res.apiResponse;
          viewModel.get("UDIInfoList").clear();
          viewModel.get("udiSourceBillSonList").clear();
          gridModel.setDataSource(apiResponse);
          selectRow = {};
        }
      },
      {
        domainKey: "yourKeyHere"
      }
    );
  }
}
function dateFormat(value, format) {
  if (value == undefined || value == null || value == "") {
    return "";
  }
  let date = new Date(value);
  var o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "H+": date.getHours(), //hour
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    S: date.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}
function getSourceOrders(mainId) {
  let billurl = viewModel.get("billType").getValue();
  if (billurl != "" && billurl != null) {
    invokeFunction1(
      "I0P_UDI.publicFunction.getSourceOrders",
      {
        url: billurl,
        mainId: mainId
      },
      function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
        } else {
          let apiResponse = res.apiResponse;
          for (let i = 0; i < apiResponse.length; i++) {
            apiResponse[i].invaliddate = dateFormat(apiResponse[i].invaliddate, "yyyy-MM-dd");
            apiResponse[i].producedate = dateFormat(apiResponse[i].producedate, "yyyy-MM-dd");
            viewModel.get("udiSourceBillSonList").appendRow(apiResponse[i]);
          }
        }
      },
      {
        domainKey: "yourKeyHere"
      }
    );
  }
}