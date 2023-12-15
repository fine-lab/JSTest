viewModel.get("button72ve") &&
  viewModel.get("button72ve").on("click", function (data) {
    // 计算--单击
    debugger;
    let mode = viewModel.getParams().mode;
    if (mode != "edit" && mode != "add") {
      cb.utils.alert("仅编辑态和新增态使用", "error");
      return;
    }
    var qsdj = viewModel.get("item180xg").getValue();
    var qsgz = viewModel.get("item309jk").getValue();
    var danjuxiaoshouzuzhi = viewModel.get("chengdanxiaoshouzuzhi").getValue();
    var danjubizhong = viewModel.get("danjubizhong").getValue();
    var customerType = viewModel.get("fljsjg_customerTypeList").getAllData();
    var merchant = viewModel.get("fljsjg_merchantList").getAllData();
    var product = viewModel.get("fljsjg_productList").getAllData();
    var kaishiriqi = viewModel.get("kaishiriqi").getValue();
    var jiezhiriqi = viewModel.get("jiezhiriqi").getValue();
    var dailishang = viewModel.get("dailishang").getValue();
    let id = viewModel.get("id").getValue();
    var billTypeVO = viewModel.get("billTypeVO").getValue();
    var billTypeVO_name = viewModel.get("billTypeVO_name").getValue();
    let request = {
      qsdj: qsdj,
      qsgz: qsgz,
      danjuxiaoshouzuzhi: danjuxiaoshouzuzhi,
      danjubizhong: danjubizhong,
      customerType: customerType,
      merchant: merchant,
      product: product,
      kaishiriqi: kaishiriqi,
      jiezhiriqi: jiezhiriqi,
      dailishang: dailishang
    };
    let res = cb.rest.invokeFunction("9b698dbd928d4efaa796e4763ec09da3", request, null, viewModel, { async: false });
    let objArr = res.result.objArr;
    const gridModel = viewModel.get("fljsjgsList");
    gridModel.clear();
    //删除数据库数据
    if (id) {
      var res2 = cb.rest.invokeFunction("10339c02abb1437a8c1367709924a086", { fljsjg_id: id }, null, viewModel, { async: false });
    }
    for (var i = 0; i < objArr.length; i++) {
      let data = objArr[i];
      gridModel.appendRow({
        hanghao: data.hanghao,
        salesOrg: data.salesOrg,
        salesOrg_name: data.salesOrg_name,
        financeOrg: data.financeOrg,
        zDY005: data.zDY005,
        zDY005_name: data.zDY005_name,
        zDY003: data.zDY003,
        zDY003_name: data.zDY003_name,
        customerType: data.customerType,
        customerType_name: data.customerType_name,
        dls_pss: data.dls_pss,
        dls_pss_name: data.dls_name,
        merchant: data.merchant,
        merchant_name: data.merchant_name,
        billTypeVO: billTypeVO,
        billTypeVO_name: billTypeVO_name,
        code: data.code,
        product: data.product,
        product_name: data.product_name,
        modelDescription: data.modelDescription,
        unit: data.unit,
        unit_name: data.unit_name,
        fahuoriqi: data.fahuoriqi,
        invProductType: data.invProductType,
        gongsidanjia: data.gongsidanjia,
        kehudanjia: data.kehudanjia,
        xiaoshoujingjia: data.xiaoshoujingjia,
        fahuoshuliang: data.fahuoshuliang,
        zheqianjine: data.zheqianjine,
        fahuojine: data.fahuojine,
        fanlibiaozhun: data.fanlibiaozhun,
        fanlijine: data.fanlijine,
        diaozhenghoujine: data.diaozhenghoujine,
        danjuid: data.danjuid
      });
    }
  });