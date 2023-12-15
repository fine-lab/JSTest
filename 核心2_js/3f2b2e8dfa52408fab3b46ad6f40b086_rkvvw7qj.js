let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    if (pdata.defines && pdata.defines.define7 == "true") {
      return { code: 200 };
    }
    //非贸易公司的不走该方法
    if (pdata.bustype_name.indexOf("贸易公司") == -1) {
      return { code: 200 };
    }
    //根据库存组织查询业务实体
    let sql1 = "select define1,define4 from org.func.BaseOrgDefine where id=" + pdata.org;
    let res1 = ObjectStore.queryByYonQL(sql1, "ucf-org-center");
    pdata.stockorgcode = res1[0].define1;
    pdata.businessEntity = res1[0].define4;
    //根据部门id查询部门编码
    let sql2 = "select code from org.func.Dept where id = " + pdata.department;
    var res2 = ObjectStore.queryByYonQL(sql2, "ucf-org-center");
    pdata.org = res2[0].code;
    //根据operator查询员工信息身份证号
    let sql3 = "select cert_no from bd.staff.Staff where id=" + pdata.operator;
    var res3 = ObjectStore.queryByYonQL(sql3, "ucf-org-center");
    pdata.idCard = res3[0].cert_no;
    //根据仓库id查询仓库编码
    let sql4 = "select code from aa.warehouse.Warehouse where id = " + pdata.warehouse;
    var res4 = ObjectStore.queryByYonQL(sql4, "productcenter");
    pdata.warehouse = res4[0].code;
    var pparam = [];
    for (var item of pdata.othInRecords) {
      pparam.push({
        businessEntity: pdata.businessEntity, //业务实体
        stockorgcode: pdata.stockorgcode, //业务单元编码(库存组织)
        org: pdata.org, //部门
        idCard: pdata.idCard, //身份证
        purpose: pdata.defines.define8, //用途
        time: pdata.vouchdate, //单据时间
        product_cCode: item.product_cCode, //物料编码
        qty: item.qty, //数量
        warehouse: pdata.warehouse, //仓库
        code: pdata.code, //单据号
        batch: item.defines.define1, //批次
        type: "02" //类型 出库：01  入库: 02
      });
    }
    var base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = { "Content-Type": hmd_contenttype };
    var body = { resdata: pparam };
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    var token = func.execute("").access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(body));
    throw new Error(apiResponse);
    //加判断
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    if (code != "200") {
      throw new Error("失败!" + obj.message);
    } else {
      if (obj.data.message.indexOf("成功") != -1) {
        //调用二开中的其他入库单更新接口
        var token2 = func.execute("").access_token;
        let base_path2 = "https://www.example.com/";
        let body2 = {
          id: pdata.id,
          "defines!define7": "true"
        };
        let apiResponse2 = postman("post", base_path2.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(body2));
        var obj2 = JSON.parse(apiResponse2);
        if (obj2.code != "200") {
          throw new Error("更新失败!" + obj2.message);
        } else {
          if (obj2.data.code == "200") {
            return { code: 200 };
          } else {
            throw new Error("更新失败!" + obj2.data.message);
          }
        }
      } else {
        throw new Error("失败!" + obj.data.message);
      }
    }
    return { code: code };
  }
}
exports({ entryPoint: MyTrigger });