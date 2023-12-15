let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    ObjectStore.deleteByMap("AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001", { 1: "1" }, "ZW_YB_LRB_001List");
    let sqje = { sqje: 0 };
    let bqje = { jfje: 0, dfje: 0 };
    let tax = 0.25;
    var zth1 = ObjectStore.queryByYonQL("select zth from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001");
    for (var e = 0; e < zth1.length; e++) {
      for (var r = e + 1; r < zth1.length; r++) {
        if (zth1[e]["zth"] == zth1[r]["zth"]) {
          zth1.splice(r, 1);
          r--;
        }
      }
    }
    for (var prod of zth1) {
      let zth = prod.zth;
      var rq = ObjectStore.queryByYonQL("select zth,max(rq) as max_rq ,min(rq) as min_rq from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" + zth + "'");
      zth = rq[0]["zth"];
      let max_rq = rq[0]["max_rq"];
      let min_rq = rq[0]["min_rq"];
      max_rq = new Date(max_rq);
      min_rq = new Date(min_rq);
      let year_min = min_rq.getFullYear();
      let year_max = max_rq.getFullYear();
      let month_min = min_rq.getMonth() + 1;
      let month_max = max_rq.getMonth() + 1;
      let res1 = year_min * 12 + month_min;
      let res2 = year_max * 12 + month_max;
      for (var y = year_min; y <= year_max; y++) {
        for (var j = res1; j <= res2; j++) {
          let nkjqj = y;
          let d = j % y;
          if (d == 12) {
            y = y + 1;
          }
          if (d >= 1 && d <= 9) {
            d = "0" + d;
          }
          let ykjqj = d;
          let nkjqj_qc = nkjqj;
          let ykjqj_qc = ykjqj - 1;
          if (ykjqj_qc == 0) {
            nkjqj_qc = nkjqj - 1;
            ykjqj_qc = 12;
          }
          if (ykjqj_qc >= 1 && ykjqj_qc <= 9) {
            ykjqj_qc = "0" + ykjqj_qc;
          }
          //营业收入
          var yysrsq = ObjectStore.queryByYonQL(
            "select yysrbqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (yysrsq.length == 0) {
            yysrsq.push(sqje);
          }
          let yysrsqje = yysrsq[0]["sqje"];
          yysrsqje = parseFloat(yysrsqje);
          var yysrbq = ObjectStore.queryByYonQL(
            "select sum(jfje),sum(dfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code in ('6001','6501')"
          );
          if (yysrbq.length == 0) {
            yysrbq.push(bqje);
          } else {
            if (yysrbq[0]["jfje"] == null) {
              yysrbq[0]["jfje"] = 0;
            } else if (yysrbq[0]["dfje"] == null) {
              yysrbq[0]["dfje"] = 0;
            }
          }
          let yysrbqje = yysrbq[0]["jfje"] - yysrbq[0]["dfje"] + yysrsqje;
          yysrbqje = parseFloat(yysrbqje);
          //营业成本
          var yycbsq = ObjectStore.queryByYonQL(
            "select yycbbqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (yycbsq.length == 0) {
            yycbsq.push(sqje);
          }
          let yycbsqje = yycbsq[0]["sqje"];
          yycbsqje = parseFloat(yycbsqje);
          var yycbbq = ObjectStore.queryByYonQL(
            "select sum(dfje),sum(jfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code in ('6401','6402')"
          );
          if (yycbbq.length == 0) {
            yycbbq.push(bqje);
          } else {
            if (yycbbq[0]["jfje"] == null) {
              yycbbq[0]["jfje"] = 0;
            } else if (yycbbq[0]["dfje"] == null) {
              yycbbq[0]["dfje"] = 0;
            }
          }
          let yycbbqje = yycbbq[0]["dfje"] - yycbbq[0]["jfje"] + yycbsqje;
          yycbbqje = parseFloat(yycbbqje);
          //税金及附加
          var sjjfjsq = ObjectStore.queryByYonQL(
            "select sjjfjbqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (sjjfjsq.length == 0) {
            sjjfjsq.push(sqje);
          }
          let sjjfjsqje = sjjfjsq[0]["sqje"];
          sjjfjsqje = parseFloat(sjjfjsqje);
          var sjjfjbq = ObjectStore.queryByYonQL(
            "select sum(dfje),sum(jfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code='6403'"
          );
          if (sjjfjbq.length == 0) {
            sjjfjbq.push(bqje);
          } else {
            if (sjjfjbq[0]["jfje"] == null) {
              sjjfjbq[0]["jfje"] = 0;
            } else if (sjjfjbq[0]["dfje"] == null) {
              sjjfjbq[0]["dfje"] = 0;
            }
          }
          let sjjfjbqje = sjjfjbq[0]["dfje"] - sjjfjbq[0]["jfje"] + sjjfjsqje;
          sjjfjbqje = parseFloat(sjjfjbqje);
          //销售费用
          var xsfysq = ObjectStore.queryByYonQL(
            "select xsfybqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (xsfysq.length == 0) {
            xsfysq.push(sqje);
          }
          let xsfysqje = xsfysq[0]["sqje"];
          xsfysqje = parseFloat(xsfysqje);
          var xsfybq = ObjectStore.queryByYonQL(
            "select sum(dfje),sum(jfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code in ('6601','6601-01','6601-02','6601-03')"
          );
          if (xsfybq.length == 0) {
            xsfybq.push(bqje);
          } else {
            if (xsfybq[0]["jfje"] == null) {
              xsfybq[0]["jfje"] = 0;
            } else if (xsfybq[0]["dfje"] == null) {
              xsfybq[0]["dfje"] = 0;
            }
          }
          let xsfybqje = xsfybq[0]["dfje"] - xsfybq[0]["jfje"] + xsfysqje;
          xsfybqje = parseFloat(xsfybqje);
          //管理费用
          var glfysq = ObjectStore.queryByYonQL(
            "select glfybqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (glfysq.length == 0) {
            glfysq.push(sqje);
          }
          let glfysqje = glfysq[0]["sqje"];
          glfysqje = parseFloat(glfysqje);
          var glfybq = ObjectStore.queryByYonQL(
            "select sum(dfje),sum(jfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code in ('6602','6602-01','6602-02','6602-03','6602-04','6602-05','6602-06','6602-07','6602-08','6602-09','6602-10')"
          );
          if (glfybq.length == 0) {
            glfybq.push(bqje);
          } else {
            if (glfybq[0]["jfje"] == null) {
              glfybq[0]["jfje"] = 0;
            } else if (glfybq[0]["dfje"] == null) {
              glfybq[0]["dfje"] = 0;
            }
          }
          let glfybqje = glfybq[0]["dfje"] - glfybq[0]["jfje"] + glfysqje;
          glfybqje = parseFloat(glfybqje);
          //研发费用
          var yffysq = ObjectStore.queryByYonQL(
            "select yffybqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (yffysq.length == 0) {
            yffysq.push(sqje);
          }
          let yffysqje = yffysq[0]["sqje"];
          yffysqje = parseFloat(yffysqje);
          var yffybq = ObjectStore.queryByYonQL(
            "select sum(dfje),sum(jfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code='5301'"
          );
          if (yffybq.length == 0) {
            yffybq.push(bqje);
          } else {
            if (yffybq[0]["jfje"] == null) {
              yffybq[0]["jfje"] = 0;
            } else if (yffybq[0]["dfje"] == null) {
              yffybq[0]["dfje"] = 0;
            }
          }
          let yffybqje = yffybq[0]["dfje"] - yffybq[0]["jfje"] + yffysqje;
          yffybqje = parseFloat(yffybqje);
          //利息费用
          var lxfysq = ObjectStore.queryByYonQL(
            "select lxfybqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (lxfysq.length == 0) {
            lxfysq.push(sqje);
          }
          let lxfysqje = lxfysq[0]["sqje"];
          lxfysqje = parseFloat(lxfysqje);
          var lxfybq = ObjectStore.queryByYonQL(
            "select sum(dfje),sum(jfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code in ('6411','6603')"
          );
          if (lxfybq.length == 0) {
            lxfybq.push(bqje);
          } else {
            if (lxfybq[0]["jfje"] == null) {
              lxfybq[0]["jfje"] = 0;
            } else if (lxfybq[0]["dfje"] == null) {
              lxfybq[0]["dfje"] = 0;
            }
          }
          let lxfybqje = lxfybq[0]["dfje"] - lxfybq[0]["jfje"] + lxfysqje;
          lxfybqje = parseFloat(lxfybqje);
          //利息收入
          var lxsrsq = ObjectStore.queryByYonQL(
            "select lxsrbqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (lxsrsq.length == 0) {
            lxsrsq.push(sqje);
          }
          let lxsrsqje = lxsrsq[0]["sqje"];
          lxsrsqje = parseFloat(lxsrsqje);
          var lxsrbq = ObjectStore.queryByYonQL(
            "select sum(jfje),sum(dfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code ='6011'"
          );
          if (lxsrbq.length == 0) {
            lxsrbq.push(bqje);
          } else {
            if (lxsrbq[0]["jfje"] == null) {
              lxsrbq[0]["jfje"] = 0;
            } else if (lxsrbq[0]["dfje"] == null) {
              lxsrbq[0]["dfje"] = 0;
            }
          }
          let lxsrbqje = lxsrbq[0]["jfje"] - lxsrbq[0]["dfje"] + lxsrsqje;
          lxsrbqje = parseFloat(lxsrbqje);
          //财务费用
          var cwfysq = ObjectStore.queryByYonQL(
            "select cwfybqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (cwfysq.length == 0) {
            cwfysq.push(sqje);
          }
          let cwfysqje = cwfysq[0]["sqje"];
          cwfysqje = parseFloat(cwfysqje);
          let cwfybqje = lxfybqje - lxsrbqje;
          cwfybqje = parseFloat(cwfybqje);
          //资产减值损失
          var zcjzsssq = ObjectStore.queryByYonQL(
            "select zcjzssbqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (zcjzsssq.length == 0) {
            zcjzsssq.push(sqje);
          }
          let zcjzsssqje = zcjzsssq[0]["sqje"];
          zcjzsssqje = parseFloat(zcjzsssqje);
          var zcjzssbq = ObjectStore.queryByYonQL(
            "select sum(dfje),sum(jfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code ='6701'"
          );
          if (zcjzssbq.length == 0) {
            zcjzssbq.push(bqje);
          } else {
            if (zcjzssbq[0]["jfje"] == null) {
              zcjzssbq[0]["jfje"] = 0;
            } else if (zcjzssbq[0]["dfje"] == null) {
              zcjzssbq[0]["dfje"] = 0;
            }
          }
          let zcjzssbqje = zcjzssbq[0]["dfje"] - zcjzssbq[0]["jfje"] + zcjzsssqje;
          zcjzssbqje = parseFloat(zcjzssbqje);
          //其他收益
          var qtsysq = ObjectStore.queryByYonQL(
            "select qtsybqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (qtsysq.length == 0) {
            qtsysq.push(sqje);
          }
          let qtsysqje = qtsysq[0]["sqje"];
          qtsysqje = parseFloat(qtsysqje);
          var qtsybq = ObjectStore.queryByYonQL(
            "select sum(jfje),sum(dfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code ='6117'"
          );
          if (qtsybq.length == 0) {
            qtsybq.push(bqje);
          } else {
            if (qtsybq[0]["jfje"] == null) {
              qtsybq[0]["jfje"] = 0;
            } else if (qtsybq[0]["dfje"] == null) {
              qtsybq[0]["dfje"] = 0;
            }
          }
          let qtsybqje = qtsybq[0]["jfje"] - qtsybq[0]["dfje"] + qtsysqje;
          qtsybqje = parseFloat(qtsybqje);
          //投资收益
          var tzsysq = ObjectStore.queryByYonQL(
            "select tzsybqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (tzsysq.length == 0) {
            tzsysq.push(sqje);
          }
          let tzsysqje = tzsysq[0]["sqje"];
          tzsysqje = parseFloat(tzsysqje);
          var tzsybq = ObjectStore.queryByYonQL(
            "select sum(dfje),sum(jfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code ='6111'"
          );
          if (tzsybq.length == 0) {
            tzsybq.push(bqje);
          } else {
            if (tzsybq[0]["jfje"] == null) {
              tzsybq[0]["jfje"] = 0;
            } else if (tzsybq[0]["dfje"] == null) {
              tzsybq[0]["dfje"] = 0;
            }
          }
          let tzsybqje = tzsybq[0]["dfje"] - tzsybq[0]["jfje"] + tzsysqje;
          tzsybqje = parseFloat(tzsybqje);
          //公允价值变动收益
          var gyjzbdsysq = ObjectStore.queryByYonQL(
            "select gyjzbdsybqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (gyjzbdsysq.length == 0) {
            gyjzbdsysq.push(sqje);
          }
          let gyjzbdsysqje = gyjzbdsysq[0]["sqje"];
          gyjzbdsysqje = parseFloat(gyjzbdsysqje);
          var gyjzbdsybq = ObjectStore.queryByYonQL(
            "select sum(dfje),sum(jfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code ='6101'"
          );
          if (gyjzbdsybq.length == 0) {
            gyjzbdsybq.push(bqje);
          } else {
            if (gyjzbdsybq[0]["jfje"] == null) {
              gyjzbdsybq[0]["jfje"] = 0;
            } else if (gyjzbdsybq[0]["dfje"] == null) {
              gyjzbdsybq[0]["dfje"] = 0;
            }
          }
          let gyjzbdsybqje = gyjzbdsybq[0]["dfje"] - gyjzbdsybq[0]["jfje"] + gyjzbdsysqje;
          gyjzbdsybqje = parseFloat(gyjzbdsybqje);
          //资产处置收益
          var zcczsysq = ObjectStore.queryByYonQL(
            "select zcczsybqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (zcczsysq.length == 0) {
            zcczsysq.push(sqje);
          }
          let zcczsysqje = zcczsysq[0]["sqje"];
          zcczsysqje = parseFloat(zcczsysqje);
          var zcczsybq = ObjectStore.queryByYonQL(
            "select sum(jfje),sum(dfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code ='6115'"
          );
          if (zcczsybq.length == 0) {
            zcczsybq.push(bqje);
          } else {
            if (zcczsybq[0]["jfje"] == null) {
              zcczsybq[0]["jfje"] = 0;
            } else if (zcczsybq[0]["dfje"] == null) {
              zcczsybq[0]["dfje"] = 0;
            }
          }
          let zcczsybqje = qtsybq[0]["jfje"] - zcczsybq[0]["dfje"] + zcczsysqje;
          zcczsybqje = parseFloat(zcczsybqje);
          //营业利润
          var yylrsq = ObjectStore.queryByYonQL(
            "select yylrbqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (yylrsq.length == 0) {
            yylrsq.push(sqje);
          }
          let yylrsqje = yylrsq[0]["sqje"];
          yylrsqje = parseFloat(yylrsqje);
          let yylrbqje = yycbbqje - sjjfjbqje - xsfybqje - glfybqje - yffybqje - cwfybqje - zcjzssbqje + tzsybqje + gyjzbdsybqje + zcczsybqje;
          yylrbqje = parseFloat(yylrbqje);
          //营业外收入
          var yywsrsq = ObjectStore.queryByYonQL(
            "select yywsrbqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (yywsrsq.length == 0) {
            yywsrsq.push(sqje);
          }
          let yywsrsqje = yywsrsq[0]["sqje"];
          yywsrsqje = parseFloat(yywsrsqje);
          var yywsrbq = ObjectStore.queryByYonQL(
            "select sum(jfje),sum(dfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code ='6301'"
          );
          if (yywsrbq.length == 0) {
            yywsrbq.push(bqje);
          } else {
            if (yywsrbq[0]["jfje"] == null) {
              yywsrbq[0]["jfje"] = 0;
            } else if (yywsrbq[0]["dfje"] == null) {
              yywsrbq[0]["dfje"] = 0;
            }
          }
          let yywsrbqje = yywsrbq[0]["jfje"] - yywsrbq[0]["dfje"] + yywsrsqje;
          //营业外支出
          var yywzcsq = ObjectStore.queryByYonQL(
            "select yywzcbqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (yywzcsq.length == 0) {
            yywzcsq.push(sqje);
          }
          let yywzcsqje = yywzcsq[0]["sqje"];
          yywzcsqje = parseFloat(yywzcsqje);
          var yywzcbq = ObjectStore.queryByYonQL(
            "select sum(dfje),sum(jfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code ='6711'"
          );
          if (yywzcbq.length == 0) {
            yywzcbq.push(bqje);
          } else {
            if (yywzcbq[0]["jfje"] == null) {
              yywzcbq[0]["jfje"] = 0;
            } else if (yywzcbq[0]["dfje"] == null) {
              yywzcbq[0]["dfje"] = 0;
            }
          }
          let yywzcbqje = yywzcbq[0]["dfje"] - yywzcbq[0]["jfje"] + yywzcsqje;
          yywzcbqje = parseFloat(yywzcbqje);
          //利润总额上期
          var lrzesq = ObjectStore.queryByYonQL(
            "select lrzebqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (lrzesq.length == 0) {
            lrzesq.push(sqje);
          }
          let lrzesqje = lrzesq[0]["sqje"];
          lrzesqje = parseFloat(lrzesqje);
          let lrzebqje = yylrbqje + yywsrbqje - yywzcbqje;
          lrzebqje = parseFloat(lrzebqje);
          //所得税费用
          var sdsfysq = ObjectStore.queryByYonQL(
            "select sdsfybqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (sdsfysq.length == 0) {
            sdsfysq.push(sqje);
          }
          let sdsfysqje = sdsfysq[0]["sqje"];
          sdsfysqje = parseFloat(sdsfysqje);
          let sdsfybqje = lrzebqje * tax;
          sdsfybqje = parseFloat(sdsfybqje);
          //净利润
          var jlrsq = ObjectStore.queryByYonQL(
            "select jlrbqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (jlrsq.length == 0) {
            jlrsq.push(sqje);
          }
          let jlrsqje = jlrsq[0]["sqje"];
          jlrsqje = parseFloat(jlrsqje);
          let jlrbqje = lrzebqje - sdsfybqje;
          jlrbqje = parseFloat(jlrbqje);
          //其他综合收益的税后净额
          var qtzhsydshjesq = ObjectStore.queryByYonQL(
            "select qtzhsydshjebqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (qtzhsydshjesq.length == 0) {
            qtzhsydshjesq.push(sqje);
          }
          let qtzhsydshjesqje = qtzhsydshjesq[0]["sqje"];
          qtzhsydshjesqje = parseFloat(qtzhsydshjesqje);
          var qtzhsydshjebq = ObjectStore.queryByYonQL(
            "select sum(dfje),sum(jfje) from AT1808958A17680009.AT1808958A17680009.ZW_PZ_VIEW_001 where zth='" +
              zth +
              "' and nkjqj='" +
              nkjqj +
              "' and ykjqj='" +
              ykjqj +
              "' and jzbj='是' and bz='[机]结转本年利润' and km_code ='4003'"
          );
          if (qtzhsydshjebq.length == 0) {
            qtzhsydshjebq.push(bqje);
          } else {
            if (qtzhsydshjebq[0]["jfje"] == null) {
              qtzhsydshjebq[0]["jfje"] = 0;
            } else if (qtzhsydshjebq[0]["dfje"] == null) {
              qtzhsydshjebq[0]["dfje"] = 0;
            }
          }
          let qtzhsydshjebqje = qtzhsydshjebq[0]["dfje"] - qtzhsydshjebq[0]["jfje"] + qtzhsydshjesqje;
          qtzhsydshjebqje = parseFloat(qtzhsydshjebqje);
          //综合收益总额
          var zhsyzesq = ObjectStore.queryByYonQL(
            "select zhsyzebqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (zhsyzesq.length == 0) {
            zhsyzesq.push(sqje);
          }
          let zhsyzesqje = zhsyzesq[0]["sqje"];
          zhsyzesqje = parseFloat(zhsyzesqje);
          let zhsyzebqje = jlrbqje + qtzhsydshjebqje;
          zhsyzebqje = parseFloat(zhsyzebqje);
          //每股收益
          var mgsysq = ObjectStore.queryByYonQL(
            "select mgsybqje as sqje from AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001 where zth='" + zth + "' and nkjqj='" + nkjqj_qc + "' and ykjqj='" + ykjqj_qc + "'"
          );
          if (mgsysq.length == 0) {
            mgsysq.push(sqje);
          }
          let mgsysqje = mgsysq[0]["sqje"];
          mgsysqje = parseFloat(mgsysqje);
          let mgsybqje = 0;
          mgsybqje = parseFloat(mgsybqje);
          let lrb_obj = {
            zth: zth,
            nkjqj: nkjqj,
            ykjqj: ykjqj,
            yysrsqje: yysrsqje,
            yysrbqje: yysrbqje,
            yycbsqje: yycbsqje,
            yycbbqje: yycbbqje,
            sjjfjsqje: sjjfjsqje,
            sjjfjbqje: sjjfjbqje,
            xsfysqje: xsfysqje,
            xsfybqje: xsfybqje,
            xsfysqje: xsfysqje,
            xsfybqje: xsfybqje,
            glfysqje: glfysqje,
            glfybqje: glfybqje,
            yffysqje: yffysqje,
            yffybqje: yffybqje,
            lxfysqje: lxfysqje,
            lxfybqje: lxfybqje,
            lxsrsqje: lxsrsqje,
            lxsrbqje: lxsrbqje,
            cwfysqje: cwfysqje,
            cwfybqje: cwfybqje,
            zcjzsssqje: zcjzsssqje,
            zcjzssbqje: zcjzssbqje,
            qtsysqje: qtsysqje,
            qtsybqje: qtsybqje,
            tzsysqje: tzsysqje,
            tzsybqje: tzsybqje,
            gyjzbdsysqje: gyjzbdsysqje,
            gyjzbdsybqje: gyjzbdsybqje,
            zcczsysqje: zcczsysqje,
            zcczsybqje: zcczsybqje,
            yylrsqje: yylrsqje,
            yylrbqje: yylrbqje,
            yywsrsqje: yywsrsqje,
            yywsrbqje: yywsrbqje,
            yywzcsqje: yywzcsqje,
            yywzcbqje: yywzcbqje,
            lrzesqje: lrzesqje,
            lrzebqje: lrzebqje,
            sdsfysqje: sdsfysqje,
            sdsfybqje: sdsfybqje,
            jlrsqje: jlrsqje,
            jlrbqje: jlrbqje,
            qtzhsydshjesqje: qtzhsydshjesqje,
            qtzhsydshjebqje: qtzhsydshjebqje,
            zhsyzesqje: zhsyzesqje.toFixed(2),
            zhsyzebqje: zhsyzebqje.toFixed(2),
            mgsysqje: mgsysqje,
            mgsybqje: mgsybqje
          };
          let lrb = [];
          lrb.push(lrb_obj);
          var res_obj = ObjectStore.insert("AT1808958A17680009.AT1808958A17680009.ZW_YB_LRB_001", lrb, "ZW_YB_LRB_001List");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });