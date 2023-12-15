var FBMLFPMXModel = viewModel.get("FBMLFPMXList");
var JTMLFPMXModel = viewModel.get("JTMLFPMXList");
var ZTMLFPMXModel = viewModel.get("ZTFPMXList");
viewModel.get("huijiqijian_code").on("afterValueChange", function (data) {
  // 会计期间--值改变后
  //清空现有表格内信息
  var FBMLFPMXRows = FBMLFPMXModel.getRows();
  var JTMLFPMXRows = JTMLFPMXModel.getRows();
  var ZTMLFPMXRows = ZTMLFPMXModel.getRows();
  if (FBMLFPMXRows.length > 0) {
    FBMLFPMXModel.deleteAllRows();
  }
  if (JTMLFPMXRows.length > 0) {
    JTMLFPMXModel.deleteAllRows();
  }
  if (ZTMLFPMXRows.length > 0) {
    ZTMLFPMXModel.deleteAllRows();
  }
  console.log(data.value);
  var TUANDUISHOURU = cb.rest.invokeFunction("GT3255AT6.backDesignerFunction.GETZHICHUML", { huijiqijian: data.value.code, huijiqijianid: data.value.id }, function (err, res) {}, viewModel, {
    async: false
  }).result.thisresult;
  console.log(TUANDUISHOURU);
  if (!!TUANDUISHOURU.jttotal) {
    viewModel.get("jituanfeiyongzonge").setValue(TUANDUISHOURU.jttotal);
  }
  if (!!TUANDUISHOURU.fbtotal) {
    viewModel.get("fenbufeiyongzonge").setValue(TUANDUISHOURU.fbtotal);
  }
  if (!!TUANDUISHOURU.zttotal) {
    viewModel.get("ZTFYZE").setValue(TUANDUISHOURU.zttotal);
  }
  if (!!TUANDUISHOURU.jtfp) {
    for (var i = 0; i < TUANDUISHOURU.jtfp.length; i++) {
      var rowdata1 = {
        tuandui: TUANDUISHOURU.jtfp[i].Team,
        tuandui_name: TUANDUISHOURU.jtfp[i].Teamname,
        jituanfudongfeiyong: TUANDUISHOURU.jtfp[i].tdjtfd,
        jituangudingfeiyong: TUANDUISHOURU.jtfp[i].jtgd,
        jituanbili: TUANDUISHOURU.jtfp[i].tdjtfdbl,
        feiyongjineheji: TUANDUISHOURU.jtfp[i].feiyongjineheji
      };
      JTMLFPMXModel.insertRow(i, rowdata1);
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
        feiyongjineheji: TUANDUISHOURU.tdfp[i].feiyongjineheji
      };
      FBMLFPMXModel.insertRow(i, rowdata2);
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
      ZTMLFPMXModel.insertRow(i, rowdata3);
    }
  }
});