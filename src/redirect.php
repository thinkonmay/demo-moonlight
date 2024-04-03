<?php
// get the HTTP URL from the query string
$http_url = 'http://servidor.brightcloudgames.com.br:8093/guacamole/';

// fetch the content from the HTTP URL
$content = file_get_contents($http_url);

// return the content to the client
echo $content;