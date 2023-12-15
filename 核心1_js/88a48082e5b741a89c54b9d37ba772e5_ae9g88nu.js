let childList = viewModel.getGridModel("SY01_supply_licenceList");
childList.setState("fixedHeight", 200);
let sunList = viewModel.getGridModel("SY01_supply_auth_scope2List");
sunList.setState("fixedHeight", 280);
let attorneyList = viewModel.getGridModel("SY01_supply_power_attorneyList");
attorneyList.setState("fixedHeight", 200);
let scope1List = viewModel.getGridModel("SY01_supply_auth_scope1List");
scope1List.setState("fixedHeight", 280);
viewModel.get("skuCode_code") &&
  viewModel.get("skuCode_code").on("afterValueChange", function (data) {
    // 物料sku编码--值改变后
    const productCode = viewModel.get("productCode_code").getValue();
    if (data.obj.value == productCode) {
      viewModel.get("skuName").setValue(null);
      viewModel.get("skuCode").setValue(null);
      viewModel.get("skuCode_code").setValue(null);
      cb.utils.confirm(
        "物料未启用多规格，无法选择sku！",
        () => {
        },
        () => {
        }
      );
    }
  });