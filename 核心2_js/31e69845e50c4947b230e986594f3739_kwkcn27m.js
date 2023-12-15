let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let customer = JSON.parse(param.requestData); //存入的客户信息
    let code = customer.code; //客户自动编码
    //上级组织编码=>客户自动编码后四位变成0
    var upCode = substring(code, 0, 9);
    upCode = upCode + "0000";
    let func1 = extrequire("GT83831AT27.util.getOrgByCode");
    let res1 = func1.execute({ code: upCode });
    let upOrgId = res1.res.id; //上级组织id
    let data = [];
    let CustomerName = customer.CustomerName; //客户名称
    data.push({
      code: code,
      name: { zh_CN: CustomerName },
      parent: upOrgId,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "1",
      _status: "Insert",
      enable: "1",
      financeOrg: {
        currency: "G001ZM0000DEFAULTCURRENCT00000000001",
        currency_name: "人民币",
        periodschema: 1796319204331780,
        isexternalaccounting: true,
        isinternalaccounting: false,
        enable: "1"
      },
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
      typelist: ["financeorg", "adminorg"]
    };
    request.body = { data: data, externalData: externalData };
    let func = extrequire("GT83831AT27.util.baseOpenApi");
    let customerOrg = func.execute(request).res.data.infos[0];
    let customerOrgId = customerOrg.id;
    let customerID = param.return.id;
    var object = { id: customerID, CustomerSysOrg: customerOrgId };
    var AccCustomer = ObjectStore.updateById("GT79915AT25.GT79915AT25.AccCustomer", object, "6fc20232");
    request = {};
    request.obj = { sysOrgCode: upCode };
    let UpYkjOrgfunc = extrequire("GT79915AT25.YkjOrg.byOne");
    let UpYkjOrg = UpYkjOrgfunc.execute(request).res[0];
    let UpYkjOrgId = UpYkjOrg.id; //云科技组织里面的上级ID
    request = {};
    let addYkjOrgArr = [];
    addYkjOrgArr.push({
      OrgCode: customerOrg.code, //组织编码
      sysOrg: customerOrg.id, //对应系统组织
      sysOrgCode: customerOrg.code, //对应系统组织编码
      AreaOrg: customer.AccAgency, //对应所属行政区域组织
      sysAreaOrg: customer.org_id, //对应系统所属行政区域组织
      sysAreaOrgCode: customer.OrgCode, //对应所属行政区域组织编码
      sysManageOrg: customer.org_id, //对应系统管理组织
      sysManageOrgCode: customer.OrgCode, //对应管理组织编码
      ManageOrg: customer.AccAgency, //对应管理组织
      isbizunit: 1, //是否业务单元0否1是默认否
      isManageOrg: 1, //是否是管理组织
      isOrgEnd: 1, //是否组织单元末级
      sysparent: customerOrg.parentid, //对应系统上级节点
      sysparentcode: upCode, //对应系统上级节点编码
      ishide: 0, //组织部门隐藏标识
      userdel: 0, //用户是否删除
      parent: UpYkjOrgId,
      name: customerOrg.name.zh_CN
    });
    request.object = addYkjOrgArr;
    let addYkjOrgArrFunc = extrequire("GT79915AT25.YkjOrg.addArr");
    let addYkjOrgArrRes = addYkjOrgArrFunc.execute(request).res[0];
    //增加云科技公司客户的账簿已使用数量
    let func4 = extrequire("GT83831AT27.acc.addAndReduce");
    let res4 = func4.execute({ OrgCode: customer.OrgCode });
    //为组织创建默认部门        _PAreaAdmin区域管理部门  _POrgAdmin组织管理部门  _P_P000默认部门
    data = [];
    data.push({
      code: customerOrg.code + "_PAreaAdmin",
      name: { zh_CN: CustomerName + "区域管理部门" },
      parent: customerOrg.id,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "2",
      _status: "Insert",
      enable: "1",
      parentorgid: customerOrg.id
    });
    data.push({
      code: customerOrg.code + "_POrgAdmin",
      name: { zh_CN: CustomerName + "组织管理部门" },
      parent: customerOrg.id,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "2",
      _status: "Insert",
      enable: "1",
      parentorgid: customerOrg.id
    });
    data.push({
      code: customerOrg.code + "_P_P000",
      name: { zh_CN: CustomerName + "默认部门" },
      parent: customerOrg.id,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "2",
      _status: "Insert",
      enable: "1",
      parentorgid: customerOrg.id
    });
    request = {};
    request.uri = "/yonbip/digitalModel/orgunit/batchSave";
    externalData = {};
    externalData = {
      typelist: []
    };
    request.body = { data: data, externalData: externalData };
    let addDefDeptfunc = extrequire("GT83831AT27.util.baseOpenApi");
    let addDefDeptRes = addDefDeptfunc.execute(request).res;
    //保存代理记账客户的默认部门成功的返回值(数组)
    let addDefDeptArr = addDefDeptRes.data.infos;
    //同步保存好的系统部门数据到 YkjOrg
    addYkjOrgArr = [];
    for (let i = 0; i < addDefDeptArr.length; i++) {
      let sysCustomerDept = addDefDeptArr[i];
      addYkjOrgArr.push({
        OrgCode: sysCustomerDept.code, //组织编码
        sysOrg: sysCustomerDept.id, //对应系统组织
        sysOrgCode: sysCustomerDept.code, //对应系统组织编码
        AreaOrg: customer.AccAgency, //对应所属行政区域组织
        sysAreaOrg: customer.org_id, //对应系统所属行政区域组织
        sysAreaOrgCode: customer.OrgCode, //对应所属行政区域组织编码
        sysManageOrg: customer.org_id, //对应系统管理组织
        sysManageOrgCode: customer.OrgCode, //对应管理组织编码
        ManageOrg: customer.AccAgency, //对应管理组织
        isbizunit: 0, //是否业务单元0否1是 默认否
        isManageOrg: 0, //是否是管理组织
        sysparent: sysCustomerDept.parentid, //对应系统上级节点
        sysparentcode: customerOrg.code, //对应系统上级节点编码
        ishide: 0, //组织部门隐藏标识
        userdel: 0, //用户是否删除
        parent: addYkjOrgArrRes.id,
        name: sysCustomerDept.name.zh_CN,
        parentorg: addYkjOrgArrRes.id, //所属组织（部门的上级）
        parentorgcode: addYkjOrgArrRes.OrgCode, //所属组织编码（部门的上级）
        sysparentorg: customerOrg.id, //所属系统组织（部门的上级）
        sysparentorgcode: customerOrg.code //所属系统组织编码（部门的上级）
      });
    }
    request.object = addYkjOrgArr;
    addYkjOrgArrFunc = extrequire("GT79915AT25.YkjOrg.addArr");
    addYkjOrgArrRes = addYkjOrgArrFunc.execute(request).res;
    return { addYkjOrgArrRes };
  }
}
exports({ entryPoint: MyTrigger });