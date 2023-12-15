//订单日报新凭证
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取前端传参
    let httpURL = "https://c2.yonyoucloud.com"; //定义域名变量
    let sql = "";
    //查看前端传参
    let orderid = request.id;
    //根据前端传参查询销售订单id与销售订单编号
    for (let i = 0; i < orderid.length; i++) {
      sql = "select code,soId from AT17C47D1409580006.AT17C47D1409580006.AdjustMtaxOrder ";
      sql += " where id = '" + orderid[i] + "'"; //根据前端传参查询销售订单id
      let resSO = ObjectStore.queryByYonQL(sql);
      sql = "select max(voucherId.displayName) as VCcode,max(voucherId.periodUnion) as VPeriod  from egl.voucher.VoucherBodyBO where description like '" + resSO[0].code + "-订单收入确认" + "'";
      let resQSV = ObjectStore.queryByYonQL(sql, "yonbip-fi-egl");
      if (resQSV.length > 0) {
        //查询销售订单数据，
        sql =
          "select orderId.vouchdate as vouchDate, orderId.id as OrderId,orderId.salesOrgId as OsalesOrgId,orderId.code as OrderCode,orderId.agentId.code as CustomerCode,orderId.headFreeItem.define16 as ReceiveAmt,orderId.transactionTypeId as TransTypeId,oriSum,orderDetailPrices.oriTax as TaxAmt,(orderId.orderPrices.payMoneyDomestic-orderId.orderPrices.totalOriTax) as SumSubTaxAmt,bodyItem.define1 as CostCenterId,taxId from voucher.order.OrderDetail"; /////**********///////////
        sql += " where orderId = '" + resSO[0].soId + "'"; //////
        let res = ObjectStore.queryByYonQL(sql, "udinghuo");
        //过滤出主表信息，并去重
        let orderItemsTmp = res.map((x) => {
          return {
            OrderId: x.OrderId, //销售订单ID
            OrderCode: x.OrderCode, //销售订单编码
            OsalesOrgId: x.OsalesOrgId, //销售订单编码
            CustomerCode: x.CustomerCode, //销售订单客户编码
            ReceiveAmt: x.ReceiveAmt, //销售订单签收金额
            SumSubTaxAmt: x.SumSubTaxAmt, //销售订单无税金额
            TransTypeId: x.TransTypeId, //交易类型ID
            vouchDate: x.vouchDate //单据日期
          };
        });
        let orderItems = [];
        orderItemsTmp.forEach((x) => {
          if (orderItems.filter((y) => y.OrderId == x.OrderId).length == 0) orderItems.push(x);
        });
        let sqlm = "select DISTINCT orderId,sum(orderDetailPrices.oriTax) as TaxAmtD,taxId.code as TaxCode from voucher.order.OrderDetail";
        sqlm += " where orderId = '" + resSO[0].soId + "'";
        sqlm += " group by orderId"; //排序
        let resm = ObjectStore.queryByYonQL(sqlm, "udinghuo");
        //过滤出主表信息，并去重
        let orderItemsTmpD = resm.map((x) => {
          return {
            orderId: x.orderId //销售订单ID
          };
        });
        let orderItemsD = [];
        orderItemsTmpD.forEach((x) => {
          if (orderItemsD.filter((y) => y.orderId == x.orderId).length == 0) orderItemsD.push(x);
        });
        let bodyabc = {
          conditions: [
            {
              field: "accentity",
              value: orderItems[0].OsalesOrgId,
              operator: "="
            }
          ]
        };
        let urlabc = httpURL + "/iuap-api-gateway/yonbip/fi/fipub/basedoc/querybd/accbook";
        let apiResponseabc = openLinker("POST", urlabc, "AT17C47D1409580006", JSON.stringify(bodyabc));
        let apiResAbcJson = JSON.parse(apiResponseabc);
        let accbookCode = "";
        if (apiResAbcJson.code == 200 && apiResAbcJson.data.length > 0) {
          accbookCode = apiResAbcJson.data[0].code;
        }
        //报文基础结构
        let body = {
          srcSystemCode: "figl",
          accbookCode: accbookCode,
          voucherTypeCode: "1",
          makerEmail: "15210202917",
          makeTime: orderItems[0].vouchDate,
          bodies: []
        };
        //取第一条数据的成本中心ID
        let arrCostCenterId = res.filter((x) => x.OrderId == orderItems[0].OrderId);
        //根据成本中心ID查询成本中心code
        sql = "select code from bd.adminOrg.AdminOrgVO where id='" + arrCostCenterId[0].CostCenterId + "'";
        let resFirstCC = ObjectStore.queryByYonQL(sql, "orgcenter");
        let bodyDebtor = {
          description: orderItems[0].OrderCode + "-冲销-" + "会计期间" + resQSV[0].VPeriod + resQSV[0].VCcode + "凭证",
          accsubjectCode: "1122120000", //借方
          debitOriginal: orderItems[0].ReceiveAmt, //销售订单的 签收金额
          debitOrg: orderItems[0].ReceiveAmt, //销售订单的 签收金额
          clientAuxiliaryList: [
            {
              filedCode: "0001", //固定值,成本中心
              valueCode: resFirstCC[0].code //成本中心编码
            },
            {
              filedCode: "0005", //固定值,客户
              valueCode: orderItems[0].CustomerCode //销售订单客户编码
            },
            {
              filedCode: "0016", //固定值，记账码
              valueCode: "01" //固定值，01
            },
            {
              filedCode: "0017", //固定值，账户类型
              valueCode: "D" //固定值，D
            },
            {
              filedCode: "0018", //固定值，凭证类型
              valueCode: "RE" //固定值，RE
            },
            {
              filedCode: "0015", //固定值，反记账
              valueCode: "X" //固定值，X
            },
            {
              filedCode: "0019", //固定值，冲销标识
              valueCode: "X" //固定值，X
            }
          ]
        };
        //添加借方结构元素
        body.bodies.push(bodyDebtor);
        let detailItems = res.filter((x) => x.OrderId == orderItems[0].OrderId);
        let detailItemsD = resm.filter((x) => x.orderId == orderItemsD[i].orderId);
        let accSubjectCode = ""; //成本中心科目编码
        if (orderItems[0].TransTypeId != undefined) {
          switch (orderItems[0].TransTypeId) {
            case "1709520541922099208":
              accSubjectCode = "6001170861";
              break;
            case "1466106585671008426":
              accSubjectCode = "6001170872";
              break;
          }
        }
        //根据成本中心ID查询成本中心code
        sql = "select code from bd.adminOrg.AdminOrgVO where id='" + detailItems[0].CostCenterId + "'";
        let resCC = ObjectStore.queryByYonQL(sql, "orgcenter");
        let bodyCostCenter = {
          description: orderItems[0].OrderCode + "-冲销-" + "会计期间" + resQSV[0].VPeriod + resQSV[0].VCcode + "凭证",
          accsubjectCode: accSubjectCode, //贷方
          creditOriginal: orderItems[0].SumSubTaxAmt, //销售订单明细中 含税金额-税额
          creditOrg: orderItems[0].SumSubTaxAmt, //销售订单明细中 含税金额-税额
          clientAuxiliaryList: [
            {
              filedCode: "0001", //固定值,成本中心
              valueCode: resCC[0].code //成本中心编码
            },
            {
              filedCode: "0005", //固定值,客户
              valueCode: orderItems[0].CustomerCode //销售订单客户编码
            },
            {
              filedCode: "0016", //固定值，记账码
              valueCode: "50" //固定值，50
            },
            {
              filedCode: "0017", //固定值，账户类型
              valueCode: "S" //固定值，s
            },
            {
              filedCode: "0018", //固定值，凭证类型
              valueCode: "RE" //固定值，RE
            },
            {
              filedCode: "0015", //固定值，反记账
              valueCode: "X" //固定值，X
            },
            {
              filedCode: "0019", //固定值，冲销标识
              valueCode: "X" //固定值，X
            }
          ]
        };
        //添加贷方成本中心结构元素
        body.bodies.push(bodyCostCenter);
        for (let j = 0; j < detailItemsD.length; j++) {
          let bodyTax = {
            description: orderItems[0].OrderCode + "-冲销-" + "会计期间" + resQSV[0].VPeriod + resQSV[0].VCcode + "凭证",
            accsubjectCode: "2241070801 ", //贷方,固定
            creditOriginal: detailItemsD[j].TaxAmtD, //销售订单明细中 税额
            creditOrg: detailItemsD[j].TaxAmtD, //销售订单明细中 税额
            clientAuxiliaryList: [
              {
                filedCode: "0005", //固定值,客户
                valueCode: orderItems[0].CustomerCode //销售订单客户编码
              },
              {
                filedCode: "0016", //固定值，记账码
                valueCode: "50" //固定值，01
              },
              {
                filedCode: "0017", //固定值，账户类型
                valueCode: "S" //固定值，D
              },
              {
                filedCode: "0018", //固定值，凭证类型
                valueCode: "RE" //固定值，RE
              },
              {
                filedCode: "0013", //固定值，税码
                valueCode: detailItemsD[j].TaxCode // 根据税率查询税码
              },
              {
                filedCode: "0015", //固定值，反记账
                valueCode: "X" //固定值，X
              },
              {
                filedCode: "0019", //固定值，冲销标识
                valueCode: "X" //固定值，X
              }
            ]
          };
          //添加贷方税额结构元素
          body.bodies.push(bodyTax);
        }
        let url = httpURL + "/iuap-api-gateway/yonbip/fi/ficloud/openapi/voucher/addVoucher";
        let apiResponse = openLinker("POST", url, "AT17C47D1409580006", JSON.stringify(body));
        let apiResJson = JSON.parse(apiResponse);
        if (apiResJson.code == 200) {
          let objectLS = { id: orderid[i], isHC: "1", _status: "update" };
          let resLS = ObjectStore.updateById("AT17C47D1409580006.AT17C47D1409580006.AdjustMtaxOrder", objectLS, "yb261f4161List");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });