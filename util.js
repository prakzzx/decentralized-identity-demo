// Base64URL helpers (UTF-8 safe)
function base64url(input) {
if (input instanceof Uint8Array) {
let str = ''; for (let i = 0; i < input.length; i++) str += String.fromCharCode(input[i]);
return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
const utf8 = new TextEncoder().encode(typeof input === 'string' ? input : JSON.stringify(input));
return base64url(utf8);
}
function base64urlToBytes(b64) {
const pad = b64.length % 4 === 2 ? '==' : b64.length % 4 === 3 ? '=' : '';
const s = b64.replace(/-/g, '+').replace(/_/g, '/') + pad;
const bin = atob(s); const out = new Uint8Array(bin.length);
for (let i=0;i<bin.length;i++) out[i] = bin.charCodeAt(i);
return out;
}
function utf8(bytes) { return new TextDecoder().decode(bytes); }