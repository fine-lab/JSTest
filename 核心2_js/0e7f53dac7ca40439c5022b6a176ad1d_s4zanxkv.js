let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = {
      id: "youridHere",
      LLCheckInformationList: [
        {
          flag: "1",
          checkProject: "1806772551225966597",
          destroyInspect: 0,
          checkProjectClass: "1806771382994862088",
          samplingUnitName: "千克",
          coord: true,
          checkProjectClass_name: "化学成分检查",
          samplePlanType: "0",
          samplingUnit: "1801782417690722314",
          vrowno: 30,
          parent_id: "youridHere",
          samplingPrecision: 2,
          _status: "Insert"
        }
      ]
    };
    var res = ObjectStore.updateById("QMSQIT.LLCheckApply.LLCheckApply", object, "ZJJL"); //qms_prodcheckapply_list
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });