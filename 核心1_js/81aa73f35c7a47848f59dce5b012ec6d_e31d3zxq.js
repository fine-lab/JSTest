let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sy_zz = "SY01_sykhsp_xgzzList";
    let sy_zz_fw = "SY01_sykhsp_xgzz_fwList";
    let sy_sq = "SY01_sykhsp_poavList";
    let sy_sq_fw = "SY01_poal_sqwt_sList";
    let sy_rep = "sy01_customer_other_reportList";
    let id = request.id;
    let yonql = "select id,code,verifystate from GT22176AT10.GT22176AT10.SY01_firstcampcusv3 where id = '" + id + "'";
    let res = ObjectStore.queryByYonQL(yonql, "sy01");
    if (res[0].verifystate == 2) {
      throw new Error(res[0].code + "已经审核");
    }
    let billObj = {
      id: res[0].id,
      compositions: [
        {
          name: sy_zz,
          compositions: [
            {
              name: sy_zz_fw
            }
          ]
        },
        {
          name: sy_sq,
          compositions: [
            {
              name: sy_sq_fw
            }
          ]
        },
        {
          name: sy_rep
        }
      ]
    };
    //实体查询
    let billInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_firstcampcusv3", billObj);
    let data = { billnum: "2e4cb1d5", data: JSON.stringify(billInfo) };
    ObjectStore.execute("audit", data);
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });