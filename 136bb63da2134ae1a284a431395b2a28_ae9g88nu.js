let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let masterId = request.masterId;
    let childArr = [];
    let childRejectArr = [];
    for (let i = 0; i < masterId.length; i++) {
      let childSql = "select * from st.purinrecord.PurInRecords where mainid=" + masterId[i];
      let childRes = ObjectStore.queryByYonQL(childSql);
      for (let j = 0; j < childRes.length; j++) {
        let wheresql = " And id=" + childRes[j].product;
        let proListSql = "select * from  pc.product.Product where 1=1 " + wheresql;
        let proListRes = ObjectStore.queryByYonQL(proListSql, "productcenter");
        childRes[j]["extend_package_specification"] = proListRes[0].extend_package_specification;
        childRes[j]["extend_bwm"] = proListRes[0].extend_standard_code;
        //包装规格:extend_package_specification
        //本位码:extend_standard_code
      }
      if (childRes[0].qty > 0) {
        childArr.push(childRes);
      } else if (childRes[0].qty < 0) {
        childRejectArr.push(childRes);
      }
    }
    return { inWareHouseArr: childArr, inWareHouseRejectArr: childRejectArr };
  }
}
exports({ entryPoint: MyAPIHandler });