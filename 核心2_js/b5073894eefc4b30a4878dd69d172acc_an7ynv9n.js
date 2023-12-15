let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    let productBSql = "select * from GT80750AT4.GT80750AT4.underwriter_product_b where status = '0' ";
    let currentPage = 1;
    let pageSize = 10;
    if (request != undefined) {
      if (request.code != undefined && request.code.length > 0) {
        productBSql = `${productBSql} and product_code in ( `;
        request.code.forEach((self) => {
          productBSql = `${productBSql}'${self}',`;
        });
        productBSql = `${productBSql}'')`;
      }
      if (request.currentPage != undefined && request.currentPage != "") {
        currentPage = request.currentPage;
      }
      if (request.pageSize != undefined && request.pageSize != "") {
        pageSize = request.pageSize;
      }
    }
    let productBs = ObjectStore.queryByYonQL(productBSql);
    var resData = {
      productBs: [],
      currentPage: currentPage,
      pageSize: pageSize,
      totalNum: 0
    };
    if (productBs == undefined || productBs.length == 0) {
      return { code: 200, data: resData };
    }
    // 分页处理
    let startPageSize = (currentPage - 1) * pageSize;
    let endPageSize = currentPage * pageSize;
    productBs.forEach((self, index) => {
      if (index >= startPageSize && index < endPageSize) {
        resData.productBs.push(self);
      }
    });
    resData.totalNum = productBs.length;
    return { code: 200, data: resData };
  }
}
exports({ entryPoint: MyAPIHandler });