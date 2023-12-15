let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let retData = {
      //供应商信息的map  odmCode -> venderInfo
      odmCodeToVendor: undefined,
      vendorIdToVendor: undefined
    };
    //根据供应商的编码或者ID去查询供应商信息
    let vendorSql =
      "select id,code,name,extendOdmCode,extendPushDown,(select contactmobile,defaultcontact,contactphone,contactname from vendorcontactss) vendorcontactss from aa.vendor.Vendor  where extendOdmCode <> null ";
    let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
    if (vendorRes && vendorRes.length > 0) {
      //根据设定好的供应商字段赋值给目标字段或者直接判断是否要推送HT
      retData.odmCodeToVendor = {};
      retData.vendorIdToVendor = {};
      vendorRes.forEach((item) => {
        let vendorcontactss = item.vendorcontactss;
        // 找到默认的供应商联系人
        if (vendorcontactss) {
          item["defaultcontact"] =
            vendorcontactss.find((contractor) => {
              return contractor.defaultcontact;
            }) || vendorcontactss[0];
        }
        retData.odmCodeToVendor[item.extendOdmCode] = item;
        retData.vendorIdToVendor[item.id] = item;
      });
    }
    return retData;
  }
}
exports({ entryPoint: MyTrigger });