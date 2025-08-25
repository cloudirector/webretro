var wasmBinaryUrls = {}
const fileEntries = encoded.split("--file");
console.log("Loaded " + (fileEntries.length - 1) + " file entrie(s) [" + encoded.length + "]")
fileEntries.forEach(entry => {
    if (entry.trim()) {
        const parts = entry.split("\n");
        const filename = parts[0].trim();
        const base64Data = parts.slice(1).join("\n").trim();
        const binaryString = atob(base64Data);
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            byteArray[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: "application/wasm" });
        const url = URL.createObjectURL(blob);
        wasmBinaryUrls[filename] = url;
        console.log("Blobbed (" + filename + ":" + wasmBinaryUrls[filename] + ")")
    }
});
        
wasmBinaryFile = wasmBinaryUrls["melondsLibretro.wasm"];


let binary = atob(encodedFile.trim());
let bytes = new Uint8Array([...binary].map(c => c.charCodeAt(0)));
let decodedWasmFile = URL.createObjectURL(new Blob([bytes], { type: "application/wasm" }));

console.log(`Decoded, (${decodedWasmFile})`);
// wasmBinaryFile = wasmBinaryUrls["genesisPlusGxLibretro.wasm"];
// console.log(`Loaded. ${genesisPlusGxLibretroWasm}`)