let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //取数单据
    var qsdj = request.qsdj;
    //取数规则
    var qsgz = request.qsgz;
    //单据销售组织
    var danjuxiaoshouzuzhi = request.danjuxiaoshouzuzhi;
    var danjuxiaoshouzuzhi_name = "";
    //单据币种
    var danjubizhong = request.danjubizhong;
    //订单性质
    var customerType = request.customerType;
    //单据客户
    var merchant = request.merchant;
    //单据商品
    var product = request.product;
    //开始日期
    var kaishiriqi = request.kaishiriqi;
    //截止日期
    var jiezhiriqi = request.jiezhiriqi;
    //代理商
    var dailishang = request.dailishang;
    //取数类型id
    if (!qsdj || !qsgz) {
      throw new Error("取数单据或者取数规则不存在！");
    }
    var splitStr1 = split(qsdj, "-", 2);
    var split1 = JSON.parse(splitStr1);
    if (split1.length != 2) {
      throw new Error("取数单据备注有误！");
    }
    //单据领域
    var ly = split1[0];
    qsdj = split1[1];
    var qsgzzd = "";
    if (qsgz.indexOf("__") != -1) {
      var splitStr2 = split(qsgz, "__", 2);
      var split2 = JSON.parse(splitStr2);
      qsgzzd = split2[0];
    } else {
      qsgzzd = qsgz;
    }
    var sql1 = "select * from " + qsdj + " where 1=1";
    if (danjuxiaoshouzuzhi) {
      sql1 = sql1 + " and salesOrg = '" + danjuxiaoshouzuzhi + "'";
    }
    if (danjubizhong) {
      sql1 = sql1 + " and currency = '" + danjubizhong + "'";
    }
    if (merchant.length > 0 || dailishang) {
      let cust = "";
      if (merchant.length > 0) {
        for (var i = 0; i < merchant.length; i++) {
          if (i == 0) {
            cust = merchant[i].merchant;
          } else {
            cust = cust + "," + merchant[i].merchant;
          }
        }
      }
      if (dailishang) {
        let sql11 = "select group_concat(merchant) from AT17E434B016F80003.AT17E434B016F80003.flzcs where dailishang = '" + dailishang + "'";
        let res11 = ObjectStore.queryByYonQL(sql11);
        if (res11.length > 0) {
          if (cust == "") {
            cust = res11[0].merchant;
          } else {
            cust = cust + "," + res11[0].merchant;
          }
        }
      }
      if (cust != "") {
        sql1 = sql1 + " and cust in (" + cust + ")";
      }
    }
    if (kaishiriqi) {
      sql1 = sql1 + " and vouchdate >= '" + kaishiriqi + "'";
    }
    if (jiezhiriqi) {
      sql1 = sql1 + " and vouchdate <= '" + jiezhiriqi + "'";
    }
    var res1 = ObjectStore.queryByYonQL(sql1, ly);
    let objArr = [];
    if (res1.length > 0) {
      for (var i = 0; i < res1.length; i++) {
        let data1 = res1[i];
        var sql2 = "select * from " + qsdj + "s where mainid = '" + data1.id + "'";
        //判断销售组
        if (customerType.length > 0) {
          let isCon = true;
          if (data1.salesOutDefineCharacter && data1.salesOutDefineCharacter.XSDD002) {
            for (var ji = 0; ji < customerType.length; ji++) {
              if (customerType[ji].customerType == data1.salesOutDefineCharacter.XSDD002) {
                isCon = false;
              }
            }
          }
          if (isCon) {
            continue;
          }
        }
        if (product.length > 0) {
          let productId = "";
          if (product.length > 0) {
            for (var ii = 0; ii < product.length; ii++) {
              if (ii == 0) {
                productId = product[ii].product;
              } else {
                productId = productId + "," + product[ii].product;
              }
            }
          }
          if (productId != "") {
            sql2 = sql2 + " and product in (" + productId + ")";
          }
        }
        var res2 = ObjectStore.queryByYonQL(sql2, ly);
        if (res2.length > 0) {
          for (var j = 0; j < res2.length; j++) {
            let data2 = res2[j];
            //判断是否已经计算过
            let sql4 = "select group_concat(id) from AT17E434B016F80003.AT17E434B016F80003.fljsjg where verifystate = 2";
            let res4 = ObjectStore.queryByYonQL(sql4);
            if (res4.length > 0) {
              let sql41 = "select id from AT17E434B016F80003.AT17E434B016F80003.fljsjgs where danjuid = '" + data2.id + "' and fljsjg_id in (" + res4[0].id + ")";
              let res41 = ObjectStore.queryByYonQL(sql41);
              if (res41.length > 0) {
                continue;
              }
            }
            let dls = "";
            let dls_name = "";
            //返利标准
            let fanlibiaozhun = 0;
            let vouchdate = substring(data1.vouchdate, 0, 10);
            var sql3 =
              "select group_concat(id) from AT17E434B016F80003.AT17E434B016F80003.flzc where verifystate = 2 and xieyikaishiriqi <= '" +
              vouchdate +
              "' and xieyijieshuriqi >= '" +
              vouchdate +
              "' order by modifyTime desc";
            var res3 = ObjectStore.queryByYonQL(sql3);
            if (res3.length > 0) {
              let sql31 =
                "select dailishang,dailishangmingchen,fanlixishu,kehudanjia from AT17E434B016F80003.AT17E434B016F80003.flzcs where flzc_id in (" +
                res3[0].id +
                ") and product = '" +
                data2.product +
                "' and merchant = '" +
                data1.cust +
                "'";
              let res31 = ObjectStore.queryByYonQL(sql31);
              if (res31.length > 0) {
                dls = res31[res31.length - 1].dailishang;
                dls_name = res31[res31.length - 1].dailishangmingchen;
                fanlibiaozhun = res31[res31.length - 1].fanlixishu;
                if (res31[res31.length - 1].kehudanjia) {
                  if (res31[res31.length - 1].kehudanjia != data2.oriTaxUnitPrice) {
                    let XSCK001 = 0;
                    if (data2.salesOutsDefineCharacter && data2.salesOutsDefineCharacter.XSCK001) {
                      XSCK001 = data2.salesOutsDefineCharacter.XSCK001;
                    }
                    if (data2.oriTaxUnitPrice == 0 && XSCK001 > 0) {
                    } else {
                      continue;
                    }
                  }
                } else {
                  continue;
                }
              } else {
                continue;
              }
              let sql32 = "select group_concat(zDY005),group_concat(zDY003) from AT17E434B016F80003.AT17E434B016F80003.flzc where id in (" + res3[0].id + ")";
              let res32 = ObjectStore.queryByYonQL(sql32);
              if (res32.length > 0) {
                let XSDD001 = undefined;
                let XSDD003 = undefined;
                if (data1.salesOutDefineCharacter) {
                  if (data1.salesOutDefineCharacter.XSDD003) {
                    XSDD003 = data1.salesOutDefineCharacter.XSDD003;
                  }
                  if (data1.salesOutDefineCharacter.XSDD001) {
                    XSDD001 = data1.salesOutDefineCharacter.XSDD001;
                  }
                }
                if (XSDD001) {
                  if (res32[0].zDY003.indexOf(XSDD001) == -1) {
                    continue;
                  }
                } else {
                  continue;
                }
              } else {
                continue;
              }
            } else {
              continue;
            }
            let XSDD003 = "";
            let XSDD002 = "";
            let XSDD001 = "";
            let XSDD005 = 0;
            let XSCK001 = 0;
            let XSDD006 = 0;
            let diaozhenghoujine = 0;
            let product_name = "";
            let unit_name = "";
            let merchant_name = "";
            let XSDD003_name = "";
            let XSDD002_name = "";
            let XSDD001_name = "";
            let fahuoshuliang = 0;
            let modelDescription = "";
            if (data1.salesOutDefineCharacter) {
              if (data1.salesOutDefineCharacter.XSDD001) {
                XSDD001 = data1.salesOutDefineCharacter.XSDD001;
                var sqlXSDD001 = "select name from bd.basedocdef.CustomerDocVO where id = '" + XSDD001 + "' and custdocdefid = 'youridHere' and dr = 0";
                var resXSDD001 = ObjectStore.queryByYonQL(sqlXSDD001, "ucfbasedoc");
                if (resXSDD001.length > 0) {
                  XSDD001_name = resXSDD001[0].name;
                }
              }
              if (data1.salesOutDefineCharacter.XSDD003) {
                XSDD003 = data1.salesOutDefineCharacter.XSDD003;
                var sqlXSDD003 = "select name from bd.basedocdef.CustomerDocVO where id = '" + XSDD003 + "' and custdocdefid = 'youridHere' and dr = 0";
                var resXSDD003 = ObjectStore.queryByYonQL(sqlXSDD003, "ucfbasedoc");
                if (resXSDD003.length > 0) {
                  XSDD003_name = resXSDD003[0].name;
                }
              }
              if (data1.salesOutDefineCharacter.XSDD002) {
                XSDD002 = data1.salesOutDefineCharacter.XSDD002;
                var sqlXSDD002 = "select name from aa.customertype.CustomerType where id = '" + XSDD002 + "'";
                var resXSDD002 = ObjectStore.queryByYonQL(sqlXSDD002, "productcenter");
                if (resXSDD002.length > 0) {
                  XSDD002_name = resXSDD002[0].name;
                }
              }
            }
            if (data2.salesOutsDefineCharacter) {
              if (data2.salesOutsDefineCharacter.XSDD005) {
                XSDD005 = data2.salesOutsDefineCharacter.XSDD005;
              }
              if (data2.salesOutsDefineCharacter.XSDD006) {
                XSDD006 = data2.salesOutsDefineCharacter.XSDD006;
              }
              if (data2.salesOutsDefineCharacter.XSCK001) {
                XSCK001 = MoneyFormatReturnBd(data2.salesOutsDefineCharacter.XSCK001 * fanlibiaozhun, 2);
                diaozhenghoujine = MoneyFormatReturnBd(data2.salesOutsDefineCharacter.XSCK001 * fanlibiaozhun, 2);
              }
            }
            if (data2.qty) {
              fahuoshuliang = MoneyFormatReturnBd(data2.qty * fanlibiaozhun, 2);
            }
            if (data2.product) {
              let sqlPro = "select name,modelDescription from pc.product.Product where id = '" + data2.product + "'";
              let resPro = ObjectStore.queryByYonQL(sqlPro, "productcenter");
              if (resPro.length > 0) {
                product_name = resPro[0].name;
                modelDescription = resPro[0].modelDescription;
              }
            }
            if (data2.unit) {
              let sqlUnit = "select name from aa.product.ProductUnit where id = '" + data2.unit + "'";
              let resUnit = ObjectStore.queryByYonQL(sqlUnit, "productcenter");
              if (resUnit.length > 0) {
                unit_name = resUnit[0].name;
              }
            }
            if (data1.cust) {
              let sqlCust = "select name from aa.agent.Agent where id = '" + data1.cust + "'";
              let resCust = ObjectStore.queryByYonQL(sqlCust, "udinghuo");
              if (resCust.length > 0) {
                merchant_name = resCust[0].name;
              }
            }
            let sql12 = "select name from org.func.SalesOrg where id = '" + data1.salesOrg + "'";
            let res12 = ObjectStore.queryByYonQL(sql12, "ucf-org-center");
            if (res12.length > 0) {
              danjuxiaoshouzuzhi_name = res12[0].name;
            }
            objArr[objArr.length] = {
              hanghao: objArr.length + 1,
              salesOrg: data1.salesOrg,
              salesOrg_name: danjuxiaoshouzuzhi_name,
              zDY005: XSDD003,
              zDY005_name: XSDD003_name,
              zDY003: XSDD001,
              zDY003_name: XSDD001_name,
              customerType: XSDD002,
              customerType_name: XSDD002_name,
              dls_pss: dls,
              dls_name: dls_name,
              merchant: data1.cust,
              merchant_name: merchant_name,
              code: data1.code,
              product: data2.product,
              product_name: product_name,
              modelDescription: modelDescription,
              unit: data2.unit,
              unit_name: unit_name,
              fahuoriqi: data1.vouchdate,
              invProductType: data2.saleStyle,
              gongsidanjia: XSDD005,
              kehudanjia: data2.oriTaxUnitPrice,
              xiaoshoujingjia: XSDD006,
              fahuoshuliang: fahuoshuliang,
              zheqianjine: data2.oriSum,
              fahuojine: data2.oriSum,
              fanlibiaozhun: fanlibiaozhun,
              fanlijine: XSCK001,
              diaozhenghoujine: diaozhenghoujine,
              danjuid: data2.id
            };
          }
        }
      }
    } else {
      return { objArr: objArr };
    }
    return { objArr: objArr };
  }
}
exports({ entryPoint: MyAPIHandler });