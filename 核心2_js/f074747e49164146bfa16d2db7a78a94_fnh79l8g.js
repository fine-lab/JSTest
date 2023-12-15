viewModel.get("lease_series_margin_setList").on("afterInsertRow", function (data2) {
  viewModel
    .get("lease_series_margin_setList")
    .getEditRowModel()
    .get("tax_flag")
    .on("select", function (data1) {
      const rows = viewModel.get("lease_series_margin_setList").getRows();
      rows.forEach((item, index) => {
        if (item.tax_flag === "2") {
          item.tax_rate = "0";
          viewModel.get("lease_series_margin_setList").updateRow(index, item);
          viewModel.get("lease_series_margin_setList").setCellState(index, "tax_rate", "readOnly", true);
        } else {
          viewModel.get("lease_series_margin_setList").setCellState(index, "tax_rate", "readOnly", false);
        }
      });
    });
});
viewModel.get("lease_a_contract_other_detailList").on("afterInsertRow", function (data2) {
  viewModel
    .get("lease_a_contract_other_detailList")
    .getEditRowModel()
    .get("tax")
    .on("select", function (data1) {
      const rows = viewModel.get("lease_a_contract_other_detailList").getRows();
      rows.forEach((item, index) => {
        if (item.tax === "2") {
          item.rate_tax = "0";
          viewModel.get("lease_a_contract_other_detailList").updateRow(index, item);
          viewModel.get("lease_a_contract_other_detailList").setCellState(index, "rate_tax", "readOnly", true);
        } else {
          viewModel.get("lease_a_contract_other_detailList").setCellState(index, "rate_tax", "readOnly", false);
        }
      });
    });
});
viewModel.get("lease_a_contract_rent_detailList").on("afterInsertRow", function (data2) {
  viewModel
    .get("lease_a_contract_rent_detailList")
    .getEditRowModel()
    .get("shifuhanshui")
    .on("select", function (data1) {
      const rows = viewModel.get("lease_a_contract_rent_detailList").getRows();
      rows.forEach((item, index) => {
        if (item.shifuhanshui === "2") {
          item.shuilv = "0";
          viewModel.get("lease_a_contract_rent_detailList").updateRow(index, item);
          viewModel.get("lease_a_contract_rent_detailList").setCellState(index, "shuilv", "readOnly", true);
        } else {
          viewModel.get("lease_a_contract_rent_detailList").setCellState(index, "shuilv", "readOnly", false);
        }
      });
    });
});
viewModel.get("button67ci") &&
  viewModel.get("button67ci").on("click", function (data) {
    // 生成标准--单击
    var apiUrl = "GT40934AT6.htgl.biaozhunSC";
    // 需要查询的收款单id和
    let request = {
      entity: rows[0]
    };
    cb.rest.invokeFunction(apiUrl, request, function (err, res) {
      console.log(err);
      console.log("------------------");
      console.log(res);
      console.log("------------------");
    });
  });