export class AppConfig 
{
    Shop_Signature_Method = 'HMAC-SHA1';
    Shop_Nonce_Length = 32;
    Shop_Parameter_Seperator = ', ';

    Shop_Name = "eCommerce";
    Shop_Version = "1.0";
    Shop_Language = 'en';
    //Api_URL = "http://depasserinfotech.in/gurjindersir-ecom/api.php?";
    Api_URL = "https://www.anythingelse.in/api.php?";
    //Api_URL = "http://192.168.0.58/live/anythingelse/api.php?";
    //Api_URL = "http://192.168.0.151:8081/anythingelse/api.php?";
    //Api_URL = "http://192.168.0.136/Anythingelse/api.php?";


    Shop_ConsumerKey = "ck_029ee9d73323f907e15e16dc2acddf64693a72c8";
    Shop_ConsumerSecret = "cs_5655dbb676dcf6b401d1ea4234bb7f7240d17c53";
    Shop_Currency = ""; 
    Shop_Currency_format = "";

    App_Secret = "10366aaacab19b2cb0b92450756ef629ab732174a9a928dd82684664c13d8f5a";
    Onesignal_Enable = false;
    OneSignal_AppID = "";
    GCM_SenderID = "";

    constructor() 
    {
    }
}
