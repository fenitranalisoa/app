"""Copy only the runtime files into an installer."""

from pathlib import Path
import shutil
import sys
from zipfile import ZIP_DEFLATED, ZipFile


root = Path(__file__).resolve().parents[1]
files = [
    root / name for name in (
        "index.html", "styles.css", "app.js", "script.js", "storyboard.js",
        "script-import.js", "script-preparation.js", "project-ideas.js",
        "board-image.js", "demo.js",
    )
]
for directory, names in {
    "assets": ("inter.ttf", "OFL-Inter.txt", "quai.jpg", "rame.jpg", "sortie.jpg"),
    "vendor": ("doc-to-text.js", "fflate.js", "pdf.js", "pdf.worker.js", "pdf-cmaps.js",
               "fflate-LICENSE", "jsdoc-LICENSE", "pdfjs-LICENSE", "pdfjs-cmaps-LICENSE"),
}.items():
    files.extend(root / directory / name for name in names)


def package(destination):
    if destination.suffix == ".zip":
        destination.parent.mkdir(parents=True, exist_ok=True)
        with ZipFile(destination, "w", compression=ZIP_DEFLATED) as archive:
            for source in files:
                archive.write(source, source.relative_to(root).as_posix())
    else:
        for source in files:
            target = destination / source.relative_to(root)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)


if __name__ == "__main__":
    package(Path(sys.argv[1]))
