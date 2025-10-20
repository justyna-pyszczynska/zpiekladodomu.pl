# Simple HTTP Server in PowerShell
Add-Type -AssemblyName System.Web

Write-Host "Starting HTTP Server..."
Write-Host "Script location: $($MyInvocation.MyCommand.Path)"
Write-Host "Script directory: $((Split-Path -Parent $MyInvocation.MyCommand.Path))"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8082/')

try {
    $listener.Start()
    Write-Host "Listener started successfully"
} catch {
    Write-Host "Failed to start listener: $($_.Exception.Message)"
    exit 1
}

Write-Host "Server started on http://localhost:8082/"
Write-Host "Press Ctrl+C to stop the server"
Write-Host "Open your browser and go to: http://localhost:8082/onas.html"
Write-Host "Serving files from: $((Split-Path -Parent $MyInvocation.MyCommand.Path))"
Write-Host "Waiting for requests..."

try {
    while ($listener.IsListening) {
        Write-Host "`n--- Waiting for request ---"
        try {
            $context = $listener.GetContext()
            Write-Host "Received request"
        } catch {
            Write-Host "Error getting context: $($_.Exception.Message)"
            continue
        }
        
        $request = $context.Request
        $response = $context.Response
        
        Write-Host "Request URL: $($request.Url)"
        Write-Host "Request Method: $($request.HttpMethod)"
        Write-Host "User Agent: $($request.UserAgent)"
        
        $localPath = $request.Url.LocalPath
        Write-Host "Local Path: $localPath"
        
        if ($localPath -eq '/') { 
            $localPath = '/index.html'
            Write-Host "Redirected root to: $localPath"
        }
        
        # Get the directory where this script is located
        $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
        $filePath = Join-Path $scriptDir $localPath.TrimStart('/')
        
        Write-Host "Script Directory: $scriptDir"
        Write-Host "Requested File Path: $filePath"
        
        if (Test-Path $filePath) {
            Write-Host "File exists: $filePath"
            
            # Check if it's a binary file
            $isBinaryFile = $filePath -like '*.jpg' -or $filePath -like '*.jpeg' -or $filePath -like '*.png' -or $filePath -like '*.gif' -or $filePath -like '*.ico' -or $filePath -like '*.svg'
            
            if ($isBinaryFile) {
                Write-Host "Binary file detected, using binary reading"
                try {
                    $fileInfo = Get-Item $filePath
                    Write-Host "File size: $($fileInfo.Length) bytes"
                } catch {
                    Write-Host "Error reading file info: $($_.Exception.Message)"
                    $response.StatusCode = 500
                    $errorMsg = "Error reading file: $($_.Exception.Message)"
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorMsg)
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                    $response.Close()
                    continue
                }
            } else {
                try {
                    $content = Get-Content $filePath -Raw
                    Write-Host "File content loaded, size: $($content.Length) characters"
                } catch {
                    Write-Host "Error reading file: $($_.Exception.Message)"
                    $response.StatusCode = 500
                    $errorMsg = "Error reading file: $($_.Exception.Message)"
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorMsg)
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                    $response.Close()
                    continue
                }
            }
            
            # Set correct content type
            $contentType = 'text/html'
            if ($filePath -like '*.svg') {
                $contentType = 'image/svg+xml'
            } elseif ($filePath -like '*.css') {
                $contentType = 'text/css'
            } elseif ($filePath -like '*.js') {
                $contentType = 'application/javascript'
            } elseif ($filePath -like '*.jpg' -or $filePath -like '*.jpeg') {
                $contentType = 'image/jpeg'
            } elseif ($filePath -like '*.png') {
                $contentType = 'image/png'
            } elseif ($filePath -like '*.gif') {
                $contentType = 'image/gif'
            } elseif ($filePath -like '*.md') {
                $contentType = 'text/markdown'
            }
            
            $response.ContentType = $contentType
            Write-Host "Content Type: $contentType"
            
            try {
                if ($isBinaryFile) {
                    # For binary files, use file size for Content-Length
                    Write-Host "Sending binary file using streaming"
                    $fileInfo = Get-Item $filePath
                    $response.ContentLength64 = $fileInfo.Length
                    
                    # Read file in chunks
                    $fileStream = [System.IO.File]::OpenRead($filePath)
                    $buffer = New-Object byte[] 8192
                    $bytesRead = 0
                    $totalBytes = 0
                    
                    while (($bytesRead = $fileStream.Read($buffer, 0, $buffer.Length)) -gt 0) {
                        $response.OutputStream.Write($buffer, 0, $bytesRead)
                        $totalBytes += $bytesRead
                    }
                    $fileStream.Close()
                    Write-Host "Binary file sent successfully: $totalBytes bytes"
                } else {
                    # For text files, check size and decide approach
                    if ($content.Length -gt 1048576) { # 1MB threshold
                        Write-Host "Large text file detected, using streaming approach"
                        $fileInfo = Get-Item $filePath
                        $response.ContentLength64 = $fileInfo.Length
                        
                        # Read file in chunks
                        $fileStream = [System.IO.File]::OpenRead($filePath)
                        $buffer = New-Object byte[] 8192
                        $bytesRead = 0
                        $totalBytes = 0
                        
                        while (($bytesRead = $fileStream.Read($buffer, 0, $buffer.Length)) -gt 0) {
                            $response.OutputStream.Write($buffer, 0, $bytesRead)
                            $totalBytes += $bytesRead
                        }
                        $fileStream.Close()
                        Write-Host "Text file sent successfully (streamed): $totalBytes bytes"
                    } else {
                        # For smaller text files, use the original approach
                        $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
                        $response.ContentLength64 = $buffer.Length
                        Write-Host "Response size: $($buffer.Length) bytes"
                        
                        $response.OutputStream.Write($buffer, 0, $buffer.Length)
                        Write-Host "Text file sent successfully"
                    }
                }
            } catch {
                Write-Host "Error sending response: $($_.Exception.Message)"
            }
        } else {
            Write-Host "File not found: $filePath"
            $response.StatusCode = 404
            $errorMsg = "File not found: $filePath"
            Write-Host "404 Error: $errorMsg"
            try {
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorMsg)
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                Write-Host "404 response sent"
            } catch {
                Write-Host "Error sending 404 response: $($_.Exception.Message)"
            }
        }
        
        try {
            $response.Close()
                Write-Host "Response closed"
        } catch {
            Write-Host "Error closing response: $($_.Exception.Message)"
        }
        
        Write-Host "--- Request completed ---"
    }
} catch {
    Write-Host "`nServer error: $($_.Exception.Message)"
    Write-Host "Error details: $($_.Exception)"
    Write-Host "Stack trace: $($_.ScriptStackTrace)"
} finally {
    Write-Host "`nServer stopped"
    if ($listener.IsListening) {
        $listener.Stop()
        Write-Host "Listener stopped"
    }
}