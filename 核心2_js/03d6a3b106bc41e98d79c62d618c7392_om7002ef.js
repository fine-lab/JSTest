viewModel.on("afterInitDefaultActions", () => {
  console.log("afterInitDefaultActions", "zhenyu");
  viewModel.get("vfinacedeptid_name").on("beforeBrowse", (data) => {
    // 参照前校验
    console.log("低代码客开代码", "zhenyu", data, viewModel.get("vfinacedeptid_name").getFilter());
    const conditions = viewModel.get("vfinacedeptid_name").getFilter() || {};
    if (conditions.simpleVOs.length) {
      conditions.simpleVOs.forEach((item) => {
        if (item.field == "parentorgid") {
          item.value1 = "12345";
        }
      });
    } else {
    }
    viewModel.get("vfinacedeptid_name").setFilter(conditions);
  });
});