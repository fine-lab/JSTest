let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (JSON.parse(param.requestData)._status !== "Update") {
      let ownOrgretrun = param.return;
      let AreaOrg = JSON.parse(param.requestData);
      let OrgCode = AreaOrg.OrgCode;
      let name = AreaOrg.name;
      let upOrgId = AreaOrg.sysparent; //上级组织id
      let data = [];
      let obj = {
        code: OrgCode,
        name: { zh_CN: name },
        parent: upOrgId,
        exchangerate: "v308xgzt",
        companytype: "45ebda24614f424abe5dfb04e00f737j",
        companytype_name: "其他组织",
        exchangerate_name: "基准汇率",
        orgtype: "1",
        _status: "Insert",
        enable: "1",
        adminOrg: {
          parentorgid: upOrgId,
          parentid: upOrgId,
          enable: 1
        }
      };
      if (AreaOrg.shortname) {
        obj.shortname = AreaOrg.shortname;
      }
      if (AreaOrg.description) {
        //描述
        obj.description = {
          zh_CN: AreaOrg.description
        };
      }
      data.push(obj);
      let request = {};
      request.uri = "/yonbip/digitalModel/orgunit/batchSave";
      let externalData = {};
      externalData = {
        typelist: ["adminorg"]
      };
      request.body = { data: data, externalData: externalData };
      let AreaOrgfunc = extrequire("GT34544AT7.common.baseOpenApi");
      let AreaOrgData = AreaOrgfunc.execute(request).res;
      let sysAreaOrgres = AreaOrgData.data.infos[0];
      //同步成功，回写
      var AreaOrgobject = { id: ownOrgretrun.id, AreaOrg: ownOrgretrun.id, sysOrg: sysAreaOrgres.id, sysAreaOrg: sysAreaOrgres.id };
      var ownOrgres = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", AreaOrgobject, "1f482c76");
      return { ownOrgres };
    } else {
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });