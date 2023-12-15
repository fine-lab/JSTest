viewModel.on("customInit", function (data) {
  //通用报销
  viewModel.on("modeChange", function () {
    if (viewModel.getParams().mode == "edit") {
      debugger;
      var expensebillbsgridModel = viewModel.get("expensebillbs");
      var expensebillbs = expensebillbsgridModel.getData();
      var expsettleinfosgridModel = viewModel.get("expsettleinfos");
      var data = {};
      expensebillbs.forEach((row) => {
        debugger;
        var gysdata = {};
        var index = row.index;
        var pk_handlepsn = row.pk_handlepsn;
        var pk_cusdoc_name = row.pk_cusdoc_name; //供应商
        var vdef1 = row.vdef1; //供应商code
        var pk_cusdoc = row.pk_cusdoc; //供应商id
        data["pk_cusdoc_name"] = pk_cusdoc_name;
        data["vdef1"] = vdef1;
        data["pk_cusdoc"] = pk_cusdoc;
        data["pk_handlepsn"] = pk_handlepsn;
        cb.rest.invokeFunction("6157e1f0eeef43e8b467f2e4e6f172f3", { data: data }, function (err, res) {
          debugger;
          if (err != null) {
            cb.utils.alert("查询数据异常" + err.message);
            return false;
          } else {
            debugger;
            //收款方类型;银行账户;收款方账号;收款方户名;收款方开户行
            var jsxx = res.jsxx;
            var yhzh = jsxx.yhzh;
            var skfzh = jsxx.skfzh;
            var skfhm = jsxx.skfhm;
            var skfkhh = jsxx.skfkhh;
            var skf = jsxx.skf;
            expsettleinfosgridModel.setCellValue(index, "igathertype", skf); //收款方类型
            expsettleinfosgridModel.setCellValue(index, "multiplebank", yhzh); //银行账户
            expsettleinfosgridModel.setCellValue(index, "vbankaccount", skfzh); //收款方账号
            expsettleinfosgridModel.setCellValue(index, "vbankaccname", skfhm); //收款方户名
            expsettleinfosgridModel.setCellValue(index, "vbankdocname", skfkhh); //收款方开户行
          }
        });
      });
    }
  });
});