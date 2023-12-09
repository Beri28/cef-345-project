self.addEventListener("install", e=>{
    e.waitUntil(
        caches.open('static').then(cache=>{
            return cache.addAll(["./","./assets/css/index.css","./assets/fonts/css/all.css"
            ,"./assets/js/jquery-3.6.0.min.js","./assets/bootstrap/css/bootstrap.min.css",
            "./assets/app_pics/logo-1.png","./assets/app_pics/logo-2.png",
            "./assets/pics/delivery-man-ride-scooter-motorcycle-for-online-delivery-service-on-yellow-background-generative-ai-photo.jpeg"])
        })
    )
})

// self.addEventListener("fetch",e=>{
//      console.log(`Intercepting fetch request for : ${e.request.url}`)
//     // e.respondWith(
//     //     caches.match(e.request).then(res=>{
//     //         return res || fetch(e.req);
//     //     })
//     // )
// })
