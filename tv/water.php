<?php
header('Content-Type: application/json');
$url = "http://hangang.dkserver.wo.tc/";

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$headers = array(
   "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:102.0) Gecko/20100101 Firefox/102.0",
   "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
   "Accept-Language: ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
   "Accept-Encoding: gzip, deflate, br",
   "DNT: 1",
   "Connection: keep-alive",
   "Cookie: _ga_MN04YCPS48=GS1.1.1656917409.1.0.1656917423.0; _ga=GA1.1.163005185.1656917409",
   "Upgrade-Insecure-Requests: 1",
   "Sec-Fetch-Dest: document",
   "Sec-Fetch-Mode: navigate",
   "Sec-Fetch-Site: none",
   "Sec-Fetch-User: ?1",
   "Pragma: no-cache",
   "Cache-Control: no-cache",
);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
//for debug only!
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

$resp = curl_exec($curl);
curl_close($curl);
echo $resp;

?>

