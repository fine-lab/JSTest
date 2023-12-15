viewModel.on("customInit", function (data) {
  var viewModel = this;
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.core.min.js?domainKey=developplatform");
  document.body.insertBefore(secScript, document.body.lastChild);
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.common.extend.js?domainKey=developplatform");
  document.body.insertBefore(secScript, document.body.lastChild);
  if (viewModel.get("batchpush80dd77de-7d82-11ec-96e4-fa163e3d9426")) {
    viewModel.get("batchpush80dd77de-7d82-11ec-96e4-fa163e3d9426").setVisible(false);
  }
  viewModel.get("button105oh").on("click", function () {
    let gridModel = viewModel.getGridModel();
    let data = gridModel.getSelectedRows();
    if (data.length < 1) {
      cb.utils.alert("请选择要导出的数据");
      return false;
    }
    let codeArr = [];
    let masterId = [];
    let vendor_name = {};
    let vendorName = [];
    for (let i = 0; i < data.length; i++) {
      if (codeArr.indexOf(data[i].code) != -1) {
        cb.utils.alert("请切换显示样式为[表头]进行导出,不要选择[表头+表体]");
        return false;
      } else {
        codeArr.push(data[i].code);
      }
      let index = masterId.indexOf(data[i].id);
      if (index == -1) {
        let zId = data[i].id;
        masterId.push(data[i].id);
        vendor_name[zId] = data[i].vendor_name;
      }
    }
    getPurchaseM = function (type) {
      return new Promise(function (resolve) {
        cb.rest.invokeFunction(
          "ST.exportDrugAdministrationData.purchaseInExportM",
          {
            masterId: masterId,
            vendor_name: vendor_name,
            type: type
          },
          function (err, res) {
            if (typeof res != "undefined") {
              let masterArr = res.masterRes;
              resolve(masterArr);
            } else if (typeof err != "undefined") {
              cb.utils.alert(err);
              return false;
            }
            resolve();
          }
        );
      });
    };
    getPurchaseM("采购入库").then((masterArr) => {
      const sheetData1 = masterArr.map((item) => ({
        采购日期: ymdDate(item.vouchdate),
        供货企业: item.vendor_name,
        销售单号: item.extend_sale_with_goods,
        入库单号: item.code,
        运输设备: "",
        运输开始时间: "",
        运输结束时间: "",
        温度记录: "",
        验收员名称: "吴小敏",
        购进结论: "符合规定"
      }));
      // 支持多 sheet
      const sheet1 = XLSX.utils.json_to_sheet(sheetData1);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet1, "sheet1");
      for (let i = 0; i < masterArr.length; i++) {
        let sheetData2 = [];
        for (let j = 0; j < masterArr[i].entryInfo.length; j++) {
          sheetData2.push({
            生产批号: masterArr[i].entryInfo[j].batchno,
            生产日期: ymdDate(masterArr[i].entryInfo[j].producedate),
            有效期至: ymdDate(masterArr[i].entryInfo[j].invaliddate),
            采购数量: masterArr[i].entryInfo[j].qty,
            本位码: masterArr[i].entryInfo[j].extend_bwm,
            包装规格: masterArr[i].entryInfo[j].extend_package_specification
          });
        }
        // 支持多 sheet
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheetData2), "sheet" + (i + 2));
        // 支持多 sheet
      }
      let workbookBlob = workbook2blob(wb);
      openDownloadDialog(workbookBlob, "采购入库.xlsx");
    });
    // 导出最后的总表
  });
  viewModel.get("button130ab").on("click", function () {
    let gridModel = viewModel.getGridModel();
    let data = gridModel.getSelectedRows();
    if (data.length < 1) {
      cb.utils.alert("请选择要导出的数据");
      return false;
    }
    let codeArr = [];
    let masterId = [];
    let vendor_name = {};
    let vendorName = [];
    for (let i = 0; i < data.length; i++) {
      if (codeArr.indexOf(data[i].code) != -1) {
        cb.utils.alert("请切换显示样式为[表头]进行导出,不要选择[表头+表体]");
        return false;
      } else {
        codeArr.push(data[i].code);
      }
      let index = masterId.indexOf(data[i].id);
      if (index == -1) {
        let zId = data[i].id;
        masterId.push(data[i].id);
        vendor_name[zId] = data[i].vendor_name;
      }
    }
    getPurchaseM = function (type) {
      return new Promise(function (resolve) {
        cb.rest.invokeFunction(
          "ST.exportDrugAdministrationData.purchaseInExportThM",
          {
            masterId: masterId,
            vendor_name: vendor_name,
            type: type
          },
          function (err, res) {
            if (typeof res != "undefined") {
              let masterArr = res.masterRes;
              resolve(masterArr);
              console.log(masterArr);
              console.log("1111111111111");
            } else if (typeof err != "undefined") {
              cb.utils.alert(err);
              return false;
            }
            resolve();
          }
        );
      });
    };
    getPurchaseM("采购退货").then((masterArr) => {
      const sheetData1 = masterArr.map((item) => ({
        退货日期: ymdDate(item.vouchdate),
        供货企业: item.vendor_name,
        出库单号: item.code,
        处理人: item.salasName,
        运输方式: "",
        承运人: "",
        运输开始时间: "",
        运输结束时间: "",
        起运温度: "",
        到达温度: ""
      }));
      // 支持多 sheet
      const sheet1 = XLSX.utils.json_to_sheet(sheetData1);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet1, "sheet1");
      let num;
      let workbookBlob;
      for (let i = 0; i < masterArr.length; i++) {
        let sheetData2 = [];
        for (let j = 0; j < masterArr[i].entryInfo.length; j++) {
          sheetData2.push({
            生产批号: masterArr[i].entryInfo[j].batchno,
            生产日期: ymdDate(masterArr[i].entryInfo[j].producedate),
            有效期至: ymdDate(masterArr[i].entryInfo[j].invaliddate),
            退货数量: -masterArr[i].entryInfo[j].qty,
            退货原因: masterArr[i].memo,
            销售单号: masterArr[i].saleWithGoods,
            本位码: masterArr[i].entryInfo[j].extend_bwm,
            包装规格: masterArr[i].entryInfo[j].extend_package_specification
          });
        }
        // 支持多 sheet
        console.log(sheetData2);
        const sheet2 = XLSX.utils.json_to_sheet(sheetData2);
        // 支持多 sheet
        XLSX.utils.book_append_sheet(wb, sheet2, "sheet" + (i + 2));
      }
      workbookBlob = workbook2blob(wb);
      // 导出最后的总表
      openDownloadDialog(workbookBlob, "退货出库记录.xlsx");
    });
  });
  function ymdDate(date) {
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
});