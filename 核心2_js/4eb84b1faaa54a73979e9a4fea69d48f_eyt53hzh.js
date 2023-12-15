run = function (event) {
  var viewModel = this;
  var gridModel = viewModel.getGridModel();
  //根据审核状态控制按钮显示
  gridModel.on("afterSetDataSource", function (data) {
    debugger;
    //获取行数据集合
    const rows = gridModel.getRows();
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        if ((action.cItemName == "btnEdit" || action.cItemName == "btnDelete") && data.verifystate != 0) {
          actionState[action.cItemName] = { visible: false };
        } else {
          actionState[action.cItemName] = { visible: true };
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.core.min.js?domainKey=developplatform");
  document.body.insertBefore(secScript, document.body.lastChild);
  var secScript1 = document.createElement("script");
  secScript1.setAttribute("type", "text/javascript");
  secScript1.setAttribute("src", "/iuap-yonbuilder-runtime/opencomponentsystem/public/GT22176AT10/xlsx.common.extend.js?domainKey=developplatform");
  document.body.insertBefore(secScript1, document.body.lastChild);
  viewModel.get("button40jh").on("click", function () {
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
          "GT22176AT10.exportDrugAdministrationData.getUnqualCruingM",
          {
            masterId: masterId
          },
          function (err, res) {
            if (typeof res != "undefined") {
              let masterArr = res.masterRes;
              let childArr = [];
              for (let arr = 0; arr < masterArr.length; arr++) {
                for (let arr1 = 0; arr1 < masterArr[arr].length; arr1++) {
                  childArr.push(masterArr[arr][arr1]);
                }
              }
              resolve(childArr);
              console.log(childArr);
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
    getMaster().then((childArr) => {
      let sheetData2 = [];
      for (let i = 0; i < childArr.length; i++) {
        sheetData2.push({
          生产批号: childArr[i].batch_no,
          生产日期: childArr[i].production_date,
          有效期至: childArr[i].valid_until,
          不合格数量: childArr[i].unqualified_num,
          不合格原因: childArr[i].buhegeyuanyin,
          是否已处理: getIsHandle(childArr[i].is_handleM),
          处理方式: childArr[i].remark,
          处理日期: childArr[i].date,
          本位码: childArr[i].standard_code, //standard_code
          包装规格: childArr[i].extend_package_specification
        });
      }
      // 支持多 sheet
      console.log(sheetData2);
      let sheet2 = XLSX.utils.json_to_sheet(sheetData2);
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet2, "sheet1");
      let workbookBlob = workbook2blob(wb);
      // 导出最后的总表
      openDownloadDialog(workbookBlob, "不合格药品.xlsx");
    });
  });
  viewModel.on("beforeBatchpush", function (args) {
    debugger;
    var gridModel = viewModel.getGridModel();
    var selectData = gridModel.getSelectedRows();
    let masterIds = [];
    var flag = 2;
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据");
      return false;
    }
    for (let i = 0; i < selectData.length; i++) {
      var verifystate = selectData[i].verifystate;
      masterIds.push(selectData[i].id);
      if (2 != verifystate) {
        cb.utils.alert("未审核的单据不允许下推!");
        return false;
      }
    }
  });
  getIsHandle = function (num) {
    if (num == 1) {
      return "True";
    } else if (num == 2) {
      return "false";
    }
  };
};