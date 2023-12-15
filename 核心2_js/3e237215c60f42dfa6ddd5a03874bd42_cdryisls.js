viewModel.get("button24tj") &&
  viewModel.get("button24tj").on("click", function (data) {
    // 推送SAP--单击
    let gridModel = viewModel.getGridModel();
    let datas = gridModel.getSelectedRows();
    if (datas.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    let removaList = removalDuplicate(datas, "id");
    for (var i = 0; i < removaList.length; i++) {
      let res1 = cb.rest.invokeFunction("AT15C9C13409B00004.A2.getCliSaveNews", { prop: removaList[i] }, function (err, res) {}, viewModel, { async: false });
      if (res1.error != undefined) {
        cb.utils.alert(res1.error.message, "error");
      } else {
        debugger;
        if (res1.result.strResponses.code == 200) {
          cb.utils.alert("选中第" + Number(i + 1) + "行更新成功", "success");
        } else {
          cb.utils.alert("选中第" + Number(i + 1) + "行更新失败:" + res1.result.strResponses.message, "error");
        }
      }
    }
  });
// 去重
function removalDuplicate(dataList, byName) {
  var result = [];
  var tem = {};
  for (var i = 0; i < dataList.length; i++) {
    if (!tem[dataList[i][byName]]) {
      result.push(dataList[i]);
      tem[dataList[i][byName]] = 1;
    }
  }
  return result;
}