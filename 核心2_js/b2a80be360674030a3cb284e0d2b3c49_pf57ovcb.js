viewModel.get("button17te") &&
  viewModel.get("button17te").on("click", function (data) {
    // 凭证拉取--单击
    cb.utils.loadingControl.start(); //开启一次loading
    let filterViewModelInfo = viewModel.getCache("FilterViewModel");
    let accbookId = filterViewModelInfo.get("accbookId").getFromModel().getValue();
    let makeTimeStart = filterViewModelInfo.get("makerDate").getFromModel().getValue();
    let makeTimeEnd = filterViewModelInfo.get("makerDate").getToModel().getValue();
    let accountPeriod = filterViewModelInfo.get("accountPeriod").getFromModel().getValue();
    if (accountPeriod.length < 7) {
      cb.utils.alert("请输入正确的会计期间！", "error");
      cb.utils.loadingControl.end(); //关闭一次loading
      return;
    }
    if (cb.utils.isEmpty(accountPeriod) || cb.utils.isEmpty(accbookId)) {
      cb.utils.alert("请设置查询区必填条件后，再进行凭证拉取操作", "error");
      cb.utils.loadingControl.end(); //关闭一次loading
      return;
    }
    let result = cb.rest.invokeFunction("AT17C47D1409580006.pztb.getVocherData", { accbookId, makeTimeStart, makeTimeEnd, accountPeriod }, function (err, res) {
      if (err) {
        cb.utils.alert(err.message, "error");
        return;
      } else {
        if (res.code == 200) {
          cb.utils.alert("凭证拉取更新成功", "info");
          //获取搜索模型后，使用fireEvent方法触发搜索模型上的点击事件
          viewModel.getCache("FilterViewModel").get("search").fireEvent("click");
        } else {
          cb.utils.alert("凭证拉取更新失败:" + res.message, "info");
        }
      }
    });
    cb.utils.loadingControl.end(); //关闭一次loading
  });
viewModel.get("button19di") &&
  viewModel.get("button19di").on("click", function (data) {
    cb.utils.confirm(
      "数据同步SAP之前应先加载最新数据，请确认是否继续！",
      () => {
        cb.utils.loadingControl.start(); //开启一次loading
        let selectedRows = viewModel.getGridModel().getSelectedRows();
        if (selectedRows.length == 0) {
          cb.utils.alert("请选择需要同步的凭证");
          cb.utils.loadingControl.end(); //关闭一次loading
          return false;
        }
        var rowDatas = selectedRows.map((item) => {
          return {
            id: item.id,
            accbookCode: item.accbookId_code,
            billCode: item.billCode,
            voucherTypeCode: item.voucherTypeCode,
            makeTime: item.makerDate
          };
        });
        cb.rest.invokeFunction("AT17C47D1409580006.pztb.vcCheckToSap", rowDatas, function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
          } else {
            console.log("vcCheckToSap执行成功:" + JSON.stringify(res));
            viewModel.execute("refresh");
          }
        });
        cb.utils.loadingControl.end(); //关闭一次loading
      },
      () => {
        return false;
      }
    );
  });
viewModel.on("afterMount", function (data) {
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  filterViewModelInfo.on("afterInit", function () {
    let startdtNow = new Date();
    startdtNow.setTime(startdtNow.getTime() - 30 * 24 * 60 * 60 * 1000); //当天日期减1天，天*小时*分钟*秒*毫秒
    let makeTimeStart = startdtNow.format("yyyy-MM-dd");
    filterViewModelInfo.get("accountPeriod").getFromModel().setValue(new Date().format("yyyy-MM"));
  });
});
viewModel.on("beforeSearch", function (data) {
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  //查询区afterResetClick事件，放在页面模型的afterMount和beforeSearch事件中可以生效
  filterViewModelInfo.on("afterResetClick", function (data) {
    let startdtNow = new Date();
    startdtNow.setTime(startdtNow.getTime() - 30 * 24 * 60 * 60 * 1000); //当天日期减1天，天*小时*分钟*秒*毫秒
    let makeTimeStart = startdtNow.format("yyyy-MM-dd");
    filterViewModelInfo.get("accountPeriod").getFromModel().setValue(new Date().format("yyyy-MM"));
    //在这个钩子里返回false的话可以阻止后续的搜索动作(默认为true)
    return false;
  });
});