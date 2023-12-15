let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let customer = JSON.parse(param.requestData); //存入的客户信息
    let OrgCode = customer.OrgCode; //客户组织编码
    let AgencyName = customer.AgencyName; //客户名称
    let func1 = extrequire("GT83831AT27.util.getOrgByCode");
    let upCustomerData = func1.execute({ code: "GXYCustomer" });
    let upOrgId = upCustomerData.res.id; //上级组织id
    let data = [];
    data.push({
      code: OrgCode,
      name: { zh_CN: AgencyName },
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
    });
    let request = {};
    request.uri = "/yonbip/digitalModel/orgunit/batchSave";
    let externalData = {};
    externalData = {
      typelist: ["adminorg"]
    };
    request.body = { data: data, externalData: externalData };
    let func = extrequire("GT83831AT27.util.baseOpenApi");
    let customerOrgData = func.execute(request).res;
    //系统组织添加成功，要同步数据到 YkjOrg 云科技组织机构
    let sysCustomerOrg = customerOrgData.data.infos[0];
    //要获取对应的 YkjOrg 里面的上级ID
    request = {};
    request.obj = { sysOrg: sysCustomerOrg.parentid };
    let func6 = extrequire("GT79915AT25.YkjOrg.byOne");
    let upYkjOrgId = func6.execute(request).res[0].id;
    request = {};
    let addYkjOrgArr = [];
    addYkjOrgArr.push({
      OrgCode: sysCustomerOrg.code, //组织编码
      sysOrg: sysCustomerOrg.id, //对应系统组织
      sysOrgCode: sysCustomerOrg.code, //对应系统组织编码
      sysAreaOrg: sysCustomerOrg.id, //对应系统所属行政区域组织
      sysAreaOrgCode: sysCustomerOrg.code, //对应所属行政区域组织编码
      sysManageOrg: "2173831265835520", //对应系统管理组织
      sysManageOrgCode: "GXYKJ", //对应管理组织编码
      ManageOrg: "2740157907751168", //对应管理组织
      isbizunit: 1, //是否业务单元0否1是默认否
      isManageOrg: 0, //是否是管理组织
      isOrgEnd: 1, //是否组织单元末级
      sysparent: sysCustomerOrg.parentid, //对应系统上级节点
      sysparentcode: "GXYCustomer", //对应系统上级节点编码
      ishide: 0, //组织部门隐藏标识
      userdel: 0, //用户是否删除
      parent: upYkjOrgId,
      name: sysCustomerOrg.name.zh_CN
    });
    request.object = addYkjOrgArr;
    let addYkjOrgArrFunc = extrequire("GT79915AT25.YkjOrg.addArr");
    let addYkjOrgArrRes = addYkjOrgArrFunc.execute(request).res[0];
    //回写-对应所属行政区域组织-
    let AreaOrg = { id: addYkjOrgArrRes.id, AreaOrg: addYkjOrgArrRes.id };
    var AreaOrgres = ObjectStore.updateById("GT83831AT27.GT83831AT27.AccAgency", AreaOrg, "cbf938ec");
    //将添加成功的系统 GXYCustomer 下的代理记账中心组织id，存入 -代理记账中心客户- 实体 org_id 作为主组织
    let customerID = param.return.id;
    var object = { id: customerID, org_id: sysCustomerOrg.id };
    var res3 = ObjectStore.updateById("GT83831AT27.GT83831AT27.AccAgency", object, "cbf938ec");
    //添加默认部门  _PAreaAdmin区域管理部门  _POrgAdmin组织管理部门  _P_P000默认部门
    data = [];
    data.push({
      code: OrgCode + "_PAreaAdmin",
      name: { zh_CN: AgencyName + "区域管理部门" },
      parent: sysCustomerOrg.id,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "2",
      _status: "Insert",
      enable: "1",
      parentorgid: sysCustomerOrg.id
    });
    data.push({
      code: OrgCode + "_POrgAdmin",
      name: { zh_CN: AgencyName + "组织管理部门" },
      parent: sysCustomerOrg.id,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "2",
      _status: "Insert",
      enable: "1",
      parentorgid: sysCustomerOrg.id
    });
    data.push({
      code: OrgCode + "_P_P000",
      name: { zh_CN: AgencyName + "默认部门" },
      parent: sysCustomerOrg.id,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "2",
      _status: "Insert",
      enable: "1",
      parentorgid: sysCustomerOrg.id
    });
    request = {};
    request.uri = "/yonbip/digitalModel/orgunit/batchSave";
    externalData = {};
    externalData = {
      typelist: []
    };
    request.body = { data: data, externalData: externalData };
    let func4 = extrequire("GT83831AT27.util.baseOpenApi");
    let addDefDeptRes = func4.execute(request).res;
    //保存代理记账中心的默认部门成功的返回值(数组)
    let addDefDeptArr = addDefDeptRes.data.infos;
    //同步保存好的系统部门数据到 YkjOrg
    addYkjOrgArr = [];
    for (let i = 0; i < addDefDeptArr.length; i++) {
      let sysCustomerDept = addDefDeptArr[i];
      addYkjOrgArr.push({
        OrgCode: sysCustomerDept.code, //组织编码
        sysOrg: sysCustomerDept.id, //对应系统组织
        sysOrgCode: sysCustomerDept.code, //对应系统组织编码
        AreaOrg: addYkjOrgArrRes.id, //对应所属行政区域组织
        sysAreaOrg: sysCustomerOrg.id, //对应系统所属行政区域组织
        sysAreaOrgCode: sysCustomerOrg.code, //对应所属行政区域组织编码
        sysManageOrg: "2173831265835520", //对应系统管理组织
        sysManageOrgCode: "GXYKJ", //对应管理组织编码
        ManageOrg: "2740157907751168", //对应管理组织
        isbizunit: 0, //是否业务单元0否1是 默认否
        isManageOrg: 0, //是否是管理组织
        sysparent: sysCustomerDept.parentid, //对应系统上级节点
        sysparentcode: sysCustomerOrg.code, //对应系统上级节点编码
        ishide: 0, //组织部门隐藏标识
        userdel: 0, //用户是否删除
        parent: addYkjOrgArrRes.id,
        name: sysCustomerDept.name.zh_CN,
        parentorg: addYkjOrgArrRes.id, //所属组织（部门的上级）
        parentorgcode: addYkjOrgArrRes.code, //所属组织编码（部门的上级）
        sysparentorg: sysCustomerOrg.id, //所属系统组织（部门的上级）
        sysparentorgcode: sysCustomerOrg.code //所属系统组织编码（部门的上级）
      });
    }
    request.object = addYkjOrgArr;
    addYkjOrgArrFunc = extrequire("GT79915AT25.YkjOrg.addArr");
    addYkjOrgArrRes = addYkjOrgArrFunc.execute(request).res;
    return { addYkjOrgArrRes };
  }
}
exports({ entryPoint: MyTrigger });