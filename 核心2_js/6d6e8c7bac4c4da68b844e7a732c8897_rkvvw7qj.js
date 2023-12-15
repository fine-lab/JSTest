let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
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
        purpose: "10", //用途
        time: pdata.vouchdate, //单据时间
        product_cCode: "4502002592", //item.product_cCode,   //物料编码
        qty: item.qty, //数量
        warehouse: res3[0].code, //仓库
        code: pdata.code, //单据号
        type: "01", //类型 出库：01  入库: 02
        batch: "2021070708"
      });
    }
    var base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      resdata: pparam
    };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let res_r = func.execute("");
    var token2 = res_r.access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(body));
    //加判断
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    if (code != "200") {
      throw new Error("失败!" + obj.message);
    }
    return { code: code };
  }
}
exports({ entryPoint: MyTrigger });