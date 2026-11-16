import AppKit
import WebKit

private let name = "Open StoryBoard Studio"
private let site = URL(string: "storyboard://studio/index.html")!

private func isLocal(_ url: URL) -> Bool {
    url.scheme == site.scheme && url.host == site.host && url.port == nil
}

private final class WebFiles: NSObject, WKURLSchemeHandler {
    private let root: URL
    private let mime = [
        "html": "text/html", "css": "text/css", "js": "text/javascript",
        "jpg": "image/jpeg", "ttf": "font/ttf"
    ]

    init(root: URL) {
        self.root = root
    }

    func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
        do {
            guard let url = task.request.url, isLocal(url),
                  let path = URLComponents(url: url, resolvingAgainstBaseURL: false)?.percentEncodedPath.removingPercentEncoding,
                  !path.contains("\\"), !path.split(separator: "/").contains(where: { $0 == ".." || $0 == "." })
            else { throw URLError(.badURL) }
            let file = root.appendingPathComponent(String(path.dropFirst()))
            guard let type = mime[file.pathExtension] else { throw URLError(.unsupportedURL) }
            let data = try Data(contentsOf: file)
            let encoding = type.hasPrefix("text/") ? "utf-8" : nil
            task.didReceive(URLResponse(url: url, mimeType: type, expectedContentLength: data.count,
                                        textEncodingName: encoding))
            task.didReceive(data)
            task.didFinish()
        } catch {
            task.didFailWithError(error)
        }
    }

    func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) { }
}

@MainActor
private final class Studio: NSObject, NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate, WKDownloadDelegate {
    private var window: NSWindow?
    private var downloads: [ObjectIdentifier: (temporary: URL, destination: URL)] = [:]

    func applicationDidFinishLaunching(_ notification: Notification) {
        configureMenus()
        let settings = WKWebViewConfiguration()
        let assets = Bundle.main.resourceURL!.appendingPathComponent("Web", isDirectory: true)
        settings.setURLSchemeHandler(WebFiles(root: assets), forURLScheme: site.scheme!)
        let view = WKWebView(frame: .zero, configuration: settings)
        view.navigationDelegate = self
        view.uiDelegate = self
        let window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 1280, height: 850),
                              styleMask: [.titled, .closable, .miniaturizable, .resizable],
                              backing: .buffered, defer: false)
        window.title = name
        window.minSize = NSSize(width: 460, height: 420)
        window.contentView = view
        self.window = window
        window.center()
        window.makeKeyAndOrderFront(nil)
        NSApplication.shared.activate(ignoringOtherApps: true)
        view.load(URLRequest(url: site))
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }

    private func configureMenus() {
        let menu = NSMenu()
        let appItem = NSMenuItem()
        let appMenu = NSMenu(title: name)
        appMenu.addItem(withTitle: "Quitter " + name, action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        appItem.submenu = appMenu
        menu.addItem(appItem)

        let editItem = NSMenuItem()
        let editMenu = NSMenu(title: "Édition")
        for (title, action, key) in [
            ("Annuler", "undo:", "z"), ("Couper", "cut:", "x"), ("Copier", "copy:", "c"),
            ("Coller", "paste:", "v"), ("Tout sélectionner", "selectAll:", "a")
        ] {
            editMenu.addItem(withTitle: title, action: NSSelectorFromString(action), keyEquivalent: key)
        }
        editItem.submenu = editMenu
        menu.addItem(editItem)
        NSApplication.shared.mainMenu = menu
    }

    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if action.shouldPerformDownload {
            decisionHandler(.download)
        } else if let url = action.request.url, isLocal(url) {
            decisionHandler(.allow)
        } else {
            if action.navigationType == .linkActivated, let url = action.request.url, url.scheme == "https" {
                NSWorkspace.shared.open(url)
            }
            decisionHandler(.cancel)
        }
    }

    func webView(_ webView: WKWebView, runOpenPanelWith parameters: WKOpenPanelParameters,
                 initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping ([URL]?) -> Void) {
        guard let window = webView.window else { completionHandler(nil); return }
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = parameters.allowsMultipleSelection
        panel.beginSheetModal(for: window) { response in
            completionHandler(response == .OK ? panel.urls : nil)
        }
    }

    func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) {
        download.delegate = self
    }

    func download(_ download: WKDownload, decideDestinationUsing response: URLResponse, suggestedFilename: String,
                  completionHandler: @escaping (URL?) -> Void) {
        guard let window else { completionHandler(nil); return }
        let panel = NSSavePanel()
        panel.nameFieldStringValue = suggestedFilename
        panel.canCreateDirectories = true
        panel.beginSheetModal(for: window) { result in
            guard result == .OK, let destination = panel.url else { completionHandler(nil); return }
            let temporary = destination.deletingLastPathComponent()
                .appendingPathComponent(".storyboard-" + UUID().uuidString)
            self.downloads[ObjectIdentifier(download)] = (temporary, destination)
            completionHandler(temporary)
        }
    }

    func downloadDidFinish(_ download: WKDownload) {
        guard let paths = downloads.removeValue(forKey: ObjectIdentifier(download)) else { return }
        do {
            let files = FileManager.default
            if files.fileExists(atPath: paths.destination.path) {
                _ = try files.replaceItemAt(paths.destination, withItemAt: paths.temporary)
            } else {
                try files.moveItem(at: paths.temporary, to: paths.destination)
            }
        } catch {
            try? FileManager.default.removeItem(at: paths.temporary)
            showError(error)
        }
    }

    func download(_ download: WKDownload, didFailWithError error: Error, resumeData: Data?) {
        guard let paths = downloads.removeValue(forKey: ObjectIdentifier(download)) else { return }
        try? FileManager.default.removeItem(at: paths.temporary)
        showError(error)
    }

    private func showError(_ error: Error) {
        guard let window else { return }
        let alert = NSAlert(error: error)
        alert.beginSheetModal(for: window)
    }
}

@main
private enum Launcher {
    @MainActor
    static func main() {
        let app = NSApplication.shared
        let studio = Studio()
        app.delegate = studio
        app.setActivationPolicy(.regular)
        withExtendedLifetime(studio) { app.run() }
    }
}
