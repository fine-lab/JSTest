let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取前端传参
    let orderOid = request.id;
    let orderid = orderOid.map((x) => "'" + x + "'").join(",");
    let httpURL = "https://c2.yonyoucloud.com"; //域名升级，世贸生产域名变量
    //根据前端传参查询销售订单数据
    let sqlSO =
      "select  max(AdjustMtaxOrder_id.id) as OrderId,max(AdjustMtaxOrder_id.vouchdate) as vouchDate,max(AdjustMtaxOrder_id.code) as OrderCode,max(AdjustMtaxOrder_id.agentId.code) as CustomerCode,max(AdjustMtaxOrder_id.salesOrgId) as OsalesOrgId,max(AdjustMtaxOrder_id.transactionTypeID) as TransTypeId,sum(oriSum) as SoriSum,sum(oriSum-oriTax) as SumSubTaxAmt,max(cbzx) as CostCenterId from AT17C47D1409580006.AT17C47D1409580006.AdjustMtaxOrderDetail";
    sqlSO += " where AdjustMtaxOrder_id in (" + orderid + ")"; //根据外键查询新建主实体销售订单数据
    sqlSO += " and AdjustMtaxOrder_id.isHC = '1' and AdjustMtaxOrder_id.isCreatNV= '0'"; //订单里 是否已红冲为是、是否已生成新凭证为否
    sqlSO += " group by AdjustMtaxOrder_id"; //分组
    sqlSO += " order by AdjustMtaxOrder_id";
    let resSO = ObjectStore.queryByYonQL(sqlSO); //
    //过滤出主表信息，并去重
    let orderItemsTmp = resSO.map((x) => {
      return {
        OrderId: x.OrderId, //销售订单ID
        OrderCode: x.OrderCode, //销售订单编码
        OsalesOrgId: x.OsalesOrgId, //销售组织编码
        CustomerCode: x.CustomerCode, //销售订单客户编码
        SoriSum: x.SoriSum, //销售订单总含税金额
        SumSubTaxAmt: x.SumSubTaxAmt, //销售订单总无税金额
        TransTypeId: x.TransTypeId, //交易类型ID
        vouchDate: x.vouchDate //单据日期
      };
    });
    let orderItems = [];
    orderItemsTmp.forEach((x) => {
      if (orderItems.filter((y) => y.OrderId == x.OrderId).length == 0) orderItems.push(x);
    });
    let sqlm = "select  max(AdjustMtaxOrder_id.id) as OrderId2,sum(oriTax) as TaxAmtD,taxId.code as TaxCode from AT17C47D1409580006.AT17C47D1409580006.AdjustMtaxOrderDetail";
    sqlm += " where AdjustMtaxOrder_id in (" + orderid + ")"; //根据外键查询新建主实体销售订单数据
    sqlm += " and AdjustMtaxOrder_id.isHC = '1' and AdjustMtaxOrder_id.isCreatNV= '0'"; //订单里 是否已红冲为是、是否已生成新凭证为否
    sqlm += " group by taxId,AdjustMtaxOrder_id"; //分组
    sqlm += " order by AdjustMtaxOrder_id";
    let resm = ObjectStore.queryByYonQL(sqlm);
    //过滤出主表信息，并去重
    let orderItemsTmpD = resm.map((x) => {
      return {
        OrderId2: x.OrderId2 //销售订单ID
      };
    });
    let orderItemsD = [];
    orderItemsTmpD.forEach((x) => {
      if (orderItemsD.filter((y) => y.OrderId2 == x.OrderId2).length == 0) orderItemsD.push(x);
    });
    for (let i = 0; i < orderItems.length; i++) {
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
        makerEmail: "16712135968", //生产环境需要修改为demo的手机号
        makeTime: orderItems[i].vouchDate,
        bodies: []
      };
      //取第一条数据的成本中心ID
      let arrCostCenterId = resSO.filter((x) => x.OrderId == orderItems[i].OrderId);
      //根据成本中心ID查询成本中心code
      let sql = "select code from bd.adminOrg.AdminOrgVO where id='" + arrCostCenterId[0].CostCenterId + "'";
      let resFirstCC = ObjectStore.queryByYonQL(sql, "orgcenter");
      let bodyDebtor = {
        description: orderItems[i].OrderCode + "-订单收入确认", //【销售订单单据编号】订单收入确认
        accsubjectCode: "1122120000", //借方
        debitOriginal: orderItems[i].SoriSum, //销售订单的 总金额
        debitOrg: orderItems[i].SoriSum, //销售订单的 总金额
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
      //根据主表id-OrderId2提取子表数据
      let detailItemsD = resm.filter((x) => x.OrderId2 == orderItemsD[i].OrderId2);
      //贷方科目一结构
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
      let bodyCostCenter = {
        description: orderItems[i].OrderCode + "-订单收入确认", //【销售订单单据编号】订单收入确认
        accsubjectCode: accSubjectCode, //贷方
        creditOriginal: orderItems[i].SumSubTaxAmt, //销售订单明细中 含税金额-税额
        creditOrg: orderItems[i].SumSubTaxAmt, //销售订单明细中 含税金额-税额
        clientAuxiliaryList: [
          {
            filedCode: "0020", //固定值,成本中心
            valueCode: resFirstCC[0].code //成本中心编码
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
      for (let j = 0; j < detailItemsD.length; j++) {
        let bodyTax = {
          description: orderItems[i].OrderCode + "-订单收入确认", //【销售订单单据编号】订单收入确认
          accsubjectCode: "2241070801 ", //贷方,固定
          creditOriginal: detailItemsD[j].TaxAmtD, //销售订单明细中 税额
          creditOrg: detailItemsD[j].TaxAmtD, //销售订单明细中 税额
          clientAuxiliaryList: [
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
            }
          ]
        };
        //添加贷方科目2税额结构元素
        body.bodies.push(bodyTax);
      }
      let url = httpURL + "/iuap-api-gateway/yonbip/fi/ficloud/openapi/voucher/addVoucher";
      let apiResponse = openLinker("POST", url, "AT17C47D1409580006", JSON.stringify(body));
      let apiResJson = JSON.parse(apiResponse);
      if (apiResJson.code == 200) {
        var objectNV = { id: orderItems[i].OrderId, isCreatNV: "1", _status: "Update" };
        var resNV = ObjectStore.updateById("AT17C47D1409580006.AT17C47D1409580006.AdjustMtaxOrder", objectNV, "yb9480b2c6");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });