let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request, a) {
    return { request };
    let body = {};
    let url = "https://www.example.com/";
    let header = {
      "Domain-Key": "u8c-auth",
      Cookie:
        "yht_access_token=bttdWplejVnbmpRUkdnczNGMTk3L3BSUWREN0NWd0M4VG02ZUY3THVzaTRvMHg4cTlsREpOd3llL3JSb1AvTC9IbWtCMS9XMy90L1BhcjJGWEFXV0tSZHlieWJVWDJvT0JZc2lBcHhaV2VGNytMenFFTGZBTStvajlVWHJkbG1hdldfX2V1Yy55b255b3VjbG91ZC5jb20.__db08b90dfd99eaee9862c6c8831d6823_1638866062603"
    };
    let apiResponse = null;
    try {
      apiResponse = postman("GET", url, JSON.stringify(header), JSON.stringify(body));
    } catch (e) {
      return { e };
    }
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });