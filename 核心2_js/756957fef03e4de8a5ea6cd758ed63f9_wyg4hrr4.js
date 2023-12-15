let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ids = request.iddata;
    var pzerror = "";
    for (var ina = 0; ina < ids.length; ina++) {
      try {
        var did = ids[ina];
        var bduri = "GT1745AT3.GT1745AT3.YSYF01";
        var bdbm = "86b9274fList";
        var yycode = "GT1745AT3";
        //查询单据内容Json
        var docQuerydata = {
          id: did
        };
        //单据类型
        var Documenttype = 0;
        //查询单据信息
        var docdata = ObjectStore.selectById(bduri, docQuerydata);
        if (docdata.shifushengchengpingzheng != 1) {
          throw new Error("不生成凭证");
        }
        if (docdata.verifystate != 2) {
          throw new Error("请先核准单据");
        }
        if (docdata.shifushengchengpingzheng1 == 1) {
          throw new Error("已生成凭证");
        }
        if (docdata.jiaoyileixing == "1547049608180400137") {
          Documenttype = 3; //应收
        }
        if (docdata.jiaoyileixing == "1547049668298407943") {
          Documenttype = 4; //应付
        }
        var sfklx = "";
        if (Documenttype == 3) {
          sfklx = "应收";
        } else {
          sfklx = "应付";
        }
        var jzqjtem = docdata.jiaoyiriqi.substring(0, 7);
        var sqlaaaaa =
          "select distinct id,billCode,periodUnion from egl.voucher.VoucherBO where id in ( select voucherId from egl.voucher.VoucherBodyBO where ( description ='" +
          docdata.zhaiyao +
          "-" +
          sfklx +
          "-" +
          docdata.code +
          "' )  and ( businessDate='" +
          docdata.jiaoyiriqi +
          "' )  ) ";
        var res11122 = ObjectStore.queryByYonQL(sqlaaaaa, "yonbip-fi-egl");
        if (res11122.length > 0) {
          var pzdoctemp = res11122[0].periodUnion + "-" + "记" + res11122[0].billCode;
          var objectjgtemp = {
            id: did,
            new35: pzdoctemp,
            shifushengchengpingzheng1: "1"
          };
          var respzulttemp = ObjectStore.updateById(bduri, objectjgtemp, bdbm);
          continue;
        }
        var headdata = ObjectStore.queryByYonQL("select id from GT13490AT20.GT13490AT20.KJ001 where  danjuleixing='" + Documenttype + "'");
        var ywdl = ""; //业务大类
        if (docdata.zDYR01 != undefined) {
          ywdl = "  and yewudalei='" + docdata.zDYR01 + "'  ";
        }
        var fyxm = ""; //费用项目
        if (docdata.feiyongxiangmu != undefined) {
          fyxm = "  and feiyongxiangmu='" + docdata.feiyongxiangmu + "' ";
        }
        var zy = docdata.zhaiyao; //摘要
        if (Documenttype == 3) {
          zy = zy + "-应收-" + docdata.code;
        }
        if (Documenttype == 4) {
          zy = zy + "-应付-" + docdata.code;
        }
        var je = docdata.jine; //金额
        var feiyongid = docdata.feiyongxiangmu; //费用项目
        var renyuanid = docdata.renyuan; //人员
        var bumenid = docdata.bumen; //部门
        var kehuid = docdata.merchant; //客户
        var yinhangid = docdata.qiyeyinxingzhanghu; //银行企业账户
        var gongyingid = docdata.gongyingshang; //供应商
        var pzdate = docdata.jiaoyiriqi; //交易日期
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
            throw new Error("未找对匹配科目对照模板");
          } else {
            for (var i = linedata.length - 1; i >= 0; i--) {
              if (linedata[i].feiyongxiangmu == docdata.feiyongxiangmu) {
                jkm = linedata[i].huijikemu;
                fu1 = linedata[i].fuzhuhesuan;
                fu2 = linedata[i].fuzhuhesuanxiang;
              }
            }
            linedata = ObjectStore.queryByYonQL("select * from GT13490AT20.GT13490AT20.KJ002 where KJ001_id='" + headdata[0].id + "' and jiedaifang='1' " + fyxm + ywdl);
            if (linedata.length > 0) {
              for (var i = linedata.length - 1; i >= 0; i--) {
                if (linedata[i].feiyongxiangmu == docdata.feiyongxiangmu && linedata[i].yewudalei == docdata.zDYR01) {
                  jkm = linedata[i].huijikemu;
                  fu1 = linedata[i].fuzhuhesuan;
                  fu2 = linedata[i].fuzhuhesuanxiang;
                }
              }
            }
          }
        } else {
          throw new Error("未找对匹配会计科目对照");
        }
        if (fu1 == "1533852668327886852") {
          //费用项目 //bd.expenseitem.ExpenseItem
          fu1Code = "0009";
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
            throw new Error("未找对匹配科目对照模板");
          } else {
            for (var i = linedata.length - 1; i >= 0; i--) {
              if (linedata[i].feiyongxiangmu == docdata.feiyongxiangmu) {
                dkm = linedata[i].huijikemu;
                du1 = linedata[i].fuzhuhesuan;
                du2 = linedata[i].fuzhuhesuanxiang;
              }
            }
            linedata = ObjectStore.queryByYonQL("select * from GT13490AT20.GT13490AT20.KJ002 where KJ001_id='" + headdata[0].id + "' and jiedaifang='2' " + fyxm + ywdl);
            if (linedata.length > 0) {
              for (var i = linedata.length - 1; i >= 0; i--) {
                if (linedata[i].feiyongxiangmu == docdata.feiyongxiangmu && linedata[i].yewudalei == docdata.zDYR01) {
                  dkm = linedata[i].huijikemu;
                  du1 = linedata[i].fuzhuhesuan;
                  du2 = linedata[i].fuzhuhesuanxiang;
                }
              }
            }
          }
        } else {
          throw new Error("未找对匹配会计科目对照");
        }
        if (du1 == "1533852668327886852") {
          //费用项目 //bd.expenseitem.ExpenseItem
          du1Code = "0009";
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
          throw new Error("未匹配到借方科目");
        }
        if (dkm == undefined) {
          throw new Error("未匹配到借方科目");
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
          throw new Error(JSON.stringify(pzresult.message));
        }
        var pzdoc = pzresult.data.period + "-" + pzresult.data.voucherType.voucherstr + pzresult.data.billCode;
        var createdzid = {
          danjuleibie: "2",
          pingzhengid: pzresult.data.voucherId,
          danjuid: docdata.id,
          danjuhao: docdata.code
        };
        var crzidret = ObjectStore.insert("AT17F6F25609F80006.AT17F6F25609F80006.IDDZ", createdzid, "yb445c0b53");
        var objectjg = {
          id: did,
          new35: pzdoc,
          shifushengchengpingzheng1: "1"
        };
        var respzult = ObjectStore.updateById(bduri, objectjg, bdbm);
      } catch (e) {
        pzerror += docdata.code + e.message;
      }
    }
    return {
      err: pzerror
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});