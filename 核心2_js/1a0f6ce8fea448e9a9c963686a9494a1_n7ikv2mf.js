let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var newBeiJingDate = function () {
      var d = new Date(); //创建一个Date对象
      var localTime = d.getTime();
      var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
      var gmt = localTime + localOffset; //GMT时间
      var offset = 8; //东8区
      var beijing = gmt + 3600000 * offset;
      var nd = new Date(beijing);
      return nd;
    };
    var formatDateTime = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    };
    var formatMonth = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      return y + m;
    };
    var querOrgByName = function (orgname) {
      let orgListbody = {
        name: orgname,
        enable: "1"
      };
      let orgListUrl = "https://www.example.com/";
      let orgsObj = openLinker("POST", orgListUrl, "AT17E908FC08280001", JSON.stringify(orgListbody));
      let orgs = JSON.parse(orgsObj).data;
      if (orgs && orgs.length > 0) {
        return orgs[0];
      }
      return {};
    };
    var querDocDefByName = function (indname, custdocdefcode) {
      let indbody = {
        pageIndex: 1,
        pageSize: 10,
        custdocdefcode: custdocdefcode, //"IDT",
        name: indname
      };
      let indListUrl = "https://www.example.com/";
      let indsObj = openLinker("POST", indListUrl, "AT17E908FC08280001", JSON.stringify(indbody));
      let inds = JSON.parse(indsObj).data.recordList;
      if (inds && inds.length > 0) {
        for (var j1 = 0; j1 < inds.length; j1++) {
          let name = inds[j1].name;
          if (typeof name == "object" && name) {
            name = name.zh_CN;
          }
          if (name == indname) {
            return inds[j1];
          }
        }
      }
      return null;
    };
    var querNewPartnerName = function (suppliername) {
      let indbody = {
        pageIndex: 1,
        pageSize: 10,
        custdocdefcode: "wbzykb_partner_compare", //"IDT",
        code: suppliername
      };
      let indListUrl = "https://www.example.com/";
      let indsObj = openLinker("POST", indListUrl, "AT17E908FC08280001", JSON.stringify(indbody));
      let inds = JSON.parse(indsObj).data.recordList;
      let ind = null;
      let newSupplierName = suppliername;
      if (inds && inds.length > 0) {
        for (var j1 = 0; j1 < inds.length; j1++) {
          let code = inds[j1].code;
          if (code == suppliername) {
            ind = inds[j1];
          }
        }
      }
      if (ind) {
        newSupplierName = ind.name;
        if (typeof newSupplierName == "object" && newSupplierName) {
          newSupplierName = newSupplierName.zh_CN;
        }
      }
      return newSupplierName;
    };
    var querIndustyContrast = function (idtcode) {
      let idt_contrast_industry = "";
      let object = { idt_contrast_code: idtcode };
      let res = ObjectStore.selectByMap("AT17E908FC08280001.AT17E908FC08280001.industry_contrast_table", object);
      if (res && res.length > 0) {
        idt_contrast_industry = res[0].idt_contrast_industry;
      }
      return idt_contrast_industry;
    };
    //外包模式
    var outsouce_mode_map = new Map();
    outsouce_mode_map.set("整包", "POM01");
    outsouce_mode_map.set("分包", "POM02");
    outsouce_mode_map.set("人天租借", "POM03");
    //外包类型
    var outsouce_type_map = new Map();
    outsouce_type_map.set("实施", "POT01");
    outsouce_type_map.set("开发", "POT02");
    outsouce_type_map.set("咨询", "POT03");
    outsouce_type_map.set("运维", "POT04");
    outsouce_type_map.set("其它", "POT06");
    outsouce_type_map.set("混合（实施+开发）", "POT05");
    //产品线
    var product_line_map = new Map();
    product_line_map.set("iUAP", "02001");
    product_line_map.set("NC", "02003");
    product_line_map.set("PLM", "02005");
    product_line_map.set("BA", "02006");
    product_line_map.set("U9", "02010");
    product_line_map.set("U8Cloud", "02015");
    product_line_map.set("NCCloud", "02017");
    product_line_map.set("U8", "02020");
    product_line_map.set("其它软件", "02030");
    product_line_map.set("第三方软件", "02500");
    product_line_map.set("iUAP云服务", "04005");
    product_line_map.set("友空间", "04006");
    product_line_map.set("友云采", "04013");
    product_line_map.set("Yonsuite", "04055");
    product_line_map.set("第三方云服务产品", "04072");
    product_line_map.set("畅捷支付金融服务", "05001");
    product_line_map.set("用友力合金融服务", "05101");
    product_line_map.set("YonBIP", "06001");
    let supMap = new Map();
    supMap.set("软通动力信息技术（集团）有限公司", "软通动力信息技术（集团）股份有限公司");
    supMap.set("信华信(大连)数字技术有限公司", "信华信（大连）数字技术有限公司");
    supMap.set("中电金信数字科技集团有限公司", "中电金信软件（上海）有限公司");
    let noOrgList = [];
    noOrgList.push("用友汽车信息科技(上海)股份有限公司");
    noOrgList.push("厦门用友烟草软件有限责任公司");
    noOrgList.push("柚子（北京）移动技术有限公司");
    noOrgList.push("智石开工业软件有限公司");
    noOrgList.push("用友金融信息技术股份有限公司");
    noOrgList.push("北京点聚信息技术有限公司");
    noOrgList.push("南京数字认证有限公司");
    noOrgList.push("沈阳点聚科技有限公司");
    noOrgList.push("上海大易云计算有限公司");
    let hwOrgList = [];
    hwOrgList.push("UFIDA (SINGAPORE) PRIVATE LIMITED");
    hwOrgList.push("UFIDA (MALAYSIA) SDN BHD");
    hwOrgList.push("用友软件日本有限公司");
    hwOrgList.push("用友软件香港有限公司");
    hwOrgList.push("UF　GLOBAL RESOURCES LTD.");
    hwOrgList.push("WECOO NETWORK TECHNOLOGIES CO.,LTD.");
    hwOrgList.push("用友软件台湾有限公司");
    hwOrgList.push("用友软件澳门有限公司");
    hwOrgList.push("YONYOU (CANADA) COMPANY LIMITED");
    let begin_ts = request.begin_ts; //formatDateTime(addDaysToDate(new Date(),-2));//2023-01-01 12:00:00
    let end_ts = request.end_ts; //formatDateTime(new Date());//2023-01-31 23:59:59
    let page = request.page;
    let size = request.size;
    let contract_code = request.contract_code;
    let upContract = [];
    let rrr = {};
    let url = "https://www.example.com/" + URLEncoder(begin_ts) + "&end_ts=" + URLEncoder(end_ts) + "&page=" + page + "&size=" + size;
    if (contract_code && contract_code.length > 0) {
      url += "&billno=" + contract_code;
    }
    url += "&token=X21Eb2MtN09iME5LdzlRRFpkWUF6aVkxejFVbjhSd20zd3RIX2tSamFoZDBldzQxVmdWaDZYQzZ0MUM3NFdlVQ==";
    let ycdatas = postman("get", url, JSON.stringify({}), null);
    let datas = JSON.parse(ycdatas).data;
    let orgMap = new Map(); //供应商
    let indMap = new Map(); //行业
    let fieldMap = new Map(); //领域
    let cglbMap = new Map(); //采购类别
    let proArray = ["iUAP", "BA", "NCCloud", "YonBIP", "iUAP云服务", "NC", "其它软件", "第三方软件"];
    let newPartOutResouceList = [];
    if (datas && datas.length > 0) {
      for (var i = 0; i < 50 && i < datas.length; i++) {
        let data = datas[i];
        let suppliername = data.suppliername; //供应商
        let customerindustry = data.customerindustry; //行业
        let outsoucemode = data.outsoucemode; //外包模式
        let outsoucetype = data.outsoucetype; //外包类型
        let productline = data.productline; //产品线
        let field = data.field; //领域
        let subject = data.subject; //合同标题
        let performancedepartcode = data.performancedepartcode;
        let highindustrydepartcode = data.highindustrydepartcode;
        let industry_name = data.industry_name; //行业
        let billstatus = data.billstatus; //单据状态
        let cglb = data.purchasetype; //采购类别
        let approve_end_time = data.approve_end_time; //审批通过日期
        let org_name = data.org_name;
        let first_party_name = data.first_party_name;
        let billno = data.billno;
        let billnostart = billno.substring(0, 2);
        if (billnostart == "TE" || billnostart == "CU" || billnostart == "NU") {
          productline = "其它软件";
        }
        if (cglb == "华为产业云服务采购" || cglb == "APICloud外包") {
          continue;
        }
        var porRes = ObjectStore.selectByMap("AT17E908FC08280001.AT17E908FC08280001.part_out_resouce", { part_contract_code: data.billno });
        if (porRes && porRes.length > 0) {
          continue;
        }
        let part_outsouce_field = "";
        if (fieldMap.has(field)) {
          part_outsouce_field = fieldMap.get(field);
        } else {
          let fid = querDocDefByName(field, "wbzykb_field");
          if (fid) {
            part_outsouce_field = fid.id;
            fieldMap.set(field, part_outsouce_field);
          }
        }
        if (performancedepartcode && performancedepartcode.lenth >= 4) {
          let dcode = substring(performancedepartcode, 0, 4);
          if (dcode == "84202") {
            //中端的
            continue;
          }
        }
        let org_id = "";
        suppliername == supMap.has(suppliername) ? supMap.get(suppliername) : suppliername;
        if (!orgMap.has(suppliername)) {
          let org = querOrgByName(suppliername);
          if (org && org.id) {
            org_id = org.id;
          }
          orgMap.set(suppliername, org_id);
        } else {
          org_id = orgMap.get(suppliername);
        }
        if (!org_id) {
          if (includes(suppliername, "(")) {
            suppliername = suppliername.replace("(", "（");
            suppliername = suppliername.replace(")", "）");
          } else if (includes(suppliername, "（")) {
            suppliername = suppliername.replace("（", "(");
            suppliername = suppliername.replace("）", ")");
          }
          let org = querOrgByName(suppliername);
          if (org && org.id) {
            org_id = org.id;
          }
        }
        if (!org_id) {
          let newSupplierName = querNewPartnerName(suppliername);
          if (suppliername !== newSupplierName) {
            let org = querOrgByName(newSupplierName);
            if (org && org.id) {
              org_id = org.id;
              suppliername = newSupplierName;
            }
          }
        }
        let part_industry = "";
        if (performancedepartcode && performancedepartcode.length >= 9) {
          part_industry = querIndustyContrast(substring(performancedepartcode, 0, 9));
        }
        if (part_industry == "" || !part_industry) {
          if (highindustrydepartcode && highindustrydepartcode.length >= 9) {
            part_industry = querIndustyContrast(substring(highindustrydepartcode, 0, 9));
          }
        }
        if (part_industry == "" || !part_industry) {
          //海外事业部
          if (hwOrgList.includes(org_name)) {
            part_industry = "1728266321462820869";
          }
        }
        let part_outsource_cglb = "";
        if (cglbMap.has(cglb)) {
          part_outsource_cglb = cglbMap.get(cglb);
        } else {
          let ind = querDocDefByName(cglb, "wbzykb_cglb");
          if (ind) {
            part_outsource_cglb = ind.id;
            cglbMap.set(cglb, part_outsource_cglb);
          }
        }
        let part_out_resouce = {
          org_id: org_id,
          part_contract_code: data.billno,
          part_partner_name: suppliername,
          part_contract_mny: data.contractmoney,
          part_create_date: approve_end_time,
          part_customer_name: data.customername,
          part_outsouce_field: part_outsouce_field,
          part_outsouce_industry: part_industry,
          part_is_pre_invest: false,
          part_is_pre_invest2: "N",
          part_outsource_cglb: part_outsource_cglb,
          part_outsouce_mode: outsouce_mode_map.has(outsoucemode) ? outsouce_mode_map.get(outsoucemode) : "",
          part_outsource_type: outsouce_type_map.has(outsoucetype) ? outsouce_type_map.get(outsoucetype) : "",
          part_product_line: product_line_map.has(productline) ? product_line_map.get(productline) : "",
          part_project_name: subject,
          part_pro_month: "202310",
          part_project_code: "PRO" + data.billno,
          part_is_closed: false,
          part_is_closed2: "N",
          part_is_erp: "Y",
          part_has_nextmonth2: "N"
        };
        newPartOutResouceList.push(part_out_resouce);
      }
    }
    if (newPartOutResouceList.length > 0) {
      var res = ObjectStore.insertBatch("AT17E908FC08280001.AT17E908FC08280001.part_out_resouce", newPartOutResouceList, "ybd993b5aa");
    }
    if (upContract.length > 0) {
      try {
        ObjectStore.updateBatch("AT17E908FC08280001.AT17E908FC08280001.pur_contract_back", upContract, "yb65f5c4d4");
      } catch (e) {}
    }
    return { newPartOutResouceList, upContract, ycdatas };
  }
}
exports({ entryPoint: MyAPIHandler });