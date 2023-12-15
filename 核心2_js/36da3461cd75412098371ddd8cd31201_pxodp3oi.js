viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  var commonVOs = args.params.condition.commonVOs; //通用检查查询条件
  for (var i in commonVOs) {
    let vos = commonVOs[i];
    if (vos.itemName == "name") {
      let nameVal = vos.value1;
      if (nameVal.startsWith("[") && nameVal.endsWith("]")) {
        nameVal = nameVal.substring(1, nameVal.length - 1);
        let rest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getStaffByName", { userName: nameVal }, function (err, res) {}, viewModel, { async: false });
        if (rest.result.code == 200 && rest.result.data.recordCount > 0) {
          let userId = rest.result.data.recordList[0].id;
          vos.itemName = "headDef!define1";
          vos.value1 = userId;
        } else {
          vos.value1 = nameVal;
        }
      }
    }
  }
});