let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //拼接当前时间字符串
    //获取当前时间
    var nowDate = new Date().getTime();
    //获取当前北京时间
    var date = new Date(nowDate + 8 * 3600 * 1000);
    //年
    var year = date.getFullYear();
    //月
    var month = date.getMonth();
    //日
    var day = date.getDate();
    //时
    var hours = date.getHours();
    //分
    var min = date.getMinutes();
    //秒
    var sec = date.getSeconds();
    var strDate = year + "-" + (month + 1 < 10 ? "0" + (month + 1) : month + 1) + "-" + day + " " + (hours < 10 ? "0" + hours : hours) + ":" + min + ":" + sec;
    //拼接间隔6分钟后时间字符串
    var nowTime = date.getTime();
    //获取当前时间
    var date6 = new Date(nowTime - 6 * 60 * 1000);
    //年
    var year6 = date6.getFullYear();
    //月
    var month6 = date6.getMonth();
    //日
    var day6 = date6.getDate();
    //时
    var hours6 = date6.getHours();
    //分
    var min6 = date6.getMinutes();
    //秒
    var sec6 = date6.getSeconds();
    var strDate6 = year6 + "-" + (month6 + 1 < 10 ? "0" + (month6 + 1) : month6 + 1) + "-" + day6 + " " + (hours6 < 10 ? "0" + hours6 : hours6) + ":" + min6 + ":" + sec6;
    var sql1 = "select * from pc.productapply.ProductApply where productUpdateTime < '" + strDate + "' and productUpdateTime >= '" + strDate6 + "' and effectStatus = 2";
    var sql2 = "select * from pc.productapply.ProductApply where effectStatus = 2 limit 10";
    var res1 = ObjectStore.queryByYonQL(sql1, "productcenter");
    var arr = [];
    if (res1.length > 0) {
      for (var i = 0; i < res1.length; i++) {
        var obj1 = res1[i];
        //判断是否生成GMP物料档案
        if (!obj1 || !obj1.productApplyCharacterDef || !obj1.productApplyCharacterDef.GMPWL) {
          break;
        }
        var obj2 = JSON.parse(obj1.productData);
        //物料信息
        var material = obj2.id;
        var materialCode = obj2.code;
        var materialName = obj2.name;
        //组织信息
        var org = obj2.orgId;
        //批准文号
        if (obj1.productApplyCharacterDef.PZWH) {
          var approvalNumber = obj1.productApplyCharacterDef.PZWH;
        }
        var obj = {
          material: material,
          materialCode: materialCode,
          materialName: materialName,
          org: org,
          org_id: org,
          approvalNumber: approvalNumber
        };
        arr[arr.length] = obj;
      }
      let param1 = { arr: arr };
      let func = extrequire("ISY_2.backOpenApiFunction.saveGSP");
      let res = func.execute(param1);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });