let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let area = JSON.parse(param.requestData); //存入的区域信息
    let AgencyAreaOrgCode = area.AgencyAreaOrgCode;
    let AgencyAreaOrgName = area.AgencyAreaOrgName;
    let UpOrg = area.UpOrg;
    let data = [];
    data.push({
      code: AgencyAreaOrgCode,
      name: { zh_CN: AgencyAreaOrgName + "代理记账中心" },
      parent: UpOrg,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "1",
      _status: "Insert",
      enable: "1",
      adminOrg: {
        parentorgid: UpOrg,
        parentid: UpOrg,
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
    let sysArea = func.execute(request).res.data.infos[0]; //存入代理记账中心节点
    let pId = sysArea.id; //代理记账中心的节点id
    data = [];
    data.push({
      code: AgencyAreaOrgCode + "_AccOrg",
      name: { zh_CN: AgencyAreaOrgName + "代理记账组织" },
      parent: pId,
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
        parentorgid: pId,
        parentid: pId,
        enable: 1
      }
    });
    data.push({
      code: AgencyAreaOrgCode + "_Gov",
      name: { zh_CN: AgencyAreaOrgName + "政府部门" },
      parent: pId,
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
        parentorgid: pId,
        parentid: pId,
        enable: 1
      }
    });
    request = {};
    request.uri = "/yonbip/digitalModel/orgunit/batchSave";
    externalData = {};
    externalData = {
      typelist: ["financeorg", "adminorg"]
    };
    request.body = { data: data, externalData: externalData };
    func = extrequire("GT83831AT27.util.baseOpenApi");
    let areaSunArr = func.execute(request).res.data.infos; //存入代理记账组织节点
    let typePId = "";
    for (let i = 0; i < areaSunArr.length; i++) {
      if (areaSunArr[i].code === AgencyAreaOrgCode + "_AccOrg") {
        typePId = areaSunArr[0].id; //代理记账组织的节点id
      }
    }
    let suncode = substring(AgencyAreaOrgCode, 0, 7);
    data = [];
    data.push({
      code: suncode + "100000",
      name: { zh_CN: "农民专业合作社" },
      parent: typePId,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "1",
      _status: "Insert",
      enable: "1",
      adminOrg: {
        parentorgid: typePId,
        parentid: typePId,
        enable: 1
      }
    });
    data.push({
      code: suncode + "200000",
      name: { zh_CN: "家庭农场" },
      parent: typePId,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "1",
      _status: "Insert",
      enable: "1",
      adminOrg: {
        parentorgid: typePId,
        parentid: typePId,
        enable: 1
      }
    });
    data.push({
      code: suncode + "300000",
      name: { zh_CN: "工商企业（企业会计准则）" },
      parent: typePId,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "1",
      _status: "Insert",
      enable: "1",
      adminOrg: {
        parentorgid: typePId,
        parentid: typePId,
        enable: 1
      }
    });
    data.push({
      code: suncode + "400000",
      name: { zh_CN: "工商企业（小企业会计准则）" },
      parent: typePId,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "1",
      _status: "Insert",
      enable: "1",
      adminOrg: {
        parentorgid: typePId,
        parentid: typePId,
        enable: 1
      }
    });
    data.push({
      code: suncode + "500000",
      name: { zh_CN: "行业协会" },
      parent: typePId,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "1",
      _status: "Insert",
      enable: "1",
      adminOrg: {
        parentorgid: typePId,
        parentid: typePId,
        enable: 1
      }
    });
    data.push({
      code: suncode + "600000",
      name: { zh_CN: "行政事业单位" },
      parent: typePId,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "1",
      _status: "Insert",
      enable: "1",
      adminOrg: {
        parentorgid: typePId,
        parentid: typePId,
        enable: 1
      }
    });
    data.push({
      code: suncode + "700000",
      name: { zh_CN: "个体工商户" },
      parent: typePId,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "1",
      _status: "Insert",
      enable: "1",
      adminOrg: {
        parentorgid: typePId,
        parentid: typePId,
        enable: 1
      }
    });
    data.push({
      code: suncode + "900000",
      name: { zh_CN: "其他" },
      parent: typePId,
      exchangerate: "v308xgzt",
      companytype: "45ebda24614f424abe5dfb04e00f737j",
      companytype_name: "其他组织",
      exchangerate_name: "基准汇率",
      orgtype: "1",
      _status: "Insert",
      enable: "1",
      adminOrg: {
        parentorgid: typePId,
        parentid: typePId,
        enable: 1
      }
    });
    func = extrequire("GT83831AT27.util.baseOpenApi");
    request = {};
    request.uri = "/yonbip/digitalModel/orgunit/batchSave";
    externalData = {};
    externalData = {
      typelist: ["adminorg"]
    };
    request.body = { data: data, externalData: externalData };
    let typeArr = func.execute(request).res.data.infos; //存入类型组织节点
    //通过代理记账机构系统编码查询代理记账机构
    request = {};
    request.obj = { OrgCode: area.item67xf };
    let YkjOrgAreaFunc = extrequire("GT79915AT25.YkjOrg.byOne");
    let YkjOrgArea = YkjOrgAreaFunc.execute(request).res[0];
    //获取代理记账中心的系统组织对象
    request = {};
    request.code = area.item67xf;
    let sysAreafunc = extrequire("GT83831AT27.util.getOrgByCode");
    let sysAreaOrg = sysAreafunc.execute(request).res;
    //同步代理区域节点到云科技组织
    let UpOrgCode = area.UpOrgCode;
    request = {};
    request.obj = { sysOrgCode: UpOrgCode };
    let func1 = extrequire("GT79915AT25.YkjOrg.byOne");
    let areaUpYkjOrg = func1.execute(request).res[0];
    let areaUpYkjOrgId = areaUpYkjOrg.id; //云科技组织里面的上级ID
    request = {};
    let addYkjOrgArr = [];
    addYkjOrgArr.push({
      OrgCode: sysArea.code, //组织编码
      sysOrg: sysArea.id, //对应系统组织
      sysOrgCode: sysArea.code, //对应系统组织编码
      AreaOrg: YkjOrgArea.id, //对应所属行政区域组织
      sysAreaOrg: sysAreaOrg.id, //对应系统所属行政区域组织
      sysAreaOrgCode: sysAreaOrg.code, //对应所属行政区域组织编码
      sysManageOrg: YkjOrgArea.sysOrg, //对应系统管理组织
      sysManageOrgCode: YkjOrgArea.OrgCode, //对应管理组织编码
      ManageOrg: area.AccAgency_id, //对应管理组织
      isbizunit: 1, //是否业务单元0否1是默认否
      isManageOrg: 1, //是否是管理组织
      isOrgEnd: 0, //是否组织单元末级
      sysparent: sysArea.parentid, //对应系统上级节点
      sysparentcode: UpOrgCode, //对应系统上级节点编码
      ishide: 0, //组织部门隐藏标识
      userdel: 0, //用户是否删除
      parent: areaUpYkjOrgId,
      name: sysArea.name.zh_CN
    });
    request.object = addYkjOrgArr;
    let addYkjOrgArrFunc = extrequire("GT79915AT25.YkjOrg.addArr");
    let addYkjOrgArrRes = addYkjOrgArrFunc.execute(request).res[0];
    //同步默认节点
    request = {};
    addYkjOrgArr = [];
    for (let i = 0; i < areaSunArr.length; i++) {
      let areaSun = areaSunArr[i];
      addYkjOrgArr.push({
        OrgCode: areaSun.code, //组织编码
        sysOrg: areaSun.id, //对应系统组织
        sysOrgCode: areaSun.code, //对应系统组织编码
        AreaOrg: YkjOrgArea.id, //对应所属行政区域组织
        sysAreaOrg: sysAreaOrg.id, //对应系统所属行政区域组织
        sysAreaOrgCode: YkjOrgArea.OrgCode, //对应所属行政区域组织编码
        sysManageOrg: YkjOrgArea.sysOrg, //对应系统管理组织
        sysManageOrgCode: YkjOrgArea.OrgCode, //对应管理组织编码
        ManageOrg: area.AccAgency_id, //对应管理组织
        isbizunit: 1, //是否业务单元0否1是默认否
        isManageOrg: 0, //是否是管理组织
        isOrgEnd: 0, //是否组织单元末级
        sysparent: areaSun.parentid, //对应系统上级节点
        sysparentcode: sysArea.code, //对应系统上级节点编码
        ishide: 0, //组织部门隐藏标识
        userdel: 0, //用户是否删除
        parent: addYkjOrgArrRes.id,
        name: areaSun.name.zh_CN
      });
    }
    request.object = addYkjOrgArr;
    let areaSunFunc = extrequire("GT79915AT25.YkjOrg.addArr");
    let areaSunRes = areaSunFunc.execute(request).res;
    //同步分类节点
    let ykjTypePId = "";
    for (let i = 0; i < areaSunRes.length; i++) {
      if (areaSunRes[i].code === AgencyAreaOrgCode + "_AccOrg") {
        ykjTypePId = areaSunRes[0].id; //云科技代理记账组织的节点id
      }
    }
    request = {};
    addYkjOrgArr = [];
    for (let i = 0; i < typeArr.length; i++) {
      let type = typeArr[i];
      addYkjOrgArr.push({
        OrgCode: type.code, //组织编码
        sysOrg: type.id, //对应系统组织
        sysOrgCode: type.code, //对应系统组织编码
        AreaOrg: YkjOrgArea.id, //对应所属行政区域组织
        sysAreaOrg: sysAreaOrg.id, //对应系统所属行政区域组织
        sysAreaOrgCode: YkjOrgArea.OrgCode, //对应所属行政区域组织编码
        sysManageOrg: YkjOrgArea.sysOrg, //对应系统管理组织
        sysManageOrgCode: YkjOrgArea.OrgCode, //对应管理组织编码
        ManageOrg: area.AccAgency_id, //对应管理组织
        isbizunit: 1, //是否业务单元0否1是默认否
        isManageOrg: 0, //是否是管理组织
        isOrgEnd: 0, //是否组织单元末级
        sysparent: type.parentid, //对应系统上级节点
        sysparentcode: sysArea.code, //对应系统上级节点编码
        ishide: 0, //组织部门隐藏标识
        userdel: 0, //用户是否删除
        parent: ykjTypePId,
        name: type.name.zh_CN
      });
    }
    request.object = addYkjOrgArr;
    let ykjAreaTypeFunc = extrequire("GT79915AT25.YkjOrg.addArr");
    let ykjAreaType = ykjAreaTypeFunc.execute(request).res;
    return { ykjAreaType };
  }
}
exports({ entryPoint: MyTrigger });