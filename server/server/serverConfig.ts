import * as serveStatic from "serve-static";

let staticConfig: serveStatic.ServeStaticOptions = {
    dotfiles: "deny",
    etag: true,
    extensions: ["html"],
    index: "index.html",
    maxAge: "1d",
    lastModified: true,
    redirect: false,
    setHeaders: function (res) {
        res.set("x-timestamp", Date.now().toString());
    }
};


export { staticConfig as StaticConfig };