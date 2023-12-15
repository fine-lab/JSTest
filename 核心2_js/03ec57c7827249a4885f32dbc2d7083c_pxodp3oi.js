viewModel.get("button25kf") &&
  viewModel.get("button25kf").on("click", function (data) {
    //事业部信息--单击
    let gridModel = viewModel.getGridModel().getData();
    console.log("result:" + gridModel);
    for (var i = 0; i < gridModel.length; i++) {
      let grid = gridModel[i];
      let id = grid.id; //shiyebu_name
      let shiyebu = "1573823532355289104";
      let shiyebuName = "AIMIX建机事业部";
      viewModel.getGridModel().setCellValue(i, "shiyebu_name", shiyebuName);
      viewModel.getGridModel().setCellValue(i, "shiyebu", shiyebu);
      console.log("id:" + id);
      let result = cb.rest.invokeFunction("AT17854C0208D8000B.backOpenApiFunction.updateShiYeBu", { id: id, shiyebu: shiyebu, shiyebuName: shiyebuName }, function (err, res) {}, viewModel, {
        async: false
      });
    }
  });
function getDate() {
  var date = new Date();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentDate = date.getFullYear() + "-" + month + "-" + strDate;
  return currentDate;
}
viewModel.on("beforeSearch", (args) => {
  let startDate = viewModel.getCache("FilterViewModel").get("shfysyrq").getFromModel().getValue();
  let endDate = viewModel.getCache("FilterViewModel").get("shfysyrq").getToModel().getValue();
  if (startDate) {
    if (!endDate) {
      endDate = getDate();
    }
    //删除commonvos中的shfysyrq
    let commonVOs = args.params.condition.commonVOs;
    let newCommonVOs = commonVOs.filter((item, index) => {
      return item.itemName !== "shfysyrq";
    });
    args.params.condition.commonVOs = newCommonVOs;
    args.params.condition.simpleVOs = [];
    args.params.condition.simpleVOs.push({
      logicOp: "and",
      conditions: [
        {
          field: "shfysyrq",
          op: "egt",
          value1: startDate
        },
        {
          field: "shfysyrq",
          op: "elt",
          value1: endDate
        }
      ]
    });
  }
});