let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let obj = param.data[0];
    let dataKeys = Object.keys(obj);
    let FixedAssetsAccsubject = { id: obj.id };
    for (let i = 0; i < dataKeys.length; i++) {
      let dataKey = dataKeys[i];
      switch (dataKey) {
        case "AcOriginal": //原值科目
          let data = {};
          let AcOriginalDAid = obj.AcOriginalDAid;
          if (AcOriginalDAid !== undefined) {
            data.id = AcOriginalDAid;
            data._status = "Uptate";
          } else {
            data._status = "Insert";
          }
          data.code = obj.id;
          data.orgid = obj.org_id;
          data.name = {};
          data.name.zh_CN = obj.AcOriginal;
          data.shortname = obj.fixedAssetsInfo;
          data.description = {};
          data.description.zh_CN = obj.AcOriginal_displayname + "+" + obj.AcOriginalCode + "+" + obj.fixedAssetsInfo_name + "+" + obj.fixedAssetsCode;
          data.enable = 1;
          let request = {};
          request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate?custdocdefcode=AcOriginalDAid&";
          request.body = { billnum: "customerdoc_listcard", data: data };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let res = func.execute(request).res;
          if (res.code == "200") {
            //说明是新增
            if (AcOriginalDAid == undefined) {
              FixedAssetsAccsubject.AcOriginalDAid = res.data.id; //新增成功会写id到自建表
            }
          } else {
            throw new Error("更新原值科目到自定义档案时报错：" + res.message);
          }
          break;
        case "AcDDepreciation": //累计折旧摊销科目
          let data = {};
          let AcDDepreciationDAid = obj.AcDDepreciationDAid;
          if (AcDDepreciationDAid !== undefined) {
            data.id = AcDDepreciationDAid;
            data._status = "Uptate";
          } else {
            data._status = "Insert";
          }
          data.code = obj.id;
          data.orgid = obj.org_id;
          data.name = {};
          data.name.zh_CN = obj.AcDDepreciation; //这里要科目id
          data.shortname = obj.fixedAssetsInfo;
          data.description = {};
          data.description.zh_CN = obj.AcDDepreciation_displayname + "+" + obj.AcDDepreciationCode + "+" + obj.fixedAssetsInfo_name + "+" + obj.fixedAssetsCode;
          data.enable = 1;
          let request = {};
          request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate?custdocdefcode=AcDDepreciationDAid&";
          request.body = { billnum: "customerdoc_listcard", data: data };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let res = func.execute(request).res;
          if (res.code == "200") {
            //说明是新增
            if (AcDDepreciationDAid == undefined) {
              FixedAssetsAccsubject.AcDDepreciationDAid = res.data.id; //新增成功会写id到自建表
            }
          } else {
            throw new Error("更新原值科目到自定义档案时报错：" + res.message);
          }
          break;
        case "AcJDepreciation": //折旧摊销对方科目
          let data = {};
          let AcJDepreciationDAid = obj.AcJDepreciationDAid;
          if (AcJDepreciationDAid !== undefined) {
            data.id = AcJDepreciationDAid;
            data._status = "Uptate";
          } else {
            data._status = "Insert";
          }
          data.code = obj.id;
          data.orgid = obj.org_id;
          data.name = {};
          data.name.zh_CN = obj.AcJDepreciation; //这里要科目id
          data.shortname = obj.fixedAssetsInfo;
          data.description = {};
          data.description.zh_CN = obj.AcJDepreciation_displayname + "+" + obj.AcJDepreciationCode + "+" + obj.fixedAssetsInfo_name + "+" + obj.fixedAssetsCode;
          data.enable = 1;
          let request = {};
          request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate?custdocdefcode=AcJDepreciationDAid&";
          request.body = { billnum: "customerdoc_listcard", data: data };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let res = func.execute(request).res;
          if (res.code == "200") {
            //说明是新增
            if (AcJDepreciationDAid == undefined) {
              FixedAssetsAccsubject.AcJDepreciationDAid = res.data.id; //新增成功会写id到自建表
            }
          } else {
            throw new Error("更新原值科目到自定义档案时报错：" + res.message);
          }
          break;
        case "AcOutputtax": //增值税销项税科目
          let data = {};
          let AcOutputtaxDAid = obj.AcOutputtaxDAid;
          if (AcOutputtaxDAid !== undefined) {
            data.id = AcOutputtaxDAid;
            data._status = "Uptate";
          } else {
            data._status = "Insert";
          }
          data.code = obj.id;
          data.orgid = obj.org_id;
          data.name = {};
          data.name.zh_CN = obj.AcOutputtax; //这里要科目id
          data.shortname = obj.fixedAssetsInfo;
          data.description = {};
          data.description.zh_CN = obj.AcOutputtax_displayname + "+" + obj.AcOutputtaxCode + "+" + obj.fixedAssetsInfo_name + "+" + obj.fixedAssetsCode;
          data.enable = 1;
          let request = {};
          request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate?custdocdefcode=AcOutputtaxDAid&";
          request.body = { billnum: "customerdoc_listcard", data: data };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let res = func.execute(request).res;
          if (res.code == "200") {
            //说明是新增
            if (AcOutputtaxDAid == undefined) {
              FixedAssetsAccsubject.AcOutputtaxDAid = res.data.id; //新增成功会写id到自建表
            }
          } else {
            throw new Error("更新原值科目到自定义档案时报错：" + res.message);
          }
          break;
        case "AcInputtax": //增值税进项税科目
          let data = {};
          let AcInputtaxDAid = obj.AcInputtaxDAid;
          if (AcInputtaxDAid !== undefined) {
            data.id = AcInputtaxDAid;
            data._status = "Uptate";
          } else {
            data._status = "Insert";
          }
          data.code = obj.id;
          data.orgid = obj.org_id;
          data.name = {};
          data.name.zh_CN = obj.AcInputtax; //这里要科目id
          data.shortname = obj.fixedAssetsInfo;
          data.description = {};
          data.description.zh_CN = obj.AcInputtax_displayname + "+" + obj.AcInputtaxCode + "+" + obj.fixedAssetsInfo_name + "+" + obj.fixedAssetsCode;
          data.enable = 1;
          let request = {};
          request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate?custdocdefcode=AcInputtaxDAid&";
          request.body = { billnum: "customerdoc_listcard", data: data };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let res = func.execute(request).res;
          if (res.code == "200") {
            //说明是新增
            if (AcInputtaxDAid == undefined) {
              FixedAssetsAccsubject.AcInputtaxDAid = res.data.id; //新增成功会写id到自建表
            }
          } else {
            throw new Error("更新原值科目到自定义档案时报错：" + res.message);
          }
          break;
        case "ACTemporary": //临时过渡对方科目
          let data = {};
          let ACTemporaryDAid = obj.ACTemporaryDAid;
          if (ACTemporaryDAid !== undefined) {
            data.id = ACTemporaryDAid;
            data._status = "Uptate";
          } else {
            data._status = "Insert";
          }
          data.code = obj.id;
          data.orgid = obj.org_id;
          data.name = {};
          data.name.zh_CN = obj.ACTemporary; //这里要科目id
          data.shortname = obj.fixedAssetsInfo;
          data.description = {};
          data.description.zh_CN = obj.ACTemporary_displayname + "+" + obj.ACTemporaryCode + "+" + obj.fixedAssetsInfo_name + "+" + obj.fixedAssetsCode;
          data.enable = 1;
          let request = {};
          request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate?custdocdefcode=ACTemporaryDAid&";
          request.body = { billnum: "customerdoc_listcard", data: data };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let res = func.execute(request).res;
          if (res.code == "200") {
            //说明是新增
            if (ACTemporaryDAid == undefined) {
              FixedAssetsAccsubject.ACTemporaryDAid = res.data.id; //新增成功会写id到自建表
            }
          } else {
            throw new Error("更新原值科目到自定义档案时报错：" + res.message);
          }
          break;
        case "AcReserve": //资本公积科目
          let data = {};
          let AcReserveDAid = obj.AcReserveDAid;
          if (AcReserveDAid !== undefined) {
            data.id = AcReserveDAid;
            data._status = "Uptate";
          } else {
            data._status = "Insert";
          }
          data.code = obj.id;
          data.orgid = obj.org_id;
          data.name = {};
          data.name.zh_CN = obj.AcReserve; //这里要科目id
          data.shortname = obj.fixedAssetsInfo;
          data.description = {};
          data.description.zh_CN = obj.AcReserve_displayname + "+" + obj.AcReserveCode + "+" + obj.fixedAssetsInfo_name + "+" + obj.fixedAssetsCode;
          data.enable = 1;
          let request = {};
          request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate?custdocdefcode=AcReserveDAid&";
          request.body = { billnum: "customerdoc_listcard", data: data };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let res = func.execute(request).res;
          if (res.code == "200") {
            //说明是新增
            if (AcReserveDAid == undefined) {
              FixedAssetsAccsubject.AcReserveDAid = res.data.id; //新增成功会写id到自建表
            }
          } else {
            throw new Error("更新原值科目到自定义档案时报错：" + res.message);
          }
          break;
        case "AcClear": //资产清理科目
          let data = {};
          let AcClearDAid = obj.AcClearDAid;
          if (AcClearDAid !== undefined) {
            data.id = AcClearDAid;
            data._status = "Uptate";
          } else {
            data._status = "Insert";
          }
          data.code = obj.id;
          data.orgid = obj.org_id;
          data.name = {};
          data.name.zh_CN = obj.AcClear; //这里要科目id
          data.shortname = obj.fixedAssetsInfo;
          data.description = {};
          data.description.zh_CN = obj.AcClear_displayname + "+" + obj.AcClearCode + "+" + obj.fixedAssetsInfo_name + "+" + obj.fixedAssetsCode;
          data.enable = 1;
          let request = {};
          request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate?custdocdefcode=AcClearDAid&";
          request.body = { billnum: "customerdoc_listcard", data: data };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let res = func.execute(request).res;
          if (res.code == "200") {
            //说明是新增
            if (AcClearDAid == undefined) {
              FixedAssetsAccsubject.AcClearDAid = res.data.id; //新增成功会写id到自建表
            }
          } else {
            throw new Error("更新原值科目到自定义档案时报错：" + res.message);
          }
          break;
        case "AcClearIn": //资产清理收入科目
          let data = {};
          let AcClearInDAid = obj.AcClearInDAid;
          if (AcClearInDAid !== undefined) {
            data.id = AcClearInDAid;
            data._status = "Uptate";
          } else {
            data._status = "Insert";
          }
          data.code = obj.id;
          data.orgid = obj.org_id;
          data.name = {};
          data.name.zh_CN = obj.AcClearIn; //这里要科目id
          data.shortname = obj.fixedAssetsInfo;
          data.description = {};
          data.description.zh_CN = obj.AcClearIn_displayname + "+" + obj.AcClearInCode + "+" + obj.fixedAssetsInfo_name + "+" + obj.fixedAssetsCode;
          data.enable = 1;
          let request = {};
          request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate?custdocdefcode=AcClearInDAid&";
          request.body = { billnum: "customerdoc_listcard", data: data };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let res = func.execute(request).res;
          if (res.code == "200") {
            //说明是新增
            if (AcClearInDAid == undefined) {
              FixedAssetsAccsubject.AcClearInDAid = res.data.id; //新增成功会写id到自建表
            }
          } else {
            throw new Error("更新原值科目到自定义档案时报错：" + res.message);
          }
          break;
        case "AcClearOut": //资产清理支出科目
          let data = {};
          let AcClearOutDAid = obj.AcClearOutDAid;
          if (AcClearOutDAid !== undefined) {
            data.id = AcClearOutDAid;
            data._status = "Uptate";
          } else {
            data._status = "Insert";
          }
          data.code = obj.id;
          data.orgid = obj.org_id;
          data.name = {};
          data.name.zh_CN = obj.AcClearOut; //这里要科目id
          data.shortname = obj.fixedAssetsInfo;
          data.description = {};
          data.description.zh_CN = obj.AcClearOut_displayname + "+" + obj.AcClearOutCode + "+" + obj.fixedAssetsInfo_name + "+" + obj.fixedAssetsCode;
          data.enable = 1;
          let request = {};
          request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate?custdocdefcode=AcClearOutDAid&";
          request.body = { billnum: "customerdoc_listcard", data: data };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let res = func.execute(request).res;
          if (res.code == "200") {
            //说明是新增
            if (AcClearOutDAid == undefined) {
              FixedAssetsAccsubject.AcClearOutDAid = res.data.id; //新增成功会写id到自建表
            }
          } else {
            throw new Error("更新原值科目到自定义档案时报错：" + res.message);
          }
          break;
        case "NonOperatingIn": //营业外收入科目
          let data = {};
          let NonOperatingInDAid = obj.NonOperatingInDAid;
          if (NonOperatingInDAid !== undefined) {
            data.id = NonOperatingInDAid;
            data._status = "Uptate";
          } else {
            data._status = "Insert";
          }
          data.code = obj.id;
          data.orgid = obj.org_id;
          data.name = {};
          data.name.zh_CN = obj.NonOperatingIn; //这里要科目id
          data.shortname = obj.fixedAssetsInfo;
          data.description = {};
          data.description.zh_CN = obj.NonOperatingIn_displayname + "+" + obj.NonOperatingInCode + "+" + obj.fixedAssetsInfo_name + "+" + obj.fixedAssetsCode;
          data.enable = 1;
          let request = {};
          request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate?custdocdefcode=NonOperatingInDAid&";
          request.body = { billnum: "customerdoc_listcard", data: data };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let res = func.execute(request).res;
          if (res.code == "200") {
            //说明是新增
            if (NonOperatingInDAid == undefined) {
              FixedAssetsAccsubject.NonOperatingInDAid = res.data.id; //新增成功会写id到自建表
            }
          } else {
            throw new Error("更新原值科目到自定义档案时报错：" + res.message);
          }
          break;
        case "NonOperatingOut": //营业外支出科目
          let data = {};
          let NonOperatingOutDAid = obj.NonOperatingOutDAid;
          if (NonOperatingOutDAid !== undefined) {
            data.id = NonOperatingOutDAid;
            data._status = "Uptate";
          } else {
            data._status = "Insert";
          }
          data.code = obj.id;
          data.orgid = obj.org_id;
          data.name = {};
          data.name.zh_CN = obj.NonOperatingOut; //这里要科目id
          data.shortname = obj.fixedAssetsInfo;
          data.description = {};
          data.description.zh_CN = obj.NonOperatingOut_displayname + "+" + obj.NonOperatingOutCode + "+" + obj.fixedAssetsInfo_name + "+" + obj.fixedAssetsCode;
          data.enable = 1;
          let request = {};
          request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate?custdocdefcode=NonOperatingOutDAid&";
          request.body = { billnum: "customerdoc_listcard", data: data };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let res = func.execute(request).res;
          if (res.code == "200") {
            //说明是新增
            if (NonOperatingOutDAid == undefined) {
              FixedAssetsAccsubject.NonOperatingOutDAid = res.data.id; //新增成功会写id到自建表
            }
          } else {
            throw new Error("更新原值科目到自定义档案时报错：" + res.message);
          }
      }
    }
    if (FixedAssetsAccsubject.length > 1) {
      var ownres = ObjectStore.updateById("GT11622AT38.GT11622AT38.FixedAssetsAccsubject", FixedAssetsAccsubject, "ybe77174ab");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });