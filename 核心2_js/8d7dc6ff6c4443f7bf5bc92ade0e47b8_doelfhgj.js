viewModel.get("wareId_name") &&
  viewModel.get("wareId_name").on("afterValueChange", function (data) {
    // 仓库--值改变后
    viewModel.get("zoneId").setValue(""); //库区
    viewModel.get("zoneId_name").setValue("");
    viewModel.get("lgrp1Id").setValue(""); //库位组1
    viewModel.get("lgrp1Code").setValue("");
    viewModel.get("lgrp1Id_name").setValue("");
    viewModel.get("lgrp2Id").setValue(""); //库位组2
    viewModel.get("lgrp2Code").setValue("");
    viewModel.get("lgrp2Id_name").setValue("");
  });