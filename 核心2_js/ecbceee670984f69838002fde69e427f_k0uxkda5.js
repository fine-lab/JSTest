viewModel.enableFeature("disabledExportUpperLimit");
viewModel.get("button41yf") &&
  viewModel.get("button41yf").on("click", function (data) {
    //其他入库/调拨--单击
    let selectedData = viewModel.getGridModel().getSelectedRows();
    let flag = true;
    if (selectedData.length == 0) {
      cb.utils.alert("请至少选择一条数据!");
    } else {
      let count = 0;
      let queryresult = cb.rest.invokeFunction("ST.afterfun.queryneeddata", { selectedData }, function (err, res) {}, viewModel, { async: false });
      if (queryresult.hasOwnProperty("result") && queryresult.result.hasOwnProperty("needpushdata")) {
        let needpushdata1 = queryresult.result.needpushdata;
        if (needpushdata1.length > 0) {
          for (let i = 0; i < needpushdata1.length; i++) {
            let needpushdata = needpushdata1[i];
            let result = cb.rest.invokeFunction("ST.afterfun.makepushdata", { needpushdata }, function (err, res) {}, viewModel, { async: false });
            if (result.hasOwnProperty("result") && result.result.hasOwnProperty("allpushdata")) {
              let allpushdata = result.result.allpushdata;
              let result1 = cb.rest.invokeFunction("ST.afterfun.processdata", { allpushdata }, function (err, res) {}, viewModel, { async: false });
              if (result1.hasOwnProperty("result") && result1.result.hasOwnProperty("pushdadaflag")) {
                let pushdataflag = result1.result.pushdadaflag;
                if (pushdataflag) {
                  let updateid = needpushdata1[i].id;
                  let updateresult = cb.rest.invokeFunction("ST.afterfun.updateSale", { updateid: updateid }, function (err, res) {}, viewModel, { async: false });
                  if (updateresult.hasOwnProperty("result") && updateresult.result.hasOwnProperty("successcount")) {
                    count = count + updateresult.result.successcount;
                  }
                }
              }
            }
          }
        }
        if (count > 0) {
          cb.utils.alert("已成功执行:" + count + "条数据");
        } else {
          cb.utils.alert("没有满足条件的数据!");
        }
      }
    }
  });