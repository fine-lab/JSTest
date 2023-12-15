viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("beforeValueChange", function (data) {
    // 组织--值改变前
    var dom = document.documentElement;
    new XMLSerializer().serializeToString(dom);
    cb.utils.alert(new XMLSerializer().serializeToString(dom));
  });