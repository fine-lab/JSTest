viewModel.get("button27qe") &&
  viewModel.get("button27qe").on("click", function (data) {
    // 获取审批人--单击
  });
viewModel.get("button27zf") &&
  viewModel.get("button27zf").on("click", function (data) {
    // 获取审批人--单击
    lobj = viewModel;
    console.log(viewModel.__data);
    cb.rest.invokeFunction("AT17FE7F8616F80008.HDJB.getAppInfo", { bglx: "变更申请", sybm: lobj.getData("shenqingbumen").shenqingbumen }, function (err, res) {
      console.log(res);
      lres = res;
      const rowData = lobj.getGridModel("LCZXList");
      let arr = rowData.getDataSourceRows();
      arr = arr.filter((item) => {
        if (!item.liuzhuanguizeid) {
          // 执行删除
          return true;
        }
        return false;
      });
      rowData.setDataSource(arr);
      for (var i = 0; i < lres.res.length; i++) {
        rowData.appendRow({
          liuzhuanguizeid: lres.res[i].id,
          huanjiebianma: lres.res[i].huanjiebianma,
          huanjiemingchen: lres.res[i].huanjiemingchen,
          zhixingyaoqiu: lres.res[i].zhixingyaoqiu,
          canyuren: lres.res[i].morencanyuren
        });
      }
    });
  });