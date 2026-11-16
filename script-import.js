"use strict";

const ScriptImport = (() => {
  const vendor = new URL("vendor/", document.currentScript.src);
  const pendingScripts = new Map();
  const types = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
  };
  const wordNamespaces = new Set([
    "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "http://purl.oclc.org/ooxml/wordprocessingml/main"
  ]);
  const maxFileSize = 50 * 1024 * 1024;
  const maxDocumentXml = 24 * 1024 * 1024;

  class ImportError extends Error {}

  function loadVendor(name) {
    if (!pendingScripts.has(name)) {
      const loading = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = new URL(name, vendor).href;
        script.onload = resolve;
        script.onerror = () => {
          script.remove();
          reject(new ImportError("Le lecteur de document est indisponible. Rechargez l’application."));
        };
        document.head.append(script);
      }).catch(error => {
        pendingScripts.delete(name);
        throw error;
      });
      pendingScripts.set(name, loading);
    }
    return pendingScripts.get(name);
  }

  function readPlain(bytes) {
    const encoding = bytes[0] === 0xff && bytes[1] === 0xfe ? "utf-16le"
      : bytes[0] === 0xfe && bytes[1] === 0xff ? "utf-16be" : "utf-8";
    try {
      return new TextDecoder(encoding, {fatal: true}).decode(bytes);
    } catch {
      return new TextDecoder("windows-1252").decode(bytes);
    }
  }

  function wordName(node) {
    return wordNamespaces.has(node.namespaceURI) ? node.localName : "";
  }

  function paragraphText(node) {
    switch (wordName(node)) {
      case "del":
      case "moveFrom":
      case "drawing":
      case "pict":
        return "";
      case "t":
        return node.textContent;
      case "tab":
        return " ";
      case "br":
      case "cr":
        return "\n";
      case "noBreakHyphen":
        return "‑";
      default:
        return Array.from(node.children, paragraphText).join("");
    }
  }

  function documentBlocks(container) {
    return [...container.children].flatMap(node => {
      switch (wordName(node)) {
        case "p":
          return [paragraphText(node).trim()];
        case "tbl": {
          const rows = [...node.children].filter(row => wordName(row) === "tr");
          const lines = rows.map(row => [...row.children].filter(cell => wordName(cell) === "tc").map(cell =>
            documentBlocks(cell).filter(Boolean).join(" / ").replace(/\s*\n\s*/g, " ")));
          const columns = Math.max(0, ...lines.map(cells => cells.length));
          const table = lines.filter(cells => cells.some(Boolean)).map(cells => {
            const padded = cells.concat(Array(Math.max(0, columns - cells.length)).fill(""));
            return "| " + padded.map(cell => cell.replace(/\|/g, "\\|")).join(" | ") + " |";
          }).join("\n");
          return ["", table, ""];
        }
        case "del":
        case "moveFrom":
          return [];
        default:
          return documentBlocks(node);
      }
    });
  }

  async function readDocx(bytes) {
    await loadVendor("fflate.js");
    const entries = fflate.unzipSync(bytes, {filter(entry) {
      if (entry.name !== "word/document.xml") return false;
      if (entry.originalSize > maxDocumentXml) throw new ImportError("Le corps du document Word est trop volumineux.");
      return true;
    }});
    const bodyBytes = entries["word/document.xml"];
    if (!bodyBytes) throw new ImportError("Le corps du document Word est introuvable. Vérifiez le fichier ou enregistrez-le de nouveau en .docx.");
    const xml = readPlain(bodyBytes);
    if (/<!DOCTYPE/i.test(xml)) throw new ImportError("Le document Word contient une déclaration XML non prise en charge.");
    const document = new DOMParser().parseFromString(xml, "application/xml");
    const body = [...document.documentElement.children].find(node => wordName(node) === "body");
    if (!body) throw new ImportError("La structure de ce document Word ne peut pas être lue.");
    return documentBlocks(body).join("\n");
  }

  async function readDoc(bytes) {
    await loadVendor("doc-to-text.js");
    const text = docToText(bytes);
    if (text === null) throw new ImportError("Ce fichier .doc est illisible, protégé ou trop ancien. Enregistrez-le en .docx dans Word, puis réessayez.");
    return text;
  }

  class PdfResources {
    async fetch({kind, filename}) {
      if (kind === "cMapUrl") {
        await loadVendor("pdf-cmaps.js");
        const entry = Object.hasOwn(pdfCMaps, filename) && pdfCMaps[filename];
        if (entry) return Uint8Array.from(atob(entry), char => char.charCodeAt(0));
      }
      throw new Error("Ressource PDF indisponible");
    }
  }

  function pdfPageText(items, viewport) {
    const rows = [];
    const fragments = items.filter(item => typeof item.str === "string" && item.str.trim()).map(item => {
      const matrix = pdfjsLib.Util.transform(viewport.transform, item.transform);
      return {
        text: item.str.replace(/\u00ad/g, ""), x: matrix[4], y: matrix[5],
        width: item.width, height: Math.max(1, Math.hypot(matrix[2], matrix[3])), rtl: item.dir === "rtl"
      };
    }).sort((a, b) => a.y - b.y || a.x - b.x);

    for (const fragment of fragments) {
      const previous = rows.at(-1);
      if (previous && Math.abs(previous.y - fragment.y) <= Math.min(previous.height, fragment.height) * .32) {
        previous.fragments.push(fragment);
      } else {
        rows.push({y: fragment.y, height: fragment.height, fragments: [fragment]});
      }
    }
    const lines = [];
    let previousRow;
    for (const row of rows) {
      const rtl = row.fragments.every(fragment => fragment.rtl);
      const ordered = row.fragments.sort((a, b) => rtl ? b.x - a.x : a.x - b.x);
      const line = ordered.map((fragment, index) => {
        const previous = ordered[index - 1];
        if (!previous) return fragment.text;
        const gap = rtl ? previous.x - fragment.x - fragment.width : fragment.x - previous.x - previous.width;
        return (gap > row.height * .2 && !/\s$/.test(previous.text) && !/^\s/.test(fragment.text) ? " " : "") + fragment.text;
      }).join("").trim();
      if (/^\d{1,4}[.)]?$/.test(line) && (row.y < 43 || row.y > viewport.height - 39)) continue;
      const gap = previousRow ? row.y - previousRow.y : 0;
      if (gap > Math.max(row.height, previousRow?.height || 0) * 1.62) lines.push("");
      const last = lines.at(-1);
      const wraps = last && gap > 0 && gap <= row.height * 1.45 && Math.abs(ordered[0].x - previousRow.x) < row.height
        && /\p{Ll}[\p{L}’']$/u.test(last) && /^\p{Ll}/u.test(line);
      if (wraps) lines[lines.length - 1] += " " + line;
      else if (line) lines.push(line);
      previousRow = {x: ordered[0].x, y: row.y, height: row.height};
    }
    return lines.join("\n");
  }

  async function readPdf(bytes, progress) {
    await loadVendor("pdf.js");
    const worker = new URL("pdf.worker.js", vendor);
    if (!["http:", "https:"].includes(location.protocol)) await loadVendor("pdf.worker.js");
    pdfjsLib.GlobalWorkerOptions.workerSrc = worker.href;
    const task = pdfjsLib.getDocument({
      data: bytes, useWasm: false, isEvalSupported: false, useWorkerFetch: false,
      BinaryDataFactory: PdfResources, cMapUrl: new URL("cmaps/", vendor).href, disableWorkerRendering: true
    });
    const pages = [];
    const emptyPages = [];
    try {
      const pdf = await task.promise;
      for (let number = 1; number <= pdf.numPages; number++) {
        progress(number, pdf.numPages);
        const page = await pdf.getPage(number);
        const {items} = await page.getTextContent();
        const text = pdfPageText(items, page.getViewport({scale: 1}));
        if (text.trim()) pages.push(text);
        else emptyPages.push(number);
        page.cleanup();
      }
    } catch (error) {
      if (error.name === "PasswordException") throw new ImportError("Ce PDF est protégé. Exportez une copie sans mot de passe pour l’importer.");
      throw error;
    } finally {
      await task.destroy();
    }
    if (!pages.length) throw new ImportError("Ce PDF ne contient pas de texte sélectionnable. Ajoutez une couche de texte avec la reconnaissance de caractères (OCR), puis réimportez-le.");
    return {text: pages.join("\n\n"), emptyPages};
  }

  async function read(file, progress = () => {}) {
    const extension = /\.([^.]+)$/.exec(file.name.toLowerCase())?.[1];
    const type = ["pdf", "doc", "docx", "txt", "md", "markdown", "fountain"].includes(extension) ? extension
      : types[file.type] || (file.type.startsWith("text/") ? "txt" : "");
    if (!type) throw new ImportError("Choisissez un PDF, un document Word, un fichier texte ou Fountain.");
    if (file.size > maxFileSize) throw new ImportError("Le fichier dépasse 50 Mo. Exportez un document plus léger ou scindez-le.");
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (type === "pdf") return await readPdf(bytes, progress);
      const text = type === "docx" ? await readDocx(bytes) : type === "doc" ? await readDoc(bytes) : readPlain(bytes);
      const normalized = text.replace(/\r\n?/g, "\n").replace(/\u0000/g, "").trim();
      if (!normalized) throw new ImportError("Ce fichier ne contient pas de texte exploitable.");
      return {text: normalized, emptyPages: []};
    } catch (error) {
      if (error instanceof ImportError) throw error;
      throw new ImportError("Le fichier n’a pas pu être lu. Vérifiez qu’il s’ouvre et réessayez.");
    }
  }

  return {read};
})();
