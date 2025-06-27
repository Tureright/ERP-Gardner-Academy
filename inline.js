import fs from "fs";
import path from "path";

// 1) Define rutas
const rootDir   = process.cwd();
const gasDir    = path.join(rootDir, "gas");
const distDir   = path.join(rootDir, "dist");
const assetsDir = path.join(distDir, "assets");

// 2) Asegura existencia de /gas
if (!fs.existsSync(gasDir)) {
  fs.mkdirSync(gasDir);
  console.log("Created gas directory.");
}

// 3) Encuentra el último .js y .css
const findLatestFile = (dir, ext) => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith(ext));
  if (!files.length) return null;
  return path.join(dir, files.sort().pop());
};

const jsFile  = findLatestFile(assetsDir, ".js");
const cssFile = findLatestFile(assetsDir, ".css");

if (!jsFile || !cssFile) {
  console.error("JavaScript or CSS file not found in assets/");
  process.exit(1);
}

// 4) Lee contenidos
const jsContent  = fs.readFileSync(jsFile, "utf8");
const cssContent = fs.readFileSync(cssFile, "utf8");

// 5) Prepara el stub para interceptar TODO document.write/writeln
const stub = `
// --- document.write/writeln overwrite stub ---
(function(){
  const origWrite   = Document.prototype.write;
  const origWriteln = Document.prototype.writeln;

  Document.prototype.write = function(html) {
    const root = document.getElementById("root");
    if (root) {
      root.insertAdjacentHTML("beforeend", html);
    } else {
      console.warn("document.write antes de existir #root:", html);
    }
  };

  Document.prototype.writeln = Document.prototype.write;
})();
`;

// 6) Construye el contenido seguro de JS
const safeJsContent = stub
  // evita cierres prematuros de </script>
  + jsContent.replace(/<\/script>/g, '<\\/script>')
  // normaliza dobles cierres '));' → ');
  .replace(/\)\);/g, ');');

// 7) Escribe js.html y css.html en /gas
const jsHtmlPath  = path.join(gasDir, "js.html");
const cssHtmlPath = path.join(gasDir, "css.html");

fs.writeFileSync(jsHtmlPath,
  `<script>
${safeJsContent}
</script>`
);

// Escribe css.html SIN <style> tags
fs.writeFileSync(cssHtmlPath,
  // sólo el CSS puro, ya escapado
  cssContent.replace(/<\/style>/g, '<\\/style>')
);

console.log("✅ js.html y css.html creados en /gas exitosamente.");