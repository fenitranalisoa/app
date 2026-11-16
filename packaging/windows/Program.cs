using System.Diagnostics;
using System.IO.Compression;
using System.Reflection;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

internal static class Program
{
    private const string Host = "studio.openstoryboard.invalid";
    private const string Name = "Open StoryBoard Studio";

    [STAThread]
    private static void Main()
    {
        ApplicationConfiguration.Initialize();
        string webRoot = Path.Combine(Path.GetTempPath(), "OpenStoryboardStudio-" + Guid.NewGuid().ToString("N"));
        try
        {
            using (Stream assets = Assembly.GetExecutingAssembly().GetManifestResourceStream("StoryboardWebAssets.zip")
                ?? throw new InvalidOperationException("Les fichiers de l’application sont introuvables."))
            using (var archive = new ZipArchive(assets))
                archive.ExtractToDirectory(webRoot);

            using var window = new Form
            {
                Text = Name,
                Width = 1280,
                Height = 850,
                MinimumSize = new Size(460, 420),
                StartPosition = FormStartPosition.CenterScreen
            };
            var view = new WebView2 { Dock = DockStyle.Fill };
            window.Controls.Add(view);
            window.Shown += async (_, _) =>
            {
                try
                {
                    string profile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                        "OpenStoryboardStudio", "WebView2");
                    await view.EnsureCoreWebView2Async(await CoreWebView2Environment.CreateAsync(userDataFolder: profile));
                    var browser = view.CoreWebView2;
                    browser.Settings.AreHostObjectsAllowed = false;
                    browser.Settings.IsWebMessageEnabled = false;
                    browser.SetVirtualHostNameToFolderMapping(Host, webRoot, CoreWebView2HostResourceAccessKind.Deny);
                    browser.NavigationStarting += (_, navigation) =>
                    {
                        if (Uri.TryCreate(navigation.Uri, UriKind.Absolute, out Uri? target) &&
                            target.Scheme == "https" && target.Host == Host && target.IsDefaultPort)
                            return;
                        navigation.Cancel = true;
                        if (navigation.IsUserInitiated) OpenExternal(navigation.Uri);
                    };
                    browser.NewWindowRequested += (_, popup) =>
                    {
                        popup.Handled = true;
                        if (popup.IsUserInitiated) OpenExternal(popup.Uri);
                    };
                    browser.Navigate($"https://{Host}/index.html");
                }
                catch (WebView2RuntimeNotFoundException)
                {
                    MessageBox.Show(window, "Installez Microsoft Edge WebView2 Runtime, puis rouvrez l’application.",
                        Name, MessageBoxButtons.OK, MessageBoxIcon.Information);
                    window.Close();
                }
                catch (Exception error)
                {
                    MessageBox.Show(window, error.Message, Name, MessageBoxButtons.OK, MessageBoxIcon.Error);
                    window.Close();
                }
            };
            Application.Run(window);
        }
        catch (Exception error)
        {
            MessageBox.Show(error.Message, Name, MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
        finally
        {
            try { if (Directory.Exists(webRoot)) Directory.Delete(webRoot, recursive: true); }
            catch (IOException) { }
            catch (UnauthorizedAccessException) { }
        }
    }

    private static void OpenExternal(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out Uri? target) ||
            target.Scheme != "https" || target.Host == Host) return;
        try { Process.Start(new ProcessStartInfo(target.AbsoluteUri) { UseShellExecute = true }); }
        catch (System.ComponentModel.Win32Exception) { }
    }
}
