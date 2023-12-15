viewModel.on("customInit", function (data) {
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.core.min.js?domainKey=developplatform");
  document.body.insertBefore(secScript, document.body.lastChild);
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.common.extend.js?domainKey=developplatform");
  document.body.insertBefore(secScript, document.body.lastChild);
  viewModel.get("button29gg").on("click", function () {
    let gridModel = viewModel.getGridModel();
    let data = gridModel.getSelectedRows();
    if (data.length < 1) {
      cb.utils.alert("请选择要导出的数据");
      return false;
    }
    let masterId = [];
    for (let i = 0; i < data.length; i++) {
      let index = masterId.indexOf(data[i].id);
      if (index == -1) {
        masterId.push(data[i].id);
      }
    }
    getMaster = function () {
      return new Promise(function (resolve) {
        cb.rest.invokeFunction(
          "GT22176AT10.exportDrugAdministrationData.getUnqualApparatusM",
          {
            masterId: masterId
          },
          function (err, res) {
            if (typeof res != "undefined") {
              let masterArr = [];
              for (let arr = 0; arr < res.masterRes.length; arr++) {
                for (let arr1 = 0; arr1 < res.masterRes[arr].length; arr1++) {
                  masterArr.push(res.masterRes[arr][arr1]);
                }
              }
              resolve(masterArr);
              console.log(masterArr);
              console.log("1111111111111");
            } else {
              cb.utils.alert(err);
              console.log(err);
            }
            resolve();
          }
        );
      });
    };
    getChild = function () {
      return new Promise(function (resolve) {
        cb.rest.invokeFunction(
          "GT22176AT10.exportDrugAdministrationData.getUnqualApparatusC",
          {
            masterId: masterId
          },
          function (err, res) {
            if (typeof res != "undefined") {
              let childArr = res.childArr;
              resolve(childArr);
              console.log(childArr);
              console.log("1111111111111");
            } else {
              cb.utils.alert(err);
              console.log(err);
            }
            resolve();
          }
        );
      });
    };
    getMaster().then((masterArr) => {
      const sheetData1 = masterArr.map((item) => ({
        ID: item.id,
        编码: item.code,
        组织: item.org_id_name,
        部门: item.department_name,
        处理人: item.staff_name,
        单据状态: item.verifystate
      }));
      const sheet1 = XLSX.utils.json_to_sheet(sheetData1);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet1, "sheet1");
      getChild().then((childArr) => {
        let num;
        let workbookBlob;
        let sheetData2 = [];
        for (num = 0; num < sheetData1.length; num++) {
          sheetData2 = childArr[num].map((item1) => ({
            ID: item1.id,
            不合格登记单ID: item1.SY01_bad_drugv2_id,
            商品名称: item1.product_name,
            批次号: item1.lot_num,
            生产日期: item1.production_date,
            有效期至: item1.valid_until,
            不合格数量: item1.unqualified_num,
            不合格原因: item1.why_unqualified,
            包装规格: item1.specs
          }));
          // 支持多 sheet
          console.log(sheetData2);
          const sheet2 = XLSX.utils.json_to_sheet(sheetData2);
          // 支持多 sheet
          XLSX.utils.book_append_sheet(wb, sheet2, "sheet" + (num + 2));
        }
        workbookBlob = workbook2blob(wb);
        // 导出最后的总表
        openDownloadDialog(workbookBlob, "不合格器械.xlsx");
      });
    });
    // 支持多 sheet
  });
});