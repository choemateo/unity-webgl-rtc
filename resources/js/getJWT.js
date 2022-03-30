let jose = require('node-jose');
var jwt='';
let privateKey = `
{
  "alg": "RS256",
  "d": "A4f7TEC3RqOeOUx0cysbtGl4XNJdWYnxRJJA2R8TOpiexltSlulZydNfz1VyWic4V5Ou73odG18Kej_5r8SrBw5Ofuzo0geeMTate4abhfoWSj1Nglw8t1Vqv35jWfVsAwLCTJCOilMl0hQC1cx0XRn_BTOfmZ93-XnsKZJfxYDEiBuw9LMEiWJbT6U_el28X0zRQCWjsgOTd1AN0IqmhWIjKQKvRRtoWrTO4KSmMVmp52FzXGvU0dBLFlXEskigL9-2VIW8igloUSq3vh8g4Y02i7k7o1Uhja8R2-pK755uA8i3ek5LCLpbHYcx_ZBjpsvrnmZwhZ6k9IXFH0os4Q",
  "dp": "5Acdb91PThALy5RXA_gBC6Z389sR6yA9oZV6PHUK5WhlYuPSgMkRjBy-OS9CKkBuJF6XmAJo9OYGskt59-wHcMRdkhkrucDefk9HQIV1EtjpD10JQ9Nq6TFmDJpFE7in9fA6g5vNPQ3I7vm2eAh1piaJpzNNKnnqxuG_rOIpI7U",
  "dq": "hPll9ZHWoXThsjsk9gSkKShezfF2Ib0M7U4ICdc_XWU_LUWD5-0Yv4Om-boY19cc984PU9zwSdDzLdEzBhihalkY_tVolTcfaOjk4JyVnQIIWoJ7ADijhtuYoAASI4Wy6BhtxzRIJ4dPXDS53LzC-DNbMvxKt7osq3UvSqTMaGE",
  "e": "AQAB",
  "ext": true,
  "key_ops": [
    "sign"
  ],
  "kty": "RSA",
  "n": "7HKEil4rHoJZ0swUkIarU2raWLpGM_7nOJFGQs7aciFyGUQOcmqBpe-Oq0HD3iWpw3S5OZ774GPgKn2pfOvfO6hCwg0kZ_QGwaZWPJMCLhAn150Qt4wmVjfdMH0-7hbg7CCDpfx_FhXgzYpoLl8ea7msOO0ubPT5gxQ922Qzfq1iF9ryuEPXSIClSVE9lTjouH0NI_vM_WHTJozm5SSSv-l5aBTIFZOelNcH_Jp6OcRuX025XzUwbCYFrU6KwwrEXZkWDydcZP0-o2UjosT3BDdgeuYS_KUyI1jGQ5RiayqKZ-vifqjostY8UbKxSeo8VtQHBxvTKtuOcSxlAZzQ1Q",
  "p": "_JGsiSFS-hmc4E7toFW5CKWRdzcHZ1UnpwYukjWsQahCm-1H0deS43VwJjOYmd1hXV3dfmSHNis4i6v2If1bp1JFhYscsZDZ2VG9iLgPXo672mKSMv8DLI1fU-gtKTE7G62SX0XbQO79-5b05rTZnxgGUwgJO2MbIHksQmmWETU",
  "q": "76jHibl5NHA94_jepSFdSYmu9NCrdq8Fq3gM8_MGyL8SrlxN5u4dpKoM8w-OPsiULELubzGOdlM1CeTfj6pVFGm1uelQB4uBIyAUkVi6bwUvH5Sw5SOvQqSGJ1vzuBrpDga6vmS9WY27IU6zt2u0bIwCfp69FXGGWBXCXpsWVSE",
  "qi": "BZMGU19S_ubhTAI_WmdLmI8sWH6Sk-qqbgNDALFCIN_bh3JpQ12OwYwTWBJ6FYVmz5EvLr2UKd6siIahQuTtbZNrxCSsiCgsY-mWFVtYaxfil89vWWZdEb9sdTw766TXBdqM9PzMvSLjENSfgQDpT4t2_f93w8Sv3bsaorMlGCA"
  }
`;

module.exports = bot_GetJWT = (kid = null, cid = null) => {
    let header = {
        alg: "RS256",
        typ: "JWT",
        kid: "e560c9f4-e20a-4bed-ae70-db8aa8cd2f00"
    };

    let payload = {
        iss: "1654220519",
        sub: "1654220519",
        aud: "https://api.line.me/",
        exp: Math.floor(new Date().getTime() / 1000) + 60 * 30,
        token_exp: 60 * 60 * 24 * 30
    };

    jose.JWS.createSign({format: 'compact', fields: header}, JSON.parse(privateKey))
        .update(JSON.stringify(payload))
        .final()
        .then(result => {
            console.log(result);
            jwt = result;
        });
    return JSON.stringify(jwt);
}
