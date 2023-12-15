viewModel.get("woshiyigewenbenkuang") &&
  viewModel.get("woshiyigewenbenkuang").on("afterValueChange", function (data) {
    // 控制标题颜色--值改变后
    let colorname = viewModel.get("woshiyigewenbenkuang").getValue();
    let orgName = document.getElementById("ucf-org-center.org_pure_tree_reforg_id_name");
    orgName.style.color = colorname;
  });