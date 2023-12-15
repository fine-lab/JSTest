viewModel.on("afterMount", function (params) {
  debugger;
  hideObjFromDB();
});
function hideObjFromDB() {
  var billNo = viewModel.getParams().billNo;
  cb.rest.invokeFunction(
    "GT3734AT5.APIFunc.getLimitFieldApi",
    { billNo: billNo },
    function (err, res) {
      if (err != null) {
        cb.utils.alert("权限控制异常");
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
              let isVisilble = fieldParams.isVisilble;
              if (isList) {
                //列表单据
                viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
              } else {
                //单据
                if (isMain) {
                  //主表
                  viewModel.get(fieldName).setVisible(isVisilble);
                  viewModel.get(fieldName).setState("bShowIt", isVisilble);
                  viewModel.get(fieldName).setState("bHidden", !isVisilble);
                } else {
                  viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                  viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
                }
              }
            }
          }
        }
      }
    },
    viewModel,
    { domainKey: "yourKeyHere" }
  );
}