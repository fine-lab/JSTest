let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let env = ObjectStore.env();
    let defineToAttrextMapping = {};
    let fieldSMapping = {};
    let excelFieldSMapping = {
      extendDefine1: "sn", //SN编码
      extendDefine2: "equipcode", //资产编码
      extendDefine3: "assetcode", //设备编码
      extendDefine4: "requiremcode", //需求单号
      extendDefine5: "contractnumber", //合同编号
      extendDefine6: "showTime" //上架时间
    };
    if (env.tenantId == "d50c9jnj") {
      // 生产-贵州中融信通科技有限公司
      defineToAttrextMapping = {
        define1: "attrext3", //SN编码
        define2: "attrext4", //设备编码
        define3: "attrext5", //资产编码
        define4: "attrext6", //需求单号
        define5: "attrext8", //合同编号
        define6: "attrext9" //上架时间
      };
      fieldSMapping = {
        extendDefine1: "attrext3", //SN编码
        extendDefine2: "attrext4", //设备编码
        extendDefine3: "attrext5", //资产编码
        extendDefine4: "attrext6", //需求单号
        extendDefine5: "attrext8", //合同编号
        extendDefine6: "attrext9" //上架时间
      };
    } else if (env.tenantId == "gx6eogib") {
      // 贵州数算互联科技有限公司
      defineToAttrextMapping = {
        define1: "attrext5", //SN编码
        define2: "attrext10", //设备编码
        define3: "attrext9", //资产编码
        define4: "attrext4", //需求单号
        define5: "attrext6", //合同编号
        define6: "attrext7" //上架时间
      };
      fieldSMapping = {
        extendDefine1: "attrext5", //SN编码
        extendDefine2: "attrext10", //设备编码
        extendDefine3: "attrext9", //资产编码
        extendDefine4: "attrext4", //需求单号
        extendDefine5: "attrext6", //合同编号
        extendDefine6: "attrext7" //上架时间
      };
    } else if (env.tenantId == "rz296oih") {
      // 测试-贵州中融信通科技有限公司
      defineToAttrextMapping = {
        define1: "attrext2", //SN编码
        define2: "attrext3", //设备编码
        define3: "attrext4", //资产编码
        define4: "attrext8", //需求单号
        define5: "attrext10", //合同编号
        define6: "attrext11" //上架时间
      };
      fieldSMapping = {
        extendDefine1: "attrext2", //SN编码
        extendDefine2: "attrext3", //设备编码
        extendDefine3: "attrext4", //资产编码
        extendDefine4: "attrext8", //需求单号
        extendDefine5: "attrext10", //合同编号
        extendDefine6: "attrext11" //上架时间
      };
    }
    return { defineToAttrextMapping, fieldSMapping, excelFieldSMapping };
  }
}
exports({ entryPoint: MyTrigger });