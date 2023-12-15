viewModel.get("requisitionDetail") &&
  viewModel.get("requisitionDetail").getEditRowModel() &&
  viewModel.get("requisitionDetail").getEditRowModel().get("product_code") &&
  viewModel
    .get("requisitionDetail")
    .getEditRowModel()
    .get("product_code")
    .on("afterValueChange", function (data) {
      // 物料编码--值改变
      if (!data.value) {
        const cellValuesAll = [];
        let character = viewModel.get("requisitionDetail").getDataSourceRows()[index].requisitionDetailDefineCharacter;
        character.manual_entry = false;
        cellValuesAll.push({ rowIndex: index, cellName: "requisitionDetailDefineCharacter", value: character });
        viewModel.get("requisitionDetail").setCellValues(cellValuesAll);
        const cellStates = [];
        cellStates.push({ rowIndex: index, cellName: "budgetUnitPrice", propertyName: "disabled", value: false });
        cellStates.push({ rowIndex: index, cellName: "budgetMoney", propertyName: "disabled", value: false });
        viewModel.get("requisitionDetail").setCellStates(cellStates);
      }
    });
viewModel.get("requisitionDetail") &&
  viewModel.get("requisitionDetail").on("afterSetDataSource", function (data) {
    debugger;
    // 详情数据区--设置数据源后
    for (let i = 0; i < data.length; i++) {
      if (data[i].requisitionDetailDefineCharacter && data[i].requisitionDetailDefineCharacter.manual_entry == true) {
        const cellStates = [];
        cellStates.push({ rowIndex: i, cellName: "budgetUnitPrice", propertyName: "disabled", value: true });
        cellStates.push({ rowIndex: i, cellName: "budgetMoney", propertyName: "disabled", value: true });
        viewModel.get("requisitionDetail").setCellStates(cellStates);
      }
    }
  });
viewModel.on("afterCellCheck", function (data) {
  if (data.params.key == "product_code") {
    if (data.res.budgetUnitPrice) {
      const cellValuesAll = [];
      let character = viewModel.get("requisitionDetail").getDataSourceRows()[data.params.location].requisitionDetailDefineCharacter;
      if (!character) {
        character = {};
      }
      character.manual_entry = true;
      cellValuesAll.push({ rowIndex: data.params.location, cellName: "requisitionDetailDefineCharacter", value: character });
      viewModel.get("requisitionDetail").setCellValues(cellValuesAll);
      const cellStates = [];
      cellStates.push({ rowIndex: data.params.location, cellName: "budgetUnitPrice", propertyName: "disabled", value: true });
      cellStates.push({ rowIndex: data.params.location, cellName: "budgetMoney", propertyName: "disabled", value: true });
      viewModel.get("requisitionDetail").setCellStates(cellStates);
    } else {
      const cellValuesAll = [];
      let character = viewModel.get("requisitionDetail").getDataSourceRows()[data.params.location].requisitionDetailDefineCharacter;
      if (!character) {
        character = {};
      }
      character.manual_entry = false;
      cellValuesAll.push({ rowIndex: data.params.location, cellName: "requisitionDetailDefineCharacter", value: character });
      viewModel.get("requisitionDetail").setCellValues(cellValuesAll);
    }
    let productId = data.res.productId;
    let orgId = viewModel.get("orgId").getValue();
    if (productId) {
      let optionAllXiShu = { async: false };
      let resXIShuAll = cb.rest.invokeFunction("078aa5bf1f934e0b9885e874a69326f2", { productId: productId, orgId: orgId }, null, viewModel, optionAllXiShu);
      if (resXIShuAll && resXIShuAll.result && resXIShuAll.result.result.price && resXIShuAll.error == undefined) {
        const cellValuesAll = [];
        let character = viewModel.get("requisitionDetail").getDataSourceRows()[data.params.location].requisitionDetailDefineCharacter;
        character.manual_entry = true;
        cellValuesAll.push({ rowIndex: data.params.location, cellName: "requisitionDetailDefineCharacter", value: character });
        cellValuesAll.push({ rowIndex: data.params.location, cellName: "budgetUnitPrice", value: resXIShuAll.result.result.price });
        viewModel.get("requisitionDetail").setCellValues(cellValuesAll);
        const cellStates = [];
        cellStates.push({ rowIndex: data.params.location, cellName: "budgetUnitPrice", propertyName: "disabled", value: true });
        cellStates.push({ rowIndex: data.params.location, cellName: "budgetMoney", propertyName: "disabled", value: true });
        viewModel.get("requisitionDetail").setCellStates(cellStates);
      }
    }
  }
});