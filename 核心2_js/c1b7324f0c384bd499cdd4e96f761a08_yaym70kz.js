let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var bumenbianma = request.bumenbianma;
    var zuzhibianma = request.zuzhibianma;
    var renyuanbianma = request.renyuanbianma;
    var danjuleixing = request.danjuleixing;
    var jiandubumencode = request.jiandubumencode;
    var yanshoubumencode = request.yanshoubumencode;
    var supsql = null;
    let cgfazbList = [];
    let caigob1List = [];
    var message;
    var sussecc;
    var bipid;
    //组织编码翻译
    let orgSql = "select * from org.func.BaseOrg where code=" + zuzhibianma;
    var org = ObjectStore.queryByYonQL(orgSql, "ucf-org-center"); //
    if (org && org[0] !== undefined) {
      request.zuzhi = org[0].id;
    } else {
      message = zuzhibianma + "在友空间组织档案未查询到!";
    }
    let deptSql = "select * from bd.adminOrg.DeptOrgVO where code=" + bumenbianma + "_" + zuzhibianma;
    var dept = ObjectStore.queryByYonQL(deptSql, "orgcenter"); //
    if (dept && dept[0] !== undefined) {
      request.bumen = dept[0].id;
    } else {
      message = bumenbianma + "在友空间部门档案未查询到!";
    }
    let staffSql = "select * from bd.staff.StaffNew where code=" + renyuanbianma;
    var staff = ObjectStore.queryByYonQL(staffSql, "ucf-staff-center"); //
    if (staff && staff[0] !== undefined) {
      request.renyuan = staff[0].id;
    } else {
      message = renyuanbianma + "在友空间员工档案未查询到!";
    }
    if (request.caigob1List && request.caigob1List !== undefined && request.caigob1List.length > 0) {
      for (let i = 0; i < request.caigob1List.length; i++) {
        let detail2 = {
          tuijiangongyingshang: "tuijiangongyingshang",
          tuijiangongyingshangmingcheng: "tuijiangongyingshangmingcheng",
          tuijianliyou: "tuijianliyou"
        };
        let detail1 = {
          baojia: "baojia",
          gongyingshangmingcheng1: "gongyingshangmingcheng1",
          shifouruku: "shifouruku",
          beizhu: "beizhu"
        };
        var detail = request.caigob1List[i];
        if (detail && detail.tuijiangongyingshangbianma) {
          let supbianma = detail.tuijiangongyingshangbianma;
          supsql = "select * from aa.vendor.Vendor where code ='" + supbianma + "'";
          var sup = ObjectStore.queryByYonQL(supsql, "yssupplier");
          if (sup && sup[0] !== undefined) {
            detail2.tuijiangongyingshang = sup[0].id;
            detail2.tuijiangongyingshangmingcheng = sup[0].name;
            detail2.tuijianliyou = detail.tuijianliyou;
            cgfazbList.push(detail2);
          } else {
            message = supbianma + "在友空间供应商档案未查询到!";
          }
        } else {
          detail1.baojia = detail.baojia;
          detail1.gongyingshangmingcheng1 = detail.gongyingshangmingcheng1;
          detail1.shifouruku = detail.shifouruku;
          detail1.beizhu = detail.beizhu;
          caigob1List.push(detail1);
        }
      }
      request.caigob1List = caigob1List;
      request.cgfazbList = cgfazbList;
    }
    var res = ObjectStore.insert("AT168837E809980003.AT168837E809980003.puorder1", request, "ybdcaa4177");
    if (message == undefined) {
      sussecc = "Y";
      message = "推送成功";
      bipid = res.id;
    } else {
      sussecc = "N";
    }
    return { sussecc, message, bipid };
  }
}
exports({ entryPoint: MyAPIHandler });