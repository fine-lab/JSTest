let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let importData = param.data;
    let id = importData.id; //供应商手工码
    let orgName = importData.org_id_name; //供应商组织名称
    if (orgName == null || orgName == undefined || orgName == "") {
      throw new Error("供应商预审表头手工码：" + id + "，组织名称为空，请填写完整后导入！");
    }
    let orgData = ObjectStore.queryByYonQL("select id from org.func.BaseOrg where name ='" + orgName + "'", "ucf-org-center");
    if (orgData.length == 0) {
      throw new Error("供应商预审表头手工码：" + id + "，" + orgName + "组织名称不存在，请确认组织名称后导入！");
    }
    let billDate = importData.billDate; //单据日期
    if (billDate == null || billDate == undefined || billDate == "") {
      throw new Error("供应商预审表头手工码：" + id + "，单据日期为空，请填写完整后导入！");
    }
    let supplierCode = importData.supplierCode_code; //供应商编码
    if (supplierCode == null || supplierCode == undefined || supplierCode == "") {
      throw new Error("供应商预审表头手工码：" + id + "，供应商编码为空，请填写完整后导入！");
    }
    //查询物料code是否存在
    let productInfo = ObjectStore.queryByYonQL("select id, code, name  from pc.product.Product where code ='" + importData.productCode_code + "'", "productcenter");
    if (productInfo.length == 0) {
      throw new Error("供应商预审表头手工码：" + id + "，没有编码为" + importData.productCode_code + "的物料！");
    } else if (productInfo.length > 0) {
      param.data.set("productName", productInfo[0].name); //["productName"] = productInfo[0].name;
    }
    let supplierFile = ObjectStore.queryByYonQL("select id, code, name from aa.vendor.Vendor where org ='" + orgData[0].id + "' and code ='" + importData.supplierCode_code + "'", "yssupplier");
    if (supplierFile.length == 0) {
      throw new Error("供应商预审表头手工码：" + id + "，" + orgName + "组织下没有编码为" + importData.supplierCode_code + "的供应商！");
    } else if (productInfo.length > 0) {
      param.data.set("supplierName", supplierFile[0].name);
    }
    //根据供应商id和组织id查询是否预审
    let supplierData = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_pre_hear_sheet", { supplierCode: supplierFile[0].id, org_id: orgData[0].id, productCode: productInfo[0].id });
    let proCode = importData.productCode_code; //物料编码
    if (proCode == null || proCode == undefined || proCode == "") {
      throw new Error("供应商预审表头手工码：" + id + "，物料编码为空，请填写完整后导入！");
    }
    //根据组织id和物料编码查询GMP物料档案是否存在
    let endDate = importData.endDate; //物料编码
    if (endDate == null || endDate == undefined || endDate == "") {
      throw new Error("供应商预审表头手工码：" + id + "，预审有效期至为空，请填写完整后导入！");
    }
    let gmpparams = ObjectStore.queryByYonQL("select * from ISY_2.ISY_2.SY01_gmpparams where org_id ='" + orgData[0].id + "'", "sy01");
    if (gmpparams.length > 0) {
      if (gmpparams[0].isSupPreqLicenManage == "1") {
        let xgzzList = importData.SY01_supply_licenceList; //供应商/生产厂商资质审证照
        let poavList = importData.SY01_supply_power_attorneyList; //授权委托人
        if (xgzzList == undefined || xgzzList == null || xgzzList.length == 0) {
          throw new Error("供应商预审表头手工码：" + id + "，供应商/生产厂商资质证照为空，请填写完整后导入！");
        } else if (poavList == undefined || poavList == null || poavList.length == 0) {
          throw new Error("供应商预审表头手工码：" + id + "，供应商授权委托人为空，请填写完整后导入！");
        }
        for (let i = 0; i < poavList.length; i++) {
          let poalv5List = poavList[i].SY01_supply_auth_scope1List; //授权委托人信息
          let authorizerCode = poavList[i].authorizerCode_code; //授权委托人编码
          let poavId = poavList[i].id; //授权委托人手工码
          if (poalv5List == undefined || poalv5List == null || poalv5List.length == 0) {
            throw new Error("授权委托人手工码：" + poavId + "，授权委托人的授权信息为空，请填写完整后导入！");
          }
          if (authorizerCode == undefined || authorizerCode == null) {
            throw new Error("授权委托人手工码：" + poavId + "，授权人编码为空，请填写完整后导入！");
          }
          //根据业务名称、供应商id和组织id查询业务员档案是否存在
          let salemanData = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_personal_licensen", { supplierName: supplierFile[0].id, org_id: orgData[0].id, code: authorizerCode });
          if (salemanData.length == 0) {
            throw new Error("授权委托人手工码：" + poavId + "，供应商编码" + supplierCode + "下没有编码为" + authorizerCode + "的业务员，请更换其他业务员导入！");
          }
        }
        for (let i = 0; i < xgzzList.length; i++) {
          let syqysp_xgzz_List = xgzzList[i].SY01_supply_auth_scope2List; //供应商/生产厂商证照
          let xgzzId = xgzzList[i].id; //相关证照手工码
          if (syqysp_xgzz_List == undefined || syqysp_xgzz_List == null || syqysp_xgzz_List.length == 0) {
            throw new Error("相关证照手工码：" + xgzzId + "，相关证照的证照授权信息为空，请填写完整后导入！");
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });