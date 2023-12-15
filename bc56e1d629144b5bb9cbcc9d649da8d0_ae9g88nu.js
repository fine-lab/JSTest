let udiSourceBillSon = viewModel.get("udiSourceBillSonList");
udiSourceBillSon.setState("fixedHeight", 280);
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
  viewModel.get("isSourceOrder").setValue(1);
  viewModel.get("operation").setValue(1);
});
viewModel.get("billType").on("afterValueChange", function (data) {
  getBillList();
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
viewModel.get("item21zc") &&
  viewModel.get("item21zc").on("blur", function (data) {
    let udiValue = viewModel.get("item21zc").getValue();
    if (udiValue == null || udiValue === "" || typeof udiValue == "undefined") {
      return;
    }
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
    param.isSourceOrder = isSourceOrder;
    param.udi = udiValue;
    let operation = viewModel.get("operation").getValue();
    if (operation == 2) {
      param.orderInfo = viewModel.get("udiSourceBillSonList").getData();
    } else {
      param.orderInfo = selectRow;
      param.orderInfo.invaliddate = dateFormat(param.orderInfo.invaliddate, "yyyy-MM-dd");
      param.orderInfo.producedate = dateFormat(param.orderInfo.producedate, "yyyy-MM-dd");
    }
    loadUdiInfo(param);
  });
viewModel.get("udiSourceBillConfigEntityList") &&
  viewModel.get("udiSourceBillConfigEntityList").on("afterSelect", function (data) {
    // 表格1--选择后
    let row = viewModel.get("udiSourceBillConfigEntityList").getRow(data[data.length - 1]);
    if (row.id != selectRow.id) {
      viewModel.get("UDIInfoList").clear();
    }
    selectRow = row;
    loadChildList(row.mainId);
  });
viewModel.get("UDIInfoList") &&
  viewModel.get("UDIInfoList").on("afterSelect", function (data) {
    // 表格1--选择后
  });
viewModel.get("button23de") &&
  viewModel.get("button23de").on("click", function (data) {
    // 绑定--单击
    let udiList = viewModel.get("UDIInfoList").getRows();
    if (udiList == null || udiList.length == 0) {
      return;
    }
    let param = {};
    let bingdingStr = "/yonbip/scm/purinrecord/list;/yonbip/scm/storeprorecord/list;/yonbip/scm/salesout/list;";
    let billType = viewModel.get("billType").getValue();
    let isSourceOrder = viewModel.get("isSourceOrder").getValue();
    let operation = viewModel.get("operation").getValue();
    if (operation == 1 && bingdingStr.indexOf(billType) > -1) {
      //绑定
      param.isSourceOrder = isSourceOrder;
      param.operation = operation;
      param.udiList = udiList;
      param.orderInfo = selectRow;
      param.billType = billType;
      bindingUDI(param);
    }
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
    viewModel.get("billType").setDisabled(false);
    if (viewModel.get("isSourceOrder").getValue() == 1) {
      viewModel.get("operation").setDisabled(false);
    } else {
      //无源单操作类型只有 1-绑定
      viewModel.get("operation").setValue(1);
      viewModel.get("operation").setDisabled(true);
    }
  });
viewModel.get("operation") &&
  viewModel.get("operation").on("afterValueChange", function (data) {
    // 操作类型--值改变后
    let operation = viewModel.get("operation").getValue();
    if (operation == 2) {
      //入库操作限制单据类型为采购到货
      viewModel.get("billType").setValue("/yonbip/scm/arrivalorder/list");
      viewModel.get("billType").setDisabled(true);
    } else {
      viewModel.get("billType").setDisabled(false);
    }
  });
viewModel.get("button28bj") &&
  viewModel.get("button28bj").on("click", function (data) {
    // 下推--单击
    let operation = viewModel.get("operation").getValue();
    if (operation == 2) {
      let udiList = viewModel.get("UDIInfoList").getRows();
      if (udiList == null || udiList.length == 0) {
        return;
      }
      let sonList = viewModel.get("udiSourceBillSonList").getData();
      if (sonList == null || sonList.length == 0) {
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
      let billno = "pu_arrivalorder";
      var params = {
        billtype: "voucher",
        billno: billno,
        domainKey: "upu",
        params: {
          mode: "edit",
          id: "youridHere",
          title: "title"
        }
      };
      cb.loader.runCommandLine("bill", params, viewModel);
    }
  });
function bindingUDI(params) {
  return new Promise((resolve) => {
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.bindingUDI", params, function (err, res) {
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
    cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.checkUdiInfo", params, function (err, res) {
      if (typeof res != "undefined") {
        let result = res.result;
        let UDIInfoList = viewModel.get("UDIInfoList").getData();
        if (UDIInfoList != null && UDIInfoList.length != 0) {
          for (let i = 0; i < UDIInfoList.length; i++) {
            if (UDIInfoList[i].UDI == result[0].UDI) {
              //相同UDI累加解析数量
              let parsingNum = UDIInfoList[i].parsingNum;
              let materialId = UDIInfoList[i].material;
              let sonList = viewModel.get("udiSourceBillSonList").getData();
              parsingNum = parsingNum * 1 + result[0].packgingNum * 1;
              for (let j = 0; j < sonList.length; j++) {
                if (materialId == sonList[j].materialId) {
                  if (parsingNum > sonList[j].materialNum) {
                    cb.utils.alert("物料" + result[0].materialName + "扫码解析数量不能大于物料数量", "error");
                    return;
                  }
                }
              }
              viewModel.get("UDIInfoList").setCellValue(i, "parsingNum", parsingNum, true);
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
      "GT22176AT10.backDefaultGroup.getSourceOrder",
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
          gridModel.setDataSource(apiResponse);
        }
      },
      {
        domainKey: "sy01"
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
function loadChildList(mainId) {
  //选中左边单据后加载右边列表
  viewModel.get("udiSourceBillSonList").clear();
  let mainList = viewModel.get("udiSourceBillConfigEntityList").getData();
  for (let i = 0; i < mainList.length; i++) {
    if (mainList[i].mainId == mainId) {
      mainList[i].invaliddate = dateFormat(mainList[i].invaliddate, "yyyy-MM-dd");
      mainList[i].producedate = dateFormat(mainList[i].producedate, "yyyy-MM-dd");
      viewModel.get("udiSourceBillSonList").appendRow(mainList[i]);
    }
  }
}