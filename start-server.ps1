# Simple HTTP Server in PowerShell
Add-Type -AssemblyName System.Web

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8081/')
$listener.Start()

Write-Host "Server started on http://localhost:8081/"
Write-Host "Press Ctrl+C to stop the server"
Write-Host "Open your browser and go to: http://localhost:8081/onas.html"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq '/') { 
            $localPath = '/onas.html' 
        }
        
        $filePath = Join-Path (Get-Location) $localPath.TrimStart('/')
        
        if (Test-Path $filePath) {
            $content = Get-Content $filePath -Raw
            
            # Set correct content type
            if ($filePath -like '*.svg') {
                $response.ContentType = 'image/svg+xml'
            } elseif ($filePath -like '*.css') {
                $response.ContentType = 'text/css'
            } elseif ($filePath -like '*.js') {
                $response.ContentType = 'application/javascript'
            } elseif ($filePath -like '*.jpg' -or $filePath -like '*.jpeg') {
                $response.ContentType = 'image/jpeg'
            } elseif ($filePath -like '*.png') {
                $response.ContentType = 'image/png'
            } elseif ($filePath -like '*.gif') {
                $response.ContentType = 'image/gif'
            } elseif ($filePath -like '*.md') {
                $response.ContentType = 'text/markdown'
            } else {
                $response.ContentType = 'text/html'
            }
            
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes('Not found')
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Server stopped"
}