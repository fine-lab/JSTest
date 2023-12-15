viewModel.on("customInit", function (data) {
  // 差旅费报销单--页面初始化
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
        var pk_endaddr = row.pk_endaddr; //目的地
        var ts = row.nhoteldays;
        data["ts"] = ts;
        data["pk_handlepsn"] = pk_handlepsn;
        data["pk_endaddr"] = pk_endaddr;
        cb.rest.invokeFunction("1fa0a0588805426ab1f919af230de444", { data: data }, function (err, res) {
          debugger;
          if (err != null) {
            cb.utils.alert("查询数据异常" + err.message);
            return false;
          } else {
            debugger;
            //收款方类型;银行账户;收款方账号;收款方户名;收款方开户行
            var jsxx = res.jsxx;
            var zwxx = res.zwxx;
            var clxx = res.clxx;
            var yhzh = jsxx.yhzh;
            var skfzh = jsxx.skfzh;
            var skfhm = jsxx.skfhm;
            var skfkhh = jsxx.skfkhh;
            var skf = jsxx.skf;
            var zw = zwxx.zw;
            var zwmc = zwxx.zwmc;
            var zsbz = clxx.zsbz;
            var ts = clxx.ts;
            var zzsbz = zsbz * ts;
            expsettleinfosgridModel.setCellValue(index, "igathertype", skf); //收款方类型
            expsettleinfosgridModel.setCellValue(index, "multiplebank", yhzh); //银行账户
            expsettleinfosgridModel.setCellValue(index, "vbankaccount", skfzh); //收款方账号
            expsettleinfosgridModel.setCellValue(index, "vbankaccname", skfhm); //收款方户名
            expsettleinfosgridModel.setCellValue(index, "vbankdocname", skfkhh); //收款方开户行
            expensebillbsgridModel.setCellValue(index, "pk_dutyjob", zw); //职务
            expensebillbsgridModel.setCellValue(index, "nhotelbasestdmny", zsbz); //住宿标准
            expensebillbsgridModel.setCellValue(index, "nhotelstdmny", zzsbz); //总住宿标准*天数
            expensebillbsgridModel.setCellValue(index, "pk_dutyjob_name", zwmc); //职务名称
          }
        });
      });
    }
  });
});