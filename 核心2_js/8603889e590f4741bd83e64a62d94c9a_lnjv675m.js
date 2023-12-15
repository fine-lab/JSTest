let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let ownOrgretrun = param.return;
    let ownorg = JSON.parse(param.requestData);
    let OrgCode = ownorg.OrgCode;
    let name = ownorg.name;
    let upOrgId = ownorg.sysparent; //上级组织id
    let data = [];
    data.push({
      code: OrgCode + "AreaAdmin",
      name: { zh_CN: ownOrgretrun.name + "区域管理部门" },
      parent: ownOrgretrun.sysOrg,
      orgtype: "2",
      _status: "Insert",
      enable: "1",
      parentorgid: ownOrgretrun.sysOrg
    });
    let request = {};
    request.uri = "/yonbip/digitalModel/admindept/save";
    request.body = { data: data };
    let func4 = extrequire("GT34544AT7.common.baseOpenApi");
    let addDefDeptRes = func4.execute(request).res;
    let sysDept = addDefDeptRes.data;
    data = [];
    data.push({
      id: sysDept.id,
      parent: ownOrgretrun.sysOrg,
      parentorgid: ownOrgretrun.sysOrg,
      code: OrgCode + "AreaAdmin",
      name: { zh_CN: ownOrgretrun.name + "区域管理部门" },
      parent: ownOrgretrun.sysOrg,
      orgtype: "2",
      _status: "Update",
      enable: "1",
      path: sysDept.id + "|"
    });
    request = {};
    request.uri = "/yonbip/digitalModel/admindept/save";
    request.body = { data: data };
    let funcUpd = extrequire("GT34544AT7.common.baseOpenApi");
    let updDefDeptRes = funcUpd.execute(request).res;
    //同步保存好的系统部门数据到 自建组织
    request = {};
    let GxsOrgArr = [];
    GxsOrgArr.push({
      OrgCode: sysDept.code, //组织编码
      sysOrg: sysDept.id, //对应系统组织
      sysOrgCode: sysDept.code, //对应系统组织编码
      AreaOrg: ownOrgretrun.AreaOrg, //对应所属行政区域组织
      sysAreaOrg: ownOrgretrun.sysAreaOrg, //对应系统所属行政区域组织
      sysAreaOrgCode: ownOrgretrun.sysAreaOrgCode, //对应所属行政区域组织编码
      sysManageOrg: ownOrgretrun.sysOrg, //对应系统管理组织
      sysManageOrgCode: ownOrgretrun.OrgCode, //对应管理组织编码
      ManageOrg: ownOrgretrun.id, //对应管理组织
      isbizunit: 0, //是否业务单元0否1是 默认否
      isManageOrg: 0, //是否是管理组织
      sysparent: ownOrgretrun.sysOrg, //对应系统上级节点
      sysparentcode: ownOrgretrun.OrgCode, //对应系统上级节点编码
      ishide: 0, //组织部门隐藏标识
      userdel: 0, //用户是否删除
      parent: ownOrgretrun.id,
      name: sysDept.name.zh_CN,
      parentorg: ownOrgretrun.id, //所属组织（部门的上级）
      parentorgcode: ownOrgretrun.OrgCode, //所属组织编码（部门的上级）
      sysparentorg: ownOrgretrun.sysOrg, //所属系统组织（部门的上级）
      sysparentorgcode: ownOrgretrun.OrgCode, //所属系统组织编码（部门的上级）
      government_grade: ownOrgretrun.government_grade //行政级次
    });
    request.object = GxsOrgArr;
    let GxsOrgArrFunc = extrequire("GT34544AT7.gxsorg.addArr");
    let addGxsOrgArrRes = GxsOrgArrFunc.execute(request).res;
    return {};
  }
}
exports({ entryPoint: MyTrigger });