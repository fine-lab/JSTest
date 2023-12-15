let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    //是否已传EBS
    if (pdata.defines.define8 == "true") {
      return { code: 200 };
    }
    let sql = "select code, name from bd.bill.TransType where id =" + pdata.bustype;
    var res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
    pdata.bustype_name = res[0].name;
    pdata.bustype_code = res[0].code;
    //非贸易公司的不走该方法
    if (pdata.bustype_name.indexOf("贸易公司") == -1) {
      return { code: 200 };
    }
    //根据org查询业务单元编码
    //查询业务单元等于发货单主表库存组织的外部编码
    let sql1 = "select define1,define4 from org.func.BaseOrgDefine where id=" + pdata.org;
    var res1 = ObjectStore.queryByYonQL(sql1, "ucf-org-center");
    //根据operator查询员工信息身份证号
    let sql2 = "select cert_no from bd.staff.Staff where id=" + pdata.operator;
    var res2 = ObjectStore.queryByYonQL(sql2, "ucf-org-center");
    //根据仓库id查询仓库编码
    let sql3 = "select code from aa.warehouse.Warehouse where id = " + pdata.warehouse;
    var res3 = ObjectStore.queryByYonQL(sql3, "productcenter");
    //根据部门id查询部门编码
    let sql4 = "select code from org.func.Dept where id = " + pdata.department;
    var res4 = ObjectStore.queryByYonQL(sql4, "ucf-org-center");
    var pparam = [];
    for (var item of pdata.othOutRecords) {
      pparam.push({
        businessEntity: res1[0].define4, //业务实体
        stockorgcode: res1[0].define1, //业务单元编码(库存组织)
        org: res4[0].code, //部门
        idCard: res2[0].cert_no, //身份证
        purpose: pdata.defines.define7, //用途
        time: pdata.vouchdate, //单据时间
        product_cCode: item.product_cCode, //物料编码
        qty: item.qty, //数量
        warehouse: res3[0].code, //仓库
        code: pdata.code, //单据号
        type: "01", //类型 出库：01  入库: 02
        batch: item.defines.define1
      });
    }
    var base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = { "Content-Type": hmd_contenttype };
    var body = { resdata: pparam };
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    var token = func.execute("").access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(body));
    //加判断
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    if (code != "200") {
      throw new Error("失败!" + obj.message);
    } else {
      if (obj.data.message.indexOf("成功") != -1) {
        //更新
        var update = {
          resdata: {
            id: pdata.id,
            defines: { id: pdata.id, define8: "true" }
          }
        };
        var base_path2 = "https://www.example.com/";
        var token2 = func.execute("").access_token;
        let apiResponse2 = postman("post", base_path2.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(update));
        var obj2 = JSON.parse(apiResponse2);
        if (obj2.code != "200") {
          throw new Error("更新失败!" + obj2.message);
        } else {
          if (obj2.data.message.indexOf("成功") != -1) {
            return { code: 200 };
          } else {
            throw new Error("更新失败!" + obj2.data.message);
          }
        }
      } else {
        throw new Error("失败!" + obj.data.message);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });