viewModel.on("afterLoadData", function (data) {
  // 授信审批开立详情--页面初始化 afterLoadData customInit
  debugger;
  let optionAllXiShu = { async: false };
  let inData = { xx: "xx" };
  let resXIShuAll = cb.rest.invokeFunction("18862c5671234edd81cea94ab089a79a", inData, null, viewModel, optionAllXiShu);
  let shangnianshijixiaoshoue = resXIShuAll.result.shangnianshijixiaoshoue;
  let shangyinianfahuojine = resXIShuAll.result.shangyinianfahuojine;
  viewModel.get("shangnianshijixiaoshoue").setValue(shangnianshijixiaoshoue);
  viewModel.get("shangyinianfahuojine").setValue(shangyinianfahuojine);
});
viewModel.get("biangengshouxinjieshuriqi") &&
  viewModel.get("biangengshouxinjieshuriqi").on("afterValueChange", function (data) {
    // 变更授信结束日期--值改变后
    const biangengshouxinkaishiriqi = viewModel.get("biangengshouxinkaishiriqi").getValue();
    const biangengshouxinjieshuriqi = viewModel.get("biangengshouxinjieshuriqi").getValue();
    if (biangengshouxinjieshuriqi < biangengshouxinkaishiriqi) {
      viewModel.get("biangengshouxinjieshuriqi").setValue(null);
    }
  });
viewModel.get("zhongzhiriqi") &&
  viewModel.get("zhongzhiriqi").on("afterValueChange", function (data) {
    // 授信终止日期--值改变后
    const kaishiriqi = viewModel.get("kaishiriqi").getValue();
    const zhongzhiriqi = viewModel.get("zhongzhiriqi").getValue();
    if (zhongzhiriqi < kaishiriqi) {
      viewModel.get("zhongzhiriqi").setValue(null);
    }
  });
viewModel.get("jianyibiangengshouxinjieshuriqi") &&
  viewModel.get("jianyibiangengshouxinjieshuriqi").on("afterValueChange", function (data) {
    // 建议变更授信结束日期--值改变后
    const jianyibiangengshouxinkaishiriqi = viewModel.get("jianyibiangengshouxinkaishiriqi").getValue();
    const jianyibiangengshouxinjieshuriqi = viewModel.get("jianyibiangengshouxinjieshuriqi").getValue();
    if (jianyibiangengshouxinjieshuriqi < jianyibiangengshouxinkaishiriqi) {
      viewModel.get("jianyibiangengshouxinjieshuriqi").setValue(null);
    }
  });
viewModel.get("shenqinggongsi_name") &&
  viewModel.get("shenqinggongsi_name").on("afterValueChange", function (data) {
    // 申请公司--值改变后const value = viewModel.get("控件编码").getValue();
    debugger;
    const shenqinggongsi = viewModel.get("shenqinggongsi").getValue();
    const kehudaima = viewModel.get("kehudaima").getValue();
    if (shenqinggongsi != null || kehudaima != null) {
      let optionAllXiShu = { async: false };
      let inData = { shenqinggongsi: shenqinggongsi, kehudaima: kehudaima };
      let resXIShuAll = cb.rest.invokeFunction("8154ff2a9802454bb763d27bd3483557", inData, null, viewModel, optionAllXiShu);
      let zongyingshouzhang = resXIShuAll.result.zongyingshouzhang;
      let meidaoqi = resXIShuAll.result.meidaoqi;
      let onethirtytian = resXIShuAll.result.onethirtytian;
      let thirtysixtytian = resXIShuAll.result.thirtysixtytian;
      let sixtytianyishang = resXIShuAll.result.sixtytianyishang;
      let beizhu = resXIShuAll.result.beizhu;
      let kaishiriqi = resXIShuAll.result.shouxinqishiri;
      let zhongzhiriqi = resXIShuAll.result.shouxinjieshuri;
      let shenqingshouxine = resXIShuAll.result.shouxine;
      viewModel.get("zongyingshouzhang").setValue(zongyingshouzhang);
      viewModel.get("meidaoqi").setValue(meidaoqi);
      viewModel.get("onethirtytian").setValue(onethirtytian);
      viewModel.get("thirtysixtytian").setValue(thirtysixtytian);
      viewModel.get("sixtytianyishang").setValue(sixtytianyishang);
      viewModel.get("beizhu").setValue(beizhu);
      viewModel.get("kaishiriqi").setValue(kaishiriqi);
      viewModel.get("zhongzhiriqi").setValue(zhongzhiriqi);
      viewModel.get("shenqingshouxine").setValue(shenqingshouxine);
    }
  });
viewModel.get("kehudaima") &&
  viewModel.get("kehudaima").on("afterValueChange", function (data) {
    // 客户代码--值改变后
    debugger;
    const shenqinggongsi = viewModel.get("shenqinggongsi").getValue();
    const kehudaima = viewModel.get("kehudaima").getValue();
    if (shenqinggongsi != null || kehudaima != null) {
      debugger;
      let optionAllXiShu = { async: false };
      let inData = { shenqinggongsi: shenqinggongsi, kehudaima: kehudaima };
      let resXIShuAll = cb.rest.invokeFunction("8154ff2a9802454bb763d27bd3483557", inData, null, viewModel, optionAllXiShu);
      let zongyingshouzhang = resXIShuAll.result.zongyingshouzhang;
      let meidaoqi = resXIShuAll.result.meidaoqi;
      let onethirtytian = resXIShuAll.result.onethirtytian;
      let thirtysixtytian = resXIShuAll.result.thirtysixtytian;
      let sixtytianyishang = resXIShuAll.result.sixtytianyishang;
      let beizhu = resXIShuAll.result.beizhu;
      let kaishiriqi = resXIShuAll.result.shouxinqishiri;
      let zhongzhiriqi = resXIShuAll.result.shouxinjieshuri;
      let shenqingshouxine = resXIShuAll.result.shouxine;
      viewModel.get("zongyingshouzhang").setValue(zongyingshouzhang);
      viewModel.get("meidaoqi").setValue(meidaoqi);
      viewModel.get("onethirtytian").setValue(onethirtytian);
      viewModel.get("thirtysixtytian").setValue(thirtysixtytian);
      viewModel.get("sixtytianyishang").setValue(sixtytianyishang);
      viewModel.get("beizhu").setValue(beizhu);
      viewModel.get("kaishiriqi").setValue(kaishiriqi);
      viewModel.get("zhongzhiriqi").setValue(zhongzhiriqi);
      viewModel.get("shenqingshouxine").setValue(shenqingshouxine);
    }
  });