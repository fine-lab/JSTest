let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let merchantId = request.merchantId;
    let orgId = request.orgId;
    merchantId = "yourIdHere";
    orgId = "yourIdHere";
    //根据客户ID和组织ID 查询医药客户档案信息
    let sql = "select * from GT22176AT10.GT22176AT10.sy01_customers_file where org_id = " + orgId + " and customer = " + merchantId + " and firstMarketingStatus = '1' and dr = 0 and enable = '1' ";
    let res = ObjectStore.queryByYonQL(sql);
    if (res.length == 0) {
      throw new Error("医药客户档案中未找到对应组织客户");
    }
    //查询医药客户档案及证照、委托书信息
    let queryCondition = {
      id: res[0].id,
      compositions: [
        {
          name: "sy01_customers_file_licenseList",
          compositions: [
            {
              name: "sy01_customers_file_lic_authList"
            }
          ]
        },
        {
          name: "SY01_customers_file_certifyList",
          compositions: [
            {
              name: "SY01_customers_file_cer_authList"
            }
          ]
        },
        {
          name: "sy01_customers_file_other_repList"
        }
      ]
    };
    //实体查询
    let merchantInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.sy01_customers_file", queryCondition);
    return { merchantInfo };
  }
}
exports({ entryPoint: MyAPIHandler });