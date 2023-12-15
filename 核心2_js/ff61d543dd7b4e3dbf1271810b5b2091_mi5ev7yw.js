viewModel.on("customInit", function (data) {
  //销售出库单列表
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.core.min.js?domainKey=developplatform");
  document.body.insertBefore(secScript, document.body.lastChild);
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.common.extend.js?domainKey=developplatform");
  document.body.insertBefore(secScript, document.body.lastChild);
  cb.rest.invokeFunction1 = function (id, data, callback, viewModel, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    if (options.async == false) {
      return proxy.doProxy(data, callback);
    } else {
      proxy.doProxy(data, callback);
    }
  };
  //销售出库
  viewModel.get("button41xh").on("click", function () {
    let gridModel = viewModel.getGridModel();
    let data = gridModel.getSelectedRows();
    if (data.length < 1) {
      cb.utils.alert("请选择要导出的数据");
      return false;
    }
    let ids = [];
    let codeArr = [];
    for (let i = 0; i < data.length; i++) {
      if (codeArr.indexOf(data[i].code) > -1) {
        cb.utils.alert("请切换显示样式为【表头】，进行导出, 不要选择【表头+表体】");
        return false;
      } else {
        codeArr.push(data[i].code);
      }
      let index = ids.indexOf(data[i].id);
      if (index == -1) {
        ids.push(data[i].id);
      }
    }
    getSaleOrders = function (type) {
      return new Promise(function (resolve) {
        cb.rest.invokeFunction(
          "ST.exportDrugAdministrationData.salesDeliveryExportM",
          {
            ids: ids,
            type: type
          },
          function (err, res) {
            debugger;
            if (typeof res != "undefined") {
              let orderInfos = res.orderInfos;
              resolve(orderInfos);
            } else if (typeof err != "undefined") {
              cb.utils.alert(err, "error");
              return false;
            }
            resolve();
          }
        );
      });
    };
    getSaleOrders("出库").then((orderInfos) => {
      //第一个sheet
      let sheetData1 = [];
      for (let i = 0; i < orderInfos.length; i++) {
        sheetData1.push({
          销售日期: export_parseDate(orderInfos[i].vouchdate),
          销售单号: orderInfos[i].entry[0].firstupcode,
          采购企业: orderInfos[i].cust_name,
          销售员: orderInfos[i].salesman_name,
          运输方式: "",
          承运人: "",
          运输开始时间: "",
          运输结束时间: "",
          起运温度: "",
          到达温度: ""
        });
      }
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheetData1), "sheet1");
      for (let i = 0; i < orderInfos.length; i++) {
        let sheetData2 = [];
        for (let j = 0; j < orderInfos[i].entry.length; j++) {
          sheetData2.push({
            生产批号: orderInfos[i].entry[j].batchno,
            生产日期: export_parseDate(orderInfos[i].entry[j].producedate),
            有效期至: export_parseDate(orderInfos[i].entry[j].invaliddate),
            销售数量: orderInfos[i].entry[j].qty,
            本位码: orderInfos[i].entry[j].extend_standard_code,
            包装规格: orderInfos[i].entry[j].extend_package_specification
          });
        }
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheetData2), "sheet" + (i + 2));
      }
      // 导出最后的总表
      let workbookBlob = workbook2blob(wb);
      openDownloadDialog(workbookBlob, "销售出库" + export_parseDate(new Date()) + ".xlsx");
    });
  });
  //销售退
  viewModel.get("button59yi").on("click", function () {
    let gridModel = viewModel.getGridModel();
    let data = gridModel.getSelectedRows();
    if (data.length < 1) {
      cb.utils.alert("请选择要导出的数据");
      return false;
    }
    let ids = [];
    let codeArr = [];
    for (let i = 0; i < data.length; i++) {
      if (codeArr.indexOf(data[i].code) > -1) {
        cb.utils.alert("请切换显示样式为【表头】，进行导出, 不要选择【表头+表体】");
        return false;
      } else {
        codeArr.push(data[i].code);
      }
      let index = ids.indexOf(data[i].id);
      if (index == -1) {
        ids.push(data[i].id);
      }
    }
    getSaleOrders = function (type) {
      return new Promise(function (resolve) {
        cb.rest.invokeFunction(
          "ST.exportDrugAdministrationData.salesDeliveryExportM",
          {
            ids: ids,
            type: type
          },
          function (err, res) {
            debugger;
            if (typeof res != "undefined") {
              let orderInfos = res.orderInfos;
              resolve(orderInfos);
            } else if (typeof err != "undefined") {
              cb.utils.alert(err, "error");
              return false;
            }
            resolve();
          }
        );
      });
    };
    getSaleOrders("退货").then((orderInfos) => {
      //第一个sheet
      let sheetData1 = [];
      for (let i = 0; i < orderInfos.length; i++) {
        sheetData1.push({
          退货日期: export_parseDate(orderInfos[i].vouchdate),
          退货企业名称: orderInfos[i].cust_name,
          入库单号: orderInfos[i].code,
          运输设备: "",
          运输开始时间: "",
          运输结束时间: "",
          温度记录: "",
          验收员名称: "吴小敏",
          购进结论: "符合规定"
        });
      }
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheetData1), "sheet1");
      for (let i = 0; i < orderInfos.length; i++) {
        let sheetData2 = [];
        for (let j = 0; j < orderInfos[i].entry.length; j++) {
          if (orderInfos[i].entry[j].firstsource != "udinghuo.voucher_order") {
            orderInfos[i].entry[j].firstupcode = "";
          }
          sheetData2.push({
            生产批号: orderInfos[i].entry[j].batchno,
            生产日期: export_parseDate(orderInfos[i].entry[j].producedate),
            有效期至: export_parseDate(orderInfos[i].entry[j].invaliddate),
            退货数量: -orderInfos[i].entry[j].qty,
            退货原因: orderInfos[i].entry[j].memo,
            销售单号: orderInfos[i].entry[j].upStreamCode,
            本位码: orderInfos[i].entry[j].extend_standard_code,
            包装规格: orderInfos[i].entry[j].extend_package_specification
          });
        }
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheetData2), "sheet" + (i + 2));
      }
      // 导出最后的总表
      let workbookBlob = workbook2blob(wb);
      openDownloadDialog(workbookBlob, "销售退货" + export_parseDate(new Date()) + ".xlsx");
    });
  });
  //抽检出库
  viewModel.get("button77ri").on("click", function () {
    let gridModel = viewModel.getGridModel();
    let data = gridModel.getSelectedRows();
    if (data.length < 1) {
      cb.utils.alert("请选择要导出的数据");
      return false;
    }
    let ids = [];
    let codeArr = [];
    for (let i = 0; i < data.length; i++) {
      if (codeArr.indexOf(data[i].code) > -1) {
        cb.utils.alert("请切换显示样式为【表头】，进行导出, 不要选择【表头+表体】");
        return false;
      } else {
        codeArr.push(data[i].code);
      }
      let index = ids.indexOf(data[i].id);
      if (index == -1) {
        ids.push(data[i].id);
      }
    }
    getSaleOrders = function (type) {
      return new Promise(function (resolve) {
        cb.rest.invokeFunction(
          "ST.exportDrugAdministrationData.salesDeliveryExportM",
          {
            ids: ids,
            type: type
          },
          function (err, res) {
            debugger;
            if (typeof res != "undefined") {
              let orderInfos = res.orderInfos;
              resolve(orderInfos);
            } else if (typeof err != "undefined") {
              cb.utils.alert(err, "error");
              return false;
            }
            resolve();
          }
        );
      });
    };
    getSaleOrders("抽检出库").then((orderInfos) => {
      //第一个sheet
      let sheetData1 = [];
      for (let i = 0; i < orderInfos.length; i++) {
        sheetData1.push({
          出库日期: export_parseDate(orderInfos[i].vouchdate),
          抽检单位名称: "佛山双鹤医药销售有限责任公司",
          抽检原因: orderInfos[i].memo,
          出库单号: orderInfos[i].code,
          处理人: "吴小敏"
        });
      }
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheetData1), "sheet1");
      for (let i = 0; i < orderInfos.length; i++) {
        let sheetData2 = [];
        for (let j = 0; j < orderInfos[i].entry.length; j++) {
          if (orderInfos[i].entry[j].firstsource != "udinghuo.voucher_order") {
            orderInfos[i].entry[j].firstupcode = "";
          }
          sheetData2.push({
            生产批号: orderInfos[i].entry[j].batchno,
            生产日期: export_parseDate(orderInfos[i].entry[j].producedate),
            有效期至: export_parseDate(orderInfos[i].entry[j].invaliddate),
            库存数量: exportNum(orderInfos[i].entry[j].currentqty),
            抽检数量: exportNum(orderInfos[i].entry[j].qty),
            本位码: orderInfos[i].entry[j].extend_standard_code,
            包装规格: orderInfos[i].entry[j].extend_package_specification
          });
        }
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheetData2), "sheet" + (i + 2));
      }
      // 导出最后的总表
      let workbookBlob = workbook2blob(wb);
      openDownloadDialog(workbookBlob, "抽检出库" + export_parseDate(new Date()) + ".xlsx");
    });
  });
  function export_parseDate(date) {
    if (date != undefined) {
      date = new Date(date);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      let dateTime = year + "-" + month + "-" + day;
      return dateTime;
    }
  }
  function exportDate(date) {
    if (date != undefined) {
      date = new Date(date);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      let dateTime = year + "/" + month + "/" + day;
      return dateTime;
    }
  }
  function exportNum(num) {
    if (num != undefined) {
      if (num < 0) {
        return -num;
      }
      if (num > 0) {
        return num;
      }
    }
  }
  checkSaleOutInvoiceQty = function (id, code) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(
        "ST.exportDrugAdministrationData.getxsckDetail",
        {
          id: id
        },
        function (err, res) {
          debugger;
          if (typeof res != "undefined") {
            if (res.status != "1") {
              cb.utils.alert("单据" + code + "的销售出库单中的物料已经开票", "error");
              return false;
            }
            resolve(orderInfos);
          } else if (typeof err != "undefined") {
            cb.utils.alert(err, "error");
            return false;
          }
          resolve();
        }
      );
    });
  };
  viewModel.on("beforeBatchUnaudit", function (args) {
    for (let i = 0; i < selectData.length; i++) {
      let data = { id: selectData[i].id, uri: "GT22176AT10.GT22176AT10.sy01_change_price" };
      //判断是否有下游单据
      var returnPromise = new cb.promise();
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.checkChildOrderUnAud",
        data,
        function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          }
          if (res.Info && res.Info.length > 0) {
            cb.utils.alert("单据" + selectData[i].code + ": 销价调整单已有相应单据！", "error");
            return false;
          }
          returnPromise.resolve();
        },
        undefined,
        { domainKey: "sy01" }
      );
      return returnPromise;
    }
  });
  viewModel.on("beforeBatchpush", function (args) {
    debugger;
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    var gridModel = viewModel.getGridModel();
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      errorMsg.push("请选择数据");
    }
    if (args.args.cSvcUrl.indexOf("targetBillNo=7a479fc4") > 0) {
      for (let i = 0; i < selectData.length; i++) {
        var extend_ispush = selectData[i].extend_ispush;
        if (extend_ispush == "false") {
          cb.utils.alert("不能重复下推药品运输单!", "error");
          return false;
        }
      }
    }
    if (args.args.cSvcUrl.indexOf("sy01_change_price") > 0) {
      for (let i = 0; i < selectData.length; i++) {
        checkSaleOutInvoiceQty(selectData[i].id, selectData[i].code);
      }
    }
    //下推出库复核判断，有下游单据，则不允许下推
    if (args.args.cSvcUrl.indexOf("9c79daf5") > 0) {
      for (let i = 0; i < selectData.length; i++) {
        debugger;
        if (selectData[i].srcBillType != "2") {
          cb.utils.alert("单据" + selectData[i].code + ": 此流程不允许下推【出库复核】", "error");
          return false;
        }
        if (selectData[i].status != 1) {
          cb.utils.alert("单据" + selectData[i].code + ": 未审核，不允许下推【出库复核】", "error");
          return false;
        }
        let data = { id: selectData[i].id, uri: "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6" };
        //判断是否有下游单据
        var returnPromise = new cb.promise();
        cb.rest.invokeFunction1(
          "GT22176AT10.publicFunction.checkChildOrderUnAud",
          data,
          function (err, res) {
            if (err) {
              cb.utils.alert(err.message, "error");
              return false;
            }
            if (res.Info && res.Info.length > 0) {
              cb.utils.alert("单据" + selectData[i].code + ": 销售出库复核已有相应单据！", "error");
              return false;
            }
            returnPromise.resolve();
          },
          undefined,
          { domainKey: "sy01" }
        );
        return returnPromise;
      }
    }
  });
});