let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute() {
    //排除客户
    var out_cus = ObjectStore.queryByYonQL("select tmp_cus_code from ISY_2.ISY_2.SY01_customer_license_file where tmp_cus_code is not null group by tmp_cus_code", "sy01");
    var billInfo;
    if (out_cus.length > 0) {
      let not_in_str = "";
      for (let i = 0; i < out_cus.length; i++) {
        not_in_str += "'" + out_cus[i].tmp_cus_code + "'";
        if (i < out_cus.length - 1) {
          not_in_str += ",";
        }
      }
      billInfo = ObjectStore.queryByYonQL("select * from aa.customerapply.CustomerApply where verifystate=2 and  merchantCode not in(" + not_in_str + ")", "iuap-apdoc-material");
    } else {
      billInfo = ObjectStore.queryByYonQL("select * from aa.customerapply.CustomerApply where verifystate=2 ", "iuap-apdoc-material");
    }
    var res_json;
    var detail_bill;
    var license;
    var license_json = [];
    let insertJson;
    var customer;
    var all_insert = [];
    for (let i = 0; i < billInfo.length; i++) {
      res_json = billInfo[i].customerData;
      detail_bill = JSON.parse(res_json);
      //证照列表
      customer = ObjectStore.queryByYonQL("select * from aa.merchant.Merchant where code='" + billInfo[i].merchantCode + "'limit 0,1", "iuap-apdoc-material");
      if (customer.length > 0) {
        if (detail_bill.SY01_customer_licenseList != undefined && detail_bill.SY01_customer_licenseList != null) {
          license = detail_bill.SY01_customer_licenseList;
          for (let j = 0; j < license.length; j++) {
            license_json = [];
            license_json.push({
              license_type: license[j].license_type,
              validity_start_date: license[j].validity_start_date,
              remark: license[j].remark,
              validity_end_date: license[j].validity_end_date,
              license_code: license[j].license_type_code
            });
          }
          insertJson = {
            org_id: billInfo[i].applicationOrg,
            tmp_cus_code: billInfo[i].merchantCode,
            customerCode: customer[0].id,
            customerName: billInfo[i].merchantName,
            applyer: billInfo[i].bizOperator,
            depart: billInfo[i].applyDepartment,
            SY01_customer_license_detailList: license_json
          };
          all_insert.push(insertJson);
        }
      }
    }
    if (all_insert.length > 0) {
      ObjectStore.insertBatch("ISY_2.ISY_2.SY01_customer_license_file", all_insert, "SY01_customer_license_file");
    }
  }
}
exports({ entryPoint: MyTrigger });