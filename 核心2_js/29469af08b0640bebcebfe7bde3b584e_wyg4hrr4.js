var YDFYFBJSModel = viewModel.get("YDFY0201List");
var YDFYJTJSModel = viewModel.get("YDFY0203List");
var YDFYZTJSModel = viewModel.get("YDFY0206List");
viewModel.get("huijiqijian_code").on("afterValueChange", function (data) {
  // 会计期间--值改变后
  //清空现有表格内信息
  var YDFYFBRows = YDFYFBJSModel.getRows();
  var YDFYJTRows = YDFYJTJSModel.getRows();
  var YDFYZTRows = YDFYZTJSModel.getRows();
  if (YDFYFBRows.length > 0) {
    YDFYFBJSModel.deleteAllRows();
  }
  if (YDFYJTRows.length > 0) {
    YDFYJTJSModel.deleteAllRows();
  }
  if (YDFYZTRows.length > 0) {
    YDFYZTJSModel.deleteAllRows();
  }
  console.log(data.value);
  var TUANDUISHOURU = cb.rest.invokeFunction("GT3255AT6.backDesignerFunction.GETZHICHU", { huijiqijian: data.value.code, huijiqijianid: data.value.id }, function (err, res) {}, viewModel, {
    async: false
  }).result.thisresult;
  console.log(TUANDUISHOURU);
  if (!!TUANDUISHOURU.jttotal) {
    viewModel.get("ziduan3").setValue(TUANDUISHOURU.jttotal);
  }
  if (!!TUANDUISHOURU.fbtotal) {
    viewModel.get("jigoufeiyongzonge").setValue(TUANDUISHOURU.fbtotal);
  }
  if (!!TUANDUISHOURU.zttotal) {
    viewModel.get("ZTFYZE").setValue(TUANDUISHOURU.zttotal);
  }
  if (!!TUANDUISHOURU.jtfp) {
    for (var i = 0; i < TUANDUISHOURU.jtfp.length; i++) {
      var rowdata1 = {
        tuandui: TUANDUISHOURU.jtfp[i].Team,
        tuandui_name: TUANDUISHOURU.jtfp[i].Teamname,
        gongsifudongfeiyong: TUANDUISHOURU.jtfp[i].tdjtfd,
        gongsigudingfeiyong: TUANDUISHOURU.jtfp[i].jtgd,
        gongsibili: TUANDUISHOURU.jtfp[i].tdjtfdbl,
        feiyongjineheji: TUANDUISHOURU.jtfp[i].feiyongjineheji.toFixed(2)
      };
      YDFYJTJSModel.insertRow(i, rowdata1);
    }
  }
  if (!!TUANDUISHOURU.tdfp) {
    for (var i = 0; i < TUANDUISHOURU.tdfp.length; i++) {
      var rowdata2 = {
        tuandui: TUANDUISHOURU.tdfp[i].Team,
        tuandui_name: TUANDUISHOURU.tdfp[i].Teamname,
        suoshufenbu: TUANDUISHOURU.tdfp[i].fenbu,
        suoshufenbu_name: TUANDUISHOURU.tdfp[i].fenbuname,
        jigoufudongfeiyong: TUANDUISHOURU.tdfp[i].fbfd,
        ziduan5: TUANDUISHOURU.tdfp[i].fbgd,
        jigoubili: TUANDUISHOURU.tdfp[i].fenbufudongbili,
        feiyongjineheji: TUANDUISHOURU.tdfp[i].feiyongjineheji.toFixed(2)
      };
      YDFYFBJSModel.insertRow(i, rowdata2);
    }
  }
  if (!!TUANDUISHOURU.ztfp) {
    for (var i = 0; i < TUANDUISHOURU.ztfp.length; i++) {
      var rowdata3 = {
        TD: TUANDUISHOURU.ztfp[i].Team,
        TD_name: TUANDUISHOURU.ztfp[i].Teamname,
        FB: TUANDUISHOURU.ztfp[i].fenbu,
        FB_name: TUANDUISHOURU.ztfp[i].fenbuname,
        ZTBL: TUANDUISHOURU.ztfp[i].ztfdbl,
        ZTFDFY: TUANDUISHOURU.ztfp[i].ztfd,
        ZTGDFY: TUANDUISHOURU.ztfp[i].ztgd,
        FYJEHJ: TUANDUISHOURU.ztfp[i].feiyongjineheji
      };
      YDFYZTJSModel.insertRow(i, rowdata3);
    }
  }
});