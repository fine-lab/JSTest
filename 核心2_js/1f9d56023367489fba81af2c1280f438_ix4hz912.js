viewModel.get("button26od") &&
  viewModel.get("button26od").on("click", function (data) {
    // 关闭--单击
    let idx = data.index;
    let dataRows = viewModel.getGridModel("qysqd_1567146954139369476").getRows();
    let dataObj = dataRows[idx];
    let id = dataObj.id;
    let code = dataObj.code;
    let isClosed = dataObj.isClosed;
    if (isClosed) {
      cb.utils.alert("温馨提示，该单据已经关闭！[" + code + "]", "info");
      return;
    }
    cb.utils.confirm(
      "确定要关闭签约申请单[" + code + "]吗？关闭作废单据不可逆!",
      function () {
        cb.rest.invokeFunction("GT3734AT5.APIFunc.closePIApi", { id: id, code: code, shiyebu: dataObj.shiyebu, schemeBillId: dataObj.schemeBillId }, function (err, res) {
          if (err == null) {
            cb.utils.alert("温馨提示，该单据关闭成功！[" + code + "]", "info");
            viewModel.execute("refresh");
          }
        });
      },
      function (args) {}
    );
  });
function synFieldLimit() {
  debugger;
  var returnPromise = new cb.promise(); //同步
  var billNo = viewModel.getParams().billNo;
  cb.rest.invokeFunction("GT3734AT5.APIFunc.getLimitFieldApi", { billNo: billNo }, function (err, res) {
    debugger;
    if (err != null) {
      cb.utils.alert("权限控制异常");
      returnPromise.resolve();
    } else {
      if (res.data.length > 0) {
        let data = res.data;
        for (let i in data) {
          let dataObj = data[i];
          let fieldParamsList = dataObj.FieldParamsList;
          let isList = dataObj.isList;
          for (j in fieldParamsList) {
            let fieldParams = fieldParamsList[j];
            let fieldName = fieldParams.fieldName;
            let isMain = fieldParams.isMain;
            let childrenField = fieldParams.childrenField;
            let isVisilble = dataObj.isVisilble;
            if (isList) {
              //列表单据
              viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
              viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
            } else {
              //单据
              if (isMain) {
                //主表
                viewModel.get(fieldName).setVisible(isVisilble);
              } else {
                viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
              }
            }
          }
        }
      }
      returnPromise.resolve();
    }
  });
  return returnPromise;
}
viewModel.on("customInit", function (data) {
  // 签约申请单--页面初始化
  let gridModel = viewModel.getGridModel("qysqd_1567146954139369476");
  gridModel.on("cellJointQuery", function (args) {
    let cellName = args.cellName;
    if ("schemeBillNo" != cellName) {
      return;
    }
    let shiyebu_name = args.row.shiyebu_name;
    let billno = "c783f00c"; //建机
    if (shiyebu_name.includes("环保")) {
      billno = "69939af7";
    } else if (shiyebu_name.includes("游乐")) {
      billno = "b8a7fc44";
    }
    let dataBody = {
      billtype: "Voucher",
      billno: billno,
      domainKey: "yourKeyHere",
      mode: "browse",
      params: {
        mode: "edit", // (编辑态edit、新增态add、浏览态browse)
        isBrowse: true,
        readOnly: true,
        id: args.row.schemeBillId
      }
    };
    cb.loader.runCommandLine("bill", dataBody, viewModel);
  });
  var returnPromise = new cb.promise(); //同步
  var billNo = viewModel.getParams().billNo;
  cb.rest.invokeFunction(
    "GT3734AT5.APIFunc.getLimitFieldApi",
    { billNo: billNo },
    function (err, res) {
      debugger;
      if (err != null) {
        cb.utils.alert("权限控制异常");
        returnPromise.resolve();
      } else {
        if (res.data.length > 0) {
          let data = res.data;
          for (let i in data) {
            let dataObj = data[i];
            let fieldParamsList = dataObj.FieldParamsList;
            let isList = dataObj.isList;
            for (j in fieldParamsList) {
              let fieldParams = fieldParamsList[j];
              let fieldName = fieldParams.fieldName;
              let isMain = fieldParams.isMain;
              let childrenField = fieldParams.childrenField;
              let isVisilble = dataObj.isVisilble;
              if (isList) {
                //列表单据
                viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
              } else {
                //单据
                if (isMain) {
                  //主表
                  viewModel.get(fieldName).setVisible(isVisilble);
                } else {
                  viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                  viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
                }
              }
            }
          }
        }
        returnPromise.resolve();
      }
    },
    viewModel,
    { domainKey: "yourKeyHere" }
  );
  return returnPromise;
});
viewModel.on("afterMount", function (params) {});