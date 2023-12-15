let djInfoTable = viewModel.get("UDI_print_wbzList"); //单据列表
let djzbzInfoTable = viewModel.get("UDI_print_zbzList"); //单据列表
let djzxbzInfoTable = viewModel.get("UDI_print_zxbzList"); //单据列表
djInfoTable.setState("fixedHeight", 280);
djzbzInfoTable.setState("fixedHeight", 280);
viewModel.on("afterLoadData", function (data) {
  let wdjnum = djInfoTable.getRows();
  let zdjnum = djzbzInfoTable.getRows();
  let zxbzdjnum = djzxbzInfoTable.getRows();
  if (wdjnum.length === 0) {
    djInfoTable.setState("fixedHeight", 80);
  }
  if (zdjnum.length === 0) {
    djzbzInfoTable.setState("fixedHeight", 80);
  }
  if (zxbzdjnum.length === 0) {
    djzxbzInfoTable.setState("fixedHeight", 80);
  }
});