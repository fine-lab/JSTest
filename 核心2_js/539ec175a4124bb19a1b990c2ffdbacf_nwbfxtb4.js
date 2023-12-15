viewModel.on("customInit", function (data) {
  // 拆分数量详情--页面初始化
});
viewModel.get("btnAbandon") &&
  viewModel.get("btnAbandon").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("btnSave") &&
  viewModel.get("btnSave").on("click", function (data) {
    // 确认--单击
    debugger;
    let rowData;
    let aa;
    var girdModel = viewModel.getGridModel();
    const data1 = viewModel.getAllData();
    var bh = viewModel.getParams().listdata;
    let parentViewModel = viewModel.getCache("parentViewModel");
    for (var d in bh) {
      let value = bh[d];
      rowData = {
        feiyongxiangmu_name: value.feiyongxiangmu_name,
        feiyongleixing: value.feiyongleixing,
        feiyongchengdanduixiangleixing: value.feiyongchengdanduixiangleixing,
        feiyonggongyingshang_name: value.feiyonggongyingshang_name,
        feiyonglizhangdanju: value.feiyonglizhangdanju,
        shuilv_name: value.shuilv_name,
        duiyingwuliao: value.duiyingwuliao,
        duiyingwuliaobianma: value.duiyingwuliaobianma,
        shuliang: data1.chaifenshuliang2,
        feiyonghanshuijine: value.feiyonghanshuijine,
        hanshuidanjia: value.hanshuidanjia,
        insetnew13: value.insetnew13,
        fapiaoleixing: value.fapiaoleixing
      };
      aa = { rowData };
    }
    cb.utils.alert(aa);
    //表格增行操作
    girdModel.appendRow(aa);
    // 关闭弹窗
    viewModel.communication({
      type: "modal",
      payload: {
        data: false
      }
    });
  });