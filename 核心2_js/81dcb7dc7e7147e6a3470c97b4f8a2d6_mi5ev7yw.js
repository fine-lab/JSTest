let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let id = data[0].id; //":"1851508380713091075"
    let apiPreAndAppListCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let json = {
      _status: "Update"
    };
    //查询GMP物料供应商评估表
    let supplierEvaluationSql = "select suppliername, tenant_id from ISY_2.ISY_2.supplierEvaluationForm where id = '" + id + "'";
    let supplierEvaluationRes = ObjectStore.queryByYonQL(supplierEvaluationSql, "sy01");
    let materialscope = [];
    if (supplierEvaluationRes.length > 0) {
      //查询供应商档案
      let vendorSql = "select id,org,code,name,vendorclass,internalunit, contact from aa.vendor.Vendor where id = '" + supplierEvaluationRes[0].suppliername + "'";
      let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
      if (vendorRes.length > 0) {
        //查询供应商分类
        let vendorClassSql = "select code from aa.vendorclass.VendorClass where id = '" + vendorRes[0].vendorclass + "'";
        let vendorClassRes = ObjectStore.queryByYonQL(vendorClassSql, "yssupplier");
        if (vendorClassRes.length > 0) {
          json["vendorclass_code"] = vendorClassRes[0].code;
        }
        json["id"] = vendorRes[0].id;
        json["org"] = vendorRes[0].org;
        json["code"] = vendorRes[0].code;
        json["name"] = { zh_CN: vendorRes[0].name };
        json["vendorclass"] = vendorRes[0].vendorclass;
        json["isCreator"] = true;
        json["isApplied"] = true;
      }
      //查询GMP物料供应商评估表-物料分类范围子表
      let materialscopeSql = "select materialscope from ISY_2.ISY_2.supplierEvaluationForm_materialscope where fkid = '" + id + "'";
      let materialscopeRes = ObjectStore.queryByYonQL(materialscopeSql, "sy01");
      if (materialscopeRes.length > 0) {
        for (let i = 0; i < materialscopeRes.length; i++) {
          materialscope.push(materialscopeRes[i].materialscope);
        }
      }
    }
    let str_materialscopes = materialscope.join(",");
    if (materialscope.length > 0) {
      //查询医药物料分类
      let custcatagorySql = "select catagoryname, name from GT22176AT10.GT22176AT10.SY01_custcatagoryv3 where id in (" + str_materialscopes + ")";
      let custcatagoryRes = ObjectStore.queryByYonQL(custcatagorySql, "");
      let catagoryname = "";
      if (custcatagoryRes.length > 0) {
        for (let i = 0; i < custcatagoryRes.length; i++) {
          if (typeof custcatagoryRes[i].catagoryname != "undefined" && custcatagoryRes[i].catagoryname != null) {
            if (i == custcatagoryRes.length - 1) {
              catagoryname += custcatagoryRes[i].catagoryname;
            } else {
              catagoryname += custcatagoryRes[i].catagoryname + "、";
            }
          } else if (typeof custcatagoryRes[i].name != "undefined" && custcatagoryRes[i].name != null) {
            if (i == custcatagoryRes.length - 1) {
              catagoryname += custcatagoryRes[i].name;
            } else {
              catagoryname += custcatagoryRes[i].name + "、";
            }
          }
        }
      }
      json["extendmaterialscope"] = catagoryname;
    }
    let body = { data: json };
    let url = apiPreAndAppListCode.apiPrefix + "/yonbip/digitalModel/vendor/save";
    let apiResponse = openLinker("POST", url, apiPreAndAppListCode.appCode, JSON.stringify(body));
    if (typeof apiResponse != "undefined" && apiResponse != null) {
      apiResponse = JSON.parse(apiResponse);
      if (apiResponse.code != 200) {
        throw new Error("【供应商档案保存/修改】接口异常：" + apiResponse.message);
      }
    } else {
      throw new Error(JSON.stringify("【供应商档案保存/修改】接口异常：" + apiResponse));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });