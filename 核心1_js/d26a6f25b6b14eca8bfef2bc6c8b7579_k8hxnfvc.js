let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let billnums = [];
    billnums.push("yccontract"); //采购合同
    if (billnums.includes(param.billnum) && param.refCode == "ucfbasedoc.bd_outer_projectcardMCref") {
      if (param.key == "projectName") {
        let param1 = {
          projectType: "0",
          personId: data.dealPsnId, //data.purPersonId,//
          orgId: data.firstPartyId, //data.orgId,//
          deptId: data.defines && data.defines.define7 ? data.defines.define7 : data.deptId
        };
        let queryProject = extrequire("APCT.backDesignerFunction.queryProject");
        let res = queryProject.execute(param1);
        this.updateContext.filters = {
          condition: {
            simpleVOs: [
              {
                field: "code",
                op: "in",
                value1: res.ret //['000100017030017_0001','000100017030018_0001']//
              }
            ]
          }
        };
      }
      if (param.key == "defines!define38_name") {
        let param2 = {
          projectType: "1",
          personId: data.dealPsnId, //data.purPersonId,//
          orgId: data.firstPartyId, //data.orgId,//
          deptId: data.deptId //(data.defines&&data.defines.define7)?data.defines.define7:data.deptId
        };
        if (data.defines && data.defines.define7) {
          param2.deptId = data.defines.define7;
        }
        let queryProject2 = extrequire("APCT.backDesignerFunction.queryProject");
        let res2 = queryProject2.execute(param2);
        this.updateContext.filters = {
          condition: {
            simpleVOs: [
              {
                field: "code",
                op: "in",
                value1: res2.ret //['000100017030017_0001','000100017030018_0001']//
              }
            ]
          }
        };
      }
    }
    if (billnums.includes(param.billnum) && param.refCode == "yssupplier.aa_vendorCreatorref") {
      if (param.key == "supplierSupName") {
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });