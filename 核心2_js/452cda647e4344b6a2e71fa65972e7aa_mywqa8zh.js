viewModel.get("button27fg") &&
  viewModel.get("button27fg").on("click", function (data) {
    // 存量查询--单击
    var girdModel = viewModel.getGridModel();
    // 获取grid中已选中行的数据
    const XianCun = girdModel.getSelectedRows();
    if (XianCun.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    var XianCun1 = XianCun[0].shangpinbianma;
    const Xcun = XianCun[0].xiancunliang;
    const Kyong = XianCun[0].keyongliang;
    let data1 = {
      billtype: "VoucherList", // 单据类型
      billno: "1c02bb02", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        XianCun1: XianCun1,
        Xcun: Xcun,
        Kyong: Kyong
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });
viewModel.get("Z_102List") &&
  viewModel.get("Z_102List").getEditRowModel() &&
  viewModel.get("Z_102List").getEditRowModel().get("shangpinbianma.code") &&
  viewModel
    .get("Z_102List")
    .getEditRowModel()
    .get("shangpinbianma.code")
    .on("aftervalueChange", function (data) {
      // 商品编码--值改变
      var girdModel = viewModel.getGridModel;
      var delvkouidp = data.value;
    });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 销售组织--值改变后
    var currrentParams = data.value;
    if (currrentParams === null) return;
    const kuchun = currrentParams.codename;
    const kuchunId = currrentParams.id;
    const orgcode = currrentParams.code;
    var girdModel = viewModel.getGridModel();
    girdModel.setColumnValue("kucunzuzhi_name", kuchun);
    girdModel.setColumnValue("kucunzuzhi", kuchunId);
    girdModel.setColumnValue("diaoruzuzhi_name", kuchun);
    girdModel.setColumnValue("diaoruzuzhi", kuchunId);
    girdModel.setColumnValue("xuqiuzuzhi_name", kuchun);
    girdModel.setColumnValue("xuqiuzuzhi", kuchunId);
    girdModel.setColumnValue("org_name", kuchun);
    girdModel.setColumnValue("org", kuchunId);
    girdModel.setColumnValue("xuqiuzuzhibianma_code", orgcode);
    girdModel.setColumnValue("xuqiuzuzhibianma", kuchunId);
    girdModel.setColumnValue("caigouzuzhibianma_code", orgcode);
    girdModel.setColumnValue("caigouzuzhibianma", kuchunId);
  });
viewModel.on("afterAddRow", function (data) {
  let gridModel = viewModel.getGridModel();
  var kuchun1 = viewModel.get("org_id_name").getValue();
  var kuchunId1 = viewModel.get("org_id").getValue();
  var orgcode1 = gridModel.getCellValue(0, "xuqiuzuzhibianma_code");
  gridModel.setCellValue(data.data.index, "kucunzuzhi_name", kuchun1);
  gridModel.setCellValue(data.data.index, "kucunzuzhi", kuchunId1);
  gridModel.setCellValue(data.data.index, "diaoruzuzhi_name", kuchun1);
  gridModel.setCellValue(data.data.index, "diaoruzuzhi", kuchunId1);
  gridModel.setCellValue(data.data.index, "xuqiuzuzhi_name", kuchun1);
  gridModel.setCellValue(data.data.index, "xuqiuzuzhi", kuchunId1);
  gridModel.setCellValue(data.data.index, "org_name", kuchun1);
  gridModel.setCellValue(data.data.index, "org", kuchunId1);
  gridModel.setCellValue(data.data.index, "xuqiuzuzhibianma_code", orgcode1);
  gridModel.setCellValue(data.data.index, "xuqiuzuzhibianma", kuchunId1);
  gridModel.setCellValue(data.data.index, "caigouzuzhibianma_code", orgcode1);
  gridModel.setCellValue(data.data.index, "caigouzuzhibianma", kuchunId1);
});
viewModel.get("Z_102List") &&
  viewModel.get("Z_102List").getEditRowModel() &&
  viewModel.get("Z_102List").getEditRowModel().get("wushuijine") &&
  viewModel
    .get("Z_102List")
    .getEditRowModel()
    .get("wushuijine")
    .on("blur", function (data) {
      // 无税金额--失去焦点的回调
      var girdModel = viewModel.getGridModel();
      //税率
      var a = girdModel.__data.colFilterDataSourceMap.shuilv_ntaxRate[0].value;
      //无税金额
      var b = girdModel.__data.colFilterDataSourceMap.wushuijine[0].value;
      var taxrate = a / 100;
      //销售数量
      var c = girdModel.__data.colFilterDataSourceMap.xiaoshoushuliang[0].value;
      //计算含税金额
      var HanShui = b * (1 + taxrate);
      girdModel.setCellValue(0, "hanshuijine", HanShui);
      //取到改变后的含税金额
      var e = girdModel.__data.colFilterDataSourceMap.hanshuijine[0].value;
      //计算含税成交价
      var HanShuiPrice = e / c;
      girdModel.setCellValue(0, "ziduan15", HanShuiPrice);
    });
viewModel.get("Z_102List") &&
  viewModel.get("Z_102List").getEditRowModel() &&
  viewModel.get("Z_102List").getEditRowModel().get("wushuichengjiaojia") &&
  viewModel
    .get("Z_102List")
    .getEditRowModel()
    .get("wushuichengjiaojia")
    .on("blur", function (data) {
      // 无税成交价--失去焦点的回调
      var girdModel = viewModel.getGridModel();
      //无税成交价
      var d = girdModel.__data.colFilterDataSourceMap.wushuichengjiaojia[0].value;
      //销售数量
      var c = girdModel.__data.colFilterDataSourceMap.xiaoshoushuliang[0].value;
      //计算无税金额
      var WuShui = c * d;
      girdModel.setCellValue(0, "wushuijine", WuShui);
      //取到改变够的无税金额
      var b = girdModel.__data.colFilterDataSourceMap.wushuijine[0].value;
      //税率
      var a = girdModel.__data.colFilterDataSourceMap.shuilv_ntaxRate[0].value;
      var taxrate = a / 100;
      //计算含税金额
      var HanShui = b * (1 + taxrate);
      girdModel.setCellValue(0, "hanshuijine", HanShui);
      //取到改变后的含税金额
      var e = girdModel.__data.colFilterDataSourceMap.hanshuijine[0].value;
      //计算含税成交价
      var HanShuiPrice = e / c;
      girdModel.setCellValue(0, "ziduan15", HanShuiPrice);
      //取到改变后的含税成交价
      var f = girdModel.__data.colFilterDataSourceMap.ziduan15[0].value;
      //计算销售数量
      //计算税率
    });
viewModel.get("button33ob") &&
  viewModel.get("button33ob").on("click", function (data) {
    // 保存订单--单击
    var girdModel = viewModel.getGridModel();
    let biao1 = viewModel.getData();
    let aa = girdModel.getData();
    var Aape = biao1.xiatui;
    if (Aape == "1") {
      cb.utils.alert("不能重复保存!", "error");
      return true;
    } else {
      var qg = cb.rest.invokeFunction(
        "GT8325AT36.Apeisd.QingGouDingDan",
        { biao1: biao1 },
        function (err, res) {},
        girdModel,
        { async: false }
      );
      var TB = cb.rest.invokeFunction(
        "GT8325AT36.Apeisd.DiaoBoDingDan",
        { biao1: biao1, aa: aa },
        function (err, res) {},
        girdModel,
        { async: false }
      );
      var XS = cb.rest.invokeFunction(
        "GT8325AT36.Apeisd.XiaoShouDingDan",
        { biao1: biao1 },
        function (err, res) {},
        girdModel,
        { async: false }
      );
      cb.utils.alert("保存成功!", "success");
    }
    var HX = cb.rest.invokeFunction("GT8325AT36.Apeisd.XTHX", { biao1: biao1 }, function (err, res) {}, girdModel, { async: false });
  });