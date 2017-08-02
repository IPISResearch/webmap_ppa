# A webmap of artisanal mining sites around Mambasa, DRC

This is (part of) the code behind the webmap of artisanal mining sites around Mambasa, DRC, that was developed as part of a pilot project on the monitoring of artisanal gold mining in Ituri, DRC. The project is sponsored by [PPA](http://www.resolv.org/site-ppa/) and was executed by [IPIS](http://ipisresearch.be).

--> ** Visit the webmap [here](http://ipisresearch.be/mapping/webmapping/webmap_ppa/index.html)** <--

## What's in this repository and how can I use it.

Our intent for publishing this code is to inspire and help other people and organisations with similar projects. By making the code accessible, we stimulate reuse and help create and open community.

This repository contains all files needed to run the webmap locally, except the data-files themselves. Therefore, you won't be able to just download this repository and view a webmap by opening `index.html`. Instead, you can use this code as inspiration and/or adapt it to be used with your own data. 

To read up on making webmaps using Leaflet, take a look at [this](https://maptimeboston.github.io/leaflet-intro/) very helpful *getting-started* tutorial by MapTime Boston and Leaflet's own [tutorials](http://leafletjs.com/examples.html) and [docs](http://leafletjs.com/reference-1.1.0.html).

Tip: don't forget to start a local http-server when developing your webmaps! If you're familiar with NodeJS, we can recommend [http-server](https://www.npmjs.com/package/http-server), but there are other options out there aswel, including MAMP, WAMP and XAMPP.

Once you've adapted the webmap to your own data and launched your local http-server in the project's directory, say on port `8080`, you can (`cd` to the directory and) open the webmap in your browser at `localhost:8080/index.html`.

Happy mapping!

