let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var reqParams = request.params;
    var wbs = [];
    //判断reqParams
    for (var i = 0; i < reqParams.length; i++) {
      var currentData = reqParams[i];
      var status = currentData._status;
      switch (status) {
        case "Insert":
          ObjectStore.insert("GT9144AT102.GT9144AT102.project_trait", currentData, "ac58a668");
          var wbsCh = { id: currentData.project_traitFk, temp: 0 };
          wbs.push(wbsCh);
          break;
        case "Update":
          ObjectStore.updateById("GT9144AT102.GT9144AT102.project_trait", currentData);
          break;
        case "Delete":
          ObjectStore.deleteById("GT9144AT102.GT9144AT102.project_trait", currentData);
          break;
      }
    }
    if (wbs.length > 0) {
      ObjectStore.updateBatch("GT9144AT102.GT9144AT102.item_wbs", wbs);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });