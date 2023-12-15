viewModel.on("afterLoadMeta", (args) => {
  const { vm, view } = args;
  console.log("%c afterLoadMeta   fired", "color: orange");
  cb.cache.set("viewModel", vm);
});
viewModel.get("button139qi") &&
  viewModel.get("button139qi").on("click", function (data) {
    let viewModel = cb.cache.get("viewModel");
    let yhtAccessToken = cb.context.getYhtAccessToken();
    getDownLoadUrl(yhtAccessToken);
  });
function getDownLoadUrl(yhtAccessToken) {
  var data =
    "appSource=PU&domainDataBaseByCode=SCM&tenantId=j39bblr3&meta=1&sendType=6&lang=zh_CN&orgId=1684464630093578242&yht_access_token=" +
    yhtAccessToken +
    "&printcode=u8c1677824976000&domainKey=upu&serverUrl=https%3A%2F%2Fc2.yonyoucloud.com%2Fmdf-node%2Fformdata%2Freport%2FgetPrintData%3FdomainKey%3Dupu%26serviceCode%3Dst_purchaseorderlist&params=%7B%22billno%22%3A%22st_purchaseorder%22%2C%22printcountswitch%22%3Atrue%2C%22printrefreshinterval%22%3A1000%2C%22context_path%22%3A%22%2Fmdf-node%2Funiform%22%2C%22ids%22%3A%5B%221774297255501103107%22%5D%7D&sortKey=bb09200c-d0b8-4972-9a0c-a8ba161fc830&previewUrl=https%3A%2F%2Fc2.yonyoucloud.com%2Fiuap-apcom-print%2Fu8cprint%2Fdesign%2FgetPreview&cookie=locale%3Dzh_CN%3Bc800%3Ddccore0%3B_WorkbenchCross_%3DUltraman%3BJSESSIONID%3D08EFAF2D5FCF30CB7676A5D53C16A5FB%3Byht_username_diwork%3DST-1307324-bR90lBDauEWpMMB1gjqc-online__8efdb18f-95a3-4087-91b1-da0a86d092fa%3Byht_usertoken_diwork%3DXsIdjyGzvGv54EdnMDlNoEsflSKvxDkkY7vXQiBMy2mt%252BRsWEOvlHVSYgnGR7Cl5daeleYFTFmQXs5XitiIM8w%253D%253D%3Byht_access_token%3DbttdnRmY2hqWGhWM1UxbS96U2k3Z0pBcDQwVnF6NHNZTFFCL2ZqeUhhY3hPcTJnTXJwUk5pQk1HVEtXODdPTWkxTl9fZXVjLnlvbnlvdWNsb3VkLmNvbQ..__894682e90f946ef1402331f759ea28e3_1698802750962dccore0iuap-apcom-workbenchaccf2030YT%3BmultilingualFlag%3Dtrue%3Btimezone%3DUTC%2B08%3A00%3Blanguage%3D001%3Blocale%3Dzh_CN%3BorgId%3D%3BdefaultOrg%3D%3Btenantid%3Dj39bblr3%3Btheme%3D%3Blanguages%3D1_3-2_1-3_1%3BnewArch%3Dfalse%3Bsysid%3Ddiwork%3Ba00%3DwwgNorAseU_h9M9q6rPCoNStrFRUspg8PCIkDMuWRaNqMzliYmxyM2AyOTk1MDQ3OTQ1MTE0MDE2YGozOWJibHIzYDhlZmRiMThmLTk1YTMtNDA4Ny05MWIxLWRhMGE4NmQwOTJmYWAxYGBlNmI1YjdlNWIzYTFlNWJiYmFlOGFlYmVlOWEyODZlNWFmYmNgYGAxNTcwMzQ2MTU1MDM4OTk4NTMxYGZhbHNlYGAxNjk4ODAyNzUwOTYxYHltc3NlczowYTg2ZmM0MjJlOGYwMGVjZjE5MWYzMTk5OThkYTk3OWBkaXdvcmtg%3Bn_f_f%3Dfalse%3Bwb_at%3DLMjnpmtpoqjaKvmk46Zt7PoFF4nfipbjnmkhmd%3BjDiowrkTokenMock%3DbttdnRmY2hqWGhWM1UxbS96U2k3Z0pBcDQwVnF6NHNZTFFCL2ZqeUhhY3hPcTJnTXJwUk5pQk1HVEtXODdPTWkxTl9fZXVjLnlvbnlvdWNsb3VkLmNvbQ..__894682e90f946ef1402331f759ea28e3_1698802750962dccore0iuap-apcom-workbenchaccf2030YT%3Ba10%3DOTIxMjIwMTg0Mjg5OTg2MDU0MzU%3BXSRF-TOKEN%3DMDF_GHD4483M377S3FWQHHVPTDMOL%21151249%3Bacw_tc%3D276077c116988227603765676e308e23832d465a70791f491717f2411835cc%3B&split=false&keepAlive=true";
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open("POST", "https://www.example.com/");
  xhr.setRequestHeader("authority", "c2.yonyoucloud.com");
  xhr.setRequestHeader("accept", "application/json, text/plain, */*");
  xhr.setRequestHeader("accept-language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
  xhr.send(data);
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      let fileUrl = JSON.parse(this.responseText).data;
      downloadFile(fileUrl);
    }
  });
}
function downloadFile(fileUrl) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  let ts = new Date().getTime();
  xhr.open("GET", "https://www.example.com/" + fileUrl + "&t=" + ts);
  xhr.setRequestHeader("authority", "c2.yonyoucloud.com");
  xhr.setRequestHeader("accept", "*/*");
  xhr.setRequestHeader("accept-language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.setRequestHeader(
    "cookie",
    "_WorkbenchCross_=Ultraman; JSESSIONID=7D66BB97FB7A8500E7D163EF1ADE60DB; yht_username_diwork=ST-3233524-ffLXyxiIbWW5YbTTnSRs-online__8efdb18f-95a3-4087-91b1-da0a86d092fa; yht_usertoken_diwork=cvks1BAYRYXxaw2i0Wni2%2B0UEI6MYQqpKYrcUYY%2BHVuwPIv41z0LB9xS6DkdvwrkoE9Rap4H2A%2BzcgWo3oQwGw%3D%3D; yht_access_token=bttYjFSZjFLMWpZYkxDSzdOYjRDSzdIenJoZ1FwYzJqc0ZxdGVMNjdkY3NXQVdoY1lpdzNrZ1dGcDB5ZjJUcjNMWF9fZXVjLnlvbnlvdWNsb3VkLmNvbQ..__894682e90f946ef1402331f759ea28e3_1698199162826dccore0iuap-apcom-workbenchaccf2030YT; multilingualFlag=true; timezone=UTC+08:00; language=001; locale=zh_CN; orgId=; defaultOrg=; tenantid=j39bblr3; theme=; languages=1_3-2_1-3_1; newArch=false; sysid=diwork; a00=NrVkvIglaTRBpg9tVPrpCpPr1N6-ZJE62QNMzKXIqVJqMzliYmxyM2AyOTk1MDQ3OTQ1MTE0MDE2YGozOWJibHIzYDhlZmRiMThmLTk1YTMtNDA4Ny05MWIxLWRhMGE4NmQwOTJmYWAxYGBlNmI1YjdlNWIzYTFlNWJiYmFlOGFlYmVlOWEyODZlNWFmYmNgYGAxNTcwMzQ2MTU1MDM4OTk4NTMxYGZhbHNlYGAxNjk4MTk5MTYyODMzYHltc3NlczpjZGZkYzA2MDAwNDc4ZWUxZjMzMjhjNTBkMGRkMjVmNmBkaXdvcmtg; n_f_f=false; wb_at=LMjpopproqjeeEQxwhBaPPrRaMMmLKrjnmkhmd; c800=dccore0; jDiowrkTokenMock=bttYjFSZjFLMWpZYkxDSzdOYjRDSzdIenJoZ1FwYzJqc0ZxdGVMNjdkY3NXQVdoY1lpdzNrZ1dGcDB5ZjJUcjNMWF9fZXVjLnlvbnlvdWNsb3VkLmNvbQ..__894682e90f946ef1402331f759ea28e3_1698199162826dccore0iuap-apcom-workbenchaccf2030YT; acw_tc=276077d816981993028516706ea6466e4f2c1e67f38710c44a8624f981b497; a10=MTE4MzY1MTExMjgzNzYwMjIyMjg; XSRF-TOKEN=AX_LUM3O1XEMXRYHC7BDC9JBPGEL!101852"
  );
  xhr.setRequestHeader("pragma", "no-cache");
  xhr.setRequestHeader(
    "referer",
    "https://www.example.com/"
  );
  xhr.setRequestHeader("sec-ch-ua", '"Chromium";v="118", "Microsoft Edge";v="118", "Not=A?Brand";v="99"');
  xhr.setRequestHeader("sec-ch-ua-mobile", "?0");
  xhr.setRequestHeader("sec-ch-ua-platform", '"Windows"');
  xhr.setRequestHeader("sec-fetch-dest", "empty");
  xhr.setRequestHeader("sec-fetch-mode", "cors");
  xhr.setRequestHeader("sec-fetch-site", "same-origin");
  xhr.setRequestHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.61");
  xhr.send();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(JSON.parse(this.responseText).data);
      sendToApi(JSON.parse(this.responseText).data);
    }
  });
}
function sendToApi(fileUrl) {
  urlToBase64(fileUrl).then((res) => {
    console.log("base64", res);
    let viewModel = cb.cache.get("viewModel");
    let id = viewModel.get("id").getData();
    cb.rest.invokeFunction("PU.backDesignerFunction.HX1687244342", { file: res, id }, function (err, res) {
      if (err) return;
      viewModel.get("extend_fileId").setValue(JSON.parse(res.res.data).info.file1);
      pushContractData(JSON.parse(res.res.data).info.file1);
    });
  });
}
function pushContractData(fileId) {
  let viewModel = cb.cache.get("viewModel");
  let invoiceVendor = viewModel.get("invoiceVendor").getData();
  let invoiceVendor_name = viewModel.get("invoiceVendor_name").getData();
  cb.rest.invokeFunction("PU.backDesignerFunction.HX1688114174", { invoiceVendor }, function (err, res) {
    if (err) return;
    let creditcode = res.res[0].creditcode;
    cb.cache.set("creditcode", creditcode);
    let sendData = {
      url: "/itp/yw/contract/pushData",
      name: "测试合同签署流程",
      fileType: "1",
      sortType: "1",
      overTime: "-1",
      userArr: [
        {
          user: creditcode,
          type: "1",
          name: invoiceVendor_name,
          deviceArr: [
            {
              deviceType: "8",
              signTypeArr: ["2"],
              name: "平潭综合实验区两岸创新投资有限公司",
              mobile: "18850383129",
              idCard: creditcode
            }
          ]
        }
      ],
      fileArr: [
        {
          fileId: fileId,
          fileName: "签章文件_" + new Date().getTime(),
          signArr: [
            {
              user: creditcode,
              mode: "1"
            }
          ]
        }
      ]
    };
    cb.rest.invokeFunction("PU.backDesignerFunction.HX1688378797", { sendData }, function (err, res) {
      if (err) return;
      console.log(res);
      getsignUrl(res);
    });
  });
}
function getsignUrl(res) {
  let sid = JSON.parse(res.res.data).info.sid;
  let sendData = {
    url: "/itp/yw/contract/getUrl",
    sid,
    creditcode: cb.cache.get("creditcode")
  };
  cb.rest.invokeFunction("PU.backDesignerFunction.HX1688437676", { sendData }, function (err, res) {
    if (err) return;
    let signUrl = JSON.parse(res.res.data).info.url;
    let viewModel = cb.cache.get("viewModel");
    viewModel.get("extend_signUrlNew").setValue(signUrl.split("=")[1]);
    viewModel.get("btnSave").execute("click");
  });
}
function urlToBase64(url) {
  return new Promise((res, err) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        res(reader.result.replace(/^data:.+;base64,/, ""));
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.send();
  });
}
viewModel.get("button340ai") &&
  viewModel.get("button340ai").on("click", function (data) {
    let viewModel = cb.cache.get("viewModel");
    let url = viewModel.get("extend_signUrlNew").getValue();
    let baseUrl = "https://kf.fjdzyz.com:51007/html/itp/pc/index.html#/pdfSign?token=";
    window.open(baseUrl + url);
  });
viewModel.get("button201ci") &&
  viewModel.get("button201ci").on("click", function (data) {
    let viewModel = cb.cache.get("viewModel");
    let fileId = viewModel.get("extend_fileId").getValue();
    cb.rest.invokeFunction("PU.backDesignerFunction.HX1688435430", { fileId }, function (err, res) {
      debugger;
    });
  });