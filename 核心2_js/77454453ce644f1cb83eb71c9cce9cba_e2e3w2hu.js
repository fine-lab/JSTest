let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var updateWrapper = new Wrapper();
    //审核单据主表id
    let id;
    let toUpdate;
    if (request.datas == null || request.datas == undefined || request.datas == "") {
      if (request.res == null || request.res == undefined || request.res.id == "") {
        return {};
      } else {
        for (var i = 0; i < request.res.length; i++) {
          updateWrapper = new Wrapper();
          id = request.res[i];
          toUpdate = {
            reviewer: "--",
            reviewerDate: "--"
          };
          updateWrapper.eq("id", id);
          var res = JSON.stringify(ObjectStore.update("AT17AA2EFA09C00009.AT17AA2EFA09C00009.manufacturing_order", toUpdate, updateWrapper, "ybf81544ac"));
        }
      }
    } else {
      id = request.datas.res.id;
      toUpdate = {
        reviewer: "--",
        reviewerDate: "--"
      };
      updateWrapper.eq("id", id);
      var res = JSON.stringify(ObjectStore.update("AT17AA2EFA09C00009.AT17AA2EFA09C00009.manufacturing_order", toUpdate, updateWrapper, "ybf81544ac"));
    }
    return { toUpdate };
  }
}
exports({ entryPoint: MyAPIHandler });