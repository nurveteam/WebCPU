define(['exports'], function (exports) { 'use strict';

    var WorkerClass = null;

    try {
        var WorkerThreads =
            typeof module !== 'undefined' && typeof module.require === 'function' && module.require('worker_threads') ||
            typeof __non_webpack_require__ === 'function' && __non_webpack_require__('worker_threads') ||
            typeof require === 'function' && require('worker_threads');
        WorkerClass = WorkerThreads.Worker;
    } catch(e) {} // eslint-disable-line

    function decodeBase64(base64, enableUnicode) {
        return Buffer.from(base64, 'base64').toString(enableUnicode ? 'utf16' : 'utf8');
    }

    function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
        var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
        var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
        var source = decodeBase64(base64, enableUnicode);
        var start = source.indexOf('\n', 10) + 1;
        var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
        return function WorkerFactory(options) {
            return new WorkerClass(body, Object.assign({}, options, { eval: true }));
        };
    }

    function decodeBase64$1(base64, enableUnicode) {
        var binaryString = atob(base64);
        if (enableUnicode) {
            var binaryView = new Uint8Array(binaryString.length);
            for (var i = 0, n = binaryString.length; i < n; ++i) {
                binaryView[i] = binaryString.charCodeAt(i);
            }
            return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
        }
        return binaryString;
    }

    function createURL(base64, sourcemapArg, enableUnicodeArg) {
        var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
        var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
        var source = decodeBase64$1(base64, enableUnicode);
        var start = source.indexOf('\n', 10) + 1;
        var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
        var blob = new Blob([body], { type: 'application/javascript' });
        return URL.createObjectURL(blob);
    }

    function createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg) {
        var url;
        return function WorkerFactory(options) {
            url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
            return new Worker(url, options);
        };
    }

    var kIsNodeJS = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

    function isNodeJS() {
        return kIsNodeJS;
    }

    function createBase64WorkerFactory$2(base64, sourcemapArg, enableUnicodeArg) {
        if (isNodeJS()) {
            return createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg);
        }
        return createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg);
    }

    var WorkerFactory = createBase64WorkerFactory$2('Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIC8vIGNvbnN0IGtJc05vZGVKUyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgPyBwcm9jZXNzIDogMCkgPT09ICdbb2JqZWN0IHByb2Nlc3NdJzsKCiAgICBjb25zdCBfc2VsZiA9ICBzZWxmOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lCiAgICBjb25zdCBfcGVyZm9ybWFuY2UgPSAgcGVyZm9ybWFuY2U7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUKCiAgICBsZXQgd2FzbSA9IG51bGw7CiAgICBsZXQgbWVtb3J5ID0gbnVsbDsKICAgIGxldCB2aWV3ID0gbnVsbDsKCiAgICBsZXQgcnVuV29ya2xvYWQgPSAoKSA9PiB7CiAgICAgICAgdGhyb3cgJ0VSUk9SOiBXb3JrZXIgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkISc7CiAgICB9OwoKICAgIC8qKgogICAgICogRnVuY3Rpb24gdG8gcnVuIHRoZSBudW1lcmljIHdvcmtsb2FkIGluIHRoZSBjdXJyZW50IHRocmVhZCBmb3IgdGhlIHNwZWNpZmllZCBhbW91bnQgb2YgdGltZSBpbiBKYXZhU2NyaXB0LgogICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIC0gVGhlIGR1cmF0aW9uIG9mIHRoaXMgd29ya2xvYWQgaW4gbWlsbGlzZWNvbmRzCiAgICAgKiBAcGFyYW0ge251bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhpcyB0aHJlYWQuCiAgICAgKiBAcmV0dXJucyB7e2VsYXBzZWQ6IG51bWJlciwgcmVzdWx0OiBudW1iZXIsIGlkOiAqLCBpdGVyYXRpb25zOiBudW1iZXJ9fQogICAgICogQHByaXZhdGUKICAgICAqLwogICAgZnVuY3Rpb24gcnVuV29ya2xvYWRKUyhkdXJhdGlvbiwgaWQpIHsKICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbjsKICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvczsKICAgICAgICBjb25zdCBNX1BJID0gTWF0aC5QSTsKCiAgICAgICAgbGV0IGNyZWFsID0gLTAuODsKICAgICAgICBsZXQgY2ltYWcgPSAwLjE1NjsKCiAgICAgICAgbGV0IGZyYW1lID0gMDsKCiAgICAgICAgbGV0IHk7CiAgICAgICAgbGV0IHg7CiAgICAgICAgbGV0IGk7CgogICAgICAgIGxldCBjeDsKICAgICAgICBsZXQgY3k7CiAgICAgICAgbGV0IHh0OwoKICAgICAgICBjb25zdCBzdGFydCA9IF9wZXJmb3JtYW5jZS5ub3coKTsKICAgICAgICBsZXQgZW5kID0gc3RhcnQ7CgogICAgICAgIGZvciAoMDsgZW5kIC0gc3RhcnQgPCBkdXJhdGlvbjsgZW5kID0gX3BlcmZvcm1hbmNlLm5vdygpKSB7CiAgICAgICAgICAgIGZvciAoeSA9IDA7IHkgPCAyMDA7ICsreSkgewogICAgICAgICAgICAgICAgZm9yICh4ID0gMDsgeCA8IDIwMDsgKyt4KSB7CiAgICAgICAgICAgICAgICAgICAgY3ggPSAtMiArIHggLyA1MDsKICAgICAgICAgICAgICAgICAgICBjeSA9IC0yICsgeSAvIDUwOwogICAgICAgICAgICAgICAgICAgIGkgPSAwOwoKICAgICAgICAgICAgICAgICAgICBkbyB7CiAgICAgICAgICAgICAgICAgICAgICAgIHh0ID0gY3ggKiBjeCAtIGN5ICogY3kgKyBjcmVhbDsKICAgICAgICAgICAgICAgICAgICAgICAgY3kgPSAyICogY3ggKiBjeSArIGNpbWFnOwogICAgICAgICAgICAgICAgICAgICAgICBjeCA9IHh0OwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKGN4ICogY3ggKyBjeSAqIGN5IDwgNCkgJiYgKytpIDwgMjUpOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICAgICsrZnJhbWU7IC8vIGluY3JlYXNlIHRoZSBudW1iZXIgb2YgdGhlIGZyYW1lCiAgICAgICAgICAgIGNyZWFsID0gLTAuOCArIDAuNiAqIHNpbihmcmFtZSAvIChNX1BJICogMjApKTsgLy8gY2FsY3VsYXRlIHRoZSBuZXcgY29vcmRpbmF0ZXMKICAgICAgICAgICAgY2ltYWcgPSAwLjE1NiArIDAuNCAqIGNvcyhmcmFtZSAvIChNX1BJICogNDApKTsgLy8gb2YgdGhlIGMgcG9pbnQKICAgICAgICB9CgogICAgICAgIHJldHVybiB7CiAgICAgICAgICAgIGVsYXBzZWQ6IGVuZCAtIHN0YXJ0LAogICAgICAgICAgICBpdGVyYXRpb25zOiBmcmFtZSwKICAgICAgICAgICAgcmVzdWx0OiB4dCwKICAgICAgICAgICAgaWQsCiAgICAgICAgfTsKICAgIH0KCiAgICAvKioKICAgICAqIEZ1bmN0aW9uIHRvIHJ1biB0aGUgbnVtZXJpYyB3b3JrbG9hZCBpbiB0aGUgY3VycmVudCB0aHJlYWQgZm9yIHRoZSBzcGVjaWZpZWQgYW1vdW50IG9mIHRpbWUgaW4gV0FTTS4KICAgICAqIE5vdGU6IHRoZSBXQVNNIG1vZHVsZSBtdXN0IGJlIHByZS1sb2FkZWQgYnkgc2VuZGluZyB0aGUgYGluaXRgIG1lc3NhZ2UgZnJvbSB0aGUgbWFpbiB0aHJlYWQuCiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gLSBUaGUgZHVyYXRpb24gb2YgdGhpcyB3b3JrbG9hZCBpbiBtaWxsaXNlY29uZHMKICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIFRoZSBpZCBvZiB0aGlzIHRocmVhZC4KICAgICAqIEByZXR1cm5zIHt7ZWxhcHNlZDogbnVtYmVyLCByZXN1bHQ6IG51bWJlciwgaWQ6ICosIGl0ZXJhdGlvbnM6IG51bWJlcn19CiAgICAgKiBAcHJpdmF0ZQogICAgICovCiAgICBmdW5jdGlvbiBydW5Xb3JrbG9hZFdBU00oZHVyYXRpb24sIGlkKSB7CiAgICAgICAgd2FzbS5leHBvcnRzLl9ydW5Xb3JrbG9hZChkdXJhdGlvbiwgNCk7CiAgICAgICAgcmV0dXJuIHsKICAgICAgICAgICAgaXRlcmF0aW9uczogdmlldy5nZXRVaW50MzIoNCwgdHJ1ZSksCiAgICAgICAgICAgIHJlc3VsdDogdmlldy5nZXRVaW50MzIoOCwgdHJ1ZSksCiAgICAgICAgICAgIGVsYXBzZWQ6IHZpZXcuZ2V0RmxvYXQzMigxMiwgdHJ1ZSksCiAgICAgICAgICAgIGlkLAogICAgICAgIH07CiAgICB9CgogICAgLyoqCiAgICAgKiBIYW5kbGVzIGV2ZW50cyBzZW50IHRvIHRoaXMgdGhyZWFkLCBmcm9tIG90aGVyIHRocmVhZHMsIHRocm91Z2ggdGhlIGBzZWxmYCBvYmplY3QuCiAgICAgKiBUaGUgbWVzc2FnZXMgY2FuZSBiZToKICAgICAqIGBpbml0YCAtIHRvIGluaXRpYWxpemUgdGhpcyB0aHJlYWQsIHRha2VzIGNhcmUgb2YgYnJpZWZseSBydW5uaW5nIHRvIHdvcmtsb2FkIHRvIGFsbG93IENQVXMgdG8gY2FjaGUgdGhlIGNvZGUKICAgICAqIGB3b3JrbG9hZGAgLSBydW5zIHRoZSB3b3JrbG9hZCBvbiB0aGlzIHRocmVhZCBmb3IgMTBtcyBhbmQgcmV0dXJucyB0aGUgcmVzdWx0cyB0byB0aGUgY2FsbGluZyB0aHJlYWQKICAgICAqIEBwYXJhbSB7TWVzc2FnZUV2ZW50fSBlIC0gVGhlIHBvc3RlZCBtZXNzYWdlIGV2ZW50LgogICAgICogQHByaXZhdGUKICAgICAqLwogICAgKF9zZWxmLm9uIHx8IF9zZWxmLmFkZEV2ZW50TGlzdGVuZXIpLmNhbGwoX3NlbGYsICdtZXNzYWdlJywgZSA9PiB7CiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGUuZGF0YSB8fCBlOwoKICAgICAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkgewogICAgICAgICAgICBjYXNlICdpbml0JzoKICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlLndhc20pIHsKICAgICAgICAgICAgICAgICAgICBjb25zdCBtZW1vcnlTaXplID0gMTY7CiAgICAgICAgICAgICAgICAgICAgbWVtb3J5ID0gbmV3IFdlYkFzc2VtYmx5Lk1lbW9yeSh7aW5pdGlhbDogbWVtb3J5U2l6ZSwgbWF4aW11bTogbWVtb3J5U2l6ZX0pOwogICAgICAgICAgICAgICAgICAgIHZpZXcgPSBuZXcgRGF0YVZpZXcobWVtb3J5LmJ1ZmZlcik7CiAgICAgICAgICAgICAgICAgICAgd2FzbSA9IG5ldyBXZWJBc3NlbWJseS5JbnN0YW5jZShtZXNzYWdlLndhc20sIHsKICAgICAgICAgICAgICAgICAgICAgICAgZW52OiB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbm93OiBfcGVyZm9ybWFuY2Uubm93LmJpbmQoX3BlcmZvcm1hbmNlKSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeTogbWVtb3J5LAogICAgICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgIH0pOwogICAgICAgICAgICAgICAgICAgIHJ1bldvcmtsb2FkID0gcnVuV29ya2xvYWRXQVNNOwogICAgICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgICAgICBydW5Xb3JrbG9hZCA9IHJ1bldvcmtsb2FkSlM7CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICBydW5Xb3JrbG9hZCgxLCAwKTsKICAgICAgICAgICAgICAgIF9zZWxmLnBvc3RNZXNzYWdlKCdzdWNjZXNzJyk7CiAgICAgICAgICAgICAgICBicmVhazsKCiAgICAgICAgICAgIGNhc2UgJ3dvcmtsb2FkJzogewogICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7CiAgICAgICAgICAgICAgICAgICAgX3NlbGYucG9zdE1lc3NhZ2UocnVuV29ya2xvYWQoMjUsIG1lc3NhZ2UuaWQpKTsKICAgICAgICAgICAgICAgIH0sIG1lc3NhZ2Uuc3RhcnRUaW1lIC0gRGF0ZS5ub3coKSk7CiAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0pOwoKfSgpKTsKCg==', 'data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViQ1BVLndvcmtlci5qcyIsInNvdXJjZXMiOlsid29ya2VyOi8vd2ViLXdvcmtlci9XZWJDUFUud29ya2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGNvbnN0IGtJc05vZGVKUyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgPyBwcm9jZXNzIDogMCkgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcbmNvbnN0IGtJc05vZGVKUyA9IGZhbHNlO1xuY29uc3Qga1JlcXVpcmUgPSBrSXNOb2RlSlMgPyBtb2R1bGUucmVxdWlyZSA6IG51bGw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuY29uc3QgX3NlbGYgPSBrSXNOb2RlSlMgPyBrUmVxdWlyZSgnd29ya2VyX3RocmVhZHMnKS5wYXJlbnRQb3J0IDogc2VsZjsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuY29uc3QgX3BlcmZvcm1hbmNlID0ga0lzTm9kZUpTID8ga1JlcXVpcmUoJ3BlcmZfaG9va3MnKS5wZXJmb3JtYW5jZSA6IHBlcmZvcm1hbmNlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbmxldCB3YXNtID0gbnVsbDtcbmxldCBtZW1vcnkgPSBudWxsO1xubGV0IHZpZXcgPSBudWxsO1xuXG5sZXQgcnVuV29ya2xvYWQgPSAoKSA9PiB7XG4gICAgdGhyb3cgJ0VSUk9SOiBXb3JrZXIgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkISc7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIHJ1biB0aGUgbnVtZXJpYyB3b3JrbG9hZCBpbiB0aGUgY3VycmVudCB0aHJlYWQgZm9yIHRoZSBzcGVjaWZpZWQgYW1vdW50IG9mIHRpbWUgaW4gSmF2YVNjcmlwdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiAtIFRoZSBkdXJhdGlvbiBvZiB0aGlzIHdvcmtsb2FkIGluIG1pbGxpc2Vjb25kc1xuICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gVGhlIGlkIG9mIHRoaXMgdGhyZWFkLlxuICogQHJldHVybnMge3tlbGFwc2VkOiBudW1iZXIsIHJlc3VsdDogbnVtYmVyLCBpZDogKiwgaXRlcmF0aW9uczogbnVtYmVyfX1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHJ1bldvcmtsb2FkSlMoZHVyYXRpb24sIGlkKSB7XG4gICAgY29uc3Qgc2luID0gTWF0aC5zaW47XG4gICAgY29uc3QgY29zID0gTWF0aC5jb3M7XG4gICAgY29uc3QgTV9QSSA9IE1hdGguUEk7XG5cbiAgICBsZXQgY3JlYWwgPSAtMC44O1xuICAgIGxldCBjaW1hZyA9IDAuMTU2O1xuXG4gICAgbGV0IGZyYW1lID0gMDtcblxuICAgIGxldCB5O1xuICAgIGxldCB4O1xuICAgIGxldCBpO1xuICAgIGxldCBpaTtcblxuICAgIGxldCBjeDtcbiAgICBsZXQgY3k7XG4gICAgbGV0IHh0O1xuXG4gICAgY29uc3Qgc3RhcnQgPSBfcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgbGV0IGVuZCA9IHN0YXJ0O1xuXG4gICAgZm9yIChpaSA9IDA7IGVuZCAtIHN0YXJ0IDwgZHVyYXRpb247ICsraWksIGVuZCA9IF9wZXJmb3JtYW5jZS5ub3coKSkge1xuICAgICAgICBmb3IgKHkgPSAwOyB5IDwgMjAwOyArK3kpIHtcbiAgICAgICAgICAgIGZvciAoeCA9IDA7IHggPCAyMDA7ICsreCkge1xuICAgICAgICAgICAgICAgIGN4ID0gLTIgKyB4IC8gNTA7XG4gICAgICAgICAgICAgICAgY3kgPSAtMiArIHkgLyA1MDtcbiAgICAgICAgICAgICAgICBpID0gMDtcblxuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgeHQgPSBjeCAqIGN4IC0gY3kgKiBjeSArIGNyZWFsO1xuICAgICAgICAgICAgICAgICAgICBjeSA9IDIgKiBjeCAqIGN5ICsgY2ltYWc7XG4gICAgICAgICAgICAgICAgICAgIGN4ID0geHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdoaWxlICgoY3ggKiBjeCArIGN5ICogY3kgPCA0KSAmJiArK2kgPCAyNSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgKytmcmFtZTsgLy8gaW5jcmVhc2UgdGhlIG51bWJlciBvZiB0aGUgZnJhbWVcbiAgICAgICAgY3JlYWwgPSAtMC44ICsgMC42ICogc2luKGZyYW1lIC8gKE1fUEkgKiAyMCkpOyAvLyBjYWxjdWxhdGUgdGhlIG5ldyBjb29yZGluYXRlc1xuICAgICAgICBjaW1hZyA9IDAuMTU2ICsgMC40ICogY29zKGZyYW1lIC8gKE1fUEkgKiA0MCkpOyAvLyBvZiB0aGUgYyBwb2ludFxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGVsYXBzZWQ6IGVuZCAtIHN0YXJ0LFxuICAgICAgICBpdGVyYXRpb25zOiBmcmFtZSxcbiAgICAgICAgcmVzdWx0OiB4dCxcbiAgICAgICAgaWQsXG4gICAgfTtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB0byBydW4gdGhlIG51bWVyaWMgd29ya2xvYWQgaW4gdGhlIGN1cnJlbnQgdGhyZWFkIGZvciB0aGUgc3BlY2lmaWVkIGFtb3VudCBvZiB0aW1lIGluIFdBU00uXG4gKiBOb3RlOiB0aGUgV0FTTSBtb2R1bGUgbXVzdCBiZSBwcmUtbG9hZGVkIGJ5IHNlbmRpbmcgdGhlIGBpbml0YCBtZXNzYWdlIGZyb20gdGhlIG1haW4gdGhyZWFkLlxuICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIC0gVGhlIGR1cmF0aW9uIG9mIHRoaXMgd29ya2xvYWQgaW4gbWlsbGlzZWNvbmRzXG4gKiBAcGFyYW0ge251bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhpcyB0aHJlYWQuXG4gKiBAcmV0dXJucyB7e2VsYXBzZWQ6IG51bWJlciwgcmVzdWx0OiBudW1iZXIsIGlkOiAqLCBpdGVyYXRpb25zOiBudW1iZXJ9fVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcnVuV29ya2xvYWRXQVNNKGR1cmF0aW9uLCBpZCkge1xuICAgIHdhc20uZXhwb3J0cy5fcnVuV29ya2xvYWQoZHVyYXRpb24sIDQpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGl0ZXJhdGlvbnM6IHZpZXcuZ2V0VWludDMyKDQsIHRydWUpLFxuICAgICAgICByZXN1bHQ6IHZpZXcuZ2V0VWludDMyKDgsIHRydWUpLFxuICAgICAgICBlbGFwc2VkOiB2aWV3LmdldEZsb2F0MzIoMTIsIHRydWUpLFxuICAgICAgICBpZCxcbiAgICB9O1xufVxuXG4vKipcbiAqIEhhbmRsZXMgZXZlbnRzIHNlbnQgdG8gdGhpcyB0aHJlYWQsIGZyb20gb3RoZXIgdGhyZWFkcywgdGhyb3VnaCB0aGUgYHNlbGZgIG9iamVjdC5cbiAqIFRoZSBtZXNzYWdlcyBjYW5lIGJlOlxuICogYGluaXRgIC0gdG8gaW5pdGlhbGl6ZSB0aGlzIHRocmVhZCwgdGFrZXMgY2FyZSBvZiBicmllZmx5IHJ1bm5pbmcgdG8gd29ya2xvYWQgdG8gYWxsb3cgQ1BVcyB0byBjYWNoZSB0aGUgY29kZVxuICogYHdvcmtsb2FkYCAtIHJ1bnMgdGhlIHdvcmtsb2FkIG9uIHRoaXMgdGhyZWFkIGZvciAxMG1zIGFuZCByZXR1cm5zIHRoZSByZXN1bHRzIHRvIHRoZSBjYWxsaW5nIHRocmVhZFxuICogQHBhcmFtIHtNZXNzYWdlRXZlbnR9IGUgLSBUaGUgcG9zdGVkIG1lc3NhZ2UgZXZlbnQuXG4gKiBAcHJpdmF0ZVxuICovXG4oX3NlbGYub24gfHwgX3NlbGYuYWRkRXZlbnRMaXN0ZW5lcikuY2FsbChfc2VsZiwgJ21lc3NhZ2UnLCBlID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gZS5kYXRhIHx8IGU7XG5cbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlICdpbml0JzpcbiAgICAgICAgICAgIGlmIChtZXNzYWdlLndhc20pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZW1vcnlTaXplID0gMTY7XG4gICAgICAgICAgICAgICAgbWVtb3J5ID0gbmV3IFdlYkFzc2VtYmx5Lk1lbW9yeSh7aW5pdGlhbDogbWVtb3J5U2l6ZSwgbWF4aW11bTogbWVtb3J5U2l6ZX0pO1xuICAgICAgICAgICAgICAgIHZpZXcgPSBuZXcgRGF0YVZpZXcobWVtb3J5LmJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgd2FzbSA9IG5ldyBXZWJBc3NlbWJseS5JbnN0YW5jZShtZXNzYWdlLndhc20sIHtcbiAgICAgICAgICAgICAgICAgICAgZW52OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfbm93OiBfcGVyZm9ybWFuY2Uubm93LmJpbmQoX3BlcmZvcm1hbmNlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeTogbWVtb3J5LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJ1bldvcmtsb2FkID0gcnVuV29ya2xvYWRXQVNNO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBydW5Xb3JrbG9hZCA9IHJ1bldvcmtsb2FkSlM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBydW5Xb3JrbG9hZCgxLCAwKTtcbiAgICAgICAgICAgIF9zZWxmLnBvc3RNZXNzYWdlKCdzdWNjZXNzJyk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICd3b3JrbG9hZCc6IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIF9zZWxmLnBvc3RNZXNzYWdlKHJ1bldvcmtsb2FkKDI1LCBtZXNzYWdlLmlkKSk7XG4gICAgICAgICAgICB9LCBtZXNzYWdlLnN0YXJ0VGltZSAtIERhdGUubm93KCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBQUE7QUFHQTtJQUNBLE1BQU0sS0FBSyxHQUFzRCxDQUFDLElBQUksQ0FBQztJQUN2RSxNQUFNLFlBQVksR0FBbUQsQ0FBQyxXQUFXLENBQUM7QUFDbEY7SUFDQSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7SUFDaEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQjtJQUNBLElBQUksV0FBVyxHQUFHLE1BQU07SUFDeEIsSUFBSSxNQUFNLHlDQUF5QyxDQUFDO0lBQ3BELENBQUMsQ0FBQztBQUNGO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFTLGFBQWEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFO0lBQ3JDLElBQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUN6QixJQUFJLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDekIsSUFBSSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ3pCO0lBQ0EsSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNyQixJQUFJLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN0QjtJQUNBLElBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCO0lBQ0EsSUFBSSxJQUFJLENBQUMsQ0FBQztJQUNWLElBQUksSUFBSSxDQUFDLENBQUM7SUFDVixJQUFJLElBQUksQ0FBQyxDQUFDO0FBRVY7SUFDQSxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ1gsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUNYLElBQUksSUFBSSxFQUFFLENBQUM7QUFDWDtJQUNBLElBQUksTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3JDLElBQUksSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ3BCO0lBQ0EsSUFBSSxLQUFVLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxHQUFHLFFBQVEsRUFBUSxHQUFHLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ3pFLFFBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7SUFDbEMsWUFBWSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtJQUN0QyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDakMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2pDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCO0lBQ0EsZ0JBQWdCLEdBQUc7SUFDbkIsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQ25ELG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQzdDLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQzVCLGlCQUFpQjtJQUNqQix1QkFBdUIsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUM1RCxhQUFhO0lBQ2IsU0FBUztJQUNULFFBQVEsRUFBRSxLQUFLLENBQUM7SUFDaEIsUUFBUSxLQUFLLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdEQsUUFBUSxLQUFLLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELEtBQUs7QUFDTDtJQUNBLElBQUksT0FBTztJQUNYLFFBQVEsT0FBTyxFQUFFLEdBQUcsR0FBRyxLQUFLO0lBQzVCLFFBQVEsVUFBVSxFQUFFLEtBQUs7SUFDekIsUUFBUSxNQUFNLEVBQUUsRUFBRTtJQUNsQixRQUFRLEVBQUU7SUFDVixLQUFLLENBQUM7SUFDTixDQUFDO0FBQ0Q7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBUyxlQUFlLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRTtJQUN2QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzQyxJQUFJLE9BQU87SUFDWCxRQUFRLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDM0MsUUFBUSxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO0lBQ3ZDLFFBQVEsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztJQUMxQyxRQUFRLEVBQUU7SUFDVixLQUFLLENBQUM7SUFDTixDQUFDO0FBQ0Q7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLElBQUk7SUFDakUsSUFBSSxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztBQUNoQztJQUNBLElBQUksUUFBUSxPQUFPLENBQUMsSUFBSTtJQUN4QixRQUFRLEtBQUssTUFBTTtJQUNuQixZQUFZLElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtJQUM5QixnQkFBZ0IsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3RDLGdCQUFnQixNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM1RixnQkFBZ0IsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRCxnQkFBZ0IsSUFBSSxHQUFHLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO0lBQzlELG9CQUFvQixHQUFHLEVBQUU7SUFDekIsd0JBQXdCLElBQUksRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDakUsd0JBQXdCLE1BQU0sRUFBRSxNQUFNO0lBQ3RDLHFCQUFxQjtJQUNyQixpQkFBaUIsQ0FBQyxDQUFDO0lBQ25CLGdCQUFnQixXQUFXLEdBQUcsZUFBZSxDQUFDO0lBQzlDLGFBQWEsTUFBTTtJQUNuQixnQkFBZ0IsV0FBVyxHQUFHLGFBQWEsQ0FBQztJQUM1QyxhQUFhO0lBQ2IsWUFBWSxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlCLFlBQVksS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN6QyxZQUFZLE1BQU07QUFDbEI7SUFDQSxRQUFRLEtBQUssVUFBVSxFQUFFO0lBQ3pCLFlBQVksVUFBVSxDQUFDLE1BQU07SUFDN0IsZ0JBQWdCLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMvRCxhQUFhLEVBQUUsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMvQyxZQUFZLE1BQU07SUFDbEIsU0FBUztJQUlULEtBQUs7SUFDTCxDQUFDLENBQUM7Ozs7OzsifQ==', false);
    /* eslint-enable */

    var workloadWASM = "data:application/wasm;base64,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";

    /**
     * Utility to estimate the number of usable cores to perform data processing in node.js and the browser.
     *
     * In node.js, it uses the code from [this gist](https://gist.github.com/brandon93s/a46fb07b0dd589dc34e987c33d775679) to
     * query the number of CPUs on the system. It can be configured to run the same estimation as in the browser.
     *
     * In the browser, takes ~2 seconds to estimate the number of CPUs, uses WASM (when available) to perform the estimation.
     *
     * Returns a {@link Promise} that resolves to a {@link WebCPUResult}.
     *
     * ### Installation
     * ```
     * yarn add webcpu
     * ```
     * or
     * ```
     * npm install webcpu
     * ```
     *
     * ### Usage
     * In Web:
     * ```
     * import {WebCPU} from 'webcpu';
     *
     * WebCPU.detectCPU().then(result => {
     *     console.log(`Reported Cores: ${result.reportedCores}`);
     *     console.log(`Estimated Idle Cores: ${result.estimatedIdleCores}`);
     *     console.log(`Estimated Physical Cores: ${result.estimatedPhysicalCores}`);
     * });
     * ```
     *
     * In Node:
     * ```
     * const WebCPU = require('webcpu/dist/umd/webcpu').WebCPU;
     *
     * WebCPU.detectCPU().then(result => {
     *     console.log(`Reported Cores: ${result.reportedCores}`);
     *     console.log(`Estimated Idle Cores: ${result.estimatedIdleCores}`);
     *     console.log(`Estimated Physical Cores: ${result.estimatedPhysicalCores}`);
     * });
     * ```
     *
     * ### Description
     * The core estimation is affected by other tasks in the system, usually the OS scheduler is efficient enough that
     * light tasks (playing music, idle programs, background updates, etc) are evenly distributed across cores and so they
     * will not affect the result of this estimation. Heavy tasks do have an effect in the results of the estimation, it is
     * recommended that you avoid performing heavy tasks while the estimation is running, it is considered good practice to
     * run the estimation periodically to compensate for user's CPU workloads and always keep an optimal number of
     * operational cores.
     *
     * The estimation is performed by running a mathematical operation in a loop for a predefined amount of time. Modern
     * CPUs run this task simultaneously across physical cores and usually each core completes a very similar number of
     * operations, once hyper threading (or task scheduling) kicks in, a few cores must share their cycles among
     * threads running. By detecting the changes in operations completed by each thread, it is possible to estimate the
     * number of cores in the system.
     *
     * The current algorithm returns bad estimations for CPUs with asymmetric cores (usually mobile ARM chips) because, as
     * explained above, it detects the changes in number of operations between threads. Asymmetric cores will complete
     * a different number of operations depending on the power of the core the task is scheduled on. Although the returned
     * estimations will be incorrect, they are safe to use to spawn threads.
     *
     * This utility DOES NOT estimate logical cores, instead it uses `navigator.hardwareConcurrency` (if available) or simply
     * returns the same number as the estimated physical cores.
     *
     * ## Methods
     */
    class WebCPU {
        /**
         * Estimates the number of CPUs in this machine.
         * @param {boolean=} hardcore - Engages hardcore mode, which kills all the workers after every test.
         * @param {boolean=} estimateInNode - If `true`, forces core estimation in Node.js rather than querying the system.
         * @returns {Promise<WebCPUResult>} - Result of the estimation.
         */
        static async detectCPU(hardcore = false, estimateInNode = false) {
            let reportedCores;

            {
                reportedCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency : null;
            }

            const maxCoresToTest = reportedCores ? reportedCores : Number.MAX_SAFE_INTEGER;
            const workers = [];
            const loops = 2;
            let baseStats;

            let wasmModule = null;
            if (WebAssembly) {
                if (WebAssembly.compileStreaming) {
                    wasmModule = await WebAssembly.compileStreaming(fetch(workloadWASM));
                } else if (WebAssembly.compile) {
                    {
                        const result = await fetch(workloadWASM);
                        const buffer = await result.arrayBuffer();
                        wasmModule = await WebAssembly.compile(buffer);
                    }
                }
            }

            workers.push(await this._initWorker(wasmModule));
            await this._testWorkers(workers, loops);
            baseStats = await this._testWorkers(workers, loops);
            // console.log(baseStats);

            if (hardcore) {
                this._killWorkers(workers);
            }

            let oddCores = 0;
            let thresholdCount = 0;
            let threadCount = 0;
            while (threadCount < maxCoresToTest) {
                ++threadCount;
                const promises = [];
                for (let i = workers.length; i < threadCount; ++i) {
                    promises.push(this._initWorker(wasmModule).then(worker => workers.push(worker)));
                }
                await Promise.all(promises);
                promises.length = 0;

                const stats = await this._testWorkers(workers, loops);
                if (!this._areAllCoresValid(baseStats, stats, 0.9)) {
                    --threadCount;
                    ++thresholdCount;
                    if (thresholdCount > 3) {
                        if (threadCount % 2 && ++oddCores < 2) {
                            --threadCount;
                            thresholdCount = 0;
                            this._killWorkers([workers.pop()]);
                        } else {
                            this._killWorkers(workers);
                            break;
                        }
                    }
                } else if (thresholdCount) {
                    --threadCount;
                    --thresholdCount;
                }

                if (hardcore) {
                    this._killWorkers(workers);
                }
            }

            let physicalCores;
            if (reportedCores && threadCount < reportedCores) {
                physicalCores = Math.floor(reportedCores / 2);
            } else {
                physicalCores = threadCount;
            }

            return {
                reportedCores: reportedCores,
                estimatedIdleCores: threadCount,
                estimatedPhysicalCores: physicalCores,
            };
        }

        /**
         * Kills all the workers in the specified array.
         * @param {Worker[]} workers - Workers to kill
         * @private
         */
        static _killWorkers(workers) {
            while (workers.length) {
                workers.pop().terminate();
            }
        }

        /**
         * Run tests in the specified workers and repeats the test for the specified number of loops. This function performs
         * and ignores the results of 5 extra loops. This is to mitigate the fact that some processor and OS combinations
         * use lazy loading.
         * @param {Worker[]} workers - The workers in which the test will run.
         * @param {number} loops - The number of times the tests will be repeated.
         * @returns {Promise<Array>}
         * @private
         */
        static async _testWorkers(workers, loops) {
            const stats = [];
            const promises = [];
            const extraLoops = 2;
            const startTime = Date.now() + workers.length * 3;
            let results;
            for (let n = 0; n < loops + extraLoops; ++n) {
                for (let i = 0; i < workers.length; ++i) {
                    promises.push(this._computeWorker(workers[i], i, startTime));
                }
                results = await Promise.all(promises);
                if (n >= extraLoops) {
                    this._addResults(stats, results);
                }
                promises.length = 0;
            }

            this._aggregateResults(stats, loops);

            return stats;
        }

        /**
         * Adds the results from a test loop to the specified stats array.
         * @param {Array} stats - Stats array to save the results in
         * @param {Array} results - The results of a test loop.
         * @private
         */
        static _addResults(stats, results) {
            for (let i = 0; i < results.length; ++i) {
                if (!stats[results[i].id]) {
                    stats[results[i].id] = {
                        elapsed: 0,
                        iterations: 0,
                    };
                }
                stats[results[i].id].elapsed += results[i].elapsed;
                stats[results[i].id].iterations += results[i].iterations;
            }
        }

        /**
         * Aggregates all the results added to a stats object.
         * This function effectively normalizes the data passed to it.
         * @param {Array} stats - Stats array no aggregate.
         * @param {number} loops - The number of times the test ran.
         * @returns {Array}
         * @private
         */
        static _aggregateResults(stats, loops) {
            for (let i = 0; i < stats.length; ++i) {
                stats[i].elapsed /= loops;
                stats[i].iterations /= loops;
            }

            return stats;
        }

        /**
         * Starts the computation task in the specified worker with the specified id.
         * This method also accepts a start time (in ms, usually Date.now() + ms_to delay), useful to synchronize the start
         * time of the computation in multiple threads.
         * @param {Worker} worker - The worker in which the computation will be started.
         * @param {number} id - The id of this thread.
         * @param {number} startTime - A time in the future when the computations should start.
         * @returns {Promise<any>}
         * @private
         */
        static _computeWorker(worker, id, startTime) {
            const addListener = worker.addEventListener || worker.on;
            const removeListener = worker.removeEventListener || worker.off;
            return new Promise(resolve => {
                const handler = e => {
                    removeListener.call(worker, 'message', handler);
                    resolve(e.data || e);
                };
                addListener.call(worker, 'message', handler);
                worker.postMessage({type: 'workload', id, startTime});
            });
        }

        /**
         * Allocates and initializes a worker.
         * @param {WebAssembly.Module=} wasm - The WASM module, if available, that contains the workload.
         * @returns {Promise<any>}
         * @private
         */
        static _initWorker(wasm = null) {
            return new Promise((resolve, reject) => {
                const worker = new WorkerFactory();

                const addListener = worker.addEventListener || worker.on;
                const removeListener = worker.removeEventListener || worker.off;

                const handler = e => {
                    removeListener.call(worker, 'message', handler);
                    const message = e.data || e;
                    if (message === 'success') {
                        resolve(worker);
                    } else {
                        worker.terminate();
                        reject();
                    }
                };
                addListener.call(worker, 'message', handler);
                worker.postMessage({type: 'init', wasm});
            });
        }

        /**
         * Estimates if all the cores, based on the results in the provided `stats` object, are running at the same time and
         * performing the same number of operations.
         * @param {Array} baseStats - The stats resulting from running tests loops on a single core.
         * @param {Array} stats - The stats of multiple cores to test against.
         * @param {number} threshold - Threshold, between 0 ans 1, that defines when a core is not considered physical.
         * @returns {boolean}
         * @private
         */
        static _areAllCoresValid(baseStats, stats, threshold) {
            let iterations = 0;
            stats.sort((a, b) => b.iterations - a.iterations);
            for (let i = 0; i < stats.length; ++i) {
                iterations += stats[i].iterations;
            }

            // console.log(stats);

            const local = stats[stats.length - 1].iterations / stats[0].iterations;
            const global = iterations / (baseStats[0].iterations * stats.length);
            const combined = local * 0.85 + global * 0.15;
            // console.log(`threads:${stats.length} local:${local} global:${global} estimated:${combined}\n`);

            return combined >= threshold;
        }
    }

    /**
     * @typedef {Object} WebCPUResult
     *
     * @property {number|null} reportedCores
     * The result of `navigator.hardwareConcurrency` or `null` if not supported. `navigator.hardwareConcurrency` returns the
     * total number of cores in the system, physical and logical. This is not particularly useful for data computations
     * because logical cores do no improve and, in some cases, even hinder performance in repetitive tasks.
     *
     * @property {number} estimatedIdleCores
     * This number represents the estimated number of cores that can be used to compute a repetitive task, like data
     * computations, in parallel. The result of the estimation is affected by system workload at the time of the detection,
     * if this number is used to spawn threads, it is recommended to re-run the detection algorithm periodically to always
     * use an optimal number of cores when computing data.
     *
     * @property {number} estimatedPhysicalCores
     * Given the reported number of cores and the result of estimated idle cores, this number represents the "best guess"
     * for the total number of physical cores in the system. This number of threads is safe to use on all platforms.
     */

    exports.WebCPU = WebCPU;

    Object.defineProperty(exports, '__esModule', { value: true });

});
