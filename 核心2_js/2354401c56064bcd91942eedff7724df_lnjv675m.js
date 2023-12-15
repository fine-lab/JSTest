let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let ownOrgretrun = param.return;
    let ownorg = JSON.parse(param.requestData);
    let OrgCode = ownorg.OrgCode;
    let name = ownorg.name;
    let upOrgId = ownorg.sysparent; //上级组织id
    let data = [];
    let addSysOrgData = {
      code: OrgCode,
      name: { zh_CN: name },
      parent: upOrgId,
      exchangerate: "lnjv675m",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "1",
      enable: "1"
    };
    let ownorgArr = Object.keys(ownorg);
    for (let i = 0; i < ownorgArr.length; i++) {
      let ownorgKey = ownorgArr[i];
      switch (ownorgKey) {
        case "_status":
          addSysOrgData._status = ownorg._status;
          break;
        case "shortname":
          addSysOrgData.shortname = ownorg.shortname;
          break;
        case "address":
          addSysOrgData.address = {
            zh_CN: ownorg.address
          };
          break;
        case "taxpayerid": //纳税人识别号
          addSysOrgData.taxpayerid = ownorg.taxpayerid;
          break;
        case "taxpayername": //纳税人名称
          addSysOrgData.taxpayername = ownorg.taxpayername;
          break;
        case "contact": //联系人
          addSysOrgData.contact = ownorg.contact;
          break;
        case "principal": //负责人、法定代表人
          addSysOrgData.principal = ownorg.principal;
          break;
        case "description":
          addSysOrgData.description = {
            zh_CN: ownorg.description
          };
      }
    }
    data.push(addSysOrgData);
    let request = {};
    request.uri = "/yonbip/digitalModel/orgunit/batchSave";
    request.body = { data: data };
    let Orgfunc = extrequire("GT34544AT7.common.baseOpenApi");
    let Orgfuncres = Orgfunc.execute(request).res;
    let OrgfuncresObject = Orgfuncres.data.infos[0];
    //保存到系统后，同步自建表数据-刚刚存的管理组织
    var syncOrgobject = { id: ownOrgretrun.id, sysManageOrgCode: OrgfuncresObject.code, sysManageOrg: OrgfuncresObject.id, ManageOrg: ownOrgretrun.id, sysOrg: OrgfuncresObject.id };
    var syncOrgobjectres = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", syncOrgobject, "86b792a1");
    //保存到系统后，同步自建表数据-此组织对应的区域
    var syncOrgobject = { id: ownOrgretrun.AreaOrg, sysManageOrgCode: OrgfuncresObject.code, sysManageOrg: OrgfuncresObject.id, ManageOrg: ownOrgretrun.id };
    var syncOrgobjectres = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", syncOrgobject, "86b792a1");
    if (ownorg._status === "Insert") {
      //添加默认部门  _PAreaAdmin区域管理部门  _POrgAdmin组织管理部门  _P_P000默认部门
      data = [];
      data.push({
        code: OrgCode + "AreaAdmin",
        name: { zh_CN: OrgfuncresObject.name.zh_CN + "区域管理部门" },
        parent: OrgfuncresObject.id,
        orgtype: "2",
        _status: "Insert",
        enable: "1",
        parentorgid: OrgfuncresObject.id
      });
      data.push({
        code: OrgCode + "OrgAdmin",
        name: { zh_CN: OrgfuncresObject.name.zh_CN + "组织管理部门" },
        parent: OrgfuncresObject.id,
        orgtype: "2",
        _status: "Insert",
        enable: "1",
        parentorgid: OrgfuncresObject.id
      });
      data.push({
        code: OrgCode + "_P000",
        name: { zh_CN: OrgfuncresObject.name.zh_CN + "默认部门" },
        parent: OrgfuncresObject.id,
        orgtype: "2",
        _status: "Insert",
        enable: "1",
        parentorgid: OrgfuncresObject.id
      });
      request = {};
      request.uri = "/yonbip/digitalModel/admindept/save";
      request.body = { data: data };
      let func4 = extrequire("GT34544AT7.common.baseOpenApi");
      let addDefDeptRes = func4.execute(request).res;
      //保存代理记账中心的默认部门成功的返回值(数组)
      let addDefDeptArr = addDefDeptRes.data;
      data = [];
      data.push({
        id: addDefDeptArr[0].id,
        parent: addDefDeptArr[0].parent,
        code: OrgCode + "AreaAdmin",
        name: { zh_CN: OrgfuncresObject.name.zh_CN + "区域管理部门" },
        parent: OrgfuncresObject.id,
        orgtype: "2",
        _status: "Update",
        enable: "1",
        parentorgid: OrgfuncresObject.id,
        path: addDefDeptArr[0].id + "|"
      });
      data.push({
        id: addDefDeptArr[1].id,
        parent: addDefDeptArr[1].parent,
        code: OrgCode + "OrgAdmin",
        name: { zh_CN: OrgfuncresObject.name.zh_CN + "组织管理部门" },
        parent: OrgfuncresObject.id,
        orgtype: "2",
        _status: "Update",
        enable: "1",
        parentorgid: OrgfuncresObject.id,
        path: addDefDeptArr[1].id + "|"
      });
      data.push({
        id: addDefDeptArr[2].id,
        parent: addDefDeptArr[2].parent,
        code: OrgCode + "_P000",
        name: { zh_CN: OrgfuncresObject.name.zh_CN + "默认部门" },
        parent: OrgfuncresObject.id,
        orgtype: "2",
        _status: "Update",
        enable: "1",
        parentorgid: OrgfuncresObject.id,
        path: addDefDeptArr[2].id + "|"
      });
      request = {};
      request.uri = "/yonbip/digitalModel/admindept/save";
      request.body = { data: data };
      let funcUpd = extrequire("GT34544AT7.common.baseOpenApi");
      let updDefDeptRes = funcUpd.execute(request).res;
      //同步保存好的系统部门数据到 自建组织
      let GxsOrgArr = [];
      for (let i = 0; i < addDefDeptArr.length; i++) {
        let sysDept = addDefDeptArr[i];
        GxsOrgArr.push({
          OrgCode: sysDept.code, //组织编码
          sysOrg: sysDept.id, //对应系统组织
          sysOrgCode: sysDept.code, //对应系统组织编码
          AreaOrg: ownOrgretrun.AreaOrg, //对应所属行政区域组织
          sysAreaOrg: ownOrgretrun.sysAreaOrg, //对应系统所属行政区域组织
          sysAreaOrgCode: ownOrgretrun.sysAreaOrgCode, //对应所属行政区域组织编码
          sysManageOrg: OrgfuncresObject.id, //对应系统管理组织
          sysManageOrgCode: OrgfuncresObject.code, //对应管理组织编码
          ManageOrg: ownOrgretrun.id, //对应管理组织
          isbizunit: 0, //是否业务单元0否1是 默认否
          isManageOrg: 0, //是否是管理组织
          sysparent: OrgfuncresObject.id, //对应系统上级节点
          sysparentcode: OrgfuncresObject.code, //对应系统上级节点编码
          ishide: 0, //组织部门隐藏标识
          userdel: 0, //用户是否删除
          parent: ownOrgretrun.id,
          name: sysDept.name.zh_CN,
          parentorg: ownOrgretrun.id, //所属组织（部门的上级）
          parentorgcode: OrgfuncresObject.code, //所属组织编码（部门的上级）
          sysparentorg: OrgfuncresObject.id, //所属系统组织（部门的上级）
          sysparentorgcode: OrgfuncresObject.code, //所属系统组织编码（部门的上级）
          government_grade: ownOrgretrun.government_grade //行政级次
        });
      }
      request.object = GxsOrgArr;
      let GxsOrgArrFunc = extrequire("GT34544AT7.gxsorg.addArr");
      let addGxsOrgArrRes = GxsOrgArrFunc.execute(request).res;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });