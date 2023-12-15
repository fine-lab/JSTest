let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let id = param.data[0].id;
    let SY01_customer_license_detailList = param.data[0].SY01_customer_license_detailList;
    if (SY01_customer_license_detailList == null || SY01_customer_license_detailList == undefined) {
      throw new Error("证照列表不能为空");
    }
    for (let i = 0; i < SY01_customer_license_detailList.length; i++) {
      for (let j = i + 1; j < SY01_customer_license_detailList.length; j++) {
        if (
          SY01_customer_license_detailList[i].license_type == SY01_customer_license_detailList[j].license_type &&
          SY01_customer_license_detailList[i].license_code == SY01_customer_license_detailList[j].license_code
        ) {
          throw new Error("相同证照类型证照编号不能相同");
        }
      }
    }
    //判断同客户同组织是否已有证照
    let customerCode = param.data[0].customerCode;
    let org_id = param.data[0].org_id;
    var object = { dr: 0, org_id: org_id, customerCode: customerCode };
    var res = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_customer_license_file", object);
    if (res.length > 0) {
      if (id != res[0].id) {
        throw new Error("已存在组织：" + param.data[0].org_id_name + ",客户:" + param.data[0].customerName + "的证照档案了");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });