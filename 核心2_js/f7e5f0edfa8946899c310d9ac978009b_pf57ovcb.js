let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let funFmtDt = extrequire("AT17C47D1409580006.rule.dateFormatP");
    let fmtDtNow = funFmtDt.execute(new Date(), "年月日");
    let fmtDtNowV = funFmtDt.execute(new Date()); //yyyy-MM-dd
    let httpURL = "https://c2.yonyoucloud.com"; //域名升级，世贸生产域名变量
    //查询销售订单数据，税率taxRate，税目税率编码taxId.code, 使用taxId.code的值
    let sql =
      "select orderId.vouchdate as vouchDate, orderId.id as OrderId,orderId.salesOrgId as OsalesOrgId,orderId.code as OrderCode,orderId.agentId.code as CustomerCode,orderId.headFreeItem.define16 as ReceiveAmt,orderId.transactionTypeId as TransTypeId,oriSum,orderDetailPrices.oriTax as TaxAmt,(orderId.orderPrices.payMoneyDomestic-orderId.orderPrices.totalOriTax) as SumSubTaxAmt,bodyItem.define1 as CostCenterId,taxId from voucher.order.OrderDetail";
    sql += " where orderId.status = 1";
    sql += " and orderId.transactionTypeId in ('1509186885881692171','1461094109764124818')"; //只有这两种对内和对外的订单才生成凭证
    sql += " and orderId.headFreeItem.define14 = '已签收'"; //2-已签收
    sql += " and orderId.headFreeItem.define13 = '未生成'"; //1-未生成
    sql += " and orderId.payStatusCode='FINISHPAYMENT'"; //1-付款状态为【付款完成】
    sql += " and orderId.vouchdate='" + fmtDtNowV + "'"; //凭证日期
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
    for (let i = 0; i < orderItems.length; i++) {
      // 通过销售组织查询账簿编码
      let bodyabc = {
        conditions: [
          {
            field: "accentity",
            value: orderItems[i].OsalesOrgId,
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
        makerEmail: "16712135968",
        makeTime: orderItems[i].vouchDate,
        bodies: []
      };
      //取第一条数据的成本中心ID
      let arrCostCenterId = res.filter((x) => x.OrderId == orderItems[i].OrderId);
      //根据成本中心ID查询成本中心code
      sql = "select code from bd.adminOrg.AdminOrgVO where id='" + arrCostCenterId[0].CostCenterId + "'";
      let resFirstCC = ObjectStore.queryByYonQL(sql, "orgcenter");
      let bodyDebtor = {
        description: orderItems[i].OrderCode + "-订单收入确认", //【销售订单单据编号】订单收入确认
        accsubjectCode: "1122120000", //借方
        debitOriginal: orderItems[i].ReceiveAmt, //销售订单的 签收金额
        debitOrg: orderItems[i].ReceiveAmt, //销售订单明细的 签收金额
        clientAuxiliaryList: [
          {
            filedCode: "0020", //固定值,成本中心
            valueCode: resFirstCC[0].code //成本中心编码
          },
          {
            filedCode: "0005", //固定值,客户
            valueCode: orderItems[i].CustomerCode //销售订单客户编码
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
          }
        ]
      };
      //添加借方结构元素
      body.bodies.push(bodyDebtor);
      let detailItems = res.filter((x) => x.OrderId == orderItems[i].OrderId);
      let accSubjectCode = ""; //成本中心科目编码
      if (orderItems[i].TransTypeId != undefined) {
        switch (orderItems[i].TransTypeId) {
          case "1509186885881692171":
            accSubjectCode = "6001170861";
            break;
          case "1461094109764124818":
            accSubjectCode = "6001170872";
            break;
        }
      }
      //根据成本中心ID查询成本中心code
      sql = "select code from bd.adminOrg.AdminOrgVO where id='" + detailItems[0].CostCenterId + "'";
      let resCC = ObjectStore.queryByYonQL(sql, "orgcenter");
      let bodyCostCenter = {
        description: orderItems[i].OrderCode + "-订单收入确认", //【销售订单单据编号】订单收入确认
        accsubjectCode: accSubjectCode, //贷方
        creditOriginal: orderItems[i].SumSubTaxAmt, //销售订单明细中 含税金额-税额
        creditOrg: orderItems[i].SumSubTaxAmt, //销售订单明细中 含税金额-税额
        clientAuxiliaryList: [
          {
            filedCode: "0020", //固定值,成本中心
            valueCode: resCC[0].code //成本中心编码
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
          }
        ]
      };
      //添加贷方成本中心结构元素
      body.bodies.push(bodyCostCenter);
      let sqlm = "select max(orderId),sum(orderDetailPrices.oriTax) as TaxAmtD,taxId.code as TaxCode from voucher.order.OrderDetail";
      sqlm += " where orderId =  '" + orderItems[i].OrderId + "'"; //////根据主表id查询子表数据
      sqlm += " group by taxId"; //分组
      let resm = ObjectStore.queryByYonQL(sqlm, "udinghuo");
      for (let j = 0; j < resm.length; j++) {
        let bodyTax = {
          description: orderItems[i].OrderCode + "-订单收入确认", //【销售订单单据编号】订单收入确认
          accsubjectCode: "2241070801", //贷方,固定
          creditOriginal: resm[j].TaxAmtD, //销售订单明细中 税额
          creditOrg: resm[j].TaxAmtD, //销售订单明细中 税额
          clientAuxiliaryList: [
            {
              filedCode: "0016", //固定值，记账码
              valueCode: "50" //固定值，50
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
              valueCode: resm[j].TaxCode // 根据税率查询税码
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
        //更新销售订单是否生成签收凭证字段，1-未生成，2-已生成
        url = httpURL + "/iuap-api-gateway/yonbip/sd/api/updateDefinesInfo";
        body = {
          billnum: "voucher_order",
          datas: [
            {
              id: orderItems[i].OrderId,
              code: orderItems[i].OrderCode,
              definesInfo: [
                {
                  isHead: true,
                  isFree: true,
                  define13: "已生成"
                }
              ]
            }
          ]
        };
        apiResponse = openLinker("POST", url, "AT17C47D1409580006", JSON.stringify(body));
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });