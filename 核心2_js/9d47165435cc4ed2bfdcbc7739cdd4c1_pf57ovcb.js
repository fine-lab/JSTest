//订单日报新凭证
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取前端传参
    let orderOid = request.id;
    let orderid = orderOid.map((x) => "'" + x + "'").join(",");
    //域名变量
    let httpURL = "https://c2.yonyoucloud.com";
    //根据前端传参查询销售订单数据
    let sqlSO =
      "select  max(AdjustMtaxOrder_id.id) as OrderId,max(AdjustMtaxOrder_id.vouchdate) as vouchDate,max(AdjustMtaxOrder_id.code) as OrderCode,max(AdjustMtaxOrder_id.agentId.code) as CustomerCode,max(AdjustMtaxOrder_id.salesOrgId) as OsalesOrgId,max(AdjustMtaxOrder_id.transactionTypeId) as TransTypeId,AdjustMtaxOrder_id.oriSum as SoriSum,max(AdjustMtaxOrder_id.saleDepartmentId) as CostCenterId,productId from AT17C47D1409580006.AT17C47D1409580006.AdjustMtaxOrderDetail";
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
        vouchDate: x.vouchDate //单据日期
      };
    });
    let orderItems = [];
    orderItemsTmp.forEach((x) => {
      if (orderItems.filter((y) => y.OrderId == x.OrderId).length == 0) orderItems.push(x);
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
        description: orderItems[i].OrderCode + orderItems[i].vouchDate + "-订单日报收入确认", //【销售订单单据编号】订单收入确认
        accsubjectCode: "1122120000", //借方
        debitOriginal: orderItems[i].SoriSum, //销售订单的 总金额
        debitOrg: orderItems[i].SoriSum, //销售订单的 总金额
        clientAuxiliaryList: [
          {
            filedCode: "0001", //固定值,成本中心
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
      let detailItems = resSO.filter((x) => x.OrderId == orderItems[i].OrderId);
      //通过物料id查询销项税率
      let oriTAX = 0; //税额变量
      let oriTAXS = 0; //税额总和
      for (let j = 0; j < detailItems.length; j++) {
        let sqlTax = "select detail.outTaxrate as taxID from pc.product.Product where id = '" + detailItems[0].productId + "'";
        let resTax = ObjectStore.queryByYonQL(sqlTax, "productcenter");
        //查询子表物料为前端传参物料的子表id数据
        let sqlNat = "select id,code,ntaxrate from archive.taxArchives.TaxRateArchive where id = '" + resTax[0].taxID + "'";
        let resNat = ObjectStore.queryByYonQL(sqlNat, "yonbip-fi-taxpubdoc");
        let TaxCode = resNat[0].code; //提取物料税码
        let nTaxrate = resNat[0].ntaxrate; //提取物料税率值
        //计算此物料对应的税额
        if (nTaxrate < 1) {
          oriTAX = (detailItems[0].SoriSum / (1 + nTaxrate)) * nTaxrate;
        } else {
          oriTAX = (detailItems[0].SoriSum / (1 + nTaxrate / 100)) * (nTaxrate / 100);
        }
        //将oriTAX转换为数值型
        oriTAX = parseFloat(oriTAX.toFixed(2));
        //添加贷方科目一：税金的科目相关 ，税额
        let bodyTax = {
          description: orderItems[i].OrderCode + orderItems[i].vouchDate + "-订单日报收入确认", //【销售订单单据编号】订单收入确认
          accsubjectCode: "2241070801 ", //贷方,固定
          creditOriginal: oriTAX, //销售订单明细中 税额
          creditOrg: oriTAX, //销售订单明细中 税额
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
              valueCode: TaxCode // 根据税率查询税码
            }
          ]
        };
        //添加贷方科目2税额结构元素
        body.bodies.push(bodyTax);
        //税额循环求和
        oriTAXS += oriTAX; //税额变量求和
      } //此处有问题，循环先去掉
      //添加凭证分录中贷方二6001170873科目，无税金额
      let bodyCostCenter = {
        description: orderItems[i].OrderCode + orderItems[i].vouchDate + "-订单日报收入确认", //【销售订单单据编号】订单收入确认
        accsubjectCode: 6001170873, //贷方
        creditOriginal: SumSubTaxAmt, //销售订单明细中 含税金额-税额
        creditOrg: SumSubTaxAmt, //销售订单明细中 含税金额-税额
        clientAuxiliaryList: [
          {
            filedCode: "0001", //固定值,成本中心
            valueCode: resFirstCC[0].code //成本中心编码
          },
          {
            filedCode: "0005", //固定值,客户
            valueCode: orderItems[i].CustomerCode //销售订单客户编码
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
      let url = httpURL + "/iuap-api-gateway/yonbip/fi/ficloud/openapi/voucher/addVoucher";
      let apiResponse = openLinker("POST", url, "AT17C47D1409580006", JSON.stringify(body));
      let apiResJson = JSON.parse(apiResponse);
      if (apiResJson.code == 200) {
        var objectNV = { id: orderItems[i].OrderId, isCreatNV: "1", _status: "Update" };
        var resNV = ObjectStore.updateById("AT17C47D1409580006.AT17C47D1409580006.AdjustMtaxOrder", objectNV, "yb9480b2c6List");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });