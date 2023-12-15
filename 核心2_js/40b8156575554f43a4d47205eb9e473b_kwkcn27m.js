let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //停用的客户信息
    var cusdata = param.data[0];
    var code = cusdata.code;
    //得到del组织里面的上级节点的code
    var upCode = substring(code, 0, 7);
    upCode = upCode + "000000del";
    //有数据是res.res     没有数据是{}
    let func1 = extrequire("GT83831AT27.util.getOrgByCode");
    let res = func1.execute({ code: upCode });
    //存放 添加上级节点后的返回对象
    let res3 = {};
    //如果在del组织里还没有该区域节点，先创建一个
    if (res.res === undefined) {
      //获取需要创建的区域del节点的上级id
      let func2 = extrequire("GT83831AT27.util.getOrgByCode");
      let res2 = func2.execute({ code: "Del_acc01" });
      let data = [];
      data.push({
        code: upCode,
        name: cusdata.org_id_name + "del",
        parent: res2.res.id,
        exchangerate: "v308xgzt",
        companytype: "45ebda24614f424abe5dfb04e00f737j",
        companytype_name: "其他组织",
        exchangerate_name: "基准汇率",
        orgtype: "1",
        _status: "Insert",
        enable: "1",
        adminOrg: {
          parentorgid: res2.res.id,
          parentid: res2.res.id,
          enable: 1
        }
      });
      let func3 = extrequire("GT83831AT27.util.baseOpenApi");
      let request = {};
      request.uri = "/yonbip/digitalModel/orgunit/batchSave";
      let externalData = {};
      externalData = {
        typelist: ["adminorg"]
      };
      request.body = { data: data, externalData: externalData };
      res3 = func3.execute(request).res; //存入代理记账中心节点
    }
    //获取代理客户组织的信息 并将其上级修改为del组织里面对应区域节点
    let func4 = extrequire("GT83831AT27.util.getOrgByCode");
    let res4 = func4.execute({ code: code }).res;
    //代理客户组织的id
    let cusId = res4.id;
    //通过id查询详情
    let func5 = extrequire("GT83831AT27.util.baseOpenApiGet");
    let parm = { id: cusId };
    let request = {};
    request.parm = parm;
    request.uri = "/yonbip/digitalModel/orgunit/detail";
    let res5 = func5.execute(request).res.data;
    //开始修改上级
    let up;
    if (res.res === undefined) {
      up = res3;
    } else {
      up = res.res;
    }
    let custUpId = up.id;
    res5.parent_name = up.name;
    res5.parent_code = up.code;
    res5.adminOrg.adminOrg = up.id;
    res5.adminOrg.parentid_name = up.name;
    res5.adminOrg.porgid_name = up.name;
    res5.adminOrg.parentorgid_name = up.name;
    res5.adminOrg._status = "Update";
    res5.financeOrg._status = "Update";
    delete res5.parent_name;
    delete res5.adminOrg.parentid_name;
    delete res5.adminOrg.porgid_name;
    delete res5.adminOrg.parentorgid_name;
    let data = [];
    res5._status = "Update";
    res5.code = code + "del";
    res5.name.zh_CN = res5.name.zh_CN + "del";
    res5.parent = custUpId;
    data[0] = res5;
    let func6 = extrequire("GT83831AT27.util.baseOpenApi");
    request = {};
    request.uri = "/yonbip/digitalModel/orgunit/batchSave";
    let externalData = {};
    let typelist = [];
    if ("financeOrg" in res5) {
      typelist.push("financeorg");
    }
    if ("salesOrg" in res5) {
      typelist.push("salesorg");
    }
    if ("purchaseOrg" in res5) {
      typelist.push("purchaseorg");
    }
    if ("inventoryOrg" in res5) {
      typelist.push("inventoryorg");
    }
    if ("factoryOrg" in res5) {
      typelist.push("factoryorg");
    }
    if ("assetsOrg" in res5) {
      typelist.push("assetsorg");
    }
    if ("taxpayerOrg" in res5) {
      typelist.push("taxpayerorg");
    }
    if ("adminOrg" in res5) {
      typelist.push("adminorg");
    }
    externalData = { typelist: typelist };
    request.body = { data: data, externalData: externalData };
    let res6 = func6.execute(request).res;
    //将代理已使用账簿数-1
    let func7 = extrequire("GT83831AT27.acc.reduce");
    let res7 = func7.execute({ OrgCode: cusdata.OrgCode });
    return { res7 };
  }
}
exports({ entryPoint: MyTrigger });