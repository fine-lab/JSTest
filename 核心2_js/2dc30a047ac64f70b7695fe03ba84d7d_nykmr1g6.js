run = function (event) {
  var viewModel = this;
  var gridModel = viewModel.getGridModel();
  let objs = [];
  gridModel.on("afterSetDataSource", function (data) {
    if (objs.length > 0) {
      for (let i = 0; i < objs.length; i++) {
        gridModel.appendRow({
          produce_date: objs[p].producedate,
          valid_until: objs[p].invaliddate,
          warehouse_qty: objs[p].qty,
          batchno: objs[p].batchno,
          standard_code: objs[p].bwm,
          package_specification: objs[p].bc,
          package_specification_packing_name: objs[p].bcName
        });
      }
    } else {
      getProducts().then((materialInfo) => {
        console.log(materialInfo);
        for (let i = 0; i < materialInfo.length; i++) {
          objs.push({
            produce_date: materialInfo[i].producedate,
            valid_until: materialInfo[i].invaliddate,
            warehouse_qty: materialInfo[i].qty,
            batchno: materialInfo[i].batchno,
            standard_code: materialInfo[i].bwm,
            package_specification: materialInfo[i].bc,
            package_specification_packing_name: materialInfo[i].bcName
          });
        }
        if (objs.length > 0) {
          for (let p = 0; p < objs.length && p < 10; p++) {
            gridModel.appendRow({
              produce_date: objs[p].producedate,
              valid_until: objs[p].invaliddate,
              warehouse_qty: objs[p].qty,
              batchno: objs[p].batchno,
              standard_code: objs[p].bwm,
              package_specification: objs[p].bc,
              package_specification_packing_name: objs[p].bcName
            });
          }
        }
      });
    }
  });
  gridModel.on("pageInfoChange", function () {
    return false;
  });
  getProducts = function () {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.exportDrugAdministrationData.getWourehousePdDate", {}, function (err, res) {
        console.log(res);
        if (typeof res !== "undefined") {
          let materialInfo = res.materialInfoSum;
          if (materialInfo.length > 0) {
            resolve(materialInfo);
          } else {
            alert("没有库存盘点单");
          }
        } else if (err !== null) {
          alert(err.message);
          return false;
        }
        resolve();
      });
    });
  };
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.core.min.js?domainKey=developplatform");
  document.body.insertBefore(secScript, document.body.lastChild);
  var secScript1 = document.createElement("script");
  secScript1.setAttribute("type", "text/javascript");
  secScript1.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.common.extend.js?domainKey=developplatform");
  document.body.insertBefore(secScript1, document.body.lastChild);
  viewModel.get("button24mi").on("click", function () {
    let gridModel = viewModel.getGridModel();
    let nowDate = new Date();
    let date = nowDate.toLocaleDateString();
    const sheetData1 = [
      {
        库存盘点截止时间: date
      }
    ];
    getProducts().then((materialInfo) => {
      let workbookBlob;
      let sheetData2 = [];
      sheetData2 = materialInfo.map((item1) => ({
        生产批号: item1.batchno,
        生产日期: item1.producedate,
        有效期至: item1.invaliddate,
        采购数量: item1.qty,
        本位码: item1.bwm,
        包装规格: item1.bcName
      }));
      // 支持多 sheet
      const wb = XLSX.utils.book_new();
      // 支持多 sheet
      const sheet1 = XLSX.utils.json_to_sheet(sheetData1);
      XLSX.utils.book_append_sheet(wb, sheet1, "sheet1");
      // 支持多 sheet
      const sheet2 = XLSX.utils.json_to_sheet(sheetData2);
      XLSX.utils.book_append_sheet(wb, sheet2, "sheet2");
      workbookBlob = workbook2blob(wb);
      // 导出最后的总表
      openDownloadDialog(workbookBlob, "库存数据.xlsx");
    });
  });
};