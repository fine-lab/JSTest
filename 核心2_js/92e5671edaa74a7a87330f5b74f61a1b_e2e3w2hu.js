let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var updateWrapper = new Wrapper();
    var toUpdate;
    if (request.status_code == "1") {
      //如果汇总长度等于空
      if (request.summary_length == undefined || request.summary_length == "" || request.summary_length == null) {
        toUpdate = {
          rukushuliang: request.Number,
          waste_state: "1",
          finished_product_state: "1"
        };
      } else {
        toUpdate = {
          rukushuliang: request.Number,
          waste_state: "1"
        };
      }
    }
    if (request.status_code == "2") {
      if (request.waste_quantity == 0 || request.waste_quantity == undefined || request.waste_quantity == null || request.waste_quantity == "") {
        toUpdate = {
          waste_state: "1",
          rukushuliang: request.Number,
          finished_product_state: "1"
        };
      } else {
        toUpdate = {
          rukushuliang: request.Number,
          finished_product_state: "1"
        };
      }
    }
    if (request.status_code == "3") {
      toUpdate = {
        waste_state: "0",
        finished_product_state: "0"
      };
    }
    updateWrapper.eq("id", request.Id);
    var res = JSON.stringify(ObjectStore.update("AT17AA2EFA09C00009.AT17AA2EFA09C00009.manufacturing_order", toUpdate, updateWrapper, "ybf81544ac"));
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });