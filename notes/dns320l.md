# D-Link ShareCenter DNS-320L NAS

## Links

+ [Página de informações e suporte no site da D-Link Brasil](https://www.dlink.com.br/produto/dns-320l/)
+ [Página de suporte no site da D-Link US](https://support.dlink.com/ProductInfo.aspx?m=DNS-320L)
+ [Add-ons DNS-320L/DNS-325/DNS-327L/DNS-345/DNS-340L](http://dlink.vtverdohleb.org.ua/Add-On/) (não oficial)

## Script de inicialização do sistema

`/usr/local/modules/script/system_init`

## Lighttpd

`/usr/local/modules/web/config/default_lighttpd.conf` - arquivo de configuração default (somente leitura)

O arquivo é copiado para `/etc/lighttpd/lighttpd.conf` sempre que o NAS é reinicializado

`/usr/sbin/lighty [ start | stop | restart ]`