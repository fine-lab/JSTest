let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 配置文件
    var yhtToken = JSON.parse(AppContext()).token;
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    // 根据客户编码查询所属平台
    if (request != undefined && request.agentCode != undefined && request.agentCode != "") {
      request.platformCode = getPlatformCode(request.agentCode);
    }
    // 主表查询
    let wineLabelSql = "select * from GT80750AT4.GT80750AT4.wine_labels where status = '0' ";
    let currentPage = 1;
    let pageSize = 10;
    if (request != undefined) {
      if (request.code != undefined && request.code != "") {
        wineLabelSql = `${wineLabelSql} and code like '${request.code}' `;
      }
      if (request.name != undefined && request.name != "") {
        wineLabelSql = `${wineLabelSql} and name like '${request.name}' `;
      }
      if (request.wineType != undefined && request.wineType != "") {
        wineLabelSql = `${wineLabelSql} and wine_type = '${request.wineType}' `;
      }
      if (request.currentPage != undefined && request.currentPage != "") {
        currentPage = request.currentPage;
      }
      if (request.pageSize != undefined && request.pageSize != "") {
        pageSize = request.pageSize;
      }
    }
    let wineLabels = ObjectStore.queryByYonQL(wineLabelSql);
    var resData = {
      wineLabels: [],
      currentPage: currentPage,
      pageSize: pageSize,
      totalNum: 0
    };
    if (wineLabels == undefined || wineLabels.length == 0) {
      return { code: 200, data: resData };
    }
    // 子表查询
    let wineLabelBSql = "select * from GT80750AT4.GT80750AT4.wine_labels_b where wine_labels_id in ( ";
    wineLabels.forEach((self) => {
      wineLabelBSql = `${wineLabelBSql}'${self.id}',`;
    });
    wineLabelBSql = `${wineLabelBSql}'')`;
    if (request != undefined) {
      if (request.platformCode != undefined && request.platformCode != "") {
        wineLabelBSql = `${wineLabelBSql} and platform_code = '${request.platformCode}' `;
      }
    }
    let wineLabelBs = ObjectStore.queryByYonQL(wineLabelBSql);
    let id2usedCount = {};
    let id2wineLabelB = {};
    if (wineLabelBs != undefined && wineLabelBs.length > 0) {
      wineLabelBs.forEach((self) => {
        if (self.used_count == undefined) {
          self.used_count = 0;
        }
        if (id2wineLabelB[self.wine_labels_id] == undefined) {
          id2wineLabelB[self.wine_labels_id] = [self];
          id2usedCount[self.wine_labels_id] = self.used_count;
        } else {
          id2wineLabelB[self.wine_labels_id].push(self);
          id2usedCount[self.wine_labels_id] += self.used_count;
        }
      });
    }
    // 酒体查询
    let wineBodys = getWineBodys(request);
    let id2wineBody = {};
    wineBodys.forEach((self) => {
      if (id2wineBody[self.wine_body_id] == undefined) {
        id2wineBody[self.wine_body_id] = [self];
      } else {
        id2wineBody[self.wine_body_id].push(self);
      }
    });
    // 分页处理
    let startPageSize = (currentPage - 1) * pageSize;
    let endPageSize = currentPage * pageSize;
    let noPageData = [];
    wineLabels.forEach((self) => {
      self.wine_labels_b = id2wineLabelB[self.id];
      self.usedCountSum = id2usedCount[self.id];
      if (self.wine_labels_b == undefined) {
        return;
      }
      self.wineBodys = id2wineBody[self.wine_body_id];
      if (self.wineBodys == undefined) {
        return;
      }
      let wine_picture = self.wine_picture;
      if (wine_picture == undefined) {
        self.wine_picture_url = [];
      } else {
        let fileID = JSON.parse(wine_picture).fileID;
        self.wine_picture_url = getFileById(fileID);
      }
      noPageData.push(self);
    });
    noPageData.forEach((self, index) => {
      if (index >= startPageSize && index < endPageSize) {
        resData.wineLabels.push(self);
      }
    });
    resData.totalNum = noPageData.length;
    return { code: 200, data: resData };
    function getWineBodys(param) {
      // 酒体查询
      let wineBodySql = "select id,code,name from GT80750AT4.GT80750AT4.wine_body where status = '0' ";
      if (param != undefined) {
        if (param.wineBodyCode != undefined && param.wineBodyCode != "") {
          wineBodySql = `${wineBodySql} and code like '${param.wineBodyCode}' `;
        }
        if (param.wineBodyName != undefined && param.wineBodyName != "") {
          wineBodySql = `${wineBodySql} and name like '${param.wineBodyName}' `;
        }
      }
      let wineBodys = ObjectStore.queryByYonQL(wineBodySql);
      if (wineBodys == undefined || wineBodys.length == 0) {
        return [];
      }
      let wineBodyBSql = "select product_id,product_code,wine_body_id from GT80750AT4.GT80750AT4.wine_body_b where wine_body_id in (";
      wineBodys.forEach((self) => {
        wineBodyBSql = `${wineBodyBSql}'${self.id}',`;
      });
      wineBodyBSql = `${wineBodyBSql}'')`;
      let wineBodyBs = ObjectStore.queryByYonQL(wineBodyBSql);
      if (wineBodyBs == undefined || wineBodyBs.length == 0) {
        return wineBodys;
      }
      let id2wineBody = {};
      wineBodys.forEach((self) => {
        id2wineBody[self.id] = self;
      });
      wineBodyBs.forEach((self) => {
        let wineBody = id2wineBody[self.wine_body_id];
        if (wineBody == undefined) {
          return;
        }
        self.code = wineBody.code;
        self.name = wineBody.name;
      });
      return wineBodyBs;
    }
    function getFileById(fileId) {
      //附件的fileid add by 2023/02/06 集团变更传参
      let url = "https://www.example.com/" + fileId + "/files?includeChild=false&pageSize=10";
      let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${yhtToken}` };
      let body = {};
      let apiResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
      if (apiResponse == undefined) {
        return [];
      }
      return JSON.parse(apiResponse).data;
    }
    function getFileByIds(attaches) {
      let url = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/batchFiles`;
      let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${yhtToken}` };
      let body = {
        includeChild: false,
        pageSize: 10,
        batchFiles: JSON.stringify(attaches)
      };
      let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
      return apiResponse;
    }
    function getPlatformCode(agentCode) {
      let req = { code: agentCode };
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/GetCtrlCustCode", "", JSON.stringify(req));
      try {
        result = JSON.parse(result);
        if (result.code != "200") {
          throw new Error(result.msg);
        } else if (result.data == undefined || result.data.fxscode == undefined || result.data.fxscode == "") {
          throw new Error(`根据客户编码${agentCode}未查询到所属平台`);
        }
      } catch (e) {
        throw new Error("获取所属平台 " + e + ";参数:" + JSON.stringify(req));
      }
      return result.data.fxscode;
    }
  }
}
exports({ entryPoint: MyAPIHandler });