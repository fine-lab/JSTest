let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var strResponse = postman(
      "post",
      "http://ebstrnapi.liuheco.com:8011/ebsIntergration/commonWS",
      null,
      '<SOAP-ENV:Envelope xmlns:SOAP-ENV="https://www.example.com/"><SOAP-ENV:Header/><SOAP-ENV:Body><ns2:REQUESTTYPE xmlns:ns2="https://www.example.com/" xmlns:ns3="https://www.example.com/" xmlns:ns4="https://www.example.com/"><ns2:ESB_ATTRS><ns2:ESB_SID>C001</ns2:ESB_SID><ns2:ESB_USER>C001</ns2:ESB_USER><ns2:ESB_PWD>a517a404e56e9e6bd087c7223245bf6f</ns2:ESB_PWD><ns2:ESB_SN>C00120210517141719</ns2:ESB_SN><ns2:IFACE_CODE>BIP016INVSTOCKQUANTITY001</ns2:IFACE_CODE><ns2:ESB_SERVICE_ID>A0020000000007</ns2:ESB_SERVICE_ID><ns2:ARG_1/><ns2:ARG_2/><ns2:ARG_3/><ns2:ARG_4/><ns2:ARG_5/></ns2:ESB_ATTRS><ns2:REQUEST_DATA>PGludjpJbnB1dFBhcmFtZXRlcnMgeG1sbnM6aW52PSJodHRwOi8veG1sbnMub3JhY2xlLmNvbS9hcHBzL2N1eC9zb2Fwcm92aWRlci9wbHNxbC9jdXhfMF93c19zZXJ2ZXJfcHJnL2ludm9rZWZtc3dzLyI+CiAgPGludjpQX0lGQUNFX0NPREU+QklQMDE1S1VDVU5RWkMwMDE8L2ludjpQX0lGQUNFX0NPREU+CiAgPGludjpQX0JBVENIX05VTUJFUj5CSVAxMDgwMDAwMDAzNjY2NDc1NDU8L2ludjpQX0JBVENIX05VTUJFUj4KICA8aW52OlBfTElORV9DT1VOVD4xPC9pbnY6UF9MSU5FX0NPVU5UPgogIDxpbnY6UF9TT1VSQ0VfQ09ERT5ZWlBUPC9pbnY6UF9TT1VSQ0VfQ09ERT4KICA8aW52OlBfUkVRVUVTVF9MSU5FPgo8aW52OlBfUkVRVUVTVF9MSU5FX0lURU0+PGludjpWQUxVRTE+PC9pbnY6VkFMVUUxPjxpbnY6VkFMVUUyPjwvaW52OlZBTFVFMj48aW52OlZBTFVFMz40NTAyMDAxMDAzPC9pbnY6VkFMVUUzPjwvaW52OlBfUkVRVUVTVF9MSU5FX0lURU0+ICA8L2ludjpQX1JFUVVFU1RfTElORT4KPC9pbnY6SW5wdXRQYXJhbWV0ZXJzPg==</ns2:REQUEST_DATA></ns2:REQUESTTYPE></SOAP-ENV:Body></SOAP-ENV:Envelope>'
    );
    return {
      test: strResponse
    };
  }
}
exports({ entryPoint: MyAPIHandler });