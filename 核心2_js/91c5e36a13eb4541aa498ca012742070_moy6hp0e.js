let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: {
        ckCode: "", //销售出库单号
        fpCodeL: "" //销售发票单号
      }
    };
    let sql = "";
    let code = request.code;
    let body;
    let apiResponse;
    let result;
    try {
      let func = extrequire("AT15DCCE0808080001.backOpenApiFunction.getGateway");
      let getGatewayInfo = func.execute();
      let baseurl = getGatewayInfo.data.gatewayUrl;
      let url = "";
      sql = "select id,b.id,vouchdate from voucher.order.Order inner join voucher.order.OrderDetail b on b.orderId=id where code='" + code + "'";
      let dt = ObjectStore.queryByYonQL(sql, "udinghuo");
      if (dt.length > 0) {
        let vouchdate = dt[0].vouchdate;
        //销售订单审核
        url = baseurl + "/yonbip/sd/voucherorder/batchaudit";
        body = {
          data: [
            {
              id: dt[0].id
            }
          ]
        };
        apiResponse = openLinker("POST", url, "AT15DCCE0808080001", JSON.stringify(body));
        result = JSON.parse(apiResponse);
        if (result.code == 200 && result.data.sucessCount == 1) {
          //下推销售出库
          url = baseurl + "/yonbip/scm/salesout/mergeSourceData/save";
          body = {
            data: {
              mergeSourceData: true,
              vouchdate: vouchdate,
              bustype: "A30005",
              details: [],
              _status: "Insert"
            }
          };
          dt.map((v) => {
            //子表数据
            body.data.details.push({
              _status: "Insert",
              sourceid: v.id,
              sourceautoid: v.b_id,
              makeRuleCode: "orderTosalesout"
            });
          });
          apiResponse = openLinker("POST", url, "AT15DCCE0808080001", JSON.stringify(body));
          result = JSON.parse(apiResponse);
          if (result.code == 200 && result.data.sucessCount == 1) {
            //下推销售出库成功
            rsp.dataInfo.ckCode = result.data.infos[0].code; //出库单号
            sql = "select id,b.id,vouchdate from st.salesout.SalesOut inner join st.salesout.SalesOuts b on b.mainid=id where code='" + rsp.dataInfo.ckCode + "'";
            let dt01 = ObjectStore.queryByYonQL(sql, "ustock");
            //销售出库审核
            url = baseurl + "/yonbip/scm/salesout/batchaudit";
            body = {
              data: [
                {
                  id: dt01[0].id
                }
              ]
            };
            apiResponse = openLinker("POST", url, "AT15DCCE0808080001", JSON.stringify(body));
            result = JSON.parse(apiResponse);
            if (result.code == 200 && result.data.sucessCount == 1) {
              //下推销售发票
              url = baseurl + "/yonbip/sd/vouchersaleinvoice/saveForSalesOut";
              body = {
                data: {
                  transactionTypeId: "yourIdHere",
                  vouchdate: vouchdate,
                  exchRateDate: vouchdate,
                  invoiceAsynTaxMark: false,
                  isNotSendTax: false,
                  modifyInvoiceType: false,
                  saleInvoiceDefineCharacter: {
                    attrext82: "Posify",
                    id: ""
                  },
                  saleInvoiceDetails: [],
                  _status: "Insert"
                }
              };
              dt01.map((v1) => {
                //子表数据
                body.data.saleInvoiceDetails.push({
                  sourceid: v1.id,
                  sourceautoid: v1.b_id
                });
              });
              //下推销售发票
              apiResponse = openLinker("POST", url, "AT15DCCE0808080001", JSON.stringify(body));
              result = JSON.parse(apiResponse);
              if (result.code == 200) {
                rsp.dataInfo.fpCodeL = result.data.code; //发票号
              } else {
                throw new Error("销售出库下推销售发票失败" + JSON.stringify(result.messages));
              }
            } else {
              throw new Error("销售出库审核失败" + JSON.stringify(result.data.messages));
            }
          } else {
            throw new Error("下推销售出库失败" + JSON.stringify(result.data.messages));
          }
        } else {
          throw new Error("销售订单审核失败" + JSON.stringify(result.data.messages));
        }
      }
    } catch (ex) {
      console.log("错误信息" + ex.toString() + "单号 " + code);
      console.log("请求参数" + JSON.stringify(body));
      rsp.code = 500;
      rsp.msg = ex.toString();
    }
    return rsp;
  }
}
exports({ entryPoint: MyAPIHandler });