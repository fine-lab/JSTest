viewModel.get("button67dk") &&
  viewModel.get("button67dk").on("click", function (data) {
    let yhtAccessToken = cb.context.getYhtAccessToken();
    getDownLoadUrl(yhtAccessToken);
  });
function getDownLoadUrl(yhtAccessToken) {
  var data =
    "appSource=PU&domainDataBaseByCode=SCM&tenantId=j39bblr3&meta=1&sendType=6&lang=zh_CN&orgId=1572548777477144623&yht_access_token=" +
    yhtAccessToken +
    "&printcode=u8c1675947515000&domainKey=upu&serverUrl=https%3A%2F%2Fc2.yonyoucloud.com%2Fmdf-node%2Fformdata%2Freport%2FgetPrintData%3FdomainKey%3Dupu%26serviceCode%3Dpu_arrivalorderlist&params=%7B%22billno%22%3A%22pu_arrivalorder%22%2C%22printcountswitch%22%3Atrue%2C%22printrefreshinterval%22%3A1000%2C%22context_path%22%3A%22%2Fmdf-node%2Funiform%22%2C%22ids%22%3A%5B%221749625039207006217%22%5D%7D&previewUrl=https%3A%2F%2Fc2.yonyoucloud.com%2Fiuap-apcom-print%2Fu8cprint%2Fdesign%2FgetPreview&cookie=locale%3Dzh_CN%3Bc800%3Ddccore0%3B_WorkbenchCross_%3DUltraman%3BmultilingualFlag%3Dtrue%3Btimezone%3DUTC%2B08%3A00%3Blanguage%3D001%3Blocale%3Dzh_CN%3BorgId%3D%3BdefaultOrg%3D%3Btenantid%3Dj39bblr3%3Btheme%3D%3Blanguages%3D001001002003%3BnewArch%3Dfalse%3Bsysid%3Ddiwork%3Bn_f_f%3Dfalse%3BPHPSESSID%3Dak5thlugetmgp5dj70nispv992%3BYKJ_IS_DIWORK%3D1%3BYKJ_DIWORK_DATA%3D%257B%2522data%2522%253A%257B%2522is_diwork%2522%253A1%252C%2522cur_qzid%2522%253A%2522578590%2522%257D%252C%2522key%2522%253A%2522560adc6dcf913bd3f2e0da21b144987f%2522%257D%3Bat%3D75539fde-4dd7-4f8c-9515-7d5b2383d399%3BJSESSIONID%3D1B6144B86D34124E5DFDFFB370BD6C6E%3Byht_username_diwork%3DST-756053-yIXdNENofs1FjhCbeTtz-online__8efdb18f-95a3-4087-91b1-da0a86d092fa%3Byht_usertoken_diwork%3DF1lB1ziY97VU4gRi4hXjFhN5hZ2BfdJRbjxf%252BNAoiwhkgEes5B1m%252F%252FO%252BxPT53qoDJ%252F%252B6qb1dE7gwS28Ekndf9w%253D%253D%3Byht_access_token%3Dbttclg4ZzBMM2k2WjIvbHY4UXBjSXlXNTlldnd4TWhqaTdDZmNvZEdkZGI0TzJnTXJwUk5pQk1HVEtXODdPTWkxTl9fZXVjLnlvbnlvdWNsb3VkLmNvbQ..__894682e90f946ef1402331f759ea28e3_1687660994409dccore0iuap-apcom-workbenchaccf2030YT%3Ba00%3DQ9v4ux6sRqwVEmkXzOagBzkp0ACy4HU1J4UWjhLcVadqMzliYmxyM2AyOTk1MDQ3OTQ1MTE0MDE2YGozOWJibHIzYDhlZmRiMThmLTk1YTMtNDA4Ny05MWIxLWRhMGE4NmQwOTJmYWAxYGBlNmI1YjdlNWIzYTFlNWJiYmFlOGFlYmVlOWEyODZlNWFmYmNgYGAxNTcwMzQ2MTU1MDM4OTk4NTMxYGZhbHNlYGAxNjg3NjYwOTk0NDI1YHltc3Nlczo0NDdlOTUzMjVkYTM2MGM4NGZlOTFjMDRlZTgxYTI3MGBkaXdvcmtg%3Bwb_at%3DLMjtrsmrpjxBQcG7Gnern8ig5adMsyjnmkhmd%3Bacw_tc%3D276077cd16876760830181559e551612770d6bada5cb0b0d612e2f67211d70%3Ba10%3DNzIwODM3Mzk4MTc4NTM3OTYxNTM%3BXSRF-TOKEN%3DMDF_8GQXASO2I1EEO87JXDN65MHC6%21152343%3B&split=false&keepAlive=true";
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
      getFileUrl(fileUrl);
    }
  });
}
function getFileUrl(fileUrl) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open("GET", "https://www.example.com/" + fileUrl + "&t=" + new Date().getTime().toString());
  xhr.setRequestHeader("authority", "c2.yonyoucloud.com");
  xhr.setRequestHeader("accept", "application/json, text/plain, */*");
  xhr.setRequestHeader("accept-language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");
  xhr.send();
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
  xhr.open("GET", fileUrl, true);
  xhr.responseType = "blob";
  xhr.send();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      debugger;
      console.log(this.response);
      const url = URL.createObjectURL(this.response);
      // 创建链接
      const link = document.createElement("a");
      link.href = url;
      link.download = "下载pdf.pdf";
      // 模拟点击链接进行下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // 释放 URL 对象
      URL.revokeObjectURL(url);
    }
  });
}
viewModel.get("button143md") && viewModel.get("button143md").on("click", function (data) {});
viewModel.get("button220tc") && viewModel.get("button220tc").on("click", function (data) {});