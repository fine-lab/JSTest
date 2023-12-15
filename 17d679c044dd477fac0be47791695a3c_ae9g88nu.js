let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let billObj = {
      id: "youridHere",
      compositions: [
        {
          name: "SY01_khbgsp_xgzzList",
          compositions: [
            {
              name: "SY01_khbgsp_xgzz_fwList"
            }
          ]
        },
        {
          name: "SY01_khbgsp_sqwtsList",
          compositions: [
            {
              name: "SY01_khbgsp_sqwts_lList"
            }
          ]
        },
        {
          name: "sy01_customer_change_reportList"
        }
      ]
    };
    //实体查询
    try {
      let billInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_cuschangeatv2", billObj);
      return { billInfo };
    } catch (e) {
      throw new Error(JSON.stringify(e));
    }
  }
}
exports({ entryPoint: MyAPIHandler });