const CACHE_NAME = 'profile-card-cache-v1'; // Tên cache, thay đổi khi cập nhật cache
const urlsToCache = [
    '/', // Trang index
    '/index.html',
    '/style.css',
    // '/icons/icon-192x192.png', // Uncomment nếu bạn có file icon
    // '/icons/icon-512x512.png', // Uncomment nếu bạn có file icon
    // Thêm các file khác mà bạn muốn cache (ví dụ: ảnh profile nếu có)
];

// Lắng nghe sự kiện install (lần đầu service worker được cài đặt)
self.addEventListener('install', function(event) {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Service Worker: Caching app shell');
                return cache.addAll(urlsToCache); // Thêm các file vào cache
            })
    );
});

// Lắng nghe sự kiện activate (khi service worker mới được kích hoạt)
self.addEventListener('activate', function(event) {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName); // Xóa cache cũ
                    }
                })
            );
        })
    );
});

// Lắng nghe sự kiện fetch (mỗi khi trình duyệt gửi yêu cầu mạng)
self.addEventListener('fetch', function(event) {
    // Phản hồi bằng tài nguyên trong cache nếu có
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Tài nguyên có trong cache, trả về từ cache
                if (response) {
                    console.log('Service Worker: Fetching from cache:', event.request.url);
                    return response;
                }
                // Không có trong cache, gửi yêu cầu mạng bình thường
                console.log('Service Worker: Fetching from network:', event.request.url);
                return fetch(event.request);
            })
    );
});
