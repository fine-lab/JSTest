let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ids = request.iddata;
    var pzerror = "";
    var iddzb = []; //ID对照批量新增
    var plxgpz = []; //凭证批量修改
    for (var ina = ids.length - 1; ina >= 0; ina--) {
      try {
        var did = ids[ina];
        var bduri = "GT6903AT9.GT6903AT9.SFKD001";
        var bdbm = "b9049bfeList";
        var yycode = "GT6903AT9";
        //查询单据内容Json
        var docQuerydata = {
          id: did
        };
        //单据类型
        var Documenttype = 0;
        //查询单据信息
        var docdata = ObjectStore.selectById(bduri, docQuerydata);
        if (docdata.verifystate != 2) {
          pzerror += docdata.code + "请先核准单据" + "\n";
          continue;
        }
        if (docdata.shifuyishengchengpingzheng == 1) {
          pzerror += docdata.code + "已生成凭证" + "\n";
          continue;
        }
        if (docdata.Documenttype == 1) {
          Documenttype = 1; //收款
        }
        if (docdata.Documenttype == 2) {
          Documenttype = 2; //付款
        }
        var sfklx = "";
        if (Documenttype == 1) {
          sfklx = "收款";
        } else {
          sfklx = "付款";
        }
        var jzqjtem = docdata.Transactiondate.substring(0, 7);
        var sqlaaaaa =
          "select distinct id,billCode,periodUnion from egl.voucher.VoucherBO where id in ( select voucherId from egl.voucher.VoucherBodyBO where ( description ='" +
          docdata.Abstract +
          "-" +
          sfklx +
          "-" +
          docdata.code +
          "' )  and ( businessDate='" +
          docdata.Transactiondate +
          "' )  ) ";
        var res11122 = ObjectStore.queryByYonQL(sqlaaaaa, "yonbip-fi-egl");
        if (res11122.length > 0) {
          var pzdoctemp = res11122[0].periodUnion + "-" + "记" + res11122[0].billCode;
          var objectjg = {
            id: did,
            new34: pzdoctemp,
            shifuyishengchengpingzheng: "1"
          };
          plxgpz.push(objectjg);
          continue;
        }
        var headdata = ObjectStore.queryByYonQL("select id from GT13490AT20.GT13490AT20.KJ001 where  danjuleixing='" + Documenttype + "'");
        var ywdl = ""; //业务大类
        if (docdata.yewudalei != undefined) {
          ywdl = "  and yewudalei='" + docdata.yewudalei + "'  ";
        }
        var fyxm = ""; //费用项目
        if (docdata.Expenseitems != undefined) {
          fyxm = "  and feiyongxiangmu='" + docdata.Expenseitems + "' ";
        }
        var zy = docdata.Abstract; //摘要
        zy = string2Json(zy);
        if (Documenttype == 1) {
          zy = zy + "-收款-" + docdata.code;
        }
        if (Documenttype == 2) {
          zy = zy + "-付款-" + docdata.code;
        }
        var je = docdata.money; //金额
        var feiyongid = docdata.Expenseitems; //费用项目
        var renyuanid = docdata.renyuan; //人员
        var bumenid = docdata.Costbeardepartment; //部门
        var kehuid = docdata.Customer; //客户
        var yinhangid = docdata.zDYR09; //银行企业账户
        var gongyingid = docdata.supplier; //供应商
        var pzdate = docdata.Transactiondate; //交易日期
        //借方
        var jkm = undefined; //借方科目
        var fu1 = undefined; //借方辅助核算1ID
        var fu2 = undefined; //借方辅助核算2ID
        var fu1Code = undefined; //借方辅助核算1Code
        var fu2Code = undefined; //借方辅助核算2Code
        var valueCode1 = undefined; //借方辅助核算项来源档案取值code1
        var valueCode2 = undefined; //借方辅助核算项来源档案取值code2
        if (headdata.length > 0) {
          var linedata = ObjectStore.queryByYonQL("select * from GT13490AT20.GT13490AT20.KJ002 where KJ001_id='" + headdata[0].id + "' and jiedaifang='1' " + fyxm);
          if (linedata.length == 0) {
            pzerror += docdata.code + "未找对匹配科目对照模板" + "\n";
            continue;
          } else {
            for (var i = linedata.length - 1; i >= 0; i--) {
              if (linedata[i].feiyongxiangmu == docdata.Expenseitems) {
                jkm = linedata[i].huijikemu;
                fu1 = linedata[i].fuzhuhesuan;
                fu2 = linedata[i].fuzhuhesuanxiang;
              }
            }
            linedata = ObjectStore.queryByYonQL("select * from GT13490AT20.GT13490AT20.KJ002 where KJ001_id='" + headdata[0].id + "' and jiedaifang='1' " + ywdl + fyxm);
            if (linedata.length > 0) {
              for (var i = linedata.length - 1; i >= 0; i--) {
                if (linedata[i].feiyongxiangmu == docdata.Expenseitems && linedata[i].yewudalei == docdata.yewudalei) {
                  jkm = linedata[i].huijikemu;
                  fu1 = linedata[i].fuzhuhesuan;
                  fu2 = linedata[i].fuzhuhesuanxiang;
                }
              }
            }
          }
        } else {
          pzerror += docdata.code + "未找对匹配会计科目对照" + "\n";
          continue;
        }
        if (fu1 == "1533852668327886852") {
          //费用项目 //bd.expenseitem.ExpenseItem
          fu1Code = "0009";
          if (feiyongid == undefined) {
            pzerror += docdata.code + "未找到费用项目" + "\n";
            continue;
          }
          var sqlfyxmsql = " select code from bd.expenseitem.ExpenseItem where id='" + feiyongid + "' ";
          var resfyxmsql = ObjectStore.queryByYonQL(sqlfyxmsql, "finbd");
          if (resfyxmsql.length > 0) {
            valueCode1 = resfyxmsql[0].code;
          } else {
            pzerror += docdata.code + "未找到费用项目" + "\n";
            continue;
          }
        }
        if (fu1 == "1498885071814787362") {
          //人员
          fu1Code = "0003";
          if (renyuanid == undefined) {
            pzerror += docdata.code + "未找到人员" + "\n";
            continue;
          }
          var sqlrysql = " select code from bd.staff.Staff where id='" + renyuanid + "' ";
          var resrysql = ObjectStore.queryByYonQL(sqlrysql, "ucf-staff-center");
          if (resrysql.length > 0) {
            valueCode1 = resrysql[0].code;
          } else {
            pzerror += docdata.code + "未找到人员" + "\n";
            continue;
          }
        }
        if (fu1 == "1498885071814787365") {
          //部门
          fu1Code = "0001"; //
          var base_pathbm1 = "select code from bd.adminOrg.AdminOrgVO where id='" + bumenid + "' ";
          var apiResponsebm1 = ObjectStore.queryByYonQL(base_pathbm1, "ucf-org-center");
          if (apiResponsebm1.length > 0) {
            valueCode1 = apiResponsebm1[0].code;
          } else {
            pzerror += docdata.code + "未找到部门" + "\n";
            continue;
          }
        }
        if (fu1 == "1498885071814787363") {
          //客户
          fu1Code = "0005";
          if (kehuid == undefined) {
            pzerror += docdata.code + "未找到客户" + "\n";
            continue;
          }
          var sqlkhsql = " select code from aa.merchant.Merchant where id='" + kehuid + "' ";
          var reskhsql = ObjectStore.queryByYonQL(sqlkhsql, "productcenter");
          if (reskhsql.length > 0) {
            valueCode1 = reskhsql[0].code;
          } else {
            pzerror += docdata.code + "未找到客户" + "\n";
            continue;
          }
        }
        if (fu1 == "1533852152936005635") {
          //银行企业账户
          fu1Code = "0008";
          if (yinhangid == undefined) {
            pzerror += docdata.code + "未找到银行企业账户" + "\n";
            continue;
          }
          var sqlyhsql = "select code from bd.basedocdef.CustomerDocVO where id='" + yinhangid + "' ";
          var resyhsql = ObjectStore.queryByYonQL(sqlyhsql, "ucfbasedoc");
          if (resyhsql.length > 0) {
            valueCode1 = resyhsql[0].code;
          } else {
            pzerror += docdata.code + "未找到银行企业账户" + "\n";
            continue;
          }
        }
        if (fu1 == "1498885071814787364") {
          //供应商
          fu1Code = "0004";
          if (gongyingid == undefined) {
            pzerror += docdata.code + "未找到供应商" + "\n";
            continue;
          }
          var sqlgys = "select code from aa.vendor.Vendor where id='" + gongyingid + "' ";
          var ressqlgys = ObjectStore.queryByYonQL(sqlgys, "yssupplier");
          if (ressqlgys.length > 0) {
            valueCode1 = ressqlgys[0].code;
          } else {
            pzerror += docdata.code + "未找到供应商" + "\n";
            continue;
          }
        }
        if (fu2 == "1533852668327886852") {
          //费用项目 //bd.expenseitem.ExpenseItem
          fu2Code = "0009";
          if (feiyongid == undefined) {
            pzerror += docdata.code + "未找到费用项目" + "\n";
            continue;
          }
          var sqlfyxmsql = " select code from bd.expenseitem.ExpenseItem where id='" + feiyongid + "' ";
          var resfyxmsql = ObjectStore.queryByYonQL(sqlfyxmsql, "finbd");
          if (resfyxmsql.length > 0) {
            valueCode2 = resfyxmsql[0].code;
          } else {
            pzerror += docdata.code + "未找到费用项目" + "\n";
            continue;
          }
        }
        if (fu2 == "1498885071814787362") {
          //人员
          fu2Code = "0003";
          if (renyuanid == undefined) {
            pzerror += docdata.code + "未找到人员" + "\n";
            continue;
          }
          var sqlrysql = " select code from bd.staff.Staff where id='" + renyuanid + "' ";
          var resrysql = ObjectStore.queryByYonQL(sqlrysql, "ucf-staff-center");
          if (resrysql.length > 0) {
            valueCode2 = resrysql[0].code;
          } else {
            pzerror += docdata.code + "未找到人员" + "\n";
            continue;
          }
        }
        if (fu2 == "1498885071814787365") {
          //部门
          fu2Code = "0001"; //
          var base_pathbm2 = "select code from bd.adminOrg.AdminOrgVO where id='" + bumenid + "' ";
          var apiResponsebm2 = ObjectStore.queryByYonQL(base_pathbm2, "ucf-org-center");
          if (apiResponsebm2.length > 0) {
            valueCode2 = apiResponsebm2[0].code;
          } else {
            pzerror += docdata.code + "未找到部门" + "\n";
            continue;
          }
        }
        if (fu2 == "1498885071814787363") {
          //客户
          fu2Code = "0005";
          if (kehuid == undefined) {
            pzerror += docdata.code + "未找到客户" + "\n";
            continue;
          }
          var sqlkhsql = " select code from aa.merchant.Merchant where id='" + kehuid + "' ";
          var reskhsql = ObjectStore.queryByYonQL(sqlkhsql, "productcenter");
          if (reskhsql.length > 0) {
            valueCode2 = reskhsql[0].code;
          } else {
            pzerror += docdata.code + "未找到客户" + "\n";
            continue;
          }
        }
        if (fu2 == "1533852152936005635") {
          //银行企业账户
          fu2Code = "0008";
          if (yinhangid == undefined) {
            pzerror += docdata.code + "未找到银行企业账户" + "\n";
            continue;
          }
          var sqlyhsql = "select code from bd.basedocdef.CustomerDocVO where id='" + yinhangid + "' ";
          var resyhsql = ObjectStore.queryByYonQL(sqlyhsql, "ucfbasedoc");
          if (resyhsql.length > 0) {
            valueCode2 = resyhsql[0].code;
          } else {
            pzerror += docdata.code + "未找到银行企业账户" + "\n";
            continue;
          }
        }
        if (fu2 == "1498885071814787364") {
          //供应商
          fu2Code = "0004";
          if (gongyingid == undefined) {
            pzerror += docdata.code + "未找到供应商" + "\n";
            continue;
          }
          var sqlgys = "select code from aa.vendor.Vendor where id='" + gongyingid + "' ";
          var ressqlgys = ObjectStore.queryByYonQL(sqlgys, "yssupplier");
          if (ressqlgys.length > 0) {
            valueCode2 = ressqlgys[0].code;
          } else {
            pzerror += docdata.code + "未找到供应商" + "\n";
            continue;
          }
        }
        //贷方
        var dkm = undefined; //贷方科目
        var du1 = undefined; //贷方辅助核算1ID
        var du2 = undefined; //贷方辅助核算2ID
        var du1Code = undefined; //贷方辅助核算1Code
        var du2Code = undefined; //贷方辅助核算2Code
        var dalueCode1 = undefined; //贷方辅助核算项来源档案取值code1
        var dalueCode2 = undefined; //贷方辅助核算项来源档案取值code2
        if (headdata.length > 0) {
          var linedata = ObjectStore.queryByYonQL("select * from GT13490AT20.GT13490AT20.KJ002 where KJ001_id='" + headdata[0].id + "' and jiedaifang='2' " + fyxm);
          if (linedata.length == 0) {
            pzerror += docdata.code + "未找对匹配科目对照模板" + "\n";
            continue;
          } else {
            for (var i = linedata.length - 1; i >= 0; i--) {
              if (linedata[i].feiyongxiangmu == docdata.Expenseitems) {
                dkm = linedata[i].huijikemu;
                du1 = linedata[i].fuzhuhesuan;
                du2 = linedata[i].fuzhuhesuanxiang;
              }
            }
            linedata = ObjectStore.queryByYonQL("select * from GT13490AT20.GT13490AT20.KJ002 where KJ001_id='" + headdata[0].id + "' and jiedaifang='2' " + ywdl + fyxm);
            if (linedata.length > 0) {
              for (var i = linedata.length - 1; i >= 0; i--) {
                if (linedata[i].feiyongxiangmu == docdata.Expenseitems && linedata[i].yewudalei == docdata.yewudalei) {
                  dkm = linedata[i].huijikemu;
                  du1 = linedata[i].fuzhuhesuan;
                  du2 = linedata[i].fuzhuhesuanxiang;
                }
              }
            }
          }
        } else {
          pzerror += docdata.code + "未找对匹配会计科目对照" + "\n";
          continue;
        }
        if (du1 == "1533852668327886852") {
          //费用项目 //bd.expenseitem.ExpenseItem
          du1Code = "0009";
          if (feiyongid == undefined) {
            pzerror += docdata.code + "未找到费用项目" + "\n";
            continue;
          }
          var sqlfyxmsql = " select code from bd.expenseitem.ExpenseItem where id='" + feiyongid + "' ";
          var resfyxmsql = ObjectStore.queryByYonQL(sqlfyxmsql, "finbd");
          if (resfyxmsql.length > 0) {
            dalueCode1 = resfyxmsql[0].code;
          } else {
            pzerror += docdata.code + "未找到费用项目" + "\n";
            continue;
          }
        }
        if (du1 == "1498885071814787362") {
          //人员
          du1Code = "0003";
          if (renyuanid == undefined) {
            pzerror += docdata.code + "未找到人员" + "\n";
            continue;
          }
          var sqlrysql = " select code from bd.staff.Staff where id='" + renyuanid + "' ";
          var resrysql = ObjectStore.queryByYonQL(sqlrysql, "ucf-staff-center");
          if (resrysql.length > 0) {
            dalueCode1 = resrysql[0].code;
          } else {
            pzerror += docdata.code + "未找到人员" + "\n";
            continue;
          }
        }
        if (du1 == "1498885071814787365") {
          //部门
          du1Code = "0001"; //
          var base_pathbm1_df = "select code from bd.adminOrg.AdminOrgVO where id='" + bumenid + "' ";
          var apiResponsebm1_df = ObjectStore.queryByYonQL(base_pathbm1_df, "ucf-org-center");
          if (apiResponsebm1_df.length > 0) {
            dalueCode1 = apiResponsebm1_df[0].code;
          } else {
            pzerror += docdata.code + "未找到部门" + "\n";
            continue;
          }
        }
        if (du1 == "1498885071814787363") {
          //客户
          du1Code = "0005";
          if (kehuid == undefined) {
            pzerror += docdata.code + "未找到客户" + "\n";
            continue;
          }
          var sqlkhsql = " select code from aa.merchant.Merchant where id='" + kehuid + "' ";
          var reskhsql = ObjectStore.queryByYonQL(sqlkhsql, "productcenter");
          if (reskhsql.length > 0) {
            dalueCode1 = reskhsql[0].code;
          } else {
            pzerror += docdata.code + "未找到客户" + "\n";
            continue;
          }
        }
        if (du1 == "1533852152936005635") {
          //银行企业账户
          du1Code = "0008";
          if (yinhangid == undefined) {
            pzerror += docdata.code + "未找到银行企业账户" + "\n";
            continue;
          }
          var sqlyhsql = "select code from bd.basedocdef.CustomerDocVO where id='" + yinhangid + "' ";
          var resyhsql = ObjectStore.queryByYonQL(sqlyhsql, "ucfbasedoc");
          if (resyhsql.length > 0) {
            dalueCode1 = resyhsql[0].code;
          } else {
            pzerror += docdata.code + "未找到银行企业账户" + "\n";
            continue;
          }
        }
        if (du1 == "1498885071814787364") {
          //供应商
          du1Code = "0004";
          if (gongyingid == undefined) {
            pzerror += docdata.code + "未找到供应商" + "\n";
            continue;
          }
          var sqlgys = "select code from aa.vendor.Vendor where id='" + gongyingid + "' ";
          var ressqlgys = ObjectStore.queryByYonQL(sqlgys, "yssupplier");
          if (ressqlgys.length > 0) {
            dalueCode1 = ressqlgys[0].code;
          } else {
            pzerror += docdata.code + "未找到供应商" + "\n";
            continue;
          }
        }
        if (du2 == "1533852668327886852") {
          //费用项目 //bd.expenseitem.ExpenseItem
          du2Code = "0009";
          if (feiyongid == undefined) {
            pzerror += docdata.code + "未找到费用项目" + "\n";
            continue;
          }
          var sqlfyxmsql = " select code from bd.expenseitem.ExpenseItem where id='" + feiyongid + "' ";
          var resfyxmsql = ObjectStore.queryByYonQL(sqlfyxmsql, "finbd");
          if (resfyxmsql.length > 0) {
            dalueCode2 = resfyxmsql[0].code;
          } else {
            pzerror += docdata.code + "未找到费用项目" + "\n";
            continue;
          }
        }
        if (du2 == "1498885071814787362") {
          //人员
          du2Code = "0003";
          if (renyuanid == undefined) {
            pzerror += docdata.code + "未找到人员" + "\n";
            continue;
          }
          var sqlrysql = " select code from bd.staff.Staff where id='" + renyuanid + "' ";
          var resrysql = ObjectStore.queryByYonQL(sqlrysql, "ucf-staff-center");
          if (resrysql.length > 0) {
            dalueCode2 = resrysql[0].code;
          } else {
            pzerror += docdata.code + "未找到人员" + "\n";
            continue;
          }
        }
        if (du2 == "1498885071814787365") {
          //部门
          du2Code = "0001"; //
          var base_pathbm2_df = "select code from bd.adminOrg.AdminOrgVO where id='" + bumenid + "' ";
          var apiResponsebm2_df = ObjectStore.queryByYonQL(base_pathbm2_df, "ucf-org-center");
          if (apiResponsebm2_df.length > 0) {
            dalueCode2 = apiResponsebm2_df[0].code;
          } else {
            pzerror += docdata.code + "未找到部门" + "\n";
            continue;
          }
        }
        if (du2 == "1498885071814787363") {
          //客户
          du2Code = "0005";
          if (kehuid == undefined) {
            pzerror += docdata.code + "未找到客户" + "\n";
            continue;
          }
          var sqlkhsql = " select code from aa.merchant.Merchant where id='" + kehuid + "' ";
          var reskhsql = ObjectStore.queryByYonQL(sqlkhsql, "productcenter");
          if (reskhsql.length > 0) {
            dalueCode2 = reskhsql[0].code;
          } else {
            pzerror += docdata.code + "未找到客户" + "\n";
            continue;
          }
        }
        if (du2 == "1533852152936005635") {
          //银行企业账户
          du2Code = "0008";
          if (yinhangid == undefined) {
            pzerror += docdata.code + "未找到银行企业账户" + "\n";
            continue;
          }
          var sqlyhsql = "select code from bd.basedocdef.CustomerDocVO where id='" + yinhangid + "' ";
          var resyhsql = ObjectStore.queryByYonQL(sqlyhsql, "ucfbasedoc");
          if (resyhsql.length > 0) {
            dalueCode2 = resyhsql[0].code;
          } else {
            pzerror += docdata.code + "未找到银行企业账户" + "\n";
            continue;
          }
        }
        if (du2 == "1498885071814787364") {
          //供应商
          du2Code = "0004";
          if (gongyingid == undefined) {
            pzerror += docdata.code + "未找到供应商" + "\n";
            continue;
          }
          var sqlgys = "select code from aa.vendor.Vendor where id='" + gongyingid + "' ";
          var ressqlgys = ObjectStore.queryByYonQL(sqlgys, "yssupplier");
          if (ressqlgys.length > 0) {
            dalueCode2 = ressqlgys[0].code;
          } else {
            pzerror += docdata.code + "未找到供应商" + "\n";
            continue;
          }
        }
        //借方辅助核算
        var jiefangstr = undefined;
        if (valueCode1 != undefined && valueCode2 == undefined) {
          jiefangstr = ',"clientAuxiliaryList":[{"filedCode":"' + fu1Code + '","valueCode":"' + valueCode1 + '"}]';
        }
        if (valueCode1 == undefined && valueCode2 != undefined) {
          jiefangstr = ',"clientAuxiliaryList":[{"filedCode":"' + fu2Code + '","valueCode":"' + valueCode2 + '"}]';
        }
        if (valueCode1 != undefined && valueCode2 != undefined) {
          jiefangstr = ',"clientAuxiliaryList":[{"filedCode":"' + fu1Code + '","valueCode":"' + valueCode1 + '"},{"filedCode":"' + fu2Code + '","valueCode":"' + valueCode2 + '"}]';
        }
        if (jiefangstr == undefined) {
          jiefangstr = "";
        }
        //贷方辅助核算
        var daifangstr = undefined;
        if (dalueCode1 != undefined && dalueCode2 == undefined) {
          daifangstr = ',"clientAuxiliaryList":[{"filedCode":"' + du1Code + '","valueCode":"' + dalueCode1 + '"}]';
        }
        if (dalueCode1 == undefined && dalueCode2 != undefined) {
          daifangstr = ',"clientAuxiliaryList":[{"filedCode":"' + du2Code + '","valueCode":"' + dalueCode2 + '"}]';
        }
        if (dalueCode1 != undefined && dalueCode2 != undefined) {
          daifangstr = ',"clientAuxiliaryList":[{"filedCode":"' + du1Code + '","valueCode":"' + dalueCode1 + '"},{"filedCode":"' + du2Code + '","valueCode":"' + dalueCode2 + '"}]';
        }
        if (daifangstr == undefined) {
          daifangstr = "";
        }
        let base_path = "https://www.example.com/";
        if (jkm == undefined) {
          pzerror += docdata.code + "未匹配到借方科目" + "\n";
          continue;
        }
        if (dkm == undefined) {
          pzerror += docdata.code + "未匹配到借方科目" + "\n";
          continue;
        }
        var pzrq = '"' + pzdate + '"';
        zy = '"' + zy + '"';
        jkm = '"' + jkm + '"';
        dkm = '"' + dkm + '"';
        var bodystr =
          '{"srcSystemCode":"figl","accbookCode":"01","voucherTypeCode":"1","makeTime":' +
          pzrq +
          ',"makerMobile":"18622919012","bodies":[{"description":' +
          zy +
          ',"accsubjectCode":' +
          jkm +
          ',"debitOriginal":' +
          je +
          ',"debitOrg":' +
          je +
          ',"rateType":"01" ' +
          jiefangstr +
          '},{"description":' +
          zy +
          ',"accsubjectCode":' +
          dkm +
          ',"creditOriginal":' +
          je +
          ',"creditOrg":' +
          je +
          ',"rateType":"01"' +
          daifangstr +
          "}]}";
        var body = JSON.parse(bodystr);
        var apiResponse = openLinker("post", base_path, yycode, JSON.stringify(body));
        var pzresult = JSON.parse(apiResponse);
        if (pzresult.code != "200") {
          pzerror += docdata.code + JSON.stringify(pzresult.message) + "\n";
          continue;
        }
        var pzdoc = pzresult.data.period + "-" + pzresult.data.voucherType.voucherstr + pzresult.data.billCode;
        var createdzid = {
          danjuleibie: "1",
          pingzhengid: pzresult.data.voucherId,
          danjuid: docdata.id,
          danjuhao: docdata.code,
          pingzhenghao: pzdoc
        };
        iddzb.push(createdzid);
        var objectjg = {
          id: did,
          new34: pzdoc,
          shifuyishengchengpingzheng: "1"
        };
        plxgpz.push(objectjg);
      } catch (e) {
        pzerror += docdata.code + e.message;
      }
    }
    if (iddzb.length > 0) {
      ObjectStore.insertBatch("AT17F6F25609F80006.AT17F6F25609F80006.IDDZ", iddzb, "yb445c0b53");
    }
    if (plxgpz.length > 0) {
      ObjectStore.updateById("GT6903AT9.GT6903AT9.SFKD001", plxgpz, "b9049bfeList");
    }
    return {
      err: pzerror
    };
    function getnum(num) {
      var result = num.substring(0, s.indexOf(".") + 3);
      return result;
    }
    function string2Json(s) {
      var newstr = "";
      for (var i = 0; i < s.length; i++) {
        var c;
        c = s.charAt(i);
        switch (c) {
          case '"':
            newstr += '\\"';
            break;
          case "\\":
            newstr += "\\\\";
            break;
          case "/":
            newstr += "\\/";
            break;
          case "\b":
            newstr += "\\b";
            break;
          case "\f":
            newstr += "\\f";
            break;
          case "\n":
            newstr += "\\n";
            break;
          case "\r":
            newstr += "\\r";
            break;
          case "\t":
            newstr += "\\t";
            break;
          default:
            newstr += c;
        }
      }
      return newstr;
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});